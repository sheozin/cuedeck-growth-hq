import React, { useState } from 'react';
import {
  Settings,
  CheckCircle,
  XCircle,
  Users,
  Percent,
  Eye,
  MessageSquare,
  Save,
  Clock,
  UserPlus,
  MessageCircle,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import useStore from '../store/useStore';
import { mockLinkedinQueue, mockLinkedinLog } from '../data/mockContent';
import './LinkedInAgent.css';

const industries = [
  'Conferences & Events',
  'Corporate Events',
  'Government Events',
  'Associations & NGOs',
  'Exhibition & Trade Shows',
];

const regions = ['Poland', 'Germany', 'UAE', 'UK', 'Netherlands', 'Egypt'];

function LinkedInAgent() {
  const { settings, updateLinkedinConfig } = useStore();
  const [config, setConfig] = useState(settings.linkedinConfig);

  const stats = [
    { label: 'Connects Sent Today', value: '12/20', sublabel: 'limit', icon: UserPlus, color: '#4A8EFF' },
    { label: 'Acceptance Rate', value: '34%', sublabel: 'last 30 days', icon: Percent, color: '#22c55e' },
    { label: 'Profile Views', value: '47', sublabel: 'this week', icon: Eye, color: '#8b5cf6' },
    { label: 'Replies Received', value: '3', sublabel: 'today', icon: MessageSquare, color: '#f59e0b' },
  ];

  const handleSaveConfig = () => {
    updateLinkedinConfig(config);
  };

  const handleIndustryToggle = (industry) => {
    const current = config.industries || [];
    if (current.includes(industry)) {
      setConfig({ ...config, industries: current.filter((i) => i !== industry) });
    } else {
      setConfig({ ...config, industries: [...current, industry] });
    }
  };

  const handleRegionToggle = (region) => {
    const current = config.regions || [];
    if (current.includes(region)) {
      setConfig({ ...config, regions: current.filter((r) => r !== region) });
    } else {
      setConfig({ ...config, regions: [...current, region] });
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'Accepted': return '#22c55e';
      case 'Sent': case 'Viewed': case 'Posted': return '#4A8EFF';
      case 'Ignored': return '#9ca3af';
      case 'Error': return '#ef4444';
      default: return '#64748b';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="linkedin-agent">
      <div className="connection-status">
        <div className="status-badge connected">
          <CheckCircle size={16} />
          Connected via PhantomBuster
        </div>
        <button className="configure-btn">
          <Settings size={16} />
          Configure
        </button>
      </div>

      <div className="stats-row">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-sublabel">{stat.sublabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="agent-grid">
        <section className="config-panel">
          <h2 className="panel-title">Configuration</h2>

          <div className="config-form">
            <div className="form-group">
              <label>Daily Connect Limit</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={config.dailyConnectLimit}
                  onChange={(e) => setConfig({ ...config, dailyConnectLimit: parseInt(e.target.value) })}
                />
                <span className="slider-value">{config.dailyConnectLimit}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Daily Message Limit</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={config.dailyMessageLimit}
                  onChange={(e) => setConfig({ ...config, dailyMessageLimit: parseInt(e.target.value) })}
                />
                <span className="slider-value">{config.dailyMessageLimit}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Connection Note Template</label>
              <textarea
                value={config.connectionTemplate}
                onChange={(e) => setConfig({ ...config, connectionTemplate: e.target.value })}
                rows={4}
                placeholder="Use {firstName}, {company}, {title} as variables"
              />
              <p className="form-hint">Variables: {'{firstName}'}, {'{company}'}, {'{title}'}</p>
            </div>

            <div className="form-group">
              <label>Target Job Titles (comma-separated)</label>
              <input
                type="text"
                value={config.targetTitles}
                onChange={(e) => setConfig({ ...config, targetTitles: e.target.value })}
                placeholder="e.g., Conference Manager, Event Director"
              />
            </div>

            <div className="form-group">
              <label>Target Industries</label>
              <div className="checkbox-grid">
                {industries.map((industry) => (
                  <label key={industry} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={config.industries?.includes(industry) || false}
                      onChange={() => handleIndustryToggle(industry)}
                    />
                    <span>{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Target Regions</label>
              <div className="checkbox-grid">
                {regions.map((region) => (
                  <label key={region} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={config.regions?.includes(region) || false}
                      onChange={() => handleRegionToggle(region)}
                    />
                    <span>{region}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="save-btn" onClick={handleSaveConfig}>
              <Save size={16} />
              Save Config
            </button>
          </div>
        </section>

        <div className="right-panels">
          <section className="queue-panel">
            <h2 className="panel-title">Action Queue</h2>
            <div className="queue-table-wrapper">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Action</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLinkedinQueue.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.title}</td>
                      <td>{item.company}</td>
                      <td>
                        <span className={`action-type ${item.action.toLowerCase().replace(' ', '-')}`}>
                          {item.action === 'Connect' && <UserPlus size={12} />}
                          {item.action === 'View Profile' && <Eye size={12} />}
                          {item.action === 'Comment on Post' && <MessageCircle size={12} />}
                          {item.action === 'Follow' && <UserCheck size={12} />}
                          {item.action}
                        </span>
                      </td>
                      <td>
                        <span className="time-cell">
                          <Clock size={12} />
                          {formatTime(item.scheduledTime)}
                        </span>
                      </td>
                      <td>
                        <span className="status-queued">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="log-panel">
            <h2 className="panel-title">Action Log</h2>
            <div className="action-log">
              {mockLinkedinLog.map((item) => (
                <div key={item.id} className="log-item">
                  <span className="log-time">{formatTime(item.timestamp)}</span>
                  <span className={`log-action ${item.action.toLowerCase()}`}>{item.action}</span>
                  <span className="log-target">{item.target}</span>
                  <span className="log-result" style={{ color: getResultColor(item.result) }}>
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LinkedInAgent;
