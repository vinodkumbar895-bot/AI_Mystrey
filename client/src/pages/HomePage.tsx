import { ArrowDownRight, ArrowRight, AudioLines, FileSearch, Fingerprint, ScanLine, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Eyebrow } from '../components/Shell';

const features = [
  { icon: FileSearch, number: '01', title: 'Every detail has a place', copy: 'Evidence arrives as witness accounts, access logs, chat records, reports, and more.' },
  { icon: ScanLine, number: '02', title: 'Look closer, think deeper', copy: 'Open files, compare timelines, and follow the details that do not quite fit.' },
  { icon: Fingerprint, number: '03', title: 'Make your case', copy: 'Name your suspect when you are ready. Your final answer reveals the full story.' }
];

export function HomePage() {
  return <>
    <section className="hero page-wrap">
      <div className="hero-copy"><Eyebrow>YOUR NEXT CASE IS WAITING</Eyebrow>
        <h1>Somewhere in<br />the details, <em>truth</em><br />leaves a trace.</h1>
        <p className="hero-subtitle">Step into a case built from your idea. Examine the evidence, question every alibi, and decide who had the motive—and the moment.</p>
        <div className="flex flex-wrap items-center gap-5"><Link to="/create" className="button">Open a new case <ArrowRight size={17} /></Link><a href="#how-it-works" className="text-link">How it works <ArrowDownRight size={15} /></a></div>
        <div className="hero-meta"><span><i className="status-pip" /> A fictional investigation</span><span>01 / INFINITE POSSIBILITIES</span></div>
      </div>
      <div className="hero-art" aria-label="Illustration of a detective's case board">
        <div className="art-index">EVIDENCE BOARD <span>CASE 001</span></div>
        <div className="board-grid" />
        <div className="board-stamp">ROOM<br /><b>NO. 08</b></div>
        <div className="evidence-photo photo-one"><div className="photo-lines"/><span>EXHIBIT A · 22:14</span></div>
        <div className="evidence-photo photo-two"><div className="file-glyph"><FileSearch size={31}/></div><span>INCIDENT REPORT · 03</span></div>
        <div className="evidence-note note-one"><span>HANDWRITTEN NOTE</span><b>“I was never<br />in the west wing.”</b></div>
        <div className="evidence-note note-two"><span>TIME / 21:48</span><b>One camera.<br />Seven minutes lost.</b></div>
        <div className="red-thread thread-one"/><div className="red-thread thread-two"/>
        <div className="art-caption"><span>FIG. 01</span><span>THE SPACE BETWEEN<br />ALIBI &amp; EVIDENCE</span></div>
        <div className="board-annotation"><Sparkles size={14}/> Every case is made for you</div>
      </div>
      <div className="hero-vertical">FIELD NOTES&nbsp;&nbsp; / &nbsp;&nbsp;VOL. 01</div>
    </section>

    <section className="ticker" aria-label="Supported evidence types"><div className="ticker-track"><span><FileSearch/> WITNESS STATEMENTS</span><i/> <span><ScanLine/> SECURITY LOGS</span><i/> <span><AudioLines/> RECORDED ACCOUNTS</span><i/> <span><Shield/> FORENSIC REPORTS</span><i/> <span><FileSearch/> WITNESS STATEMENTS</span><i/> <span><ScanLine/> SECURITY LOGS</span></div></section>

    <section className="section page-wrap" id="how-it-works"><div className="section-heading"><div><Eyebrow>A ROOM BUILT AROUND YOUR THEORY</Eyebrow><h2>Follow the evidence.<br /><em>Find the answer.</em></h2></div><p>Each investigation is a self-contained world: suspicious people, conflicting accounts, and a trail that rewards a closer look.</p></div>
      <div className="feature-grid">{features.map(({ icon: Icon, number, title, copy }) => <article className="feature-card" key={number}><div className="feature-top"><span>{number} / 03</span><Icon size={19}/></div><h3>{title}</h3><p>{copy}</p><div className="feature-rule"/></article>)}</div>
    </section>

    <section className="case-cta page-wrap"><div className="cta-mark"><Fingerprint size={28}/></div><div><Eyebrow>THE FILE IS YOURS TO OPEN</Eyebrow><h2>What happened is only<br />half the mystery.</h2></div><Link to="/create" className="button button-outline">Write the first clue <ArrowRight size={17}/></Link><span className="cta-ghost">CASE<br/>CLOSED?</span></section>
  </>;
}

