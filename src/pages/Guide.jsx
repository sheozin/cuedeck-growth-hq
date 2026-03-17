import React, { useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Users,
  PenTool,
  Linkedin,
  Twitter,
  Mail,
  Settings,
  ChevronRight,
  Zap,
  Target,
  MessageSquare,
  Shield,
  Workflow
} from 'lucide-react';
import './Guide.css';

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    icon: BookOpen,
    content: {
      description: 'CueDeck Growth HQ is your marketing automation command center. It helps you manage outreach across LinkedIn, X (Twitter), and Email from a single dashboard.',
      features: [
        'Monitor all agent activity in real-time',
        'Generate AI-powered content for multiple platforms',
        'Manage your lead pipeline from first contact to closed deal',
        'Configure automated outreach with safety limits',
        'Track engagement metrics and conversion rates'
      ]
    }
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    content: {
      description: 'The Dashboard gives you a bird\'s-eye view of all your marketing automation activities.',
      subsections: [
        {
          title: 'Agent Status Cards',
          text: 'Each card shows an agent\'s current status (Running/Paused), what task it\'s working on, and how many tasks completed today. Click any agent card to go to its configuration page.'
        },
        {
          title: 'Stats Overview',
          text: 'Quick metrics showing leads generated, emails sent, LinkedIn connections, and content pieces created this week.'
        },
        {
          title: 'Activity Feed',
          text: 'Real-time log of all agent actions. Filter by agent type or action type. Click any activity to see details.'
        },
        {
          title: 'Pipeline Preview',
          text: 'Shows leads in each stage. Click "View Pipeline" to see the full CRM view.'
        }
      ]
    }
  },
  {
    id: 'pipeline',
    title: 'Pipeline (CRM)',
    icon: Users,
    content: {
      description: 'Manage your leads through the sales funnel with a visual pipeline view.',
      subsections: [
        {
          title: 'Lead Stages',
          text: 'Leads move through 5 stages: New Lead → Contacted → Qualified → Proposal Sent → Closed Won/Lost. Drag and drop to move leads between stages.'
        },
        {
          title: 'Lead Details',
          text: 'Click any lead to open the detail drawer. View contact info, company details, engagement history, and add notes.'
        },
        {
          title: 'Filters & Search',
          text: 'Filter by stage, source, or date. Use the search bar to find specific leads by name or company.'
        },
        {
          title: 'Actions',
          text: 'From the lead drawer, you can: Send email, View LinkedIn profile, Add to sequence, Update stage, Add notes.'
        }
      ],
      tips: [
        'Add notes after every interaction to track conversation history',
        'Use tags to categorize leads by industry or event size',
        'Set follow-up reminders to never miss a touchpoint'
      ]
    }
  },
  {
    id: 'content-studio',
    title: 'Content Studio',
    icon: PenTool,
    content: {
      description: 'Create AI-powered content for LinkedIn, X, and Email campaigns.',
      subsections: [
        {
          title: 'Generator Tab',
          text: 'Select a platform, define your ICP target, enter a topic/angle, and choose a tone. Click Generate to create content using Claude AI.'
        },
        {
          title: 'How to Generate Content',
          steps: [
            'Select Platform: LinkedIn Post, X Thread, Email Subject, LinkedIn Comment, or LinkedIn DM',
            'Define ICP Target: Describe who you\'re writing for (e.g., "Conference organizer, 500-person events, Poland")',
            'Enter Topic: What angle or message? (e.g., "How we cut interpreter costs by 40%")',
            'Choose Tone: Professional, Conversational, Bold, or Storytelling',
            'Click Generate and wait for AI to create your content'
          ]
        },
        {
          title: 'After Generation',
          text: 'You can: Copy to clipboard, Edit the content, Add to Queue for scheduling, or Regenerate for a different version.'
        },
        {
          title: 'Calendar Tab',
          text: 'See your scheduled content for the week. Each day shows posts with platform icon and scheduled time.'
        },
        {
          title: 'Queue Tab',
          text: 'Manage all pending content. Edit, reschedule, or publish immediately. Delete items you no longer need.'
        }
      ],
      tips: [
        'Be specific in your ICP target for better personalization',
        'Generate multiple versions and pick the best one',
        'Schedule posts at optimal times for your audience timezone'
      ]
    }
  },
  {
    id: 'linkedin-agent',
    title: 'LinkedIn Agent',
    icon: Linkedin,
    content: {
      description: 'Automate LinkedIn outreach while staying within platform limits.',
      subsections: [
        {
          title: 'Configuration Panel',
          settings: [
            { name: 'Daily Connect Limit', desc: 'Max connection requests per day (recommended: 20-30 to avoid restrictions)' },
            { name: 'Daily Message Limit', desc: 'Max direct messages per day' },
            { name: 'Connection Template', desc: 'Default message for connection requests. Use {firstName}, {company}, {title} as variables' },
            { name: 'Target Job Titles', desc: 'Comma-separated list of titles to target' },
            { name: 'Target Industries', desc: 'Check industries to focus on' },
            { name: 'Target Regions', desc: 'Geographic areas to prioritize' }
          ]
        },
        {
          title: 'Action Queue',
          text: 'Shows upcoming automated actions: Connect, View Profile, Comment on Post, Follow. Review before they execute.'
        },
        {
          title: 'Action Log',
          text: 'History of completed actions with results (Accepted, Pending, Viewed, etc.).'
        }
      ],
      tips: [
        'Start with lower limits and increase gradually',
        'Personalize connection templates for better acceptance rates',
        'Focus on 2nd-degree connections for higher acceptance'
      ]
    }
  },
  {
    id: 'x-agent',
    title: 'X (Twitter) Agent',
    icon: Twitter,
    content: {
      description: 'Grow your X presence through strategic engagement.',
      subsections: [
        {
          title: 'Configuration',
          settings: [
            { name: 'Daily Follow Limit', desc: 'Max accounts to follow per day' },
            { name: 'Reply Tone', desc: 'Supportive, Insightful, or Witty - sets the AI tone for auto-generated replies' },
            { name: 'Hashtags to Monitor', desc: 'Hashtags to track for engagement opportunities' },
            { name: 'Keywords to Track', desc: 'Topics to search for relevant conversations' },
            { name: 'Accounts to Engage', desc: 'Specific accounts to prioritize for engagement' }
          ]
        },
        {
          title: 'Engagement Queue',
          text: 'Shows suggested engagements: Like, Reply, Retweet. Each shows the original tweet and suggested action. Approve or Skip each one.'
        },
        {
          title: 'Scheduled Posts',
          text: 'Your upcoming scheduled tweets/threads. Edit or delete before they post.'
        },
        {
          title: 'Rate Limit Status',
          text: 'Monitor API usage to avoid hitting X\'s rate limits. Shows current usage vs. max for Follows, Likes, Replies, and API calls.'
        }
      ],
      tips: [
        'Engage authentically - don\'t just like, add thoughtful replies',
        'Monitor rate limits to avoid account restrictions',
        'Focus on hashtags where your ICP is active'
      ]
    }
  },
  {
    id: 'email-agent',
    title: 'Email Agent',
    icon: Mail,
    content: {
      description: 'Manage cold email sequences with deliverability monitoring.',
      subsections: [
        {
          title: 'Stats Overview',
          text: 'Key metrics: Emails Sent Today, Open Rate (7-day), Reply Rate (7-day), Bounced Today.'
        },
        {
          title: 'Domain Warmup Status',
          text: 'Each sending domain shows: Warmup Score (0-100), Daily Limit, Status (Warming/Ready/Paused). Keep warmup score above 70 before heavy sending.'
        },
        {
          title: 'Active Sequences',
          text: 'Your email sequences with stats per step. Click to expand and see: Subject lines, Sent/Opened/Replied counts per step, Current step indicator.'
        },
        {
          title: 'Sequence Controls',
          text: 'Pause/Resume sequences as needed. View all contacts in a sequence.'
        },
        {
          title: 'Active Contacts',
          text: 'Table showing all contacts currently in sequences: Name, Company, Sequence, Current Step, Last Sent, Status (Sent/Opened/Replied/Bounced).'
        }
      ],
      tips: [
        'Wait for warmup score > 70 before scaling volume',
        'Keep sequences to 3-4 steps for best results',
        'Remove bounced contacts immediately',
        'A/B test subject lines for better open rates'
      ]
    }
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    content: {
      description: 'Configure integrations, ICP profile, brand voice, and notifications.',
      subsections: [
        {
          title: 'Integrations',
          text: 'Connect your external services:',
          settings: [
            { name: 'Claude API', desc: 'Powers content generation (required for Content Studio)' },
            { name: 'PhantomBuster', desc: 'LinkedIn automation' },
            { name: 'Instantly.ai', desc: 'Email sequences and warmup' },
            { name: 'Apollo.io', desc: 'Lead enrichment' },
            { name: 'Airtable', desc: 'Database sync' },
            { name: 'n8n', desc: 'Workflow automation' }
          ]
        },
        {
          title: 'ICP Profile',
          text: 'Define your Ideal Customer Profile: Job titles, Industries, Company sizes, Regions, Annual events. This is used by AI for content personalization.'
        },
        {
          title: 'Brand Voice',
          text: 'Set your company name, tagline, value propositions, tone adjectives, and words to avoid. The AI uses this for consistent messaging.'
        },
        {
          title: 'Notifications',
          text: 'Choose what alerts you receive: Hot lead flagged, Reply received, Agent error, Daily summary, LinkedIn accepted.'
        }
      ],
      tips: [
        'API keys are stored securely and never saved to browser storage',
        'Keep your ICP profile updated as your target market evolves',
        'Use Brand Voice to maintain consistent messaging across all content'
      ]
    }
  },
  {
    id: 'workflows',
    title: 'Typical Workflows',
    icon: Workflow,
    content: {
      description: 'Common tasks and how to accomplish them.',
      workflows: [
        {
          title: 'Generate and Schedule a LinkedIn Post',
          steps: [
            'Go to Content Studio → Generator tab',
            'Select "LinkedIn Post" as platform',
            'Enter your ICP target and topic',
            'Choose tone and click Generate',
            'Review the content, edit if needed',
            'Click "Add to Queue"',
            'Go to Queue tab to set the scheduled time'
          ]
        },
        {
          title: 'Set Up LinkedIn Outreach',
          steps: [
            'Go to LinkedIn Agent',
            'Set your daily connect limit (start with 15-20)',
            'Write a connection template with personalization variables',
            'Select target job titles and industries',
            'Click Save Config',
            'Monitor the Action Queue and approve/skip suggestions'
          ]
        },
        {
          title: 'Monitor Email Campaign Performance',
          steps: [
            'Go to Email Agent',
            'Check domain warmup scores (should be >70)',
            'Review sequence stats for open/reply rates',
            'Click on a sequence to see per-step performance',
            'Check Active Contacts for individual status',
            'Pause sequences with poor performance'
          ]
        },
        {
          title: 'Manage a Lead Through Pipeline',
          steps: [
            'Go to Pipeline',
            'Find your lead (use search or filters)',
            'Click to open lead details',
            'Add notes after each interaction',
            'Update stage when lead progresses',
            'Add to appropriate email sequence if needed'
          ]
        }
      ]
    }
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    content: {
      description: 'How your data is protected.',
      subsections: [
        {
          title: 'API Key Security',
          text: 'API keys are stored only in Vercel environment variables on the server. They are never exposed to the browser or saved in localStorage.'
        },
        {
          title: 'Content Generation',
          text: 'When you generate content, the request goes to our server-side proxy (/api/generate) which adds the API key securely before calling Claude. Your browser never sees the API key.'
        },
        {
          title: 'Local Storage',
          text: 'Only non-sensitive preferences are saved locally: UI settings, ICP profile, brand voice. No API keys, passwords, or tokens.'
        },
        {
          title: 'Security Headers',
          text: 'The app includes security headers: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.'
        }
      ]
    }
  }
];

function Guide() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = (section) => {
    const { content } = section;

    return (
      <div className="guide-content">
        <h2 className="content-title">
          <section.icon size={24} />
          {section.title}
        </h2>

        <p className="content-description">{content.description}</p>

        {content.features && (
          <div className="features-list">
            <h3>Key Features</h3>
            <ul>
              {content.features.map((feature, i) => (
                <li key={i}>
                  <Zap size={14} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.subsections && (
          <div className="subsections">
            {content.subsections.map((sub, i) => (
              <div key={i} className="subsection">
                <h3>{sub.title}</h3>
                {sub.text && <p>{sub.text}</p>}
                {sub.steps && (
                  <ol className="steps-list">
                    {sub.steps.map((step, j) => (
                      <li key={j}>{step}</li>
                    ))}
                  </ol>
                )}
                {sub.settings && (
                  <div className="settings-list">
                    {sub.settings.map((setting, j) => (
                      <div key={j} className="setting-item">
                        <strong>{setting.name}:</strong> {setting.desc}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {content.workflows && (
          <div className="workflows">
            {content.workflows.map((workflow, i) => (
              <div key={i} className="workflow-card">
                <h3>
                  <Target size={16} />
                  {workflow.title}
                </h3>
                <ol className="workflow-steps">
                  {workflow.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {content.tips && (
          <div className="tips-section">
            <h3>
              <MessageSquare size={16} />
              Tips
            </h3>
            <ul>
              {content.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const activeData = sections.find(s => s.id === activeSection);

  return (
    <div className="guide-page">
      <div className="guide-header">
        <BookOpen size={28} />
        <div>
          <h1>User Guide</h1>
          <p>Learn how to use CueDeck Growth HQ</p>
        </div>
      </div>

      <div className="guide-layout">
        <nav className="guide-nav" aria-label="Guide sections">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon size={18} />
              <span>{section.title}</span>
              <ChevronRight size={16} className="chevron" />
            </button>
          ))}
        </nav>

        <main className="guide-main">
          {activeData && renderContent(activeData)}
        </main>
      </div>
    </div>
  );
}

export default Guide;
