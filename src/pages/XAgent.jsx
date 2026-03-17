import React, { useState } from 'react';
import {
  Settings,
  CheckCircle,
  XCircle,
  UserPlus,
  Heart,
  MessageCircle,
  Users,
  Save,
  Check,
  X,
  Clock,
  Repeat2,
  Edit2,
  Trash2
} from 'lucide-react';
import useStore from '../store/useStore';
import { mockXQueue, mockXScheduled } from '../data/mockContent';
import './XAgent.css';

function XAgent() {
  const { settings, updateXConfig } = useStore();
  const [config, setConfig] = useState(settings.xConfig);
  const [queue, setQueue] = useState(mockXQueue);

  const stats = [
    { label: 'Follows Today', value: '8/20', sublabel: 'limit', icon: UserPlus, color: '#4A8EFF' },
    { label: 'Likes Sent', value: '34', sublabel: 'today', icon: Heart, color: '#ef4444' },
    { label: 'Replies Posted', value: '5', sublabel: 'today', icon: MessageCircle, color: '#22c55e' },
    { label: 'New Followers', value: '2', sublabel: 'today', icon: Users, color: '#8b5cf6' },
  ];

  const rateLimits = [
    { label: 'Follows', current: 8, max: 20 },
    { label: 'Likes', current: 34, max: 50 },
    { label: 'Replies', current: 5, max: 10 },
    { label: 'API Calls', current: 847, max: 1500 },
  ];

  const handleSaveConfig = () => {
    updateXConfig(config);
  };

  const handleApprove = (id) => {
    setQueue(queue.map(item =>
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  };

  const handleSkip = (id) => {
    setQueue(queue.filter(item => item.id !== id));
  };

  const handleHashtagChange = (value) => {
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setConfig({ ...config, hashtags: tags });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="x-agent">
      <div className="connection-status">
        <div className="status-badge connected">
          <CheckCircle size={16} />
          Connected to X API
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
              <label>Daily Follow Limit</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={config.dailyFollowLimit}
                  onChange={(e) => setConfig({ ...config, dailyFollowLimit: parseInt(e.target.value) })}
                />
                <span className="slider-value">{config.dailyFollowLimit}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Reply Tone</label>
              <div className="tone-options">
                {['Supportive', 'Insightful', 'Witty'].map((t) => (
                  <label key={t} className="radio-item">
                    <input
                      type="radio"
                      name="tone"
                      checked={config.replyTone === t}
                      onChange={() => setConfig({ ...config, replyTone: t })}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Hashtags to Monitor</label>
              <input
                type="text"
                value={config.hashtags?.join(', ') || ''}
                onChange={(e) => handleHashtagChange(e.target.value)}
                placeholder="#eventprof, #conferences, #eventtech"
              />
            </div>

            <div className="form-group">
              <label>Keywords to Track</label>
              <input
                type="text"
                value={config.keywords || ''}
                onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
                placeholder="conference management, event production"
              />
            </div>

            <div className="form-group">
              <label>Accounts to Engage (one per line)</label>
              <textarea
                value={config.accountsToEngage || ''}
                onChange={(e) => setConfig({ ...config, accountsToEngage: e.target.value })}
                rows={4}
                placeholder="@eventprof&#10;@conferencetech&#10;@avproduction"
              />
            </div>

            <button className="save-btn" onClick={handleSaveConfig}>
              <Save size={16} />
              Save Config
            </button>
          </div>
        </section>

        <div className="right-panels">
          <section className="engagement-queue">
            <h2 className="panel-title">Engagement Queue</h2>
            <div className="queue-list">
              {queue.map((item) => (
                <div key={item.id} className={`queue-item ${item.status === 'approved' ? 'approved' : ''}`}>
                  <div className="tweet-preview">
                    <span className="tweet-author">{item.author}</span>
                    <p className="tweet-content">{item.tweet}</p>
                  </div>
                  <div className="queue-item-action">
                    <span className={`action-badge ${item.action.toLowerCase()}`}>
                      {item.action === 'Like' && <Heart size={12} />}
                      {item.action === 'Reply' && <MessageCircle size={12} />}
                      {item.action === 'Retweet' && <Repeat2 size={12} />}
                      {item.action}
                    </span>
                    {item.reply && (
                      <p className="reply-preview">{item.reply}</p>
                    )}
                  </div>
                  <div className="queue-item-buttons">
                    {item.status !== 'approved' ? (
                      <>
                        <button className="approve-btn" onClick={() => handleApprove(item.id)}>
                          <Check size={14} />
                          Approve
                        </button>
                        <button className="skip-btn" onClick={() => handleSkip(item.id)}>
                          <X size={14} />
                          Skip
                        </button>
                      </>
                    ) : (
                      <span className="approved-badge">
                        <CheckCircle size={14} />
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="post-schedule">
            <h2 className="panel-title">Scheduled Posts</h2>
            <div className="scheduled-list">
              {mockXScheduled.map((post) => (
                <div key={post.id} className="scheduled-item">
                  <div className="scheduled-time">
                    <Clock size={14} />
                    <span>{formatDate(post.scheduledTime)}</span>
                    <span>{formatTime(post.scheduledTime)}</span>
                  </div>
                  <p className="scheduled-content">{post.content}</p>
                  <div className="scheduled-actions">
                    <span className={`status-badge ${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                    <button className="icon-btn">
                      <Edit2 size={14} />
                    </button>
                    <button className="icon-btn danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rate-limits">
            <h2 className="panel-title">Rate Limit Status</h2>
            <div className="limits-grid">
              {rateLimits.map((limit) => (
                <div key={limit.label} className="limit-item">
                  <div className="limit-header">
                    <span className="limit-label">{limit.label}</span>
                    <span className="limit-value">{limit.current}/{limit.max}</span>
                  </div>
                  <div className="limit-bar">
                    <div
                      className="limit-fill"
                      style={{
                        width: `${(limit.current / limit.max) * 100}%`,
                        backgroundColor: limit.current / limit.max > 0.8 ? '#ef4444' : '#4A8EFF'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default XAgent;
