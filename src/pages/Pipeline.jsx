import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';
import useStore from '../store/useStore';
import './Pipeline.css';

const stages = [
  { key: 'Discovered', color: '#9ca3af' },
  { key: 'Warming', color: '#3b82f6' },
  { key: 'Connected', color: '#22c55e' },
  { key: 'In Sequence', color: '#f59e0b' },
  { key: 'Replied', color: '#14b8a6' },
  { key: 'Demo Booked', color: '#8b5cf6' },
];

function Pipeline() {
  const { leads, openLeadDrawer } = useStore();
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStageColor = (stage) => {
    const stageObj = stages.find((s) => s.key === stage);
    return stageObj?.color || '#9ca3af';
  };

  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.key] = filteredLeads.filter((lead) => lead.stage === stage.key);
    return acc;
  }, {});

  return (
    <div className="pipeline">
      <div className="pipeline-header">
        <div className="pipeline-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-select">
            <Filter size={16} />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="all">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.key}
                </option>
              ))}
            </select>
          </div>

          <button className="add-lead-btn">
            <Plus size={18} />
            Add Lead
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            <List size={18} />
          </button>
          <button
            className={viewMode === 'kanban' ? 'active' : ''}
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="pipeline-table-wrapper">
          <table className="pipeline-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Company</th>
                <th>Stage</th>
                <th>Platforms</th>
                <th>Last Touch</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => openLeadDrawer(lead)}
                  className="clickable-row"
                >
                  <td>
                    <div className="lead-name-cell">
                      <div className="lead-avatar">
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
                    <div className="platform-icons">
                      {lead.platforms.includes('linkedin') && (
                        <Linkedin size={16} />
                      )}
                      {lead.platforms.includes('x') && <Twitter size={16} />}
                      {lead.platforms.includes('email') && <Mail size={16} />}
                    </div>
                  </td>
                  <td>{formatDate(lead.lastTouch)}</td>
                  <td>
                    <div className="score-cell">
                      <span className="score-value">{lead.score}</span>
                      <div className="score-bar">
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
        <div className="kanban-board">
          {stages.map((stage) => (
            <div key={stage.key} className="kanban-column">
              <div className="kanban-column-header">
                <div
                  className="column-indicator"
                  style={{ backgroundColor: stage.color }}
                ></div>
                <span className="column-title">{stage.key}</span>
                <span className="column-count">
                  {leadsByStage[stage.key]?.length || 0}
                </span>
              </div>
              <div className="kanban-cards">
                {leadsByStage[stage.key]?.map((lead) => (
                  <div
                    key={lead.id}
                    className="kanban-card"
                    onClick={() => openLeadDrawer(lead)}
                  >
                    <div className="kanban-card-header">
                      <div className="lead-avatar-small">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="kanban-card-info">
                        <span className="kanban-name">{lead.name}</span>
                        <span className="kanban-company">{lead.company}</span>
                      </div>
                    </div>
                    <div className="kanban-card-footer">
                      <div className="platform-icons-small">
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
