import React, { useState, useCallback } from 'react';
import {
  Zap,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle,
  Linkedin,
  Twitter,
  Mail,
  Calendar,
  Users,
  Globe,
  Chrome,
  Share2,
  ArrowRight,
  Star
} from 'lucide-react';
import './GrowthTools.css';

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'x', name: 'X/Twitter', icon: Twitter },
  { id: 'email', name: 'Email', icon: Mail },
];

const contentTypes = [
  'Post',
  'Thread',
  'DM/Message',
  'Comment',
  'Article'
];

function GrowthTools() {
  const [activeTab, setActiveTab] = useState('predictor');

  // Content Predictor State
  const [predictorContent, setPredictorContent] = useState('');
  const [predictorPlatform, setPredictorPlatform] = useState('linkedin');
  const [predictorType, setPredictorType] = useState('Post');
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Best Time Analyzer State
  const [selectedTimePlatform, setSelectedTimePlatform] = useState('linkedin');
  const [audienceTimezone, setAudienceTimezone] = useState('America/New_York');

  // Signature Generator State
  const [signatureName, setSignatureName] = useState('');
  const [signatureTitle, setSignatureTitle] = useState('');
  const [signatureCompany, setSignatureCompany] = useState('');
  const [signatureLinkedIn, setSignatureLinkedIn] = useState('');
  const [signatureCopied, setSignatureCopied] = useState(false);

  const handleAnalyzeContent = useCallback(() => {
    if (!predictorContent.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70;
      const suggestions = [
        score < 80 ? 'Add a clear call-to-action at the end' : 'Great call-to-action!',
        score < 85 ? 'Include more specific numbers or data points' : 'Good use of data!',
        score < 90 ? 'Consider adding an engaging hook in the first line' : 'Strong opening hook!',
        'Optimal length for engagement',
        predictorPlatform === 'linkedin' ? 'Add relevant hashtags (3-5 recommended)' : 'Consider adding relevant hashtags',
      ];

      setPrediction({
        score,
        engagement: {
          likes: Math.floor(score * 1.5 + Math.random() * 50),
          comments: Math.floor(score * 0.3 + Math.random() * 20),
          shares: Math.floor(score * 0.15 + Math.random() * 10),
        },
        suggestions: suggestions.slice(0, 4),
        sentiment: score > 85 ? 'Positive' : score > 70 ? 'Neutral' : 'Needs Improvement',
        readability: score > 80 ? 'Easy to read' : 'Consider simplifying',
        viralPotential: score > 85 ? 'High' : score > 75 ? 'Medium' : 'Low'
      });
      setIsAnalyzing(false);
    }, 1500);
  }, [predictorContent, predictorPlatform]);

  const bestTimes = {
    linkedin: [
      { day: 'Tuesday', times: ['7:00 AM', '12:00 PM', '5:00 PM'], score: 95 },
      { day: 'Wednesday', times: ['8:00 AM', '12:00 PM', '6:00 PM'], score: 92 },
      { day: 'Thursday', times: ['7:00 AM', '11:00 AM', '5:00 PM'], score: 90 },
      { day: 'Monday', times: ['8:00 AM', '1:00 PM'], score: 85 },
      { day: 'Friday', times: ['9:00 AM', '12:00 PM'], score: 78 },
    ],
    x: [
      { day: 'Wednesday', times: ['12:00 PM', '3:00 PM', '6:00 PM'], score: 94 },
      { day: 'Thursday', times: ['9:00 AM', '12:00 PM', '7:00 PM'], score: 91 },
      { day: 'Tuesday', times: ['10:00 AM', '1:00 PM', '5:00 PM'], score: 88 },
      { day: 'Friday', times: ['11:00 AM', '2:00 PM'], score: 82 },
      { day: 'Monday', times: ['9:00 AM', '5:00 PM'], score: 75 },
    ],
    email: [
      { day: 'Tuesday', times: ['10:00 AM', '2:00 PM'], score: 96 },
      { day: 'Thursday', times: ['9:00 AM', '1:00 PM'], score: 93 },
      { day: 'Wednesday', times: ['10:00 AM', '3:00 PM'], score: 89 },
      { day: 'Monday', times: ['11:00 AM'], score: 80 },
      { day: 'Friday', times: ['9:00 AM'], score: 72 },
    ]
  };

  const handleCopySignature = useCallback(() => {
    const signature = `
${signatureName}
${signatureTitle} at ${signatureCompany}
${signatureLinkedIn ? `LinkedIn: ${signatureLinkedIn}` : ''}

Powered by CueDeck - Supercharge your lead generation
https://cuedeck.com
    `.trim();

    navigator.clipboard.writeText(signature);
    setSignatureCopied(true);
    setTimeout(() => setSignatureCopied(false), 2000);
  }, [signatureName, signatureTitle, signatureCompany, signatureLinkedIn]);

  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="growth-tools-page">
      <div className="tools-header">
        <div className="header-content">
          <h2>
            <Zap size={24} />
            Growth Tools
          </h2>
          <p>AI-powered tools to accelerate your growth</p>
        </div>
      </div>

      <div className="tools-tabs">
        <button
          className={activeTab === 'predictor' ? 'active' : ''}
          onClick={() => setActiveTab('predictor')}
        >
          <Sparkles size={18} />
          Content Predictor
        </button>
        <button
          className={activeTab === 'timing' ? 'active' : ''}
          onClick={() => setActiveTab('timing')}
        >
          <Clock size={18} />
          Best Time to Post
        </button>
        <button
          className={activeTab === 'signature' ? 'active' : ''}
          onClick={() => setActiveTab('signature')}
        >
          <Mail size={18} />
          Email Signature
        </button>
        <button
          className={activeTab === 'extension' ? 'active' : ''}
          onClick={() => setActiveTab('extension')}
        >
          <Chrome size={18} />
          Chrome Extension
        </button>
      </div>

      {activeTab === 'predictor' && (
        <div className="predictor-section">
          <div className="predictor-layout">
            <div className="predictor-input">
              <h3>Content Performance Predictor</h3>
              <p>Analyze your content before posting to maximize engagement</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Platform</label>
                  <div className="platform-buttons">
                    {platforms.map(p => (
                      <button
                        key={p.id}
                        className={predictorPlatform === p.id ? 'active' : ''}
                        onClick={() => setPredictorPlatform(p.id)}
                      >
                        <p.icon size={16} />
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Content Type</label>
                  <select
                    value={predictorType}
                    onChange={(e) => setPredictorType(e.target.value)}
                  >
                    {contentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Your Content</label>
                <textarea
                  value={predictorContent}
                  onChange={(e) => setPredictorContent(e.target.value)}
                  placeholder="Paste or type your content here to analyze its potential performance..."
                  rows={8}
                />
                <span className="char-count">{predictorContent.length} characters</span>
              </div>

              <button
                className="analyze-btn"
                onClick={handleAnalyzeContent}
                disabled={!predictorContent.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={18} className="spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Content
                  </>
                )}
              </button>
            </div>

            <div className="predictor-results">
              {prediction ? (
                <>
                  <div className="score-card">
                    <div className="score-circle" style={{ borderColor: getScoreColor(prediction.score) }}>
                      <span className="score-value" style={{ color: getScoreColor(prediction.score) }}>
                        {prediction.score}
                      </span>
                      <span className="score-label">Score</span>
                    </div>
                    <div className="score-details">
                      <div className="detail-item">
                        <span className="detail-label">Viral Potential</span>
                        <span className={`detail-value ${prediction.viralPotential.toLowerCase()}`}>
                          {prediction.viralPotential}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Sentiment</span>
                        <span className="detail-value">{prediction.sentiment}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Readability</span>
                        <span className="detail-value">{prediction.readability}</span>
                      </div>
                    </div>
                  </div>

                  <div className="engagement-prediction">
                    <h4>Predicted Engagement</h4>
                    <div className="engagement-stats">
                      <div className="engagement-item">
                        <Target size={20} />
                        <span className="eng-value">{prediction.engagement.likes}</span>
                        <span className="eng-label">Likes</span>
                      </div>
                      <div className="engagement-item">
                        <Users size={20} />
                        <span className="eng-value">{prediction.engagement.comments}</span>
                        <span className="eng-label">Comments</span>
                      </div>
                      <div className="engagement-item">
                        <Share2 size={20} />
                        <span className="eng-value">{prediction.engagement.shares}</span>
                        <span className="eng-label">Shares</span>
                      </div>
                    </div>
                  </div>

                  <div className="suggestions-card">
                    <h4>Improvement Suggestions</h4>
                    <ul>
                      {prediction.suggestions.map((suggestion, idx) => (
                        <li key={idx}>
                          <Star size={14} />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="empty-results">
                  <BarChart3 size={48} />
                  <h4>Ready to Analyze</h4>
                  <p>Enter your content and click "Analyze" to see predicted performance</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timing' && (
        <div className="timing-section">
          <div className="timing-header">
            <h3>Best Time to Post</h3>
            <p>Optimize your posting schedule based on your audience's activity</p>
          </div>

          <div className="timing-controls">
            <div className="form-group">
              <label>Platform</label>
              <div className="platform-buttons">
                {platforms.map(p => (
                  <button
                    key={p.id}
                    className={selectedTimePlatform === p.id ? 'active' : ''}
                    onClick={() => setSelectedTimePlatform(p.id)}
                  >
                    <p.icon size={16} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Audience Timezone</label>
              <select
                value={audienceTimezone}
                onChange={(e) => setAudienceTimezone(e.target.value)}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Central European (CET)</option>
                <option value="Asia/Tokyo">Japan (JST)</option>
              </select>
            </div>
          </div>

          <div className="timing-grid">
            {bestTimes[selectedTimePlatform].map((day, idx) => (
              <div key={day.day} className={`timing-card ${idx === 0 ? 'best' : ''}`}>
                {idx === 0 && <span className="best-badge">Best Day</span>}
                <div className="timing-header-row">
                  <Calendar size={18} />
                  <span className="day-name">{day.day}</span>
                  <span className="day-score" style={{ color: getScoreColor(day.score) }}>
                    {day.score}%
                  </span>
                </div>
                <div className="time-slots">
                  {day.times.map(time => (
                    <span key={time} className="time-slot">
                      <Clock size={12} />
                      {time}
                    </span>
                  ))}
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${day.score}%`,
                      backgroundColor: getScoreColor(day.score)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="timing-insight">
            <TrendingUp size={20} />
            <div>
              <strong>Pro Tip:</strong> Based on your audience, posting on{' '}
              <strong>{bestTimes[selectedTimePlatform][0].day}</strong> at{' '}
              <strong>{bestTimes[selectedTimePlatform][0].times[0]}</strong>{' '}
              ({audienceTimezone.split('/')[1].replace('_', ' ')}) will maximize your reach.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'signature' && (
        <div className="signature-section">
          <div className="signature-layout">
            <div className="signature-form">
              <h3>Email Signature Generator</h3>
              <p>Create a professional signature with CueDeck branding</p>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={signatureTitle}
                  onChange={(e) => setSignatureTitle(e.target.value)}
                  placeholder="Growth Manager"
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={signatureCompany}
                  onChange={(e) => setSignatureCompany(e.target.value)}
                  placeholder="Acme Inc"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn URL (optional)</label>
                <input
                  type="text"
                  value={signatureLinkedIn}
                  onChange={(e) => setSignatureLinkedIn(e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>

              <button
                className="copy-btn"
                onClick={handleCopySignature}
                disabled={!signatureName || !signatureTitle || !signatureCompany}
              >
                {signatureCopied ? (
                  <>
                    <CheckCircle size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Signature
                  </>
                )}
              </button>
            </div>

            <div className="signature-preview">
              <h4>Preview</h4>
              <div className="signature-card">
                <div className="sig-name">{signatureName || 'Your Name'}</div>
                <div className="sig-title">
                  {signatureTitle || 'Job Title'} at {signatureCompany || 'Company'}
                </div>
                {signatureLinkedIn && (
                  <div className="sig-link">
                    <Linkedin size={14} />
                    {signatureLinkedIn}
                  </div>
                )}
                <div className="sig-cuedeck">
                  <span className="powered-by">Powered by</span>
                  <span className="cuedeck-logo">CueDeck</span>
                  <span className="cuedeck-tagline">Supercharge your lead generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'extension' && (
        <div className="extension-section">
          <div className="extension-hero">
            <div className="extension-icon">
              <Chrome size={64} />
            </div>
            <h3>CueDeck Chrome Extension</h3>
            <p>Capture leads and generate content directly from LinkedIn and X</p>

            <div className="extension-features">
              <div className="feature-item">
                <Users size={20} />
                <span>One-click lead capture from LinkedIn profiles</span>
              </div>
              <div className="feature-item">
                <Sparkles size={20} />
                <span>AI content suggestions while browsing</span>
              </div>
              <div className="feature-item">
                <Target size={20} />
                <span>Real-time lead scoring overlay</span>
              </div>
              <div className="feature-item">
                <Globe size={20} />
                <span>Works on LinkedIn, X, and company websites</span>
              </div>
            </div>

            <div className="extension-cta">
              <button className="install-btn">
                <Chrome size={20} />
                Add to Chrome - It's Free
              </button>
              <span className="install-note">100K+ users • 4.8 rating</span>
            </div>
          </div>

          <div className="extension-preview">
            <div className="preview-card">
              <div className="preview-header">
                <span className="preview-dot red" />
                <span className="preview-dot yellow" />
                <span className="preview-dot green" />
                <span className="preview-url">linkedin.com/in/johndoe</span>
              </div>
              <div className="preview-body">
                <div className="mock-profile">
                  <div className="mock-avatar" />
                  <div className="mock-info">
                    <div className="mock-name" />
                    <div className="mock-title" />
                  </div>
                </div>
                <div className="cuedeck-overlay">
                  <div className="overlay-header">
                    <Zap size={16} />
                    CueDeck
                  </div>
                  <div className="overlay-score">
                    <span className="score">87</span>
                    <span className="label">Lead Score</span>
                  </div>
                  <button className="overlay-btn">
                    Add to Pipeline
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GrowthTools;
