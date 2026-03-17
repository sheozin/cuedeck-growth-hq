import React, { useState } from 'react';
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
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import useStore from '../store/useStore';
import { mockContent } from '../data/mockContent';
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
  const { contentQueue, addToContentQueue, updateContentItem, removeFromContentQueue, settings } = useStore();
  const [activeTab, setActiveTab] = useState('generator');

  // Generator state
  const [platform, setPlatform] = useState('linkedin-post');
  const [icpTarget, setIcpTarget] = useState('Conference organizer, 500-person events, Poland');
  const [topic, setTopic] = useState('How we cut interpreter costs by 40% using AI');
  const [tone, setTone] = useState('Professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    const apiKey = process.env.REACT_APP_ANTHROPIC_KEY || settings.apiKeys.claude;

    if (!apiKey) {
      setError('Please add your Claude API key in Settings > Integrations');
      setIsGenerating(false);
      return;
    }

    const platformLabel = platforms.find(p => p.value === platform)?.label || platform;

    const systemPrompt = `You are a B2B SaaS marketing copywriter for CueDeck (cuedeck.io), a real-time conference control platform used by event production companies. Pricing: €39/event, €59/mo Starter, €99/mo Pro. Key features: 8-state session machine, 6 operator roles, AI Incident Advisor, live signage, simultaneous interpretation control, post-event reports. ICP: conference organizers, AV production companies, event managers running 100-2000 person events. Write copy that is specific, value-driven, and never generic.`;

    const userPrompt = `Write a ${platformLabel} for this target audience: ${icpTarget}

Topic/Angle: ${topic}

Tone: ${tone}

${platform === 'x-thread' ? 'Format as a thread with 3-5 tweets, each on its own line starting with a number.' : ''}
${platform === 'email-subject' ? 'Provide 5 subject line variations, each on its own line.' : ''}
${platform === 'linkedin-dm' ? 'Keep it short, personal, and under 300 characters.' : ''}
${platform === 'linkedin-comment' ? 'Keep it under 200 characters, thoughtful and engaging.' : ''}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content[0].text);
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const handleAddToQueue = () => {
    const platformIcon = platform.includes('linkedin') ? 'linkedin' : platform.includes('x') ? 'x' : 'email';
    addToContentQueue({
      platform: platformIcon,
      content: generatedContent,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'Draft',
      type: 'post'
    });
    setGeneratedContent('');
  };

  // Calendar helpers
  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const getPostsForDate = (date) => {
    return mockContent.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="content-studio">
      <div className="tabs">
        <button
          className={activeTab === 'generator' ? 'active' : ''}
          onClick={() => setActiveTab('generator')}
        >
          Generator
        </button>
        <button
          className={activeTab === 'calendar' ? 'active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          className={activeTab === 'queue' ? 'active' : ''}
          onClick={() => setActiveTab('queue')}
        >
          Queue
        </button>
      </div>

      {activeTab === 'generator' && (
        <div className="generator-layout">
          <div className="generator-form">
            <h3>Create Content</h3>

            <div className="form-group">
              <label>Platform</label>
              <div className="platform-selector">
                {platforms.map((p) => (
                  <button
                    key={p.value}
                    className={platform === p.value ? 'active' : ''}
                    onClick={() => setPlatform(p.value)}
                  >
                    <p.icon size={16} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>ICP Target</label>
              <input
                type="text"
                value={icpTarget}
                onChange={(e) => setIcpTarget(e.target.value)}
                placeholder="e.g., Conference organizer, 500-person events, Poland"
              />
            </div>

            <div className="form-group">
              <label>Topic / Angle</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How we cut interpreter costs by 40% using AI"
              />
            </div>

            <div className="form-group">
              <label>Tone</label>
              <div className="tone-selector">
                {tones.map((t) => (
                  <button
                    key={t}
                    className={tone === t ? 'active' : ''}
                    onClick={() => setTone(t)}
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
            >
              {isGenerating ? (
                <>
                  <Loader size={18} className="spinner" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Generate
                </>
              )}
            </button>
          </div>

          <div className="generator-result">
            <h3>Preview</h3>

            {error && (
              <div className="error-message">
                <XCircle size={18} />
                {error}
              </div>
            )}

            {generatedContent ? (
              <>
                <div className={`content-preview ${platform.includes('linkedin') ? 'linkedin-style' : platform.includes('x') ? 'x-style' : 'email-style'}`}>
                  <div className="preview-header">
                    {platform.includes('linkedin') && <Linkedin size={20} />}
                    {platform.includes('x') && <Twitter size={20} />}
                    {platform.includes('email') && <Mail size={20} />}
                    <span>CueDeck</span>
                  </div>
                  <div className="preview-content">
                    {generatedContent}
                  </div>
                </div>

                <div className="preview-actions">
                  <button className="action-btn" onClick={handleCopy}>
                    <Copy size={16} />
                    Copy
                  </button>
                  <button className="action-btn">
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button className="action-btn primary" onClick={handleAddToQueue}>
                    <Plus size={16} />
                    Add to Queue
                  </button>
                  <button className="action-btn" onClick={handleGenerate} disabled={isGenerating}>
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-preview">
                <p>Generated content will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="calendar-view">
          <div className="calendar-grid">
            {weekDates.map((date) => (
              <div key={date.toISOString()} className="calendar-day">
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
                        {post.platform === 'linkedin' && <Linkedin size={12} />}
                        {post.platform === 'x' && <Twitter size={12} />}
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
        <div className="queue-view">
          <table className="queue-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Preview</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...mockContent, ...contentQueue].map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="platform-cell">
                      {item.platform === 'linkedin' && <Linkedin size={18} />}
                      {item.platform === 'x' && <Twitter size={18} />}
                      {item.platform === 'email' && <Mail size={18} />}
                    </div>
                  </td>
                  <td>
                    <span className="content-preview-text">
                      {item.content.substring(0, 60)}...
                    </span>
                  </td>
                  <td>
                    <div className="scheduled-cell">
                      <Calendar size={14} />
                      {new Date(item.scheduledTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      <Clock size={14} />
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
                      <button className="queue-btn primary">
                        <Send size={14} />
                        Publish Now
                      </button>
                      <button className="queue-btn">
                        <Edit2 size={14} />
                      </button>
                      <button className="queue-btn danger" onClick={() => removeFromContentQueue(item.id)}>
                        <XCircle size={14} />
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
