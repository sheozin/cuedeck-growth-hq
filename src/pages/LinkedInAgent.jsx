import React, { useState, useCallback, useMemo } from 'react';
import {
  Settings,
  CheckCircle,
  Users,
  Percent,
  Eye,
  MessageSquare,
  Save,
  Clock,
  UserPlus,
  MessageCircle,
  UserCheck
} from 'lucide-react';
import useStore from '../store/useStore';
import { mockLinkedinQueue, mockLinkedinLog } from '../data/mockContent';
import { formatTime } from '../utils/formatters';
import { getStatusColor } from '../utils/styles';
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
  const settings = useStore((state) => state.settings);
  const updateLinkedinConfig = useStore((state) => state.updateLinkedinConfig);
  const [config, setConfig] = useState(settings.linkedinConfig);

  const stats = useMemo(() => [
    { label: 'Connects Sent Today', value: '12/20', sublabel: 'limit', icon: UserPlus, color: '#4A8EFF' },
    { label: 'Acceptance Rate', value: '34%', sublabel: 'last 30 days', icon: Percent, color: '#22c55e' },
    { label: 'Profile Views', value: '47', sublabel: 'this week', icon: Eye, color: '#8b5cf6' },
    { label: 'Replies Received', value: '3', sublabel: 'today', icon: MessageSquare, color: '#f59e0b' },
  ], []);

  const handleSaveConfig = useCallback(() => {
    updateLinkedinConfig(config);
  }, [config, updateLinkedinConfig]);

  const handleIndustryToggle = useCallback((industry) => {
    const current = config.industries || [];
    setConfig((prev) => ({
      ...prev,
      industries: current.includes(industry)
        ? current.filter((i) => i !== industry)
        : [...current, industry]
    }));
  }, [config.industries]);

  const handleRegionToggle = useCallback((region) => {
    const current = config.regions || [];
    setConfig((prev) => ({
      ...prev,
      regions: current.includes(region)
        ? current.filter((r) => r !== region)
        : [...current, region]
    }));
  }, [config.regions]);

  return (
    <div className="linkedin-agent">
      <div className="connection-status">
        <div className="status-badge connected" role="status">
          <CheckCircle size={16} aria-hidden="true" />
          Connected via PhantomBuster
        </div>
        <button className="configure-btn" aria-label="Configure PhantomBuster">
          <Settings size={16} aria-hidden="true" />
          Configure
        </button>
      </div>

      <div className="stats-row" role="region" aria-label="LinkedIn Agent statistics">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }} aria-hidden="true">
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
        <section className="config-panel" aria-labelledby="config-title">
          <h2 id="config-title" className="panel-title">Configuration</h2>

          <div className="config-form">
            <div className="form-group">
              <label htmlFor="connect-limit">Daily Connect Limit</label>
              <div className="slider-container">
                <input
                  id="connect-limit"
                  type="range"
                  min="1"
                  max="50"
                  value={config.dailyConnectLimit}
                  onChange={(e) => setConfig({ ...config, dailyConnectLimit: parseInt(e.target.value) })}
                  aria-valuemin="1"
                  aria-valuemax="50"
                  aria-valuenow={config.dailyConnectLimit}
                />
                <span className="slider-value" aria-hidden="true">{config.dailyConnectLimit}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message-limit">Daily Message Limit</label>
              <div className="slider-container">
                <input
                  id="message-limit"
                  type="range"
                  min="1"
                  max="30"
                  value={config.dailyMessageLimit}
                  onChange={(e) => setConfig({ ...config, dailyMessageLimit: parseInt(e.target.value) })}
                  aria-valuemin="1"
                  aria-valuemax="30"
                  aria-valuenow={config.dailyMessageLimit}
                />
                <span className="slider-value" aria-hidden="true">{config.dailyMessageLimit}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="connection-template">Connection Note Template</label>
              <textarea
                id="connection-template"
                value={config.connectionTemplate}
                onChange={(e) => setConfig({ ...config, connectionTemplate: e.target.value })}
                rows={4}
                placeholder="Use {firstName}, {company}, {title} as variables"
              />
              <p className="form-hint">Variables: {'{firstName}'}, {'{company}'}, {'{title}'}</p>
            </div>

            <div className="form-group">
              <label htmlFor="target-titles">Target Job Titles (comma-separated)</label>
              <input
                id="target-titles"
                type="text"
                value={config.targetTitles}
                onChange={(e) => setConfig({ ...config, targetTitles: e.target.value })}
                placeholder="e.g., Conference Manager, Event Director"
              />
            </div>

            <div className="form-group">
              <label id="industries-label">Target Industries</label>
              <div className="checkbox-grid" role="group" aria-labelledby="industries-label">
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
              <label id="regions-label">Target Regions</label>
              <div className="checkbox-grid" role="group" aria-labelledby="regions-label">
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
              <Save size={16} aria-hidden="true" />
              Save Config
            </button>
          </div>
        </section>

        <div className="right-panels">
          <section className="queue-panel" aria-labelledby="queue-title">
            <h2 id="queue-title" className="panel-title">Action Queue</h2>
            <div className="queue-table-wrapper">
              <table className="queue-table" aria-label="Upcoming LinkedIn actions">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Title</th>
                    <th scope="col">Company</th>
                    <th scope="col">Action</th>
                    <th scope="col">Scheduled</th>
                    <th scope="col">Status</th>
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
                          {item.action === 'Connect' && <UserPlus size={12} aria-hidden="true" />}
                          {item.action === 'View Profile' && <Eye size={12} aria-hidden="true" />}
                          {item.action === 'Comment on Post' && <MessageCircle size={12} aria-hidden="true" />}
                          {item.action === 'Follow' && <UserCheck size={12} aria-hidden="true" />}
                          {item.action}
                        </span>
                      </td>
                      <td>
                        <span className="time-cell">
                          <Clock size={12} aria-hidden="true" />
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

          <section className="log-panel" aria-labelledby="log-title">
            <h2 id="log-title" className="panel-title">Action Log</h2>
            <div className="action-log" role="log" aria-live="polite">
              {mockLinkedinLog.map((item) => (
                <div key={item.id} className="log-item">
                  <span className="log-time">{formatTime(item.timestamp)}</span>
                  <span className={`log-action ${item.action.toLowerCase()}`}>{item.action}</span>
                  <span className="log-target">{item.target}</span>
                  <span className="log-result" style={{ color: getStatusColor(item.result) }}>
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
