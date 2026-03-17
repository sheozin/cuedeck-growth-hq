import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Linkedin,
  Twitter,
  Mail,
  X,
  Save
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatDate } from '../utils/formatters';
import { getStageColor } from '../utils/styles';
import './Pipeline.css';

const stages = [
  { key: 'Discovered', color: '#9ca3af' },
  { key: 'Warming', color: '#3b82f6' },
  { key: 'Connected', color: '#22c55e' },
  { key: 'In Sequence', color: '#f59e0b' },
  { key: 'Replied', color: '#14b8a6' },
  { key: 'Demo Booked', color: '#8b5cf6' },
];

const emptyLead = {
  name: '',
  email: '',
  company: '',
  title: '',
  stage: 'Discovered',
  platforms: [],
};

function Pipeline() {
  const leads = useStore((state) => state.leads);
  const addLead = useStore((state) => state.addLead);
  const openLeadDrawer = useStore((state) => state.openLeadDrawer);
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState(emptyLead);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [leads, searchQuery, stageFilter]);

  const leadsByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.key] = filteredLeads.filter((lead) => lead.stage === stage.key);
      return acc;
    }, {});
  }, [filteredLeads]);

  const handleOpenLead = useCallback((lead) => {
    openLeadDrawer(lead);
  }, [openLeadDrawer]);

  const handleAddLead = useCallback(() => {
    if (!newLead.name || !newLead.company) {
      alert('Please fill in at least Name and Company');
      return;
    }
    addLead({
      ...newLead,
      score: 50,
      lastTouch: new Date().toISOString(),
      signal: 'New Lead',
      notes: '',
      isHot: false,
    });
    setNewLead(emptyLead);
    setShowAddModal(false);
  }, [newLead, addLead]);

  const handlePlatformToggle = useCallback((platform) => {
    setNewLead(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  }, []);

  return (
    <div className="pipeline">
      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-lead-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Lead</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lead-name">Name *</label>
                  <input
                    id="lead-name"
                    type="text"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lead-email">Email</label>
                  <input
                    id="lead-email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="email@company.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lead-company">Company *</label>
                  <input
                    id="lead-company"
                    type="text"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lead-title">Job Title</label>
                  <input
                    id="lead-title"
                    type="text"
                    value={newLead.title}
                    onChange={(e) => setNewLead({ ...newLead, title: e.target.value })}
                    placeholder="e.g., Event Director"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lead-stage">Stage</label>
                  <select
                    id="lead-stage"
                    value={newLead.stage}
                    onChange={(e) => setNewLead({ ...newLead, stage: e.target.value })}
                  >
                    {stages.map(s => (
                      <option key={s.key} value={s.key}>{s.key}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Platforms</label>
                  <div className="platform-checkboxes">
                    <label className="platform-checkbox">
                      <input
                        type="checkbox"
                        checked={newLead.platforms.includes('linkedin')}
                        onChange={() => handlePlatformToggle('linkedin')}
                      />
                      <Linkedin size={16} />
                      LinkedIn
                    </label>
                    <label className="platform-checkbox">
                      <input
                        type="checkbox"
                        checked={newLead.platforms.includes('x')}
                        onChange={() => handlePlatformToggle('x')}
                      />
                      <Twitter size={16} />
                      X
                    </label>
                    <label className="platform-checkbox">
                      <input
                        type="checkbox"
                        checked={newLead.platforms.includes('email')}
                        onChange={() => handlePlatformToggle('email')}
                      />
                      <Mail size={16} />
                      Email
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddLead}>
                <Save size={16} />
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pipeline-header">
        <div className="pipeline-filters">
          <div className="search-box">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search leads"
            />
          </div>

          <div className="filter-select">
            <Filter size={16} aria-hidden="true" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              aria-label="Filter by stage"
            >
              <option value="all">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.key}
                </option>
              ))}
            </select>
          </div>

          <button
            className="add-lead-btn"
            aria-label="Add new lead"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} aria-hidden="true" />
            Add Lead
          </button>
        </div>

        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
            aria-pressed={viewMode === 'table'}
            aria-label="Table view"
          >
            <List size={18} aria-hidden="true" />
          </button>
          <button
            className={viewMode === 'kanban' ? 'active' : ''}
            onClick={() => setViewMode('kanban')}
            aria-pressed={viewMode === 'kanban'}
            aria-label="Kanban view"
          >
            <LayoutGrid size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="pipeline-table-wrapper">
          <table className="pipeline-table" aria-label="Lead pipeline">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Title</th>
                <th scope="col">Company</th>
                <th scope="col">Stage</th>
                <th scope="col">Platforms</th>
                <th scope="col">Last Touch</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => handleOpenLead(lead)}
                  className="clickable-row"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleOpenLead(lead)}
                  role="button"
                  aria-label={`View ${lead.name}`}
                >
                  <td>
                    <div className="lead-name-cell">
                      <div className="lead-avatar" aria-hidden="true">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td>{lead.title}</td>
                  <td>{lead.company}</td>
                  <td>
                    <span
                      className="stage-badge"
                      style={{
                        backgroundColor: `${getStageColor(lead.stage)}20`,
                        color: getStageColor(lead.stage),
                      }}
                    >
                      {lead.stage}
                    </span>
                  </td>
                  <td>
                    <div className="platform-icons" aria-label={`Platforms: ${lead.platforms.join(', ')}`}>
                      {lead.platforms.includes('linkedin') && (
                        <Linkedin size={16} aria-hidden="true" />
                      )}
                      {lead.platforms.includes('x') && <Twitter size={16} aria-hidden="true" />}
                      {lead.platforms.includes('email') && <Mail size={16} aria-hidden="true" />}
                    </div>
                  </td>
                  <td>{formatDate(lead.lastTouch)}</td>
                  <td>
                    <div className="score-cell">
                      <span className="score-value">{lead.score}</span>
                      <div className="score-bar" role="progressbar" aria-valuenow={lead.score} aria-valuemin="0" aria-valuemax="100">
                        <div
                          className="score-fill"
                          style={{ width: `${lead.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="kanban-board" role="region" aria-label="Kanban board">
          {stages.map((stage) => (
            <div key={stage.key} className="kanban-column" role="group" aria-label={`${stage.key} stage`}>
              <div className="kanban-column-header">
                <div
                  className="column-indicator"
                  style={{ backgroundColor: stage.color }}
                  aria-hidden="true"
                ></div>
                <span className="column-title">{stage.key}</span>
                <span className="column-count" aria-label={`${leadsByStage[stage.key]?.length || 0} leads`}>
                  {leadsByStage[stage.key]?.length || 0}
                </span>
              </div>
              <div className="kanban-cards">
                {leadsByStage[stage.key]?.map((lead) => (
                  <div
                    key={lead.id}
                    className="kanban-card"
                    onClick={() => handleOpenLead(lead)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleOpenLead(lead)}
                    role="button"
                    aria-label={`${lead.name} at ${lead.company}, score ${lead.score}`}
                  >
                    <div className="kanban-card-header">
                      <div className="lead-avatar-small" aria-hidden="true">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="kanban-card-info">
                        <span className="kanban-name">{lead.name}</span>
                        <span className="kanban-company">{lead.company}</span>
                      </div>
                    </div>
                    <div className="kanban-card-footer">
                      <div className="platform-icons-small" aria-hidden="true">
                        {lead.platforms.includes('linkedin') && (
                          <Linkedin size={12} />
                        )}
                        {lead.platforms.includes('x') && <Twitter size={12} />}
                        {lead.platforms.includes('email') && <Mail size={12} />}
                      </div>
                      <span className="kanban-score">{lead.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Pipeline;
