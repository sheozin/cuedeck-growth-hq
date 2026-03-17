import React, { useState } from 'react';
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
  Mail
} from 'lucide-react';
import useStore from '../store/useStore';
import { mockSequences, mockDomains } from '../data/mockSequences';
import { mockEmailContacts } from '../data/mockContent';
import './EmailAgent.css';

function EmailAgent() {
  const [expandedSequence, setExpandedSequence] = useState(null);
  const [sequences, setSequences] = useState(mockSequences);

  const stats = [
    { label: 'Emails Sent Today', value: '47', sublabel: '', icon: Send, color: '#4A8EFF' },
    { label: 'Open Rate', value: '31%', sublabel: 'last 7 days', icon: Eye, color: '#22c55e' },
    { label: 'Reply Rate', value: '8%', sublabel: 'last 7 days', icon: MessageSquare, color: '#8b5cf6' },
    { label: 'Bounced', value: '2', sublabel: 'today', icon: AlertCircle, color: '#ef4444' },
  ];

  const toggleSequence = (id) => {
    setExpandedSequence(expandedSequence === id ? null : id);
  };

  const toggleSequenceStatus = (id) => {
    setSequences(sequences.map(seq =>
      seq.id === id
        ? { ...seq, status: seq.status === 'active' ? 'paused' : 'active' }
        : seq
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#22c55e';
      case 'Replied': return '#8b5cf6';
      case 'Bounced': return '#ef4444';
      case 'Unsubscribed': return '#9ca3af';
      default: return '#64748b';
    }
  };

  return (
    <div className="email-agent">
      <div className="connection-status">
        <div className="status-badge connected">
          <CheckCircle size={16} />
          Connected to Instantly.ai
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
              {stat.sublabel && <span className="stat-sublabel">{stat.sublabel}</span>}
            </div>
          </div>
        ))}
      </div>

      <section className="warmup-section">
        <h2 className="section-title">Domain Warmup Status</h2>
        <div className="warmup-table-wrapper">
          <table className="warmup-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Warmup Score</th>
                <th>Daily Limit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockDomains.map((domain) => (
                <tr key={domain.id}>
                  <td>
                    <div className="domain-cell">
                      <Mail size={16} />
                      {domain.domain}
                    </div>
                  </td>
                  <td>
                    <div className="warmup-score">
                      <div className="score-bar">
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

      <section className="sequences-section">
        <h2 className="section-title">Active Sequences</h2>
        <div className="sequences-list">
          {sequences.map((sequence) => (
            <div key={sequence.id} className={`sequence-card ${expandedSequence === sequence.id ? 'expanded' : ''}`}>
              <div className="sequence-header" onClick={() => toggleSequence(sequence.id)}>
                <div className="sequence-main">
                  <h3 className="sequence-name">{sequence.name}</h3>
                  <div className="sequence-meta">
                    <span className="meta-item">
                      <Users size={14} />
                      {sequence.contacts} contacts
                    </span>
                    <span className="meta-item">
                      Step {sequence.currentStep}/{sequence.totalSteps}
                    </span>
                  </div>
                </div>

                <div className="sequence-stats">
                  <div className="stat-pill">
                    <Eye size={12} />
                    {sequence.openRate}% open
                  </div>
                  <div className="stat-pill">
                    <MessageSquare size={12} />
                    {sequence.replyRate}% reply
                  </div>
                </div>

                <div className="sequence-actions">
                  <button
                    className={`toggle-btn ${sequence.status === 'active' ? 'active' : 'paused'}`}
                    onClick={(e) => { e.stopPropagation(); toggleSequenceStatus(sequence.id); }}
                  >
                    {sequence.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    {sequence.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button className="view-contacts-btn" onClick={(e) => e.stopPropagation()}>
                    View Contacts
                  </button>
                  {expandedSequence === sequence.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedSequence === sequence.id && (
                <div className="sequence-details">
                  <div className="steps-timeline">
                    {sequence.steps.map((step, index) => (
                      <div
                        key={step.step}
                        className={`step-item ${index < sequence.currentStep ? 'completed' : index === sequence.currentStep - 1 ? 'current' : 'upcoming'}`}
                      >
                        <div className="step-indicator">
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

      <section className="contacts-section">
        <h2 className="section-title">Active Contacts</h2>
        <div className="contacts-table-wrapper">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Sequence</th>
                <th>Step</th>
                <th>Last Sent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockEmailContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.company}</td>
                  <td>{contact.sequence}</td>
                  <td>Step {contact.step}</td>
                  <td>
                    {new Date(contact.lastSent).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
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
