import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, CircleHelp, LoaderCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Eyebrow, PanelTitle } from '../components/Shell';
import { api } from '../lib/api';

const categories = [
  ['general', 'General mystery'], ['theft', 'Theft'], ['missing_object', 'Missing object'], ['disappearance', 'Disappearance'],
  ['workplace', 'Workplace mystery'], ['museum', 'Museum mystery'], ['locked_room', 'Locked room'], ['cyber', 'Cyber mystery']
];

export function CreatePage() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState(''); const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general'); const [difficulty, setDifficulty] = useState('medium');
  const [suspectCount, setSuspectCount] = useState(4); const [evidenceCount, setEvidenceCount] = useState(8);
  const [tone, setTone] = useState('detective'); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const remaining = 2000 - scenario.length;

  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    if (scenario.trim().length < 30) { setError('Give us at least 30 characters to start the investigation.'); return; }
    setLoading(true);
    try {
      const created = await api<{ caseId: string }>('/cases', { method: 'POST', body: JSON.stringify({ scenario: scenario.trim(), title: title.trim() || undefined, category, difficulty, suspectCount, evidenceCount, tone }) });
      const investigation = await api<{ investigationId: string }>(`/cases/${created.caseId}/investigations`, { method: 'POST', body: JSON.stringify({}) });
      sessionStorage.setItem(`investigation:${created.caseId}`, investigation.investigationId);
      navigate(`/cases/${created.caseId}`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'We could not create this mystery. Please try again.'); }
    finally { setLoading(false); }
  }

  return <section className="page-wrap form-page">
    <Link to="/" className="back-link"><ArrowLeft size={15}/> Back to archive</Link>
    <div className="form-intro"><Eyebrow>NEW INVESTIGATION <span className="text-line">/</span> 01</Eyebrow><h1>Start with<br /><em>a suspicion.</em></h1><p>Give us the first thread. We’ll build a fictional case around it, with people, evidence, and a solution waiting to be found.</p></div>
    <form className="case-form" onSubmit={submit}>
      <div className="form-section"><PanelTitle index="01">THE STARTING POINT</PanelTitle>
        <label className="field-label" htmlFor="scenario">What happened? <span>REQUIRED</span></label>
        <textarea id="scenario" maxLength={2000} minLength={30} required value={scenario} onChange={(event) => setScenario(event.target.value)} placeholder="A rare manuscript vanished from the university archive during a late-night restoration. The only people with access were…" />
        <div className="field-foot"><span>Set the scene. The people and clues will follow.</span><span className={remaining < 100 ? 'text-amber' : ''}>{scenario.length.toLocaleString()} / 2,000</span></div>
        <label className="field-label mt-7" htmlFor="title">Case title <span>OPTIONAL</span></label>
        <input id="title" maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="We can name the case for you" />
      </div>
      <div className="form-section"><PanelTitle index="02">SHAPE THE CASE</PanelTitle>
        <div className="form-grid">
          <label className="control-label">Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label className="control-label">Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="easy">Easy — a clear trail</option><option value="medium">Medium — read between lines</option><option value="hard">Hard — every detail counts</option></select></label>
          <label className="control-label">Number of suspects<select value={suspectCount} onChange={(event) => setSuspectCount(Number(event.target.value))}>{[3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} suspects</option>)}</select></label>
          <label className="control-label">Evidence files<select value={evidenceCount} onChange={(event) => setEvidenceCount(Number(event.target.value))}>{[4, 6, 8, 10, 12].map((n) => <option key={n} value={n}>{n} files</option>)}</select></label>
          <label className="control-label form-span">Investigation tone<select value={tone} onChange={(event) => setTone(event.target.value)}><option value="detective">Realistic detective story</option><option value="noir">Noir and atmospheric</option><option value="light">Light and playful</option><option value="tense">Tense and cinematic</option></select></label>
        </div>
      </div>
      <div className="fiction-note"><CircleHelp size={17}/><p>Every case is fictional. Simulated messages, records, and surveillance are labeled as such.</p></div>
      {error && <div className="error-box" role="alert">{error}</div>}
      <div className="form-submit"><span>GENERATED CASES TAKE A MOMENT TO PREPARE</span><button className="button" disabled={loading || scenario.trim().length < 30} type="submit">{loading ? <><LoaderCircle className="animate-spin" size={16}/> Building your case…</> : <>Generate mystery <ArrowRight size={16}/></>}</button></div>
      {loading && <p className="loading-caption" role="status">Creating a fictional investigation from your scenario. This can take a little while.</p>}
    </form>
  </section>;
}

