import React, { useState } from 'react';
import {
  Bot,
  Linkedin,
  Mail,
  Database,
  Table2,
  Webhook,
  CheckCircle,
  XCircle,
  Loader,
  Save,
  Plus,
  X
} from 'lucide-react';
import useStore from '../store/useStore';
import './Settings.css';

const integrations = [
  {
    key: 'claude',
    name: 'Claude API',
    description: 'AI content generation',
    icon: Bot,
    color: '#4A8EFF',
    fields: [{ key: 'claude', label: 'API Key', type: 'password' }],
  },
  {
    key: 'phantombuster',
    name: 'PhantomBuster',
    description: 'LinkedIn automation',
    icon: Linkedin,
    color: '#0077b5',
    fields: [
      { key: 'phantombuster', label: 'API Key', type: 'password' },
      { key: 'phantombusterAgentId', label: 'Agent ID', type: 'text' },
    ],
  },
  {
    key: 'instantly',
    name: 'Instantly.ai',
    description: 'Email sequences',
    icon: Mail,
    color: '#8b5cf6',
    fields: [{ key: 'instantly', label: 'API Key', type: 'password' }],
  },
  {
    key: 'apollo',
    name: 'Apollo.io',
    description: 'Lead enrichment',
    icon: Database,
    color: '#f59e0b',
    fields: [{ key: 'apollo', label: 'API Key', type: 'password' }],
  },
  {
    key: 'airtable',
    name: 'Airtable',
    description: 'CRM/Lead database',
    icon: Table2,
    color: '#22c55e',
    fields: [
      { key: 'airtableKey', label: 'API Key', type: 'password' },
      { key: 'airtableBaseId', label: 'Base ID', type: 'text' },
    ],
  },
  {
    key: 'n8n',
    name: 'n8n Webhook',
    description: 'Orchestrator trigger',
    icon: Webhook,
    color: '#ef4444',
    fields: [{ key: 'n8nWebhook', label: 'Webhook URL', type: 'text' }],
  },
];

const industries = [
  'Conferences & Events',
  'Corporate Events',
  'Government Events',
  'Associations & NGOs',
  'Exhibition & Trade Shows',
];

const companySizes = ['10-50', '50-200', '200-500', '500+'];
const regions = ['Poland', 'Germany', 'UAE', 'UK', 'Netherlands', 'Egypt'];
const eventRanges = ['1-5', '5-20', '20-50', '50+'];

function Settings() {
  const {
    settings,
    updateApiKey,
    updateIntegrationStatus,
    updateIcpProfile,
    updateBrandVoice,
    updateNotifications,
  } = useStore();

  const [activeTab, setActiveTab] = useState('integrations');
  const [testingIntegration, setTestingIntegration] = useState(null);

  // Local state for form values
  const [icpForm, setIcpForm] = useState(settings.icpProfile);
  const [brandForm, setBrandForm] = useState(settings.brandVoice);
  const [notifForm, setNotifForm] = useState(settings.notifications);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newToneWord, setNewToneWord] = useState('');
  const [newAvoidWord, setNewAvoidWord] = useState('');

  const testConnection = async (integrationKey) => {
    setTestingIntegration(integrationKey);
    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const hasKey = settings.apiKeys[integrationKey] && settings.apiKeys[integrationKey].length > 0;
    updateIntegrationStatus(integrationKey, hasKey ? 'connected' : 'disconnected');
    setTestingIntegration(null);
  };

  const handleAddJobTitle = () => {
    if (newJobTitle.trim()) {
      setIcpForm({
        ...icpForm,
        jobTitles: [...icpForm.jobTitles, newJobTitle.trim()],
      });
      setNewJobTitle('');
    }
  };

  const handleRemoveJobTitle = (title) => {
    setIcpForm({
      ...icpForm,
      jobTitles: icpForm.jobTitles.filter((t) => t !== title),
    });
  };

  const handleSaveIcp = () => {
    updateIcpProfile(icpForm);
  };

  const handleAddToneWord = () => {
    if (newToneWord.trim()) {
      setBrandForm({
        ...brandForm,
        toneAdjectives: [...brandForm.toneAdjectives, newToneWord.trim()],
      });
      setNewToneWord('');
    }
  };

  const handleRemoveToneWord = (word) => {
    setBrandForm({
      ...brandForm,
      toneAdjectives: brandForm.toneAdjectives.filter((w) => w !== word),
    });
  };

  const handleAddAvoidWord = () => {
    if (newAvoidWord.trim()) {
      setBrandForm({
        ...brandForm,
        wordsToAvoid: [...brandForm.wordsToAvoid, newAvoidWord.trim()],
      });
      setNewAvoidWord('');
    }
  };

  const handleRemoveAvoidWord = (word) => {
    setBrandForm({
      ...brandForm,
      wordsToAvoid: brandForm.wordsToAvoid.filter((w) => w !== word),
    });
  };

  const handleSaveBrand = () => {
    updateBrandVoice(brandForm);
  };

  const handleSaveNotifications = () => {
    updateNotifications(notifForm);
  };

  return (
    <div className="settings">
      <div className="tabs">
        <button
          className={activeTab === 'integrations' ? 'active' : ''}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
        <button
          className={activeTab === 'icp' ? 'active' : ''}
          onClick={() => setActiveTab('icp')}
        >
          ICP Profile
        </button>
        <button
          className={activeTab === 'brand' ? 'active' : ''}
          onClick={() => setActiveTab('brand')}
        >
          Brand Voice
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'integrations' && (
        <div className="integrations-list">
          {integrations.map((integration) => (
            <div key={integration.key} className="integration-card">
              <div className="integration-header">
                <div
                  className="integration-icon"
                  style={{ backgroundColor: `${integration.color}15`, color: integration.color }}
                >
                  <integration.icon size={24} />
                </div>
                <div className="integration-info">
                  <h3>{integration.name}</h3>
                  <p>{integration.description}</p>
                </div>
                <div className="integration-status">
                  {settings.integrationStatus[integration.key] === 'connected' ? (
                    <span className="status connected">
                      <CheckCircle size={16} />
                      Connected
                    </span>
                  ) : (
                    <span className="status disconnected">
                      <XCircle size={16} />
                      Not Connected
                    </span>
                  )}
                </div>
              </div>

              <div className="integration-fields">
                {integration.fields.map((field) => (
                  <div key={field.key} className="field-group">
                    <label>{field.label}</label>
                    <input
                      type={field.type}
                      value={settings.apiKeys[field.key] || ''}
                      onChange={(e) => updateApiKey(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              <div className="integration-actions">
                <button
                  className="test-btn"
                  onClick={() => testConnection(integration.key)}
                  disabled={testingIntegration === integration.key}
                >
                  {testingIntegration === integration.key ? (
                    <>
                      <Loader size={14} className="spinner" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </button>
                <button className="connect-btn">
                  {settings.integrationStatus[integration.key] === 'connected'
                    ? 'Disconnect'
                    : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'icp' && (
        <div className="icp-form">
          <div className="form-section">
            <label>Target Job Titles</label>
            <div className="tag-input-container">
              <div className="tags">
                {icpForm.jobTitles.map((title) => (
                  <span key={title} className="tag">
                    {title}
                    <button onClick={() => handleRemoveJobTitle(title)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input">
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddJobTitle()}
                  placeholder="Add job title..."
                />
                <button onClick={handleAddJobTitle}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label>Target Industries</label>
            <div className="checkbox-grid">
              {industries.map((industry) => (
                <label key={industry} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={icpForm.industries?.includes(industry) || false}
                    onChange={() => {
                      const current = icpForm.industries || [];
                      setIcpForm({
                        ...icpForm,
                        industries: current.includes(industry)
                          ? current.filter((i) => i !== industry)
                          : [...current, industry],
                      });
                    }}
                  />
                  <span>{industry}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Company Size</label>
            <div className="checkbox-grid horizontal">
              {companySizes.map((size) => (
                <label key={size} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={icpForm.companySize?.includes(size) || false}
                    onChange={() => {
                      const current = icpForm.companySize || [];
                      setIcpForm({
                        ...icpForm,
                        companySize: current.includes(size)
                          ? current.filter((s) => s !== size)
                          : [...current, size],
                      });
                    }}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Target Regions</label>
            <div className="checkbox-grid">
              {regions.map((region) => (
                <label key={region} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={icpForm.regions?.includes(region) || false}
                    onChange={() => {
                      const current = icpForm.regions || [];
                      setIcpForm({
                        ...icpForm,
                        regions: current.includes(region)
                          ? current.filter((r) => r !== region)
                          : [...current, region],
                      });
                    }}
                  />
                  <span>{region}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Annual Events Run</label>
            <select
              value={icpForm.annualEvents || ''}
              onChange={(e) => setIcpForm({ ...icpForm, annualEvents: e.target.value })}
            >
              <option value="">Select range...</option>
              {eventRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <button className="save-btn" onClick={handleSaveIcp}>
            <Save size={16} />
            Save ICP Profile
          </button>
        </div>
      )}

      {activeTab === 'brand' && (
        <div className="brand-form">
          <div className="form-section">
            <label>Company Name</label>
            <input
              type="text"
              value={brandForm.companyName}
              onChange={(e) => setBrandForm({ ...brandForm, companyName: e.target.value })}
            />
          </div>

          <div className="form-section">
            <label>Tagline</label>
            <input
              type="text"
              value={brandForm.tagline}
              onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
            />
          </div>

          <div className="form-section">
            <label>Core Value Props</label>
            <textarea
              value={brandForm.valueProps}
              onChange={(e) => setBrandForm({ ...brandForm, valueProps: e.target.value })}
              rows={4}
            />
          </div>

          <div className="form-section">
            <label>Tone Adjectives</label>
            <div className="tag-input-container">
              <div className="tags">
                {brandForm.toneAdjectives?.map((word) => (
                  <span key={word} className="tag">
                    {word}
                    <button onClick={() => handleRemoveToneWord(word)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input">
                <input
                  type="text"
                  value={newToneWord}
                  onChange={(e) => setNewToneWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddToneWord()}
                  placeholder="Add tone adjective..."
                />
                <button onClick={handleAddToneWord}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label>Words to Avoid</label>
            <div className="tag-input-container">
              <div className="tags">
                {brandForm.wordsToAvoid?.map((word) => (
                  <span key={word} className="tag danger">
                    {word}
                    <button onClick={() => handleRemoveAvoidWord(word)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input">
                <input
                  type="text"
                  value={newAvoidWord}
                  onChange={(e) => setNewAvoidWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAvoidWord()}
                  placeholder="Add word to avoid..."
                />
                <button onClick={handleAddAvoidWord}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label>Sample Approved Post (for AI reference)</label>
            <textarea
              value={brandForm.samplePost || ''}
              onChange={(e) => setBrandForm({ ...brandForm, samplePost: e.target.value })}
              rows={4}
              placeholder="Paste a sample post that represents your brand voice..."
            />
          </div>

          <button className="save-btn" onClick={handleSaveBrand}>
            <Save size={16} />
            Save Brand Voice
          </button>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="notifications-form">
          <div className="toggle-section">
            <div className="toggle-item">
              <div className="toggle-info">
                <h4>Hot Lead Flagged</h4>
                <p>Get notified when a lead is flagged as hot</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.hotLeadFlagged}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, hotLeadFlagged: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h4>Reply Received</h4>
                <p>Notify when a reply is received in any sequence</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.replyReceived}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, replyReceived: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h4>Agent Error</h4>
                <p>Alert me when any agent encounters an error</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.agentError}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, agentError: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h4>LinkedIn Connection Accepted</h4>
                <p>Notify when a LinkedIn connection is accepted</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.linkedinAccepted}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, linkedinAccepted: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item with-input">
              <div className="toggle-info">
                <h4>Daily Summary Email</h4>
                <p>Receive a daily summary of all agent activities</p>
              </div>
              <div className="toggle-with-input">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifForm.dailySummary}
                    onChange={(e) =>
                      setNotifForm({ ...notifForm, dailySummary: e.target.checked })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
                {notifForm.dailySummary && (
                  <input
                    type="email"
                    value={notifForm.dailySummaryEmail || ''}
                    onChange={(e) =>
                      setNotifForm({ ...notifForm, dailySummaryEmail: e.target.value })
                    }
                    placeholder="Enter email address"
                    className="email-input"
                  />
                )}
              </div>
            </div>
          </div>

          <button className="save-btn" onClick={handleSaveNotifications}>
            <Save size={16} />
            Save Notification Settings
          </button>
        </div>
      )}
    </div>
  );
}

export default Settings;
