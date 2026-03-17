import React from 'react';
import './AgentCard.css';

function AgentCard({ name, status, task, tasksToday, icon: Icon }) {
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'green';
      case 'paused':
        return 'amber';
      case 'idle':
      default:
        return 'gray';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'paused':
        return 'Paused';
      case 'idle':
      default:
        return 'Idle';
    }
  };

  return (
    <div className="agent-card">
      <div className="agent-info">
        <div className={`agent-status-dot ${getStatusColor()}`}></div>
        <div className="agent-details">
          <div className="agent-name-row">
            {Icon && <Icon size={16} className="agent-icon" />}
            <span className="agent-name">{name}</span>
            <span className={`agent-status-badge ${getStatusColor()}`}>
              {getStatusLabel()}
            </span>
          </div>
          <p className="agent-task">{task}</p>
        </div>
      </div>
      <div className="agent-tasks">
        <span className="tasks-count">{tasksToday}</span>
        <span className="tasks-label">tasks today</span>
      </div>
    </div>
  );
}

export default AgentCard;
