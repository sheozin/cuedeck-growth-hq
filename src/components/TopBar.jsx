import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Play, User, Settings, LogOut, HelpCircle, Check, X } from 'lucide-react';
import useStore from '../store/useStore';
import './TopBar.css';

const pageTitles = {
  '/': 'Dashboard',
  '/pipeline': 'Pipeline',
  '/content': 'Content Studio',
  '/linkedin': 'LinkedIn Agent',
  '/x': 'X Agent',
  '/email': 'Email Agent',
  '/settings': 'Settings',
  '/guide': 'Guide',
};

const initialNotifications = [
  { id: 1, type: 'hot_lead', message: 'New hot lead: Sarah Chen from TechCorp', time: '5 min ago', read: false, link: '/pipeline' },
  { id: 2, type: 'reply', message: 'Reply received from Michael Brown', time: '1 hour ago', read: false, link: '/email' },
  { id: 3, type: 'agent', message: 'LinkedIn Agent completed 20 connections', time: '2 hours ago', read: true, link: '/linkedin' },
];

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentStatuses, updateAgentStatus } = useStore();
  const title = pageTitles[location.pathname] || 'Dashboard';

  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRunAll = useCallback(() => {
    Object.keys(agentStatuses).forEach((agent) => {
      updateAgentStatus(agent, { status: 'running' });
    });
  }, [agentStatuses, updateAgentStatus]);

  const handleNotificationClick = useCallback(() => {
    setShowNotifications(prev => !prev);
    setShowProfile(false);
  }, []);

  const handleProfileClick = useCallback(() => {
    setShowProfile(prev => !prev);
    setShowNotifications(false);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const handleNotificationNavigate = useCallback((notification) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    if (notification.link) {
      navigate(notification.link);
    }
  }, [markAsRead, navigate]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleProfileAction = useCallback((action) => {
    setShowProfile(false);
    switch (action) {
      case 'settings':
        navigate('/settings');
        break;
      case 'guide':
        navigate('/guide');
        break;
      case 'logout':
        // In a real app, this would handle logout
        alert('Logout functionality would be implemented with authentication');
        break;
      default:
        break;
    }
  }, [navigate]);

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-actions">
        <button className="run-all-btn" onClick={handleRunAll} aria-label="Run all agents">
          <Play size={16} aria-hidden="true" />
          Run All Agents
        </button>

        {/* Notification Dropdown */}
        <div className="dropdown-container" ref={notificationRef}>
          <button
            className={`notification-btn ${showNotifications ? 'active' : ''}`}
            onClick={handleNotificationClick}
            aria-label={`Notifications. ${unreadCount} unread`}
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Bell size={20} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="notification-badge" aria-hidden="true">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-panel notification-panel" role="menu">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={markAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="empty-state">No notifications</div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      role="menuitem"
                    >
                      <div
                        className="notification-content"
                        onClick={() => handleNotificationNavigate(notification)}
                      >
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      <div className="notification-actions">
                        {!notification.read && (
                          <button
                            className="notification-action-btn"
                            onClick={() => markAsRead(notification.id)}
                            aria-label="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          className="notification-action-btn dismiss"
                          onClick={() => dismissNotification(notification.id)}
                          aria-label="Dismiss notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown-container" ref={profileRef}>
          <button
            className={`user-avatar ${showProfile ? 'active' : ''}`}
            onClick={handleProfileClick}
            aria-label="User menu"
            aria-expanded={showProfile}
            aria-haspopup="true"
          >
            <User size={20} aria-hidden="true" />
          </button>

          {showProfile && (
            <div className="dropdown-panel profile-panel" role="menu">
              <div className="profile-header">
                <div className="profile-avatar">
                  <User size={24} />
                </div>
                <div className="profile-info">
                  <span className="profile-name">Admin User</span>
                  <span className="profile-email">admin@cuedeck.com</span>
                </div>
              </div>
              <div className="profile-menu">
                <button
                  className="profile-menu-item"
                  onClick={() => handleProfileAction('settings')}
                  role="menuitem"
                >
                  <Settings size={16} aria-hidden="true" />
                  Settings
                </button>
                <button
                  className="profile-menu-item"
                  onClick={() => handleProfileAction('guide')}
                  role="menuitem"
                >
                  <HelpCircle size={16} aria-hidden="true" />
                  Help & Guide
                </button>
                <div className="menu-divider"></div>
                <button
                  className="profile-menu-item logout"
                  onClick={() => handleProfileAction('logout')}
                  role="menuitem"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
