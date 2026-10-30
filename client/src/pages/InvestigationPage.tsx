import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronRight, CircleHelp, Clock3, FileText, Fingerprint, FolderOpen, Image, LoaderCircle, MessageSquare, Search, ShieldAlert, Siren, Sparkles, Users, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Eyebrow } from '../components/Shell';
import { api } from '../lib/api';
import type { CaseData, Evidence, EvidenceType, ResultData, Suspect } from '../types';

const typeLabel: Record<EvidenceType, string> = { chat: 'Message thread', image: 'Scene image', cctv: 'Surveillance record', witness_statement: 'Witness statement', security_log: 'Security log', document: 'Case document', forensic_report: 'Forensic report', audio_transcript: 'Audio transcript', timeline_event: 'Timeline entry' };
const typeIcon: Record<EvidenceType, typeof FileText> = { chat: MessageSquare, image: Image, cctv: Siren, witness_statement: Users, security_log: ShieldAlert, document: FileText, forensic_report: Search, audio_transcript: MessageSquare, timeline_event: Clock3 };
type PublicEvidence = Evidence;

function readable(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(readable).filter(Boolean).join('\n');
  return Object.entries(value as Record<string, unknown>).map(([key, item]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}: ${readable(item)}`).join('\n');
}

export function InvestigationPage() {
  const { caseId = '' } = useParams(); const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseData | null>(null); const [investigationId, setInvestigationId] = useState('');
  const [selected, setSelected] = useState<PublicEvidence | null>(null); const [tab, setTab] = useState<'evidence' | 'suspects' | 'timeline'>('evidence');
  const [filter, setFilter] = useState<string>('all'); const [query, setQuery] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(true);
  const [contentMatches, setContentMatches] = useState<{ query: string; ids: string[] } | null>(null);
  const [hint, setHint] = useState(''); const [hintBusy, setHintBusy] = useState(false); const [accuseOpen, setAccuseOpen] = useState(false);
  const [suspectId, setSuspectId] = useState(''); const [reasoning, setReasoning] = useState(''); const [accusing, setAccusing] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setBusy(true); setError('');
      try {
        const data = await api<CaseData>(`/cases/${caseId}`);
        const attempt = await api<{ investigationId: string; status: string }>(`/cases/${caseId}/investigations`, { method: 'POST', body: JSON.stringify({}) });
        if (!active) return;
        sessionStorage.setItem(`investigation:${caseId}`, attempt.investigationId);
        setCaseData(data); setInvestigationId(attempt.investigationId);
        if (attempt.status === 'completed') navigate(`/cases/${caseId}/result`, { replace: true });
      } catch (reason) { if (active) setError(reason instanceof Error ? reason.message : 'This case could not be opened.'); }
      finally { if (active) setBusy(false); }
    }
    void load(); return () => { active = false; };
  }, [caseId, navigate]);

  useEffect(() => {
    const search = query.trim();
    if (search.length < 2) return;
    let active = true;
    const timer = setTimeout(() => {
      api<{ evidenceIds: string[] }>(`/cases/${caseId}/evidence/search?q=${encodeURIComponent(search)}`)
        .then((result) => { if (active) setContentMatches({ query: search, ids: result.evidenceIds }); })
        .catch(() => { if (active) setContentMatches({ query: search, ids: [] }); });
    }, 220);
    return () => { active = false; clearTimeout(timer); };
  }, [caseId, query]);

  const reviewed = caseData?.progress?.reviewedEvidenceIds ?? [];
  const filtered = useMemo(() => caseData?.evidence.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const summaryMatches = `${item.title} ${item.description} ${item.source}`.toLowerCase().includes(query.toLowerCase());
    const matchesQuery = !query || summaryMatches || (contentMatches !== null && contentMatches.query === query.trim() && contentMatches.ids.includes(item.id));
    return matchesFilter && matchesQuery;
  }) ?? [], [caseData, contentMatches, filter, query]);

  async function openEvidence(item: Evidence) {
    if (!caseData) return;
    try {
      const detail = await api<PublicEvidence>(`/cases/${caseId}/evidence/${item.id}`);
      await api(`/investigations/${investigationId}/evidence/${item.id}/review`, { method: 'POST', body: JSON.stringify({}) });
      setSelected(detail); setCaseData((current) => current ? { ...current, progress: { status: 'in_progress', reviewedEvidenceIds: [...new Set([...(current.progress?.reviewedEvidenceIds ?? []), item.id])], hintsUsed: current.progress?.hintsUsed ?? 0, investigationId } } : current);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Evidence could not be opened.'); }
  }

  async function requestHint() {
    if (!caseData || !investigationId) return;
    setHintBusy(true); setError('');
    try {
      const level = (caseData.progress?.hintsUsed ?? 0) + 1;
      const response = await api<{ level: number; hint: string; hintsUsed: number }>(`/investigations/${investigationId}/hints`, { method: 'POST', body: JSON.stringify({ level }) });
      setHint(response.hint); setCaseData((current) => current ? { ...current, progress: { status: 'in_progress', reviewedEvidenceIds: current.progress?.reviewedEvidenceIds ?? [], hintsUsed: response.hintsUsed, investigationId } } : current);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The hint could not be retrieved.'); }
    finally { setHintBusy(false); }
  }

  async function submitAccusation() {
    if (!suspectId) return;
    setAccusing(true); setError('');
    try {
      const result = await api<ResultData>(`/investigations/${investigationId}/accusation`, { method: 'POST', body: JSON.stringify({ suspectId, reasoning: reasoning.trim() || undefined }) });
      navigate(`/cases/${caseId}/result`, { state: result });
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The accusation could not be submitted.'); }
    finally { setAccusing(false); }
  }

  if (busy) return <div className="page-wrap centered-state"><LoaderCircle size={24} className="animate-spin text-amber"/><p>Opening the case file…</p></div>;
  if (error && !caseData) return <div className="page-wrap centered-state"><AlertTriangle size={25}/><h1>File unavailable</h1><p>{error}</p><Link className="button" to="/">Return to archive</Link></div>;
  if (!caseData) return null;

  return <section className="page-wrap investigation-page">
    <div className="case-topline"><Link to="/" className="back-link"><ArrowLeft size={15}/> Archive</Link><span><i className="status-pip"/> ACTIVE INVESTIGATION</span><span>FILE / {caseId.slice(-6).toUpperCase()}</span></div>
    <div className="case-heading"><div><Eyebrow>{caseData.category.replace('_', ' ').toUpperCase()} <span className="text-line">/</span> {caseData.difficulty.toUpperCase()} DIFFICULTY</Eyebrow><h1>{caseData.title}</h1><p>{caseData.briefing}</p></div><div className="case-seal"><Fingerprint size={28}/><span>CASE<br/>ACTIVE</span></div></div>
    <div className="incident-summary"><span>INCIDENT SUMMARY</span><p>{caseData.incidentDescription}</p></div>
    <div className="provenance-legend"><span><BadgeCheck size={13}/> Briefing &amp; timeline <b>CASE FACTS</b></span><span><MessageSquare size={13}/> Statements <b>UNVERIFIED ACCOUNTS</b></span><span><ShieldAlert size={13}/> All records <b>FICTIONAL / SIMULATED</b></span></div>
    {error && <div className="inline-error" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss error"><X size={15}/></button></div>}
    <div className="room-layout">
      <aside className="room-sidebar">
        <div className="progress-card"><div className="sidebar-kicker">INVESTIGATION STATUS</div><div className="progress-count">{reviewed.length}<span> / {caseData.evidence.length}</span></div><p>evidence files reviewed</p><div className="progress-track" role="progressbar" aria-label="Evidence reviewed" aria-valuemin={0} aria-valuemax={caseData.evidence.length} aria-valuenow={reviewed.length}><div style={{ width: `${Math.min(100, reviewed.length / caseData.evidence.length * 100)}%` }}/></div><div className="progress-meta"><span>{caseData.progress?.hintsUsed ?? 0} hints used</span><span>1 accusation</span></div></div>
        <div className="room-nav" role="tablist" aria-label="Case sections">
          <button className={tab === 'evidence' ? 'active' : ''} role="tab" aria-selected={tab === 'evidence'} onClick={() => { setTab('evidence'); setSelected(null); }}><FolderOpen size={16}/> Evidence library <span>{caseData.evidence.length}</span></button>
          <button className={tab === 'suspects' ? 'active' : ''} role="tab" aria-selected={tab === 'suspects'} onClick={() => { setTab('suspects'); setSelected(null); }}><Users size={16}/> Persons of interest <span>{caseData.suspects.length}</span></button>
          <button className={tab === 'timeline' ? 'active' : ''} role="tab" aria-selected={tab === 'timeline'} onClick={() => { setTab('timeline'); setSelected(null); }}><Clock3 size={16}/> Case timeline <span>{caseData.timeline.length}</span></button>
        </div>
        <div className="hint-card"><div className="hint-heading"><Sparkles size={15}/> NEED A NUDGE?</div><p>{hint || 'A small direction. You still make the deduction.'}</p><button disabled={hintBusy || (caseData.progress?.hintsUsed ?? 0) >= 3} onClick={requestHint}>{hintBusy ? <LoaderCircle className="animate-spin" size={14}/> : <CircleHelp size={14}/>} {hintBusy ? 'Finding a clue…' : (caseData.progress?.hintsUsed ?? 0) >= 3 ? 'No hints remaining' : 'Request next hint'}</button></div>
        <div className="fiction-label"><BadgeCheck size={15}/> Fictional case file</div>
      </aside>

      <div className="room-main">
        {tab === 'evidence' && <>
          {selected ? <EvidenceDetail evidence={selected} suspects={caseData.suspects} onBack={() => setSelected(null)}/> : <>
            <div className="room-main-heading"><div><div className="sidebar-kicker">THE PAPER TRAIL</div><h2>Evidence library</h2></div><span>{filtered.length} FILES <span className="text-line">/</span> {reviewed.length} REVIEWED</span></div>
            <div className="search-row"><label className="search-box"><Search size={15}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, content, sources…" aria-label="Search evidence" /></label><label className="sr-only" htmlFor="evidence-filter">Filter evidence type</label><select id="evidence-filter" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All evidence</option>{Object.entries(typeLabel).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></div>
            <div className="evidence-list">{filtered.map((item, index) => <EvidenceRow key={item.id} item={item} index={index} reviewed={reviewed.includes(item.id)} onClick={() => void openEvidence(item)}/>)}{filtered.length === 0 && <div className="empty-state"><Search size={20}/><p>No evidence matches that search.</p></div>}</div>
          </>}
        </>}
        {tab === 'suspects' && <><div className="room-main-heading"><div><div className="sidebar-kicker">PEOPLE CONNECTED TO THE INCIDENT</div><h2>Persons of interest</h2></div><span>{caseData.suspects.length} PROFILES</span></div><div className="suspect-grid">{caseData.suspects.map((person, index) => <SuspectCard key={person.id} person={person} index={index} evidenceCount={caseData.evidence.filter((item) => item.associatedSuspectIds.includes(person.id)).length}/>)}</div></>}
        {tab === 'timeline' && <><div className="room-main-heading"><div><div className="sidebar-kicker">KNOWN SEQUENCE OF EVENTS</div><h2>Case timeline</h2></div><span>{caseData.timeline.length} ENTRIES</span></div><div className="timeline-list">{caseData.timeline.map((event) => <article className="timeline-entry" key={event.id}><time>{new Date(event.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time><p>{event.description}</p><small>{event.involvedSuspectIds.length} PERSONS <span className="text-line">/</span> {event.evidenceIds.length} RELATED FILES</small></article>)}</div></>}
      </div>

      <aside className="room-right"><div className="right-heading"><div className="sidebar-kicker">PEOPLE IN THE FILE</div><span>{caseData.suspects.length}</span></div>{caseData.suspects.map((person, index) => <button key={person.id} className="suspect-compact" onClick={() => { setTab('suspects'); setSelected(null); }}><div className="avatar">{person.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><div><b>{person.name}</b><span>{person.occupation}</span></div><ChevronRight size={15}/><span className="sr-only">View suspect profile</span></button>)}
        <div className="accusation-card"><div className="accusation-emblem"><Fingerprint size={20}/></div><div className="sidebar-kicker">WHEN YOU’RE READY</div><h3>Make your<br />accusation.</h3><p>One final answer will close the file and reveal the truth.</p><button className="button button-full" onClick={() => setAccuseOpen(true)}>Accuse a suspect <ArrowRight size={15}/></button><span>YOUR ATTEMPT ENDS ON SUBMISSION</span></div>
      </aside>
    </div>
    {accuseOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccuseOpen(false); }}><section className="accusation-modal" role="dialog" aria-modal="true" aria-labelledby="accusation-title"><button className="modal-close" onClick={() => setAccuseOpen(false)} aria-label="Close accusation"><X size={18}/></button><Eyebrow>FINAL ACCUSATION <span className="text-line">/</span> ONE ATTEMPT</Eyebrow><h2 id="accusation-title">Who did it?</h2><p>Choose the person whose account best fits the evidence. Submitting ends this investigation and reveals the solution.</p><label className="control-label">Your suspect<select value={suspectId} onChange={(event) => setSuspectId(event.target.value)}><option value="">Select a person…</option>{caseData.suspects.map((person) => <option key={person.id} value={person.id}>{person.name} — {person.occupation}</option>)}</select></label><label className="control-label mt-5">Your reasoning <span className="optional-label">OPTIONAL</span><textarea className="reasoning-box" maxLength={1000} value={reasoning} onChange={(event) => setReasoning(event.target.value)} placeholder="Which details convinced you?" /></label><div className="warning-note"><AlertTriangle size={16}/><span>Your answer is final. You’ll see the culprit and full explanation after submitting.</span></div><button disabled={!suspectId || accusing} onClick={() => void submitAccusation()} className="button button-full modal-submit">{accusing ? <LoaderCircle className="animate-spin" size={16}/> : <Fingerprint size={16}/>} {accusing ? 'Closing the file…' : 'Submit final accusation'}</button></section></div>}
  </section>;
}

function EvidenceRow({ item, index, reviewed, onClick }: { item: Evidence; index: number; reviewed: boolean; onClick: () => void }) {
  const Icon = typeIcon[item.type];
  return <button className={`evidence-row ${reviewed ? 'is-reviewed' : ''}`} onClick={onClick}><div className="evidence-index">{String(index + 1).padStart(2, '0')}</div><div className="evidence-icon"><Icon size={18}/></div><div className="evidence-copy"><span>{typeLabel[item.type]} <i className="text-line">/</i> {item.source}</span><b>{item.title}</b><p>{item.description}</p></div><div className="evidence-status">{reviewed ? <Check size={15}/> : <ChevronRight size={17}/>}</div></button>;
}

function EvidenceDetail({ evidence, suspects, onBack }: { evidence: Evidence; suspects: Suspect[]; onBack: () => void }) {
  const Icon = typeIcon[evidence.type]; const content = readable(evidence.content);
  return <article className="evidence-detail"><button className="back-link" onClick={onBack}><ArrowLeft size={14}/> All evidence</button><div className="detail-type"><Icon size={17}/>{typeLabel[evidence.type]} <span className="text-line">/</span> SIMULATED EVIDENCE</div><h2>{evidence.title}</h2><p className="detail-description">{evidence.description}</p>
    {evidence.type === 'image' ? <div className="scene-placeholder"><div className="scene-sky"/><div className="scene-light"/><div className="scene-caption"><Image size={17}/> SIMULATED SCENE <span>NO GENERATED IMAGE ASSET</span></div></div> : null}
    {evidence.type === 'cctv' ? <div className="cctv-frame"><div className="cctv-overlay">CAM / ARCHIVE 04 <span>SIMULATED FOOTAGE RECORD</span><time>{evidence.timestamp ? new Date(evidence.timestamp).toLocaleString() : 'TIME UNKNOWN'}</time></div><div className="cctv-scanlines"/><div className="cctv-center">VIDEO NOT AVAILABLE<br/><small>INCIDENT DESCRIPTION BELOW</small></div></div> : null}
    {evidence.type === 'chat' && Array.isArray(evidence.content?.messages) ? <ChatEvidence messages={evidence.content.messages} fallback={content || evidence.description}/> : <div className={`evidence-content ${evidence.type === 'audio_transcript' ? 'content-transcript' : ''}`}><div className="content-label">{evidence.type === 'witness_statement' ? 'STATEMENT / UNVERIFIED ACCOUNT' : 'FILE CONTENT'} <span>FICTIONAL</span></div><p>{content || evidence.description}</p></div>}
    <div className="detail-meta"><span>ORIGIN <b>{evidence.source}</b></span>{evidence.timestamp && <span>RECORDED <b>{new Date(evidence.timestamp).toLocaleString()}</b></span>}</div>
    <div className="related-box"><div className="content-label">ASSOCIATED PERSONS</div>{evidence.associatedSuspectIds.length ? <div className="related-names">{evidence.associatedSuspectIds.map((id) => suspects.find((person) => person.id === id)?.name).filter(Boolean).join(' · ')}</div> : <div className="related-names muted">No person directly associated</div>}</div>
  </article>;
}

function ChatEvidence({ messages, fallback }: { messages: unknown; fallback: string }) {
  if (!Array.isArray(messages)) return <div className="evidence-content"><div className="content-label">FICTIONAL MESSAGE THREAD</div><p>{fallback}</p></div>;
  return <div className="chat-evidence"><div className="content-label">FICTIONAL MESSAGE THREAD <span>SIMULATED</span></div>{messages.map((value, index) => {
    const message = typeof value === 'object' && value !== null ? value as Record<string, unknown> : { text: value };
    const sender = String(message.sender ?? message.participant ?? 'Unknown participant');
    const body = String(message.text ?? message.message ?? message.content ?? '');
    const timestamp = message.timestamp ? String(message.timestamp) : '';
    return <div className={`chat-message ${index % 2 ? 'chat-message-right' : ''}`} key={`${index}-${sender}`}><span>{sender}</span><p>{body}</p>{timestamp && <time>{timestamp}</time>}</div>;
  })}</div>;
}

function SuspectCard({ person, index, evidenceCount }: { person: Suspect; index: number; evidenceCount: number }) {
  return <article className="suspect-card"><div className="suspect-card-top"><div className="avatar avatar-large">{person.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><span>PERSON / {String(index + 1).padStart(2, '0')}</span></div><h3>{person.name}</h3><div className="suspect-role">{person.occupation}{person.age ? ` · ${person.age}` : ''}</div><p>{person.background}</p><div className="suspect-fact"><span>CONNECTION</span>{person.relationship}</div><div className="suspect-fact"><span>POSSIBLE MOTIVE</span>{person.motive}</div><div className="suspect-fact"><span>ACCOUNT</span>{person.alibi}</div><div className="suspect-fact"><span>PERSONALITY</span>{person.personality}</div><div className="suspect-foot"><span>{evidenceCount} RELATED FILES</span><span>UNDER REVIEW</span></div></article>;
}

