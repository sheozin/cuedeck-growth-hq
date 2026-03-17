/**
 * Shared style utilities for consistent colors and badges
 */

export const stageColors = {
  'Discovered': '#9ca3af',
  'Warming': '#3b82f6',
  'Connected': '#22c55e',
  'In Sequence': '#f59e0b',
  'Replied': '#14b8a6',
  'Demo Booked': '#8b5cf6',
  'Archived': '#6b7280',
};

export const getStageColor = (stage) => {
  return stageColors[stage] || '#9ca3af';
};

export const getStatusColor = (status) => {
  const colors = {
    'running': '#22c55e',
    'paused': '#f59e0b',
    'idle': '#9ca3af',
    'Active': '#22c55e',
    'Replied': '#8b5cf6',
    'Bounced': '#ef4444',
    'Unsubscribed': '#9ca3af',
    'Accepted': '#22c55e',
    'Sent': '#4A8EFF',
    'Viewed': '#4A8EFF',
    'Posted': '#4A8EFF',
    'Ignored': '#9ca3af',
    'Error': '#ef4444',
  };
  return colors[status] || '#64748b';
};

export const getStatusLabel = (status) => {
  const labels = {
    'running': 'Running',
    'paused': 'Paused',
    'idle': 'Idle',
  };
  return labels[status] || status;
};
