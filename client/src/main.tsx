import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { InvestigationPage } from './pages/InvestigationPage';
import { ResultPage } from './pages/ResultPage';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><Shell><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreatePage />} />
    <Route path="/cases/:caseId" element={<InvestigationPage />} />
    <Route path="/cases/:caseId/result" element={<ResultPage />} />
    <Route path="*" element={<HomePage />} />
  </Routes></Shell></BrowserRouter></React.StrictMode>
);

