import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Mail,
  Linkedin,
  Twitter,
  Target,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Share2
} from 'lucide-react';
import useStore from '../store/useStore';
import './Analytics.css';

const timeRanges = ['7 days', '30 days', '90 days', 'All time'];

function Analytics() {
  const leads = useStore((state) => state.leads);
  const contentQueue = useStore((state) => state.contentQueue);
  const [timeRange, setTimeRange] = useState('30 days');

  const metrics = useMemo(() => ({
    totalLeads: leads.length,
    leadGrowth: 23.5,
    hotLeads: leads.filter(l => l.isHot).length,
    convertedLeads: leads.filter(l => l.stage === 'Closed Won').length,
    conversionRate: 12.4,
    avgLeadScore: Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length) || 0,
    contentCreated: contentQueue.length + 47,
    engagementRate: 4.8,
    replyRate: 8.2,
    emailsDelivered: 1247,
    linkedinConnections: 342,
    xFollowers: 128
  }), [leads, contentQueue]);

  const roiMetrics = useMemo(() => ({
    estimatedRevenue: '$24,500',
    costSaved: '$12,300',
    hoursAutomated: 156,
    roi: '340%'
  }), []);

  const channelPerformance = useMemo(() => [
    { channel: 'LinkedIn', leads: 156, conversion: 15.2, color: '#0A66C2', icon: Linkedin },
    { channel: 'X/Twitter', leads: 89, conversion: 8.7, color: '#1DA1F2', icon: Twitter },
    { channel: 'Email', leads: 203, conversion: 12.1, color: '#22c55e', icon: Mail },
  ], []);

  const weeklyData = useMemo(() => [
    { day: 'Mon', leads: 12, content: 5, engagement: 45 },
    { day: 'Tue', leads: 18, content: 8, engagement: 62 },
    { day: 'Wed', leads: 15, content: 6, engagement: 58 },
    { day: 'Thu', leads: 22, content: 10, engagement: 78 },
    { day: 'Fri', leads: 28, content: 12, engagement: 92 },
    { day: 'Sat', leads: 8, content: 3, engagement: 25 },
    { day: 'Sun', leads: 5, content: 2, engagement: 18 },
  ], []);

  const maxLeads = Math.max(...weeklyData.map(d => d.leads));

  const handleExport = () => {
    const data = {
      metrics,
      roiMetrics,
      channelPerformance,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuedeck-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareText = `My CueDeck Growth Stats:\n📊 ${metrics.totalLeads} leads generated\n🔥 ${metrics.hotLeads} hot leads\n💰 ${roiMetrics.estimatedRevenue} estimated revenue\n🚀 ${roiMetrics.roi} ROI\n\nPowered by CueDeck Growth HQ`;
    if (navigator.share) {
      navigator.share({ title: 'My CueDeck Analytics', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Analytics summary copied to clipboard!');
    }
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="header-left">
          <h2>Analytics Dashboard</h2>
          <p className="header-subtitle">Track your growth metrics and ROI</p>
        </div>
        <div className="header-actions">
          <div className="time-range-selector">
            {timeRanges.map(range => (
              <button
                key={range}
                className={timeRange === range ? 'active' : ''}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="action-btn" onClick={handleExport}>
            <Download size={16} />
            Export
          </button>
          <button className="action-btn primary" onClick={handleShare}>
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* ROI Banner */}
      <div className="roi-banner">
        <div className="roi-item">
          <DollarSign size={24} />
          <div>
            <span className="roi-value">{roiMetrics.estimatedRevenue}</span>
            <span className="roi-label">Est. Revenue Generated</span>
          </div>
        </div>
        <div className="roi-item">
          <Target size={24} />
          <div>
            <span className="roi-value">{roiMetrics.costSaved}</span>
            <span className="roi-label">Cost Saved</span>
          </div>
        </div>
        <div className="roi-item">
          <Calendar size={24} />
          <div>
            <span className="roi-value">{roiMetrics.hoursAutomated}h</span>
            <span className="roi-label">Hours Automated</span>
          </div>
        </div>
        <div className="roi-item highlight">
          <TrendingUp size={24} />
          <div>
            <span className="roi-value">{roiMetrics.roi}</span>
            <span className="roi-label">Return on Investment</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <Users size={20} />
            <span className="metric-change positive">
              <ArrowUpRight size={14} />
              +{metrics.leadGrowth}%
            </span>
          </div>
          <div className="metric-value">{metrics.totalLeads}</div>
          <div className="metric-label">Total Leads</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Target size={20} />
            <span className="metric-change positive">
              <ArrowUpRight size={14} />
              +5.2%
            </span>
          </div>
          <div className="metric-value">{metrics.hotLeads}</div>
          <div className="metric-label">Hot Leads</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <BarChart3 size={20} />
            <span className="metric-change positive">
              <ArrowUpRight size={14} />
              +2.1%
            </span>
          </div>
          <div className="metric-value">{metrics.conversionRate}%</div>
          <div className="metric-label">Conversion Rate</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <TrendingUp size={20} />
            <span className="metric-change negative">
              <ArrowDownRight size={14} />
              -1.3%
            </span>
          </div>
          <div className="metric-value">{metrics.avgLeadScore}</div>
          <div className="metric-label">Avg Lead Score</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Mail size={20} />
          </div>
          <div className="metric-value">{metrics.emailsDelivered}</div>
          <div className="metric-label">Emails Delivered</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Linkedin size={20} />
          </div>
          <div className="metric-value">{metrics.linkedinConnections}</div>
          <div className="metric-label">LinkedIn Connections</div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Weekly Activity Chart */}
        <section className="chart-card">
          <h3>Weekly Activity</h3>
          <div className="bar-chart">
            {weeklyData.map(day => (
              <div key={day.day} className="bar-group">
                <div className="bar-container">
                  <div
                    className="bar leads-bar"
                    style={{ height: `${(day.leads / maxLeads) * 100}%` }}
                    title={`${day.leads} leads`}
                  />
                </div>
                <span className="bar-label">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span><span className="legend-dot leads" /> Leads Generated</span>
          </div>
        </section>

        {/* Channel Performance */}
        <section className="chart-card">
          <h3>Channel Performance</h3>
          <div className="channel-list">
            {channelPerformance.map(channel => (
              <div key={channel.channel} className="channel-item">
                <div className="channel-info">
                  <div className="channel-icon" style={{ backgroundColor: `${channel.color}20`, color: channel.color }}>
                    <channel.icon size={18} />
                  </div>
                  <div>
                    <span className="channel-name">{channel.channel}</span>
                    <span className="channel-leads">{channel.leads} leads</span>
                  </div>
                </div>
                <div className="channel-stats">
                  <div className="conversion-bar">
                    <div
                      className="conversion-fill"
                      style={{ width: `${channel.conversion * 5}%`, backgroundColor: channel.color }}
                    />
                  </div>
                  <span className="conversion-rate">{channel.conversion}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Engagement Metrics */}
        <section className="chart-card">
          <h3>Engagement Metrics</h3>
          <div className="engagement-stats">
            <div className="engagement-item">
              <div className="engagement-circle">
                <svg viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4A8EFF"
                    strokeWidth="3"
                    strokeDasharray={`${metrics.engagementRate * 10}, 100`}
                  />
                </svg>
                <span className="engagement-value">{metrics.engagementRate}%</span>
              </div>
              <span className="engagement-label">Engagement Rate</span>
            </div>
            <div className="engagement-item">
              <div className="engagement-circle">
                <svg viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeDasharray={`${metrics.replyRate * 10}, 100`}
                  />
                </svg>
                <span className="engagement-value">{metrics.replyRate}%</span>
              </div>
              <span className="engagement-label">Reply Rate</span>
            </div>
          </div>
        </section>
      </div>

      {/* Social Proof Footer */}
      <div className="social-proof-banner">
        <div className="proof-stat">
          <span className="proof-value">10,000+</span>
          <span className="proof-label">Leads generated by CueDeck users</span>
        </div>
        <div className="proof-stat">
          <span className="proof-value">500+</span>
          <span className="proof-label">Companies using CueDeck</span>
        </div>
        <div className="proof-stat">
          <span className="proof-value">98%</span>
          <span className="proof-label">Customer satisfaction</span>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
