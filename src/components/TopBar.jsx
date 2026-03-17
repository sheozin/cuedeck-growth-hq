import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Play, User } from 'lucide-react';
import useStore from '../store/useStore';
import './TopBar.css';

const pageTitles = {
  '/': 'Dashboard',
  '/pipeline': 'Pipeline',
  '/content': 'Content Studio',
  '/linkedin': 'LinkedIn Agent',
  '/x': 'X Agent',
  '/email': 'Email Agent',
  '/settings': 'Settings',
};

function TopBar() {
  const location = useLocation();
  const { agentStatuses, updateAgentStatus } = useStore();
  const title = pageTitles[location.pathname] || 'Dashboard';

  const notificationCount = 3;

  const handleRunAll = () => {
    Object.keys(agentStatuses).forEach((agent) => {
      updateAgentStatus(agent, { status: 'running' });
    });
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-actions">
        <button className="run-all-btn" onClick={handleRunAll}>
          <Play size={16} />
          Run All Agents
        </button>

        <button className="notification-btn">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>

        <div className="user-avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}

export default TopBar;
