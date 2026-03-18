import React, { useState, useMemo, useCallback } from 'react';
import {
  Users,
  Trophy,
  Gift,
  Copy,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Zap,
  Star,
  MessageSquare,
  Heart,
  CheckCircle,
  ExternalLink,
  Twitter,
  Linkedin
} from 'lucide-react';
import './Community.css';

const leaderboardData = [
  { rank: 1, name: 'Sarah Martinez', company: 'TechFlow', score: 12450, leads: 342, avatar: 'SM', change: 2 },
  { rank: 2, name: 'James Wilson', company: 'GrowthLabs', score: 11280, leads: 298, avatar: 'JW', change: -1 },
  { rank: 3, name: 'Emily Chen', company: 'ScaleUp Inc', score: 10890, leads: 287, avatar: 'EC', change: 1 },
  { rank: 4, name: 'Michael Brown', company: 'Innovate Co', score: 9760, leads: 254, avatar: 'MB', change: 0 },
  { rank: 5, name: 'Lisa Thompson', company: 'Digital Edge', score: 9340, leads: 241, avatar: 'LT', change: 3 },
  { rank: 6, name: 'David Kim', company: 'NextGen', score: 8920, leads: 228, avatar: 'DK', change: -2 },
  { rank: 7, name: 'Amanda White', company: 'Pulse Media', score: 8540, leads: 219, avatar: 'AW', change: 1 },
  { rank: 8, name: 'Robert Garcia', company: 'Momentum', score: 8210, leads: 205, avatar: 'RG', change: 0 },
  { rank: 9, name: 'Jennifer Lee', company: 'Apex Growth', score: 7890, leads: 198, avatar: 'JL', change: -1 },
  { rank: 10, name: 'Chris Anderson', company: 'Elevate', score: 7650, leads: 192, avatar: 'CA', change: 2 },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Martinez',
    title: 'Growth Lead',
    company: 'TechFlow',
    avatar: 'SM',
    content: 'CueDeck transformed our outreach. We went from 50 leads/month to 300+ in just 8 weeks. The AI content generator alone saved us 20 hours weekly.',
    rating: 5,
    metrics: { leads: '+500%', time: '-20h/week', conversion: '+180%' }
  },
  {
    id: 2,
    name: 'James Wilson',
    title: 'CEO',
    company: 'GrowthLabs',
    avatar: 'JW',
    content: 'Finally, a tool that actually delivers on its promises. The LinkedIn automation is seamless, and the lead scoring helps us focus on high-value prospects.',
    rating: 5,
    metrics: { leads: '+340%', time: '-15h/week', conversion: '+95%' }
  },
  {
    id: 3,
    name: 'Emily Chen',
    title: 'Marketing Director',
    company: 'ScaleUp Inc',
    avatar: 'EC',
    content: 'We tried 5 different tools before CueDeck. Nothing comes close. The multi-channel approach and unified pipeline view is exactly what we needed.',
    rating: 5,
    metrics: { leads: '+280%', time: '-12h/week', conversion: '+120%' }
  }
];

const referralTiers = [
  { referrals: 1, reward: '1 Month Free', icon: Gift, color: '#22c55e' },
  { referrals: 3, reward: 'Premium Features', icon: Zap, color: '#4A8EFF' },
  { referrals: 5, reward: '3 Months Free', icon: Star, color: '#8b5cf6' },
  { referrals: 10, reward: 'Lifetime Deal', icon: Crown, color: '#f59e0b' },
];

function Community() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [referralCode] = useState('CUEDECK-USER123');
  const [referralsCopied, setReferralsCopied] = useState(false);
  const [currentReferrals] = useState(2);

  const referralLink = useMemo(() => {
    return `https://cuedeck.com/join?ref=${referralCode}`;
  }, [referralCode]);

  const handleCopyReferral = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setReferralsCopied(true);
    setTimeout(() => setReferralsCopied(false), 2000);
  }, [referralLink]);

  const handleShareTwitter = useCallback(() => {
    const text = encodeURIComponent("I've been using CueDeck to supercharge my lead generation and it's been amazing! Join me and get started: ");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, '_blank');
  }, [referralLink]);

  const handleShareLinkedIn = useCallback(() => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank');
  }, [referralLink]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={18} className="gold" />;
    if (rank === 2) return <Medal size={18} className="silver" />;
    if (rank === 3) return <Award size={18} className="bronze" />;
    return <span className="rank-number">{rank}</span>;
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="header-content">
          <h2>Community Hub</h2>
          <p>Connect, compete, and grow with other CueDeck users</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <Users size={18} />
            <span>5,234 Members</span>
          </div>
          <div className="stat-badge">
            <TrendingUp size={18} />
            <span>+127 This Week</span>
          </div>
        </div>
      </div>

      <div className="community-tabs">
        <button
          className={activeTab === 'leaderboard' ? 'active' : ''}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={18} />
          Leaderboard
        </button>
        <button
          className={activeTab === 'referral' ? 'active' : ''}
          onClick={() => setActiveTab('referral')}
        >
          <Gift size={18} />
          Referral Program
        </button>
        <button
          className={activeTab === 'testimonials' ? 'active' : ''}
          onClick={() => setActiveTab('testimonials')}
        >
          <MessageSquare size={18} />
          Success Stories
        </button>
      </div>

      {activeTab === 'leaderboard' && (
        <div className="leaderboard-section">
          <div className="leaderboard-header">
            <h3>Top Performers This Month</h3>
            <p>Based on leads generated and engagement score</p>
          </div>

          <div className="top-three">
            {leaderboardData.slice(0, 3).map((user, index) => (
              <div key={user.rank} className={`top-card position-${index + 1}`}>
                <div className="top-avatar">
                  <span>{user.avatar}</span>
                  {getRankIcon(user.rank)}
                </div>
                <h4>{user.name}</h4>
                <p className="company">{user.company}</p>
                <div className="top-stats">
                  <div className="top-stat">
                    <span className="value">{user.score.toLocaleString()}</span>
                    <span className="label">Score</span>
                  </div>
                  <div className="top-stat">
                    <span className="value">{user.leads}</span>
                    <span className="label">Leads</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                  <th>Leads</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.slice(3).map(user => (
                  <tr key={user.rank}>
                    <td>
                      <span className="table-rank">{user.rank}</span>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{user.avatar}</div>
                        <div>
                          <span className="user-name">{user.name}</span>
                          <span className="user-company">{user.company}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.score.toLocaleString()}</td>
                    <td>{user.leads}</td>
                    <td>
                      <span className={`change ${user.change > 0 ? 'up' : user.change < 0 ? 'down' : ''}`}>
                        {user.change > 0 ? `+${user.change}` : user.change === 0 ? '-' : user.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="your-rank">
            <div className="your-rank-content">
              <span className="rank-label">Your Current Rank</span>
              <span className="rank-value">#47</span>
            </div>
            <div className="rank-progress">
              <span>2,340 points to next rank</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'referral' && (
        <div className="referral-section">
          <div className="referral-hero">
            <div className="referral-icon">
              <Gift size={48} />
            </div>
            <h3>Invite Friends, Earn Rewards</h3>
            <p>Share CueDeck with your network and unlock exclusive benefits</p>
          </div>

          <div className="referral-code-box">
            <label>Your Referral Link</label>
            <div className="code-input">
              <input type="text" value={referralLink} readOnly />
              <button onClick={handleCopyReferral} className={referralsCopied ? 'copied' : ''}>
                {referralsCopied ? <CheckCircle size={18} /> : <Copy size={18} />}
                {referralsCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="share-buttons">
              <button className="share-btn twitter" onClick={handleShareTwitter}>
                <Twitter size={18} />
                Share on X
              </button>
              <button className="share-btn linkedin" onClick={handleShareLinkedIn}>
                <Linkedin size={18} />
                Share on LinkedIn
              </button>
            </div>
          </div>

          <div className="referral-progress">
            <div className="progress-header">
              <span>Your Progress</span>
              <span className="referral-count">{currentReferrals} Referrals</span>
            </div>
            <div className="tiers-track">
              {referralTiers.map((tier) => (
                <div
                  key={tier.referrals}
                  className={`tier ${currentReferrals >= tier.referrals ? 'unlocked' : ''}`}
                >
                  <div
                    className="tier-icon"
                    style={{
                      backgroundColor: currentReferrals >= tier.referrals ? `${tier.color}20` : '#f1f5f9',
                      color: currentReferrals >= tier.referrals ? tier.color : '#94a3b8'
                    }}
                  >
                    <tier.icon size={20} />
                  </div>
                  <span className="tier-referrals">{tier.referrals} referral{tier.referrals > 1 ? 's' : ''}</span>
                  <span className="tier-reward">{tier.reward}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="referral-stats">
            <div className="stat-card">
              <span className="stat-value">2</span>
              <span className="stat-label">Total Referrals</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">$50</span>
              <span className="stat-label">Credits Earned</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">1</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="testimonials-section">
          <div className="testimonials-header">
            <h3>Success Stories</h3>
            <p>See how CueDeck users are crushing their growth goals</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="author-info">
                    <div className="author-avatar">{testimonial.avatar}</div>
                    <div>
                      <span className="author-name">{testimonial.name}</span>
                      <span className="author-title">{testimonial.title} at {testimonial.company}</span>
                    </div>
                  </div>
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-metrics">
                  <div className="metric">
                    <span className="metric-value">{testimonial.metrics.leads}</span>
                    <span className="metric-label">Leads</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{testimonial.metrics.time}</span>
                    <span className="metric-label">Time Saved</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{testimonial.metrics.conversion}</span>
                    <span className="metric-label">Conversion</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="share-story">
            <Heart size={24} />
            <div>
              <h4>Have a success story?</h4>
              <p>Share your CueDeck journey with the community</p>
            </div>
            <button className="share-story-btn">
              Share Your Story
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="community-cta">
        <div className="cta-content">
          <h3>Join the CueDeck Community</h3>
          <p>Connect with growth experts, share strategies, and level up together</p>
        </div>
        <div className="cta-buttons">
          <button className="cta-btn discord">
            Join Discord
          </button>
          <button className="cta-btn slack">
            Join Slack
          </button>
        </div>
      </div>
    </div>
  );
}

export default Community;
