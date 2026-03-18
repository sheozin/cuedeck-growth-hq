import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Check,
  ExternalLink,
  Zap,
  Settings,
  Star,
  Users,
  ArrowRight,
  Webhook,
  Key,
  Copy,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import './Integrations.css';

const integrationCategories = [
  { id: 'all', label: 'All' },
  { id: 'crm', label: 'CRM' },
  { id: 'automation', label: 'Automation' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'communication', label: 'Communication' },
  { id: 'social', label: 'Social' },
];

const integrations = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'Sync leads, contacts, and deals with HubSpot CRM',
    logo: '🟠',
    status: 'available',
    users: '2.1K',
    rating: 4.8,
    features: ['Two-way sync', 'Deal pipeline', 'Contact enrichment'],
    popular: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    description: 'Connect with Salesforce for enterprise-grade CRM sync',
    logo: '☁️',
    status: 'available',
    users: '1.8K',
    rating: 4.7,
    features: ['Lead sync', 'Opportunity tracking', 'Custom objects'],
    popular: true
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'crm',
    description: 'Push leads directly to your Pipedrive pipeline',
    logo: '🟢',
    status: 'connected',
    users: '1.2K',
    rating: 4.6,
    features: ['Deal automation', 'Activity sync', 'Smart contact data']
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'automation',
    description: 'Connect CueDeck to 5000+ apps with automated workflows',
    logo: '⚡',
    status: 'available',
    users: '3.4K',
    rating: 4.9,
    features: ['5000+ apps', 'Multi-step zaps', 'Filters & paths'],
    popular: true
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    category: 'automation',
    description: 'Build complex automation scenarios with visual workflows',
    logo: '🔮',
    status: 'available',
    users: '980',
    rating: 4.7,
    features: ['Visual builder', 'Advanced logic', 'Data transformation']
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: 'automation',
    description: 'Self-hosted workflow automation with full control',
    logo: '🔗',
    status: 'available',
    users: '450',
    rating: 4.5,
    features: ['Self-hosted', 'Open source', 'Custom nodes']
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    category: 'analytics',
    description: 'Track conversions and UTM attribution from CueDeck',
    logo: '📊',
    status: 'available',
    users: '2.8K',
    rating: 4.6,
    features: ['Conversion tracking', 'UTM attribution', 'Goal sync']
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    category: 'analytics',
    description: 'Advanced product analytics and user behavior tracking',
    logo: '📈',
    status: 'available',
    users: '670',
    rating: 4.5,
    features: ['Event tracking', 'Funnel analysis', 'Retention reports']
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Get real-time notifications about leads and campaigns',
    logo: '💬',
    status: 'connected',
    users: '4.2K',
    rating: 4.8,
    features: ['Real-time alerts', 'Lead notifications', 'Daily digests'],
    popular: true
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'communication',
    description: 'Team notifications and alerts in your Discord server',
    logo: '🎮',
    status: 'available',
    users: '890',
    rating: 4.4,
    features: ['Webhook alerts', 'Bot commands', 'Channel sync']
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'communication',
    description: 'Sync leads to Mailchimp for email marketing campaigns',
    logo: '🐵',
    status: 'available',
    users: '1.5K',
    rating: 4.5,
    features: ['List sync', 'Tag automation', 'Campaign triggers']
  },
  {
    id: 'phantombuster',
    name: 'PhantomBuster',
    category: 'social',
    description: 'Advanced LinkedIn automation and data extraction',
    logo: '👻',
    status: 'connected',
    users: '2.3K',
    rating: 4.7,
    features: ['Profile scraping', 'Auto-connect', 'Message sequences']
  },
  {
    id: 'linkedin-sales',
    name: 'LinkedIn Sales Navigator',
    category: 'social',
    description: 'Import leads from LinkedIn Sales Navigator searches',
    logo: '💼',
    status: 'available',
    users: '1.9K',
    rating: 4.6,
    features: ['Lead import', 'Account sync', 'InMail tracking']
  },
  {
    id: 'twitter-api',
    name: 'X (Twitter) API',
    category: 'social',
    description: 'Full X/Twitter automation with API access',
    logo: '🐦',
    status: 'available',
    users: '1.1K',
    rating: 4.4,
    features: ['Auto-engage', 'Scheduling', 'Analytics sync']
  }
];

function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [webhookCopied, setWebhookCopied] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [webhookUrl] = useState('https://api.cuedeck.com/webhooks/usr_abc123xyz');
  const [apiKey] = useState('cd_live_sk_AbCdEf123456789XyZ');

  const filteredIntegrations = useMemo(() => {
    return integrations.filter(int => {
      const matchesCategory = selectedCategory === 'all' || int.category === selectedCategory;
      const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        int.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const connectedCount = useMemo(() => {
    return integrations.filter(i => i.status === 'connected').length;
  }, []);

  const handleConnect = useCallback((integration) => {
    alert(`Opening ${integration.name} connection flow...`);
  }, []);

  const handleConfigure = useCallback((integration) => {
    alert(`Opening ${integration.name} settings...`);
  }, []);

  const handleCopyWebhook = useCallback(() => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  }, [webhookUrl]);

  const handleCopyApiKey = useCallback(() => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  }, [apiKey]);

  return (
    <div className="integrations-page">
      <div className="integrations-header">
        <div className="header-content">
          <h2>Integration Marketplace</h2>
          <p>Connect CueDeck with your favorite tools</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <Check size={16} />
            <span>{connectedCount} Connected</span>
          </div>
          <div className="stat-badge">
            <Zap size={16} />
            <span>{integrations.length} Available</span>
          </div>
        </div>
      </div>

      {/* Developer Tools Section */}
      <div className="developer-section">
        <h3>
          <Key size={18} />
          Developer Tools
        </h3>
        <div className="dev-tools-grid">
          <div className="dev-tool-card">
            <div className="tool-header">
              <Webhook size={20} />
              <span>Webhook URL</span>
            </div>
            <p>Receive real-time events from CueDeck</p>
            <div className="credential-box">
              <input type="text" value={webhookUrl} readOnly />
              <button onClick={handleCopyWebhook} className={webhookCopied ? 'copied' : ''}>
                {webhookCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <div className="dev-tool-card">
            <div className="tool-header">
              <Key size={20} />
              <span>API Key</span>
            </div>
            <p>Authenticate with CueDeck API</p>
            <div className="credential-box">
              <input type="password" value={apiKey} readOnly />
              <button onClick={handleCopyApiKey} className={apiKeyCopied ? 'copied' : ''}>
                {apiKeyCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
              <button className="regenerate">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="integrations-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {integrationCategories.map(cat => (
            <button
              key={cat.id}
              className={selectedCategory === cat.id ? 'active' : ''}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Integrations */}
      {selectedCategory === 'all' && !searchQuery && (
        <section className="popular-section">
          <h3>
            <Star size={18} />
            Popular Integrations
          </h3>
          <div className="popular-grid">
            {integrations.filter(i => i.popular).map(integration => (
              <div key={integration.id} className="integration-card popular">
                <div className="card-header">
                  <div className="integration-logo">{integration.logo}</div>
                  <div className="integration-meta">
                    <span className="integration-name">{integration.name}</span>
                    <span className="integration-category">{integration.category}</span>
                  </div>
                  {integration.status === 'connected' && (
                    <span className="connected-badge">
                      <Check size={12} />
                      Connected
                    </span>
                  )}
                </div>
                <p className="integration-description">{integration.description}</p>
                <div className="integration-stats">
                  <span><Users size={12} /> {integration.users} users</span>
                  <span><Star size={12} /> {integration.rating}</span>
                </div>
                <button
                  className={`connect-btn ${integration.status === 'connected' ? 'configure' : ''}`}
                  onClick={() => integration.status === 'connected' ? handleConfigure(integration) : handleConnect(integration)}
                >
                  {integration.status === 'connected' ? (
                    <>
                      <Settings size={16} />
                      Configure
                    </>
                  ) : (
                    <>
                      Connect
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Integrations Grid */}
      <section className="all-integrations">
        <h3>
          {selectedCategory === 'all' ? 'All Integrations' : `${integrationCategories.find(c => c.id === selectedCategory)?.label} Integrations`}
        </h3>
        <div className="integrations-grid">
          {filteredIntegrations.map(integration => (
            <div key={integration.id} className={`integration-card ${integration.status === 'connected' ? 'connected' : ''}`}>
              <div className="card-header">
                <div className="integration-logo">{integration.logo}</div>
                <div className="integration-info">
                  <span className="integration-name">{integration.name}</span>
                  <div className="integration-stats">
                    <span><Users size={12} /> {integration.users}</span>
                    <span><Star size={12} /> {integration.rating}</span>
                  </div>
                </div>
              </div>
              <p className="integration-description">{integration.description}</p>
              <div className="integration-features">
                {integration.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">
                    <Check size={10} />
                    {feature}
                  </span>
                ))}
              </div>
              <div className="card-footer">
                {integration.status === 'connected' ? (
                  <>
                    <span className="status-connected">
                      <Check size={14} />
                      Connected
                    </span>
                    <button className="config-btn" onClick={() => handleConfigure(integration)}>
                      <Settings size={16} />
                    </button>
                  </>
                ) : (
                  <button className="connect-btn full" onClick={() => handleConnect(integration)}>
                    Connect
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {filteredIntegrations.length === 0 && (
        <div className="empty-state">
          <Search size={48} />
          <h3>No integrations found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Request Integration */}
      <div className="request-section">
        <div className="request-content">
          <h3>Don't see what you need?</h3>
          <p>Request an integration and we'll prioritize it based on community demand</p>
        </div>
        <button className="request-btn">
          Request Integration
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}

export default Integrations;
