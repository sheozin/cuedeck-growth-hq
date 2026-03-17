import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Users,
  Zap,
  Calendar,
  MessageSquare,
  Bot,
  PenTool,
  Linkedin,
  Twitter,
  Mail,
  Database,
  Eye,
  XCircle
} from 'lucide-react';
import useStore from '../store/useStore';
import AgentCard from '../components/AgentCard';
import { formatTime } from '../utils/formatters';
import './Dashboard.css';

function Dashboard() {
  const leads = useStore((state) => state.leads);
  const activities = useStore((state) => state.activities);
  const agentStatuses = useStore((state) => state.agentStatuses);
  const openLeadDrawer = useStore((state) => state.openLeadDrawer);
  const updateLead = useStore((state) => state.updateLead);
  const activityRef = useRef(null);

  const hotLeads = useMemo(() =>
    leads.filter((lead) => lead.isHot),
    [leads]
  );

  const stats = useMemo(() => [
    { label: 'Total Leads', value: leads.length, delta: '+4 today', positive: true, icon: Users },
    { label: 'Active Sequences', value: 3, delta: '+1 today', positive: true, icon: Zap },
    { label: 'Posts Scheduled', value: 12, delta: '+2 today', positive: true, icon: Calendar },
    { label: 'Replies Today', value: 7, delta: '+3 vs yesterday', positive: true, icon: MessageSquare },
  ], [leads.length]);

  const agents = useMemo(() => [
    { key: 'orchestrator', name: 'Orchestrator', icon: Bot, ...agentStatuses.orchestrator },
    { key: 'contentGenerator', name: 'Content Generator', icon: PenTool, ...agentStatuses.contentGenerator },
    { key: 'linkedinAgent', name: 'LinkedIn Agent', icon: Linkedin, ...agentStatuses.linkedinAgent },
    { key: 'xAgent', name: 'X Agent', icon: Twitter, ...agentStatuses.xAgent },
    { key: 'emailAgent', name: 'Email Agent', icon: Mail, ...agentStatuses.emailAgent },
    { key: 'crmAgent', name: 'CRM Agent', icon: Database, ...agentStatuses.crmAgent },
  ], [agentStatuses]);

  const handleOpenLead = useCallback((lead) => {
    openLeadDrawer(lead);
  }, [openLeadDrawer]);

  const handleDismissLead = useCallback((leadId) => {
    updateLead(leadId, { isHot: false });
  }, [updateLead]);

  useEffect(() => {
    if (activityRef.current) {
      activityRef.current.scrollTop = 0;
    }
  }, [activities]);

  return (
    <div className="dashboard">
      <section className="stats-row" aria-label="Key metrics">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              <stat.icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-delta ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="agents-panel" aria-labelledby="agents-title">
          <h2 id="agents-title" className="panel-title">Agent Status</h2>
          <div className="agents-list" role="list">
            {agents.map((agent) => (
              <AgentCard
                key={agent.key}
                name={agent.name}
                status={agent.status}
                task={agent.task}
                tasksToday={agent.tasksToday}
                icon={agent.icon}
              />
            ))}
          </div>
        </section>

        <section className="activity-panel" aria-labelledby="activity-title">
          <h2 id="activity-title" className="panel-title">Activity Feed</h2>
          <div
            className="activity-feed"
            ref={activityRef}
            role="log"
            aria-live="polite"
            aria-label="Recent agent activities"
          >
            {activities.slice(0, 20).map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className="activity-time">{formatTime(activity.timestamp)}</span>
                <span className="activity-agent">{activity.agent}</span>
                <span className="activity-action">{activity.action}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="hot-leads-panel" aria-labelledby="hot-leads-title">
        <h2 id="hot-leads-title" className="panel-title">Hot Leads</h2>
        <div className="hot-leads-table-wrapper">
          <table className="hot-leads-table" aria-label="Hot leads requiring attention">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Company</th>
                <th scope="col">Title</th>
                <th scope="col">Signal</th>
                <th scope="col">Platform</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="lead-name-cell">
                      <div className="lead-avatar-small" aria-hidden="true">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td>{lead.company}</td>
                  <td>{lead.title}</td>
                  <td>
                    <span className="signal-badge">{lead.signal}</span>
                  </td>
                  <td>
                    <div className="platform-icons" aria-label={`Platforms: ${lead.platforms.join(', ')}`}>
                      {lead.platforms.includes('linkedin') && <Linkedin size={16} aria-hidden="true" />}
                      {lead.platforms.includes('x') && <Twitter size={16} aria-hidden="true" />}
                      {lead.platforms.includes('email') && <Mail size={16} aria-hidden="true" />}
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="view-btn"
                        onClick={() => handleOpenLead(lead)}
                        aria-label={`View ${lead.name}`}
                      >
                        <Eye size={14} aria-hidden="true" />
                        View
                      </button>
                      <button
                        className="dismiss-btn"
                        aria-label={`Dismiss ${lead.name}`}
                        onClick={() => handleDismissLead(lead.id)}
                      >
                        <XCircle size={14} aria-hidden="true" />
                        Dismiss
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
