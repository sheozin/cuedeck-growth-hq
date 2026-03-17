import React, { useState, useCallback, useMemo } from 'react';
import {
  Settings,
  CheckCircle,
  Send,
  Eye,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Users,
  Mail,
  X
} from 'lucide-react';
import ConfigModal from '../components/ConfigModal';
import { mockSequences, mockDomains } from '../data/mockSequences';
import { mockEmailContacts } from '../data/mockContent';
import { formatDate } from '../utils/formatters';
import { getStatusColor } from '../utils/styles';
import './EmailAgent.css';

function EmailAgent() {
  const [expandedSequence, setExpandedSequence] = useState(null);
  const [sequences, setSequences] = useState(mockSequences);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [viewingContacts, setViewingContacts] = useState(null);

  const stats = useMemo(() => [
    { label: 'Emails Sent Today', value: '47', sublabel: '', icon: Send, color: '#4A8EFF' },
    { label: 'Open Rate', value: '31%', sublabel: 'last 7 days', icon: Eye, color: '#22c55e' },
    { label: 'Reply Rate', value: '8%', sublabel: 'last 7 days', icon: MessageSquare, color: '#8b5cf6' },
    { label: 'Bounced', value: '2', sublabel: 'today', icon: AlertCircle, color: '#ef4444' },
  ], []);

  const toggleSequence = useCallback((id) => {
    setExpandedSequence((prev) => prev === id ? null : id);
  }, []);

  const toggleSequenceStatus = useCallback((id) => {
    setSequences((prev) => prev.map(seq =>
      seq.id === id
        ? { ...seq, status: seq.status === 'active' ? 'paused' : 'active' }
        : seq
    ));
  }, []);

  const handleViewContacts = useCallback((sequence) => {
    setViewingContacts(sequence);
  }, []);

  const sequenceContacts = useMemo(() => {
    if (!viewingContacts) return [];
    return mockEmailContacts.filter(c => c.sequence === viewingContacts.name);
  }, [viewingContacts]);

  return (
    <div className="email-agent">
      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        platform="email"
      />

      {/* View Contacts Modal */}
      {viewingContacts && (
        <div className="modal-overlay" onClick={() => setViewingContacts(null)}>
          <div className="contacts-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contacts in "{viewingContacts.name}"</h3>
              <button className="close-btn" onClick={() => setViewingContacts(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {sequenceContacts.length === 0 ? (
                <p className="empty-message">No contacts found in this sequence.</p>
              ) : (
                <table className="modal-contacts-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Step</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sequenceContacts.map(contact => (
                      <tr key={contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.company}</td>
                        <td>Step {contact.step}</td>
                        <td>
                          <span style={{ color: getStatusColor(contact.status) }}>
                            {contact.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="connection-status">
        <div className="status-badge connected" role="status">
          <CheckCircle size={16} aria-hidden="true" />
          Connected to Instantly.ai
        </div>
        <button
          className="configure-btn"
          aria-label="Configure Instantly.ai"
          onClick={() => setShowConfigModal(true)}
        >
          <Settings size={16} aria-hidden="true" />
          Configure
        </button>
      </div>

      <div className="stats-row" role="region" aria-label="Email Agent statistics">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }} aria-hidden="true">
              <stat.icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              {stat.sublabel && <span className="stat-sublabel">{stat.sublabel}</span>}
            </div>
          </div>
        ))}
      </div>

      <section className="warmup-section" aria-labelledby="warmup-title">
        <h2 id="warmup-title" className="section-title">Domain Warmup Status</h2>
        <div className="warmup-table-wrapper">
          <table className="warmup-table" aria-label="Domain warmup status">
            <thead>
              <tr>
                <th scope="col">Domain</th>
                <th scope="col">Warmup Score</th>
                <th scope="col">Daily Limit</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockDomains.map((domain) => (
                <tr key={domain.id}>
                  <td>
                    <div className="domain-cell">
                      <Mail size={16} aria-hidden="true" />
                      {domain.domain}
                    </div>
                  </td>
                  <td>
                    <div className="warmup-score">
                      <div
                        className="score-bar"
                        role="progressbar"
                        aria-valuenow={domain.warmupScore}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`Warmup score: ${domain.warmupScore} of 100`}
                      >
                        <div
                          className="score-fill"
                          style={{
                            width: `${domain.warmupScore}%`,
                            backgroundColor: domain.warmupScore > 70 ? '#22c55e' : domain.warmupScore > 40 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span>{domain.warmupScore}/100</span>
                    </div>
                  </td>
                  <td>{domain.dailyLimit} emails/day</td>
                  <td>
                    <span className={`warmup-status ${domain.status.toLowerCase()}`}>
                      {domain.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sequences-section" aria-labelledby="sequences-title">
        <h2 id="sequences-title" className="section-title">Active Sequences</h2>
        <div className="sequences-list" role="list">
          {sequences.map((sequence) => (
            <div
              key={sequence.id}
              className={`sequence-card ${expandedSequence === sequence.id ? 'expanded' : ''}`}
              role="listitem"
            >
              <div
                className="sequence-header"
                onClick={() => toggleSequence(sequence.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleSequence(sequence.id)}
                aria-expanded={expandedSequence === sequence.id}
                aria-controls={`sequence-details-${sequence.id}`}
              >
                <div className="sequence-main">
                  <h3 className="sequence-name">{sequence.name}</h3>
                  <div className="sequence-meta">
                    <span className="meta-item">
                      <Users size={14} aria-hidden="true" />
                      {sequence.contacts} contacts
                    </span>
                    <span className="meta-item">
                      Step {sequence.currentStep}/{sequence.totalSteps}
                    </span>
                  </div>
                </div>

                <div className="sequence-stats">
                  <div className="stat-pill">
                    <Eye size={12} aria-hidden="true" />
                    {sequence.openRate}% open
                  </div>
                  <div className="stat-pill">
                    <MessageSquare size={12} aria-hidden="true" />
                    {sequence.replyRate}% reply
                  </div>
                </div>

                <div className="sequence-actions">
                  <button
                    className={`toggle-btn ${sequence.status === 'active' ? 'active' : 'paused'}`}
                    onClick={(e) => { e.stopPropagation(); toggleSequenceStatus(sequence.id); }}
                    aria-label={sequence.status === 'active' ? 'Pause sequence' : 'Resume sequence'}
                  >
                    {sequence.status === 'active' ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                    {sequence.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    className="view-contacts-btn"
                    onClick={(e) => { e.stopPropagation(); handleViewContacts(sequence); }}
                  >
                    View Contacts
                  </button>
                  {expandedSequence === sequence.id ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
                </div>
              </div>

              {expandedSequence === sequence.id && (
                <div id={`sequence-details-${sequence.id}`} className="sequence-details">
                  <div className="steps-timeline" role="list" aria-label="Sequence steps">
                    {sequence.steps.map((step, index) => (
                      <div
                        key={step.step}
                        className={`step-item ${index < sequence.currentStep ? 'completed' : index === sequence.currentStep - 1 ? 'current' : 'upcoming'}`}
                        role="listitem"
                      >
                        <div className="step-indicator" aria-hidden="true">
                          <span className="step-number">{step.step}</span>
                        </div>
                        <div className="step-content">
                          <p className="step-subject">{step.subject}</p>
                          <div className="step-stats">
                            <span>Sent: {step.sent}</span>
                            <span>Opened: {step.opened}</span>
                            <span>Replied: {step.replied}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="contacts-section" aria-labelledby="contacts-title">
        <h2 id="contacts-title" className="section-title">Active Contacts</h2>
        <div className="contacts-table-wrapper">
          <table className="contacts-table" aria-label="Active email contacts">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Company</th>
                <th scope="col">Sequence</th>
                <th scope="col">Step</th>
                <th scope="col">Last Sent</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockEmailContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.company}</td>
                  <td>{contact.sequence}</td>
                  <td>Step {contact.step}</td>
                  <td>{formatDate(contact.lastSent)}</td>
                  <td>
                    <span
                      className="contact-status"
                      style={{ color: getStatusColor(contact.status) }}
                    >
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default EmailAgent;
