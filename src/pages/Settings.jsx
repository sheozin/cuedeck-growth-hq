import React, { useState, useCallback } from 'react';
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
  X,
  AlertTriangle
} from 'lucide-react';
import useStore from '../store/useStore';
import './Settings.css';

const integrations = [
  {
    key: 'claude',
    name: 'Claude API',
    description: 'AI content generation (server-side)',
    icon: Bot,
    color: '#4A8EFF',
    fields: [{ key: 'claude', label: 'API Key', type: 'password' }],
    serverSide: true,
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
  const settings = useStore((state) => state.settings);
  const apiKeys = useStore((state) => state.apiKeys);
  const updateApiKey = useStore((state) => state.updateApiKey);
  const updateIntegrationStatus = useStore((state) => state.updateIntegrationStatus);
  const updateIcpProfile = useStore((state) => state.updateIcpProfile);
  const updateBrandVoice = useStore((state) => state.updateBrandVoice);
  const updateNotifications = useStore((state) => state.updateNotifications);

  const [activeTab, setActiveTab] = useState('integrations');
  const [testingIntegration, setTestingIntegration] = useState(null);

  // Local state for form values
  const [icpForm, setIcpForm] = useState(settings.icpProfile);
  const [brandForm, setBrandForm] = useState(settings.brandVoice);
  const [notifForm, setNotifForm] = useState(settings.notifications);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newToneWord, setNewToneWord] = useState('');
  const [newAvoidWord, setNewAvoidWord] = useState('');

  const testConnection = useCallback(async (integrationKey) => {
    setTestingIntegration(integrationKey);
    try {
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const hasKey = apiKeys[integrationKey] && apiKeys[integrationKey].length > 0;
      updateIntegrationStatus(integrationKey, hasKey ? 'connected' : 'disconnected');
    } catch (error) {
      updateIntegrationStatus(integrationKey, 'disconnected');
    } finally {
      setTestingIntegration(null);
    }
  }, [apiKeys, updateIntegrationStatus]);

  const handleToggleConnection = useCallback((integrationKey) => {
    const currentStatus = settings.integrationStatus[integrationKey];
    if (currentStatus === 'connected') {
      // Disconnect: clear API key and update status
      updateApiKey(integrationKey, '');
      updateIntegrationStatus(integrationKey, 'disconnected');
    } else {
      // Connect: prompt for API key
      const key = prompt(`Enter API key for ${integrationKey}:`);
      if (key) {
        updateApiKey(integrationKey, key);
        updateIntegrationStatus(integrationKey, 'connected');
      }
    }
  }, [settings.integrationStatus, updateApiKey, updateIntegrationStatus]);

  const handleAddJobTitle = useCallback(() => {
    if (newJobTitle.trim()) {
      setIcpForm((prev) => ({
        ...prev,
        jobTitles: [...prev.jobTitles, newJobTitle.trim()],
      }));
      setNewJobTitle('');
    }
  }, [newJobTitle]);

  const handleRemoveJobTitle = useCallback((title) => {
    setIcpForm((prev) => ({
      ...prev,
      jobTitles: prev.jobTitles.filter((t) => t !== title),
    }));
  }, []);

  const handleSaveIcp = useCallback(() => {
    updateIcpProfile(icpForm);
  }, [icpForm, updateIcpProfile]);

  const handleAddToneWord = useCallback(() => {
    if (newToneWord.trim()) {
      setBrandForm((prev) => ({
        ...prev,
        toneAdjectives: [...prev.toneAdjectives, newToneWord.trim()],
      }));
      setNewToneWord('');
    }
  }, [newToneWord]);

  const handleRemoveToneWord = useCallback((word) => {
    setBrandForm((prev) => ({
      ...prev,
      toneAdjectives: prev.toneAdjectives.filter((w) => w !== word),
    }));
  }, []);

  const handleAddAvoidWord = useCallback(() => {
    if (newAvoidWord.trim()) {
      setBrandForm((prev) => ({
        ...prev,
        wordsToAvoid: [...prev.wordsToAvoid, newAvoidWord.trim()],
      }));
      setNewAvoidWord('');
    }
  }, [newAvoidWord]);

  const handleRemoveAvoidWord = useCallback((word) => {
    setBrandForm((prev) => ({
      ...prev,
      wordsToAvoid: prev.wordsToAvoid.filter((w) => w !== word),
    }));
  }, []);

  const handleSaveBrand = useCallback(() => {
    updateBrandVoice(brandForm);
  }, [brandForm, updateBrandVoice]);

  const handleSaveNotifications = useCallback(() => {
    updateNotifications(notifForm);
  }, [notifForm, updateNotifications]);

  return (
    <div className="settings">
      <div className="tabs" role="tablist" aria-label="Settings sections">
        <button
          role="tab"
          aria-selected={activeTab === 'integrations'}
          className={activeTab === 'integrations' ? 'active' : ''}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'icp'}
          className={activeTab === 'icp' ? 'active' : ''}
          onClick={() => setActiveTab('icp')}
        >
          ICP Profile
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'brand'}
          className={activeTab === 'brand' ? 'active' : ''}
          onClick={() => setActiveTab('brand')}
        >
          Brand Voice
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'notifications'}
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'integrations' && (
        <div role="tabpanel" aria-label="Integrations settings">
          <div className="security-notice" role="alert">
            <AlertTriangle size={16} aria-hidden="true" />
            <span>API keys are stored in memory only and never saved to your browser. For production, configure keys in your server environment.</span>
          </div>
          <div className="integrations-list">
            {integrations.map((integration) => (
              <div key={integration.key} className="integration-card">
                <div className="integration-header">
                  <div
                    className="integration-icon"
                    style={{ backgroundColor: `${integration.color}15`, color: integration.color }}
                    aria-hidden="true"
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
                        <CheckCircle size={16} aria-hidden="true" />
                        Connected
                      </span>
                    ) : (
                      <span className="status disconnected">
                        <XCircle size={16} aria-hidden="true" />
                        Not Connected
                      </span>
                    )}
                  </div>
                </div>

                <div className="integration-fields">
                  {integration.fields.map((field) => (
                    <div key={field.key} className="field-group">
                      <label htmlFor={`field-${field.key}`}>{field.label}</label>
                      <input
                        id={`field-${field.key}`}
                        type={field.type}
                        value={apiKeys[field.key] || ''}
                        onChange={(e) => updateApiKey(field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        autoComplete="off"
                      />
                    </div>
                  ))}
                </div>

                <div className="integration-actions">
                  <button
                    className="test-btn"
                    onClick={() => testConnection(integration.key)}
                    disabled={testingIntegration === integration.key}
                    aria-busy={testingIntegration === integration.key}
                  >
                    {testingIntegration === integration.key ? (
                      <>
                        <Loader size={14} className="spinner" aria-hidden="true" />
                        Testing...
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </button>
                  <button
                    className={`connect-btn ${settings.integrationStatus[integration.key] === 'connected' ? 'connected' : ''}`}
                    onClick={() => handleToggleConnection(integration.key)}
                  >
                    {settings.integrationStatus[integration.key] === 'connected'
                      ? 'Disconnect'
                      : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'icp' && (
        <div role="tabpanel" aria-label="ICP Profile settings" className="icp-form">
          <div className="form-section">
            <label id="job-titles-label">Target Job Titles</label>
            <div className="tag-input-container" aria-labelledby="job-titles-label">
              <div className="tags" role="list">
                {icpForm.jobTitles.map((title) => (
                  <span key={title} className="tag" role="listitem">
                    {title}
                    <button onClick={() => handleRemoveJobTitle(title)} aria-label={`Remove ${title}`}>
                      <X size={12} aria-hidden="true" />
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
                  aria-label="Add job title"
                />
                <button onClick={handleAddJobTitle} aria-label="Add job title">
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label id="industries-label">Target Industries</label>
            <div className="checkbox-grid" role="group" aria-labelledby="industries-label">
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
            <label id="company-size-label">Company Size</label>
            <div className="checkbox-grid horizontal" role="group" aria-labelledby="company-size-label">
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
            <label id="regions-label">Target Regions</label>
            <div className="checkbox-grid" role="group" aria-labelledby="regions-label">
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
            <label htmlFor="annual-events">Annual Events Run</label>
            <select
              id="annual-events"
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
            <Save size={16} aria-hidden="true" />
            Save ICP Profile
          </button>
        </div>
      )}

      {activeTab === 'brand' && (
        <div role="tabpanel" aria-label="Brand Voice settings" className="brand-form">
          <div className="form-section">
            <label htmlFor="company-name">Company Name</label>
            <input
              id="company-name"
              type="text"
              value={brandForm.companyName}
              onChange={(e) => setBrandForm({ ...brandForm, companyName: e.target.value })}
            />
          </div>

          <div className="form-section">
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              type="text"
              value={brandForm.tagline}
              onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
            />
          </div>

          <div className="form-section">
            <label htmlFor="value-props">Core Value Props</label>
            <textarea
              id="value-props"
              value={brandForm.valueProps}
              onChange={(e) => setBrandForm({ ...brandForm, valueProps: e.target.value })}
              rows={4}
            />
          </div>

          <div className="form-section">
            <label id="tone-label">Tone Adjectives</label>
            <div className="tag-input-container" aria-labelledby="tone-label">
              <div className="tags" role="list">
                {brandForm.toneAdjectives?.map((word) => (
                  <span key={word} className="tag" role="listitem">
                    {word}
                    <button onClick={() => handleRemoveToneWord(word)} aria-label={`Remove ${word}`}>
                      <X size={12} aria-hidden="true" />
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
                  aria-label="Add tone adjective"
                />
                <button onClick={handleAddToneWord} aria-label="Add tone adjective">
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label id="avoid-label">Words to Avoid</label>
            <div className="tag-input-container" aria-labelledby="avoid-label">
              <div className="tags" role="list">
                {brandForm.wordsToAvoid?.map((word) => (
                  <span key={word} className="tag danger" role="listitem">
                    {word}
                    <button onClick={() => handleRemoveAvoidWord(word)} aria-label={`Remove ${word}`}>
                      <X size={12} aria-hidden="true" />
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
                  aria-label="Add word to avoid"
                />
                <button onClick={handleAddAvoidWord} aria-label="Add word to avoid">
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label htmlFor="sample-post">Sample Approved Post (for AI reference)</label>
            <textarea
              id="sample-post"
              value={brandForm.samplePost || ''}
              onChange={(e) => setBrandForm({ ...brandForm, samplePost: e.target.value })}
              rows={4}
              placeholder="Paste a sample post that represents your brand voice..."
            />
          </div>

          <button className="save-btn" onClick={handleSaveBrand}>
            <Save size={16} aria-hidden="true" />
            Save Brand Voice
          </button>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div role="tabpanel" aria-label="Notification settings" className="notifications-form">
          <div className="toggle-section">
            <div className="toggle-item">
              <div className="toggle-info">
                <h4 id="hot-lead-label">Hot Lead Flagged</h4>
                <p>Get notified when a lead is flagged as hot</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.hotLeadFlagged}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, hotLeadFlagged: e.target.checked })
                  }
                  aria-labelledby="hot-lead-label"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h4 id="reply-label">Reply Received</h4>
                <p>Notify when a reply is received in any sequence</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.replyReceived}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, replyReceived: e.target.checked })
                  }
                  aria-labelledby="reply-label"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h4 id="agent-error-label">Agent Error</h4>
                <p>Alert me when any agent encounters an error</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.agentError}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, agentError: e.target.checked })
                  }
                  aria-labelledby="agent-error-label"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h4 id="linkedin-label">LinkedIn Connection Accepted</h4>
                <p>Notify when a LinkedIn connection is accepted</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifForm.linkedinAccepted}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, linkedinAccepted: e.target.checked })
                  }
                  aria-labelledby="linkedin-label"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item with-input">
              <div className="toggle-info">
                <h4 id="daily-summary-label">Daily Summary Email</h4>
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
                    aria-labelledby="daily-summary-label"
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
                    aria-label="Daily summary email address"
                  />
                )}
              </div>
            </div>
          </div>

          <button className="save-btn" onClick={handleSaveNotifications}>
            <Save size={16} aria-hidden="true" />
            Save Notification Settings
          </button>
        </div>
      )}
    </div>
  );
}

export default Settings;
