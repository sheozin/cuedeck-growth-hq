import React, { useState, useCallback, useMemo } from 'react';
import {
  Settings,
  CheckCircle,
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
import ConfigModal from '../components/ConfigModal';
import { mockXQueue, mockXScheduled } from '../data/mockContent';
import { formatTime, formatDate } from '../utils/formatters';
import './XAgent.css';

function XAgent() {
  const settings = useStore((state) => state.settings);
  const updateXConfig = useStore((state) => state.updateXConfig);
  const [config, setConfig] = useState(settings.xConfig);
  const [queue, setQueue] = useState(mockXQueue);
  const [scheduledPosts, setScheduledPosts] = useState(mockXScheduled);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const stats = useMemo(() => [
    { label: 'Follows Today', value: '8/20', sublabel: 'limit', icon: UserPlus, color: '#4A8EFF' },
    { label: 'Likes Sent', value: '34', sublabel: 'today', icon: Heart, color: '#ef4444' },
    { label: 'Replies Posted', value: '5', sublabel: 'today', icon: MessageCircle, color: '#22c55e' },
    { label: 'New Followers', value: '2', sublabel: 'today', icon: Users, color: '#8b5cf6' },
  ], []);

  const rateLimits = useMemo(() => [
    { label: 'Follows', current: 8, max: 20 },
    { label: 'Likes', current: 34, max: 50 },
    { label: 'Replies', current: 5, max: 10 },
    { label: 'API Calls', current: 847, max: 1500 },
  ], []);

  const handleSaveConfig = useCallback(() => {
    updateXConfig(config);
  }, [config, updateXConfig]);

  const handleApprove = useCallback((id) => {
    setQueue((prev) => prev.map(item =>
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  }, []);

  const handleSkip = useCallback((id) => {
    setQueue((prev) => prev.filter(item => item.id !== id));
  }, []);

  const handleHashtagChange = useCallback((value) => {
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setConfig((prev) => ({ ...prev, hashtags: tags }));
  }, []);

  const handleEditPost = useCallback((post) => {
    const newContent = prompt('Edit post content:', post.content);
    if (newContent && newContent !== post.content) {
      setScheduledPosts(prev => prev.map(p =>
        p.id === post.id ? { ...p, content: newContent } : p
      ));
    }
  }, []);

  const handleDeletePost = useCallback((postId) => {
    if (window.confirm('Are you sure you want to delete this scheduled post?')) {
      setScheduledPosts(prev => prev.filter(p => p.id !== postId));
    }
  }, []);

  return (
    <div className="x-agent">
      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        platform="x"
      />
      <div className="connection-status">
        <div className="status-badge connected" role="status">
          <CheckCircle size={16} aria-hidden="true" />
          Connected to X API
        </div>
        <button
          className="configure-btn"
          aria-label="Configure X API"
          onClick={() => setShowConfigModal(true)}
        >
          <Settings size={16} aria-hidden="true" />
          Configure
        </button>
      </div>

      <div className="stats-row" role="region" aria-label="X Agent statistics">
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
              <label htmlFor="follow-limit">Daily Follow Limit</label>
              <div className="slider-container">
                <input
                  id="follow-limit"
                  type="range"
                  min="1"
                  max="50"
                  value={config.dailyFollowLimit}
                  onChange={(e) => setConfig({ ...config, dailyFollowLimit: parseInt(e.target.value) })}
                />
                <span className="slider-value" aria-hidden="true">{config.dailyFollowLimit}</span>
              </div>
            </div>

            <div className="form-group">
              <label id="tone-label">Reply Tone</label>
              <div className="tone-options" role="radiogroup" aria-labelledby="tone-label">
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
              <label htmlFor="hashtags">Hashtags to Monitor</label>
              <input
                id="hashtags"
                type="text"
                value={config.hashtags?.join(', ') || ''}
                onChange={(e) => handleHashtagChange(e.target.value)}
                placeholder="#eventprof, #conferences, #eventtech"
              />
            </div>

            <div className="form-group">
              <label htmlFor="keywords">Keywords to Track</label>
              <input
                id="keywords"
                type="text"
                value={config.keywords || ''}
                onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
                placeholder="conference management, event production"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accounts">Accounts to Engage (one per line)</label>
              <textarea
                id="accounts"
                value={config.accountsToEngage || ''}
                onChange={(e) => setConfig({ ...config, accountsToEngage: e.target.value })}
                rows={4}
                placeholder="@eventprof&#10;@conferencetech&#10;@avproduction"
              />
            </div>

            <button className="save-btn" onClick={handleSaveConfig}>
              <Save size={16} aria-hidden="true" />
              Save Config
            </button>
          </div>
        </section>

        <div className="right-panels">
          <section className="engagement-queue" aria-labelledby="queue-title">
            <h2 id="queue-title" className="panel-title">Engagement Queue</h2>
            <div className="queue-list" role="list">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={`queue-item ${item.status === 'approved' ? 'approved' : ''}`}
                  role="listitem"
                >
                  <div className="tweet-preview">
                    <span className="tweet-author">{item.author}</span>
                    <p className="tweet-content">{item.tweet}</p>
                  </div>
                  <div className="queue-item-action">
                    <span className={`action-badge ${item.action.toLowerCase()}`}>
                      {item.action === 'Like' && <Heart size={12} aria-hidden="true" />}
                      {item.action === 'Reply' && <MessageCircle size={12} aria-hidden="true" />}
                      {item.action === 'Retweet' && <Repeat2 size={12} aria-hidden="true" />}
                      {item.action}
                    </span>
                    {item.reply && (
                      <p className="reply-preview">{item.reply}</p>
                    )}
                  </div>
                  <div className="queue-item-buttons">
                    {item.status !== 'approved' ? (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(item.id)}
                          aria-label={`Approve ${item.action} for ${item.author}`}
                        >
                          <Check size={14} aria-hidden="true" />
                          Approve
                        </button>
                        <button
                          className="skip-btn"
                          onClick={() => handleSkip(item.id)}
                          aria-label={`Skip ${item.action} for ${item.author}`}
                        >
                          <X size={14} aria-hidden="true" />
                          Skip
                        </button>
                      </>
                    ) : (
                      <span className="approved-badge" role="status">
                        <CheckCircle size={14} aria-hidden="true" />
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="post-schedule" aria-labelledby="schedule-title">
            <h2 id="schedule-title" className="panel-title">Scheduled Posts</h2>
            <div className="scheduled-list" role="list">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="scheduled-item" role="listitem">
                  <div className="scheduled-time">
                    <Clock size={14} aria-hidden="true" />
                    <span>{formatDate(post.scheduledTime)}</span>
                    <span>{formatTime(post.scheduledTime)}</span>
                  </div>
                  <p className="scheduled-content">{post.content}</p>
                  <div className="scheduled-actions">
                    <span className={`status-badge ${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                    <button
                      className="icon-btn"
                      aria-label="Edit post"
                      onClick={() => handleEditPost(post)}
                    >
                      <Edit2 size={14} aria-hidden="true" />
                    </button>
                    <button
                      className="icon-btn danger"
                      aria-label="Delete post"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rate-limits" aria-labelledby="limits-title">
            <h2 id="limits-title" className="panel-title">Rate Limit Status</h2>
            <div className="limits-grid">
              {rateLimits.map((limit) => (
                <div key={limit.label} className="limit-item">
                  <div className="limit-header">
                    <span className="limit-label">{limit.label}</span>
                    <span className="limit-value">{limit.current}/{limit.max}</span>
                  </div>
                  <div
                    className="limit-bar"
                    role="progressbar"
                    aria-valuenow={limit.current}
                    aria-valuemin="0"
                    aria-valuemax={limit.max}
                    aria-label={`${limit.label}: ${limit.current} of ${limit.max}`}
                  >
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
