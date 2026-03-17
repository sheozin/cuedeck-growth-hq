import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Flame,
  Archive
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatDateTime } from '../utils/formatters';
import { getStageColor } from '../utils/styles';
import './LeadDrawer.css';

function LeadDrawer() {
  const isLeadDrawerOpen = useStore((state) => state.isLeadDrawerOpen);
  const selectedLead = useStore((state) => state.selectedLead);
  const closeLeadDrawer = useStore((state) => state.closeLeadDrawer);
  const updateLead = useStore((state) => state.updateLead);

  const [notes, setNotes] = useState('');

  // Sync notes when selectedLead changes
  useEffect(() => {
    if (selectedLead) {
      setNotes(selectedLead.notes || '');
    }
  }, [selectedLead]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isLeadDrawerOpen) {
        closeLeadDrawer();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isLeadDrawerOpen, closeLeadDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isLeadDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLeadDrawerOpen]);

  const handleSaveNotes = useCallback(() => {
    if (selectedLead) {
      updateLead(selectedLead.id, { notes });
    }
  }, [selectedLead, notes, updateLead]);

  const handleMarkHot = useCallback(() => {
    if (selectedLead) {
      updateLead(selectedLead.id, { isHot: !selectedLead.isHot });
    }
  }, [selectedLead, updateLead]);

  const handleArchive = useCallback(() => {
    if (selectedLead) {
      updateLead(selectedLead.id, { stage: 'Archived' });
      closeLeadDrawer();
    }
  }, [selectedLead, updateLead, closeLeadDrawer]);

  if (!isLeadDrawerOpen || !selectedLead) return null;

  return (
    <>
      <div
        className="drawer-backdrop"
        onClick={closeLeadDrawer}
        aria-hidden="true"
      ></div>
      <aside
        className={`lead-drawer ${isLeadDrawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <div className="drawer-title-section">
            <div className="lead-avatar" aria-hidden="true">
              {selectedLead.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 id="drawer-title" className="drawer-title">{selectedLead.name}</h2>
              <p className="drawer-subtitle">{selectedLead.title} at {selectedLead.company}</p>
            </div>
          </div>
          <button
            className="drawer-close"
            onClick={closeLeadDrawer}
            aria-label="Close drawer"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="drawer-body">
          <section className="drawer-section" aria-labelledby="score-heading">
            <h3 id="score-heading" className="sr-only">Lead Score</h3>
            <div className="lead-score-card">
              <div className="score-main">
                <span className="score-value">{selectedLead.score}</span>
                <span className="score-label">Lead Score</span>
              </div>
              <div className="score-breakdown">
                <div className="score-item">
                  <span className="score-item-label">Engagement</span>
                  <div
                    className="score-bar"
                    role="progressbar"
                    aria-valuenow={selectedLead.scoreBreakdown?.engagement || 0}
                    aria-valuemin="0"
                    aria-valuemax="35"
                  >
                    <div
                      className="score-bar-fill"
                      style={{ width: `${(selectedLead.scoreBreakdown?.engagement || 0) / 35 * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-item-value">{selectedLead.scoreBreakdown?.engagement || 0}</span>
                </div>
                <div className="score-item">
                  <span className="score-item-label">ICP Fit</span>
                  <div
                    className="score-bar"
                    role="progressbar"
                    aria-valuenow={selectedLead.scoreBreakdown?.fit || 0}
                    aria-valuemin="0"
                    aria-valuemax="35"
                  >
                    <div
                      className="score-bar-fill"
                      style={{ width: `${(selectedLead.scoreBreakdown?.fit || 0) / 35 * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-item-value">{selectedLead.scoreBreakdown?.fit || 0}</span>
                </div>
                <div className="score-item">
                  <span className="score-item-label">Intent</span>
                  <div
                    className="score-bar"
                    role="progressbar"
                    aria-valuenow={selectedLead.scoreBreakdown?.intent || 0}
                    aria-valuemin="0"
                    aria-valuemax="35"
                  >
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

          <section className="drawer-section" aria-labelledby="contact-heading">
            <h3 id="contact-heading" className="section-title">Contact Info</h3>
            <div className="contact-links">
              {selectedLead.linkedinUrl && (
                <a
                  href={selectedLead.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <Linkedin size={16} aria-hidden="true" />
                  LinkedIn Profile
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
              {selectedLead.xHandle && (
                <a
                  href={`https://x.com/${selectedLead.xHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <Twitter size={16} aria-hidden="true" />
                  {selectedLead.xHandle}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
              {selectedLead.email && (
                <a href={`mailto:${selectedLead.email}`} className="contact-link">
                  <Mail size={16} aria-hidden="true" />
                  {selectedLead.email}
                </a>
              )}
            </div>
          </section>

          <section className="drawer-section" aria-labelledby="stage-heading">
            <h3 id="stage-heading" className="section-title">Stage</h3>
            <span
              className="stage-badge-large"
              style={{ backgroundColor: `${getStageColor(selectedLead.stage)}20`, color: getStageColor(selectedLead.stage) }}
            >
              {selectedLead.stage}
            </span>
          </section>

          <section className="drawer-section" aria-labelledby="timeline-heading">
            <h3 id="timeline-heading" className="section-title">Activity Timeline</h3>
            <div className="timeline" role="list">
              {selectedLead.timeline?.map((event, index) => (
                <div key={index} className="timeline-item" role="listitem">
                  <div className="timeline-dot" aria-hidden="true"></div>
                  <div className="timeline-content">
                    <span className="timeline-agent">{event.agent}</span>
                    <p className="timeline-action">{event.action}</p>
                    <span className="timeline-date">{formatDateTime(event.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="drawer-section" aria-labelledby="notes-heading">
            <h3 id="notes-heading" className="section-title">Notes</h3>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={4}
              aria-label="Lead notes"
            />
            <button className="save-notes-btn" onClick={handleSaveNotes}>
              Save Notes
            </button>
          </section>

          <section className="drawer-section" aria-labelledby="actions-heading">
            <h3 id="actions-heading" className="section-title">Manual Actions</h3>
            <div className="action-buttons">
              <button className="action-btn linkedin" aria-label="Send LinkedIn direct message">
                <Linkedin size={16} aria-hidden="true" />
                Send LinkedIn DM
              </button>
              <button className="action-btn email" aria-label="Add to email sequence">
                <Mail size={16} aria-hidden="true" />
                Add to Email Sequence
              </button>
              <button
                className={`action-btn hot ${selectedLead.isHot ? 'active' : ''}`}
                onClick={handleMarkHot}
                aria-pressed={selectedLead.isHot}
              >
                <Flame size={16} aria-hidden="true" />
                {selectedLead.isHot ? 'Marked as Hot' : 'Mark as Hot'}
              </button>
              <button className="action-btn archive" onClick={handleArchive}>
                <Archive size={16} aria-hidden="true" />
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
