import React, { useState, useMemo, useCallback } from 'react';
import {
  Linkedin,
  Twitter,
  Mail,
  MessageSquare,
  Send,
  Copy,
  Edit2,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  XCircle,
  Loader
} from 'lucide-react';
import useStore from '../store/useStore';
import { mockContent } from '../data/mockContent';
import { formatDate, formatTime } from '../utils/formatters';
import './ContentStudio.css';

const platforms = [
  { value: 'linkedin-post', label: 'LinkedIn Post', icon: Linkedin },
  { value: 'x-thread', label: 'X Thread', icon: Twitter },
  { value: 'email-subject', label: 'Email Subject', icon: Mail },
  { value: 'linkedin-comment', label: 'LinkedIn Comment', icon: MessageSquare },
  { value: 'linkedin-dm', label: 'LinkedIn DM', icon: Send },
];

const tones = ['Professional', 'Conversational', 'Bold', 'Storytelling'];

function ContentStudio() {
  const contentQueue = useStore((state) => state.contentQueue);
  const addToContentQueue = useStore((state) => state.addToContentQueue);
  const removeFromContentQueue = useStore((state) => state.removeFromContentQueue);
  const updateContentItem = useStore((state) => state.updateContentItem);

  const [activeTab, setActiveTab] = useState('generator');

  // Generator state
  const [platform, setPlatform] = useState('linkedin-post');
  const [icpTarget, setIcpTarget] = useState('Conference organizer, 500-person events, Poland');
  const [topic, setTopic] = useState('How we cut interpreter costs by 40% using AI');
  const [tone, setTone] = useState('Professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      // Use server-side API proxy to keep API key secure
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          icpTarget,
          topic,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.content);
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [platform, icpTarget, topic, tone]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedContent);
  }, [generatedContent]);

  const handleAddToQueue = useCallback(() => {
    const platformIcon = platform.includes('linkedin') ? 'linkedin' : platform.includes('x') ? 'x' : 'email';
    addToContentQueue({
      platform: platformIcon,
      content: generatedContent,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'Draft',
      type: 'post'
    });
    setGeneratedContent('');
    setIsEditing(false);
  }, [platform, generatedContent, addToContentQueue]);

  const handleEditContent = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleContentChange = useCallback((e) => {
    setGeneratedContent(e.target.value);
  }, []);

  const handlePublishNow = useCallback((item) => {
    updateContentItem(item.id, { status: 'Published' });
    alert(`Published: "${item.content.substring(0, 50)}..."`);
  }, [updateContentItem]);

  const handleEditQueueItem = useCallback((item) => {
    const newContent = prompt('Edit content:', item.content);
    if (newContent && newContent !== item.content) {
      updateContentItem(item.id, { content: newContent });
    }
  }, [updateContentItem]);

  // Calendar helpers
  const weekDates = useMemo(() => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const getPostsForDate = useCallback((date) => {
    return mockContent.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return postDate.toDateString() === date.toDateString();
    });
  }, []);

  const allContent = useMemo(() => {
    return contentQueue;
  }, [contentQueue]);

  return (
    <div className="content-studio">
      <div className="tabs" role="tablist" aria-label="Content Studio tabs">
        <button
          role="tab"
          aria-selected={activeTab === 'generator'}
          aria-controls="generator-panel"
          className={activeTab === 'generator' ? 'active' : ''}
          onClick={() => setActiveTab('generator')}
        >
          Generator
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'calendar'}
          aria-controls="calendar-panel"
          className={activeTab === 'calendar' ? 'active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'queue'}
          aria-controls="queue-panel"
          className={activeTab === 'queue' ? 'active' : ''}
          onClick={() => setActiveTab('queue')}
        >
          Queue
        </button>
      </div>

      {activeTab === 'generator' && (
        <div id="generator-panel" role="tabpanel" className="generator-layout">
          <div className="generator-form">
            <h3 id="create-content-heading">Create Content</h3>

            <div className="form-group">
              <label id="platform-label">Platform</label>
              <div
                className="platform-selector"
                role="group"
                aria-labelledby="platform-label"
              >
                {platforms.map((p) => (
                  <button
                    key={p.value}
                    className={platform === p.value ? 'active' : ''}
                    onClick={() => setPlatform(p.value)}
                    aria-pressed={platform === p.value}
                  >
                    <p.icon size={16} aria-hidden="true" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="icp-target">ICP Target</label>
              <input
                id="icp-target"
                type="text"
                value={icpTarget}
                onChange={(e) => setIcpTarget(e.target.value)}
                placeholder="e.g., Conference organizer, 500-person events, Poland"
              />
            </div>

            <div className="form-group">
              <label htmlFor="topic">Topic / Angle</label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How we cut interpreter costs by 40% using AI"
              />
            </div>

            <div className="form-group">
              <label id="tone-label">Tone</label>
              <div
                className="tone-selector"
                role="group"
                aria-labelledby="tone-label"
              >
                {tones.map((t) => (
                  <button
                    key={t}
                    className={tone === t ? 'active' : ''}
                    onClick={() => setTone(t)}
                    aria-pressed={tone === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating}
              aria-busy={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader size={18} className="spinner" aria-hidden="true" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw size={18} aria-hidden="true" />
                  Generate
                </>
              )}
            </button>
          </div>

          <div className="generator-result">
            <h3>Preview</h3>

            {error && (
              <div className="error-message" role="alert">
                <XCircle size={18} aria-hidden="true" />
                {error}
              </div>
            )}

            {generatedContent ? (
              <>
                <div className={`content-preview ${platform.includes('linkedin') ? 'linkedin-style' : platform.includes('x') ? 'x-style' : 'email-style'}`}>
                  <div className="preview-header">
                    {platform.includes('linkedin') && <Linkedin size={20} aria-hidden="true" />}
                    {platform.includes('x') && <Twitter size={20} aria-hidden="true" />}
                    {platform.includes('email') && <Mail size={20} aria-hidden="true" />}
                    <span>CueDeck</span>
                  </div>
                  <div className="preview-content">
                    {isEditing ? (
                      <textarea
                        className="content-editor"
                        value={generatedContent}
                        onChange={handleContentChange}
                        rows={10}
                      />
                    ) : (
                      generatedContent
                    )}
                  </div>
                </div>

                <div className="preview-actions">
                  <button className="action-btn" onClick={handleCopy} aria-label="Copy content">
                    <Copy size={16} aria-hidden="true" />
                    Copy
                  </button>
                  <button
                    className={`action-btn ${isEditing ? 'active' : ''}`}
                    onClick={handleEditContent}
                    aria-label="Edit content"
                    aria-pressed={isEditing}
                  >
                    <Edit2 size={16} aria-hidden="true" />
                    {isEditing ? 'Editing...' : 'Edit'}
                  </button>
                  <button className="action-btn primary" onClick={handleAddToQueue} aria-label="Add to queue">
                    <Plus size={16} aria-hidden="true" />
                    Add to Queue
                  </button>
                  <button
                    className="action-btn"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    aria-label="Regenerate content"
                  >
                    <RefreshCw size={16} aria-hidden="true" />
                    Regenerate
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-preview" aria-live="polite">
                <p>Generated content will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div id="calendar-panel" role="tabpanel" className="calendar-view">
          <div className="calendar-grid" role="grid" aria-label="Content calendar">
            {weekDates.map((date) => (
              <div key={date.toISOString()} className="calendar-day" role="gridcell">
                <div className="day-header">
                  <span className="day-name">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="day-date">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="day-posts">
                  {getPostsForDate(date).map((post) => (
                    <div key={post.id} className={`calendar-post ${post.platform}`}>
                      <div className="post-header">
                        {post.platform === 'linkedin' && <Linkedin size={12} aria-hidden="true" />}
                        {post.platform === 'x' && <Twitter size={12} aria-hidden="true" />}
                        <span>{formatTime(post.scheduledTime)}</span>
                      </div>
                      <p className="post-preview">
                        {post.content.substring(0, 80)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div id="queue-panel" role="tabpanel" className="queue-view">
          <table className="queue-table" aria-label="Content queue">
            <thead>
              <tr>
                <th scope="col">Platform</th>
                <th scope="col">Preview</th>
                <th scope="col">Scheduled</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allContent.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="platform-cell">
                      {item.platform === 'linkedin' && <Linkedin size={18} aria-label="LinkedIn" />}
                      {item.platform === 'x' && <Twitter size={18} aria-label="X" />}
                      {item.platform === 'email' && <Mail size={18} aria-label="Email" />}
                    </div>
                  </td>
                  <td>
                    <span className="content-preview-text">
                      {item.content.substring(0, 60)}...
                    </span>
                  </td>
                  <td>
                    <div className="scheduled-cell">
                      <Calendar size={14} aria-hidden="true" />
                      {formatDate(item.scheduledTime)}
                      <Clock size={14} aria-hidden="true" />
                      {formatTime(item.scheduledTime)}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="queue-actions">
                      <button
                        className="queue-btn primary"
                        aria-label="Publish now"
                        onClick={() => handlePublishNow(item)}
                        disabled={item.status === 'Published'}
                      >
                        <Send size={14} aria-hidden="true" />
                        {item.status === 'Published' ? 'Published' : 'Publish Now'}
                      </button>
                      <button
                        className="queue-btn"
                        aria-label="Edit"
                        onClick={() => handleEditQueueItem(item)}
                      >
                        <Edit2 size={14} aria-hidden="true" />
                      </button>
                      <button
                        className="queue-btn danger"
                        onClick={() => removeFromContentQueue(item.id)}
                        aria-label="Delete"
                      >
                        <XCircle size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContentStudio;
