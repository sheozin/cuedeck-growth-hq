import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PenTool,
  Linkedin,
  Twitter,
  Mail,
  Settings,
  Menu
} from 'lucide-react';
import useStore from '../store/useStore';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/pipeline', icon: Users, label: 'Pipeline' },
  { path: '/content', icon: PenTool, label: 'Content Studio' },
  { path: '/linkedin', icon: Linkedin, label: 'LinkedIn Agent' },
  { path: '/x', icon: Twitter, label: 'X Agent' },
  { path: '/email', icon: Mail, label: 'Email Agent' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, agentStatuses } = useStore();

  const allRunning = Object.values(agentStatuses).every(
    (agent) => agent.status === 'running' || agent.status === 'paused'
  );

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        {!sidebarCollapsed && (
          <div className="logo">
            <span className="logo-main">CueDeck</span>
            <span className="logo-sub">Growth HQ</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className={`status-indicator ${allRunning ? 'running' : 'stopped'}`}>
          <span className="status-dot"></span>
          {!sidebarCollapsed && (
            <span className="status-text">
              {allRunning ? 'All agents running' : 'Agents stopped'}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
