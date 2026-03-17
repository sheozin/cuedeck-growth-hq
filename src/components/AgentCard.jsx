import React from 'react';
import { getStatusColor, getStatusLabel } from '../utils/styles';
import './AgentCard.css';

function AgentCard({ name, status, task, tasksToday, icon: Icon }) {
  const statusColorClass = status === 'running' ? 'green' : status === 'paused' ? 'amber' : 'gray';

  return (
    <div className="agent-card" role="listitem">
      <div className="agent-info">
        <div
          className={`agent-status-dot ${statusColorClass}`}
          aria-hidden="true"
        ></div>
        <div className="agent-details">
          <div className="agent-name-row">
            {Icon && <Icon size={16} className="agent-icon" aria-hidden="true" />}
            <span className="agent-name">{name}</span>
            <span
              className={`agent-status-badge ${statusColorClass}`}
              role="status"
              aria-label={`Status: ${getStatusLabel(status)}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>
          <p className="agent-task">{task}</p>
        </div>
      </div>
      <div className="agent-tasks" aria-label={`${tasksToday} tasks completed today`}>
        <span className="tasks-count">{tasksToday}</span>
        <span className="tasks-label">tasks today</span>
      </div>
    </div>
  );
}

export default React.memo(AgentCard);
