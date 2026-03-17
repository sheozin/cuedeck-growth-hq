import React, { useState } from 'react';
import {
  X,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  MessageSquare,
  Flame,
  Archive,
  Calendar
} from 'lucide-react';
import useStore from '../store/useStore';
import './LeadDrawer.css';

function LeadDrawer() {
  const { isLeadDrawerOpen, selectedLead, closeLeadDrawer, updateLead } = useStore();
  const [notes, setNotes] = useState(selectedLead?.notes || '');

  if (!isLeadDrawerOpen || !selectedLead) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStageColor = (stage) => {
    const colors = {
      'Discovered': '#9ca3af',
      'Warming': '#3b82f6',
      'Connected': '#22c55e',
      'In Sequence': '#f59e0b',
      'Replied': '#14b8a6',
      'Demo Booked': '#8b5cf6',
    };
    return colors[stage] || '#9ca3af';
  };

  const handleSaveNotes = () => {
    updateLead(selectedLead.id, { notes });
  };

  const handleMarkHot = () => {
    updateLead(selectedLead.id, { isHot: !selectedLead.isHot });
  };

  const handleArchive = () => {
    updateLead(selectedLead.id, { stage: 'Archived' });
    closeLeadDrawer();
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={closeLeadDrawer}></div>
      <aside className={`lead-drawer ${isLeadDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title-section">
            <div className="lead-avatar">
              {selectedLead.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="drawer-title">{selectedLead.name}</h2>
              <p className="drawer-subtitle">{selectedLead.title} at {selectedLead.company}</p>
            </div>
          </div>
          <button className="drawer-close" onClick={closeLeadDrawer}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          <section className="drawer-section">
            <div className="lead-score-card">
              <div className="score-main">
                <span className="score-value">{selectedLead.score}</span>
                <span className="score-label">Lead Score</span>
              </div>
              <div className="score-breakdown">
                <div className="score-item">
                  <span className="score-item-label">Engagement</span>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${(selectedLead.scoreBreakdown?.engagement || 0) / 35 * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-item-value">{selectedLead.scoreBreakdown?.engagement || 0}</span>
                </div>
                <div className="score-item">
                  <span className="score-item-label">ICP Fit</span>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${(selectedLead.scoreBreakdown?.fit || 0) / 35 * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-item-value">{selectedLead.scoreBreakdown?.fit || 0}</span>
                </div>
                <div className="score-item">
                  <span className="score-item-label">Intent</span>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${(selectedLead.scoreBreakdown?.intent || 0) / 35 * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-item-value">{selectedLead.scoreBreakdown?.intent || 0}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="section-title">Contact Info</h3>
            <div className="contact-links">
              {selectedLead.linkedinUrl && (
                <a href={selectedLead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <Linkedin size={16} />
                  LinkedIn Profile
                  <ExternalLink size={14} />
                </a>
              )}
              {selectedLead.xHandle && (
                <a href={`https://x.com/${selectedLead.xHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <Twitter size={16} />
                  {selectedLead.xHandle}
                  <ExternalLink size={14} />
                </a>
              )}
              {selectedLead.email && (
                <a href={`mailto:${selectedLead.email}`} className="contact-link">
                  <Mail size={16} />
                  {selectedLead.email}
                </a>
              )}
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="section-title">Stage</h3>
            <span
              className="stage-badge-large"
              style={{ backgroundColor: `${getStageColor(selectedLead.stage)}20`, color: getStageColor(selectedLead.stage) }}
            >
              {selectedLead.stage}
            </span>
          </section>

          <section className="drawer-section">
            <h3 className="section-title">Activity Timeline</h3>
            <div className="timeline">
              {selectedLead.timeline?.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-agent">{event.agent}</span>
                    <p className="timeline-action">{event.action}</p>
                    <span className="timeline-date">{formatDate(event.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="section-title">Notes</h3>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={4}
            />
            <button className="save-notes-btn" onClick={handleSaveNotes}>
              Save Notes
            </button>
          </section>

          <section className="drawer-section">
            <h3 className="section-title">Manual Actions</h3>
            <div className="action-buttons">
              <button className="action-btn linkedin">
                <Linkedin size={16} />
                Send LinkedIn DM
              </button>
              <button className="action-btn email">
                <Mail size={16} />
                Add to Email Sequence
              </button>
              <button
                className={`action-btn hot ${selectedLead.isHot ? 'active' : ''}`}
                onClick={handleMarkHot}
              >
                <Flame size={16} />
                {selectedLead.isHot ? 'Marked as Hot' : 'Mark as Hot'}
              </button>
              <button className="action-btn archive" onClick={handleArchive}>
                <Archive size={16} />
                Archive
              </button>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

export default LeadDrawer;
