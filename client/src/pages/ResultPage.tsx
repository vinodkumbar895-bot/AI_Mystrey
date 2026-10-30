import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, Fingerprint, LoaderCircle, ShieldCheck, ShieldX, Sparkles } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Eyebrow } from '../components/Shell';
import { api } from '../lib/api';
import type { ResultData } from '../types';

export function ResultPage() {
  const { caseId = '' } = useParams(); const location = useLocation();
  const [result, setResult] = useState<ResultData | null>((location.state as ResultData | null) ?? null);
  const [error, setError] = useState(''); const [loading, setLoading] = useState(!result);
  useEffect(() => {
    if (result) return;
    let active = true;
    async function loadResult() {
      let investigationId = sessionStorage.getItem(`investigation:${caseId}`);
      if (!investigationId) {
        const caseData = await api<{ progress: { investigationId?: string } | null }>(`/cases/${caseId}`);
        investigationId = caseData.progress?.investigationId ?? null;
      }
      if (!investigationId) throw new Error('Submit a final accusation before opening the result.');
      sessionStorage.setItem(`investigation:${caseId}`, investigationId);
      return api<ResultData>(`/investigations/${investigationId}/result`);
    }
    loadResult()
      .then((value) => { if (active) setResult(value); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'The result could not be opened.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [caseId, result]);

  if (loading) return <div className="page-wrap centered-state"><LoaderCircle className="animate-spin text-amber" size={24}/><p>Retrieving your result…</p></div>;
  if (error || !result) return <div className="page-wrap centered-state"><ShieldX size={28}/><h1>The file is still sealed.</h1><p>{error || 'Submit a final accusation before opening the result.'}</p><Link to={`/cases/${caseId}`} className="button"><ArrowLeft size={15}/> Return to investigation</Link></div>;

  return <section className="page-wrap result-page">
    <div className="result-topline"><Link to="/" className="back-link"><ArrowLeft size={15}/> Case archive</Link><span>INVESTIGATION COMPLETE <i className="text-line">/</i> {caseId.slice(-6).toUpperCase()}</span></div>
    <div className="result-case-title">CLOSED FILE <span>/</span> {result.caseTitle}</div>
    <header className={`result-hero ${result.correct ? 'result-correct' : 'result-incorrect'}`}>
      <div className="result-icon">{result.correct ? <ShieldCheck size={28}/> : <ShieldX size={28}/>}</div><Eyebrow>CASE FILE CLOSED <span className="text-line">/</span> FINAL FINDING</Eyebrow>
      <h1>{result.correct ? 'You found the truth.' : 'The trail led elsewhere.'}</h1>
      <p>{result.correct ? 'Your accusation holds up against the evidence.' : 'Your theory was plausible. Here is what the evidence points to.'}</p>
      <div className="score-stamp"><span>FINAL SCORE</span><b>{result.score}<small> / 100</small></b></div>
    </header>
    <div className="result-columns"><section className="result-main">
      <div className="reveal-card"><div className="reveal-heading"><Fingerprint size={18}/><span>THE PERSON RESPONSIBLE</span></div><h2>{result.actualCulprit.name}</h2><p className="suspect-role">{result.actualCulprit.occupation}</p><div className="reveal-rule"/><div className="reveal-grid"><div><span>MOTIVE</span><p>{result.motive}</p></div><div><span>METHOD</span><p>{result.method}</p></div><div><span>OPPORTUNITY</span><p>{result.opportunity}</p></div></div></div>
      <article className="solution-section"><div className="sidebar-kicker">HOW THE CASE FITS TOGETHER</div><h2>The explanation</h2><p>{result.explanation}</p></article>
      <article className="solution-section evidence-support"><div className="sidebar-kicker">THE DECISIVE DETAILS</div><h2>Evidence that mattered</h2>{result.decisiveEvidence.map((item, index) => <div className="result-evidence" key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{item.title}</b><p>{item.description}</p></div><BadgeCheck size={17}/></div>)}</article>
      <article className="solution-section"><div className="sidebar-kicker">RECONSTRUCTING THE INCIDENT</div><h2>Timeline</h2><div className="result-timeline">{result.timeline.map((event) => <div className="timeline-entry" key={event.id}><time>{new Date(event.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time><p>{event.description}</p></div>)}</div></article>
      {result.suspectContradictions.length > 0 && <article className="solution-section"><div className="sidebar-kicker">ACCOUNTS THAT DIDN’T HOLD</div><h2>Contradictions</h2>{result.suspectContradictions.map((item, index) => <div className="contradiction" key={`${item.suspect}-${index}`}><b>{item.suspect}</b><p>{item.contradiction}</p><small>SUPPORTED BY {item.supportingEvidence.join(' · ')}</small></div>)}</article>}
    </section><aside className="result-side">
      <div className="your-call"><div className="sidebar-kicker">YOUR FINAL ACCUSATION</div><h3>{result.selectedSuspect.name}</h3><p>{result.correct ? 'A deduction supported by the record.' : 'A reasonable theory that missed one key detail.'}</p></div>
      <div className="score-card"><div className="sidebar-kicker">SCORE BREAKDOWN</div><div><span>Correct accusation</span><b>{result.scoreBreakdown.accusation}<small> / 60</small></b></div><div><span>Evidence reviewed <i>({result.reviewedCount}/{result.evidenceCount})</i></span><b>{result.scoreBreakdown.evidence}<small> / 25</small></b></div><div><span>Hint efficiency <i>({result.hintsUsed} used)</i></span><b>{result.scoreBreakdown.hints}<small> / 15</small></b></div><div className="score-total"><span>TOTAL</span><b>{result.score}<small> / 100</small></b></div></div>
      <div className="result-note"><Sparkles size={16}/><p>Every detail in this fictional case was generated for your investigation.</p></div>
    </aside></div>
    <div className="result-actions"><Link to="/" className="text-link"><ArrowLeft size={15}/> Return to archive</Link><Link to="/create" className="button">Open another case <ArrowRight size={16}/></Link></div>
  </section>;
}

