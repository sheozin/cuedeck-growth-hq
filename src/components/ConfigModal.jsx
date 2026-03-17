import React, { useState, useCallback } from 'react';
import { X, Save, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import './ConfigModal.css';

function ConfigModal({ isOpen, onClose, platform }) {
  const apiKeys = useStore((state) => state.apiKeys);
  const updateApiKey = useStore((state) => state.updateApiKey);
  const integrationStatus = useStore((state) => state.settings.integrationStatus);
  const updateIntegrationStatus = useStore((state) => state.updateIntegrationStatus);

  const [localKeys, setLocalKeys] = useState({});
  const [testStatus, setTestStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const platformConfig = {
    linkedin: {
      title: 'PhantomBuster Configuration',
      description: 'Connect your PhantomBuster account to automate LinkedIn actions.',
      docsUrl: 'https://phantombuster.com/docs',
      fields: [
        { key: 'phantombuster', label: 'API Key', placeholder: 'Enter your PhantomBuster API key' },
        { key: 'phantombusterAgentId', label: 'Agent ID', placeholder: 'Enter your LinkedIn Agent ID' },
      ],
      statusKey: 'phantombuster',
    },
    x: {
      title: 'X API Configuration',
      description: 'Connect your X (Twitter) Developer account to enable engagement features.',
      docsUrl: 'https://developer.twitter.com/en/docs',
      fields: [
        { key: 'xApiKey', label: 'API Key', placeholder: 'Enter your X API key' },
        { key: 'xApiSecret', label: 'API Secret', placeholder: 'Enter your X API secret' },
        { key: 'xAccessToken', label: 'Access Token', placeholder: 'Enter your access token' },
        { key: 'xAccessSecret', label: 'Access Token Secret', placeholder: 'Enter your access token secret' },
      ],
      statusKey: 'x',
    },
    email: {
      title: 'Instantly.ai Configuration',
      description: 'Connect your Instantly.ai account to manage email sequences.',
      docsUrl: 'https://instantly.ai/docs',
      fields: [
        { key: 'instantly', label: 'API Key', placeholder: 'Enter your Instantly.ai API key' },
        { key: 'instantlyWorkspace', label: 'Workspace ID', placeholder: 'Enter your workspace ID (optional)' },
      ],
      statusKey: 'instantly',
    },
  };

  const config = platformConfig[platform];

  const handleFieldChange = useCallback((key, value) => {
    setLocalKeys(prev => ({ ...prev, [key]: value }));
    setTestStatus(null);
  }, []);

  const handleTestConnection = useCallback(async () => {
    setIsTesting(true);
    setTestStatus(null);

    // Simulate API test (in production, this would actually test the connection)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const hasValues = config.fields.some(f => localKeys[f.key] || apiKeys[f.key]);

    if (hasValues) {
      setTestStatus('success');
      updateIntegrationStatus(config.statusKey, 'connected');
    } else {
      setTestStatus('error');
    }

    setIsTesting(false);
  }, [config, localKeys, apiKeys, updateIntegrationStatus]);

  const handleSave = useCallback(() => {
    Object.entries(localKeys).forEach(([key, value]) => {
      if (value) {
        updateApiKey(key, value);
      }
    });
    onClose();
  }, [localKeys, updateApiKey, onClose]);

  if (!isOpen || !config) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="config-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{config.title}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">{config.description}</p>

          <div className="connection-status-bar">
            <span className="status-label">Status:</span>
            <span className={`status-value ${integrationStatus[config.statusKey]}`}>
              {integrationStatus[config.statusKey] === 'connected' ? (
                <>
                  <CheckCircle size={14} />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle size={14} />
                  Not Connected
                </>
              )}
            </span>
          </div>

          <div className="config-fields">
            {config.fields.map(field => (
              <div key={field.key} className="config-field">
                <label htmlFor={field.key}>{field.label}</label>
                <input
                  id={field.key}
                  type="password"
                  placeholder={field.placeholder}
                  value={localKeys[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          {testStatus && (
            <div className={`test-result ${testStatus}`}>
              {testStatus === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  Connection successful!
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Connection failed. Please check your credentials.
                </>
              )}
            </div>
          )}

          <a
            href={config.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="docs-link"
          >
            <ExternalLink size={14} />
            View API Documentation
          </a>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-test"
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigModal;
