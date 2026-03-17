import React, { useEffect, useRef } from 'react';
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
import './Dashboard.css';

function Dashboard() {
  const { leads, activities, agentStatuses, openLeadDrawer } = useStore();
  const activityRef = useRef(null);

  const hotLeads = leads.filter((lead) => lead.isHot);

  const stats = [
    { label: 'Total Leads', value: leads.length, delta: '+4 today', positive: true, icon: Users },
    { label: 'Active Sequences', value: 3, delta: '+1 today', positive: true, icon: Zap },
    { label: 'Posts Scheduled', value: 12, delta: '+2 today', positive: true, icon: Calendar },
    { label: 'Replies Today', value: 7, delta: '+3 vs yesterday', positive: true, icon: MessageSquare },
  ];

  const agents = [
    { key: 'orchestrator', name: 'Orchestrator', icon: Bot, ...agentStatuses.orchestrator },
    { key: 'contentGenerator', name: 'Content Generator', icon: PenTool, ...agentStatuses.contentGenerator },
    { key: 'linkedinAgent', name: 'LinkedIn Agent', icon: Linkedin, ...agentStatuses.linkedinAgent },
    { key: 'xAgent', name: 'X Agent', icon: Twitter, ...agentStatuses.xAgent },
    { key: 'emailAgent', name: 'Email Agent', icon: Mail, ...agentStatuses.emailAgent },
    { key: 'crmAgent', name: 'CRM Agent', icon: Database, ...agentStatuses.crmAgent },
  ];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (activityRef.current) {
      activityRef.current.scrollTop = 0;
    }
  }, [activities]);

  return (
    <div className="dashboard">
      <section className="stats-row">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">
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
        <section className="agents-panel">
          <h2 className="panel-title">Agent Status</h2>
          <div className="agents-list">
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

        <section className="activity-panel">
          <h2 className="panel-title">Activity Feed</h2>
          <div className="activity-feed" ref={activityRef}>
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

      <section className="hot-leads-panel">
        <h2 className="panel-title">Hot Leads</h2>
        <div className="hot-leads-table-wrapper">
          <table className="hot-leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Title</th>
                <th>Signal</th>
                <th>Platform</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="lead-name-cell">
                      <div className="lead-avatar-small">
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
                    <div className="platform-icons">
                      {lead.platforms.includes('linkedin') && <Linkedin size={16} />}
                      {lead.platforms.includes('x') && <Twitter size={16} />}
                      {lead.platforms.includes('email') && <Mail size={16} />}
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="view-btn" onClick={() => openLeadDrawer(lead)}>
                        <Eye size={14} />
                        View
                      </button>
                      <button className="dismiss-btn">
                        <XCircle size={14} />
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
