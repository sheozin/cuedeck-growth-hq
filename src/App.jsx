import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LeadDrawer from './components/LeadDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import useStore from './store/useStore';
import './App.css';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pipeline = lazy(() => import('./pages/Pipeline'));
const ContentStudio = lazy(() => import('./pages/ContentStudio'));
const LinkedInAgent = lazy(() => import('./pages/LinkedInAgent'));
const XAgent = lazy(() => import('./pages/XAgent'));
const EmailAgent = lazy(() => import('./pages/EmailAgent'));
const Settings = lazy(() => import('./pages/Settings'));
const Guide = lazy(() => import('./pages/Guide'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Templates = lazy(() => import('./pages/Templates'));
const Community = lazy(() => import('./pages/Community'));
const Integrations = lazy(() => import('./pages/Integrations'));
const GrowthTools = lazy(() => import('./pages/GrowthTools'));

// Loading fallback component
const PageLoader = () => (
  <div className="page-loader" role="status" aria-label="Loading page">
    <div className="loader-spinner"></div>
    <span className="loader-text">Loading...</span>
  </div>
);

function App() {
  const sidebarCollapsed = useStore((state) => state.sidebarCollapsed);

  return (
    <ErrorBoundary level="app">
      <div className="app">
        <Sidebar />
        <main
          className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}
          role="main"
          aria-label="Main content"
        >
          <TopBar />
          <div className="page-content">
            <ErrorBoundary level="page">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pipeline" element={<Pipeline />} />
                  <Route path="/content" element={<ContentStudio />} />
                  <Route path="/linkedin" element={<LinkedInAgent />} />
                  <Route path="/x" element={<XAgent />} />
                  <Route path="/email" element={<EmailAgent />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/growth-tools" element={<GrowthTools />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
        <LeadDrawer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
