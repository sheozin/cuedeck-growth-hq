import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LeadDrawer from './components/LeadDrawer';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import ContentStudio from './pages/ContentStudio';
import LinkedInAgent from './pages/LinkedInAgent';
import XAgent from './pages/XAgent';
import EmailAgent from './pages/EmailAgent';
import Settings from './pages/Settings';
import useStore from './store/useStore';
import './App.css';

function App() {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="app">
      <Sidebar />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <TopBar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/content" element={<ContentStudio />} />
            <Route path="/linkedin" element={<LinkedInAgent />} />
            <Route path="/x" element={<XAgent />} />
            <Route path="/email" element={<EmailAgent />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
      <LeadDrawer />
    </div>
  );
}

export default App;
