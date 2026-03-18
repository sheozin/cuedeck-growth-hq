import React, { useState, useMemo, useCallback } from 'react';
import {
  Linkedin,
  Twitter,
  Mail,
  Copy,
  Heart,
  Download,
  Filter,
  Search,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  Megaphone,
  CheckCircle
} from 'lucide-react';
import './Templates.css';

const templateCategories = [
  { id: 'all', label: 'All Templates', icon: Filter },
  { id: 'linkedin-post', label: 'LinkedIn Posts', icon: Linkedin },
  { id: 'linkedin-dm', label: 'LinkedIn DMs', icon: Users },
  { id: 'x-thread', label: 'X Threads', icon: Twitter },
  { id: 'email', label: 'Email Sequences', icon: Mail },
  { id: 'cold-outreach', label: 'Cold Outreach', icon: Megaphone },
];

const templates = [
  {
    id: 1,
    category: 'linkedin-post',
    title: 'Thought Leadership Hook',
    description: 'Engaging opening that establishes expertise',
    platform: 'linkedin',
    uses: 2340,
    rating: 4.8,
    content: `I've spent 10 years in [INDUSTRY] and here's what nobody tells you:

The biggest lie? That you need [COMMON BELIEF].

Here's the truth...

[Your insight with specific data or example]

The companies that understand this are seeing:
→ [Benefit 1]
→ [Benefit 2]
→ [Benefit 3]

What's your experience with this? 👇`,
    tags: ['engagement', 'thought-leadership', 'viral']
  },
  {
    id: 2,
    category: 'linkedin-post',
    title: 'Problem-Solution Framework',
    description: 'Address pain points and present your solution',
    platform: 'linkedin',
    uses: 1856,
    rating: 4.7,
    content: `Your [TARGET AUDIENCE] is struggling with [PROBLEM].

I know because I've talked to 100+ of them this year.

The top 3 challenges they mention:

1. [Challenge 1]
2. [Challenge 2]
3. [Challenge 3]

Here's the framework we use to solve this:

Step 1: [Action]
Step 2: [Action]
Step 3: [Action]

Result? [Specific outcome with numbers]

Save this post for later. ♻️ Repost to help others.`,
    tags: ['solution', 'framework', 'educational']
  },
  {
    id: 3,
    category: 'linkedin-dm',
    title: 'Warm Connection Request',
    description: 'Non-salesy connection message',
    platform: 'linkedin',
    uses: 3421,
    rating: 4.9,
    content: `Hi [NAME],

I noticed your recent post about [TOPIC] - really insightful perspective on [SPECIFIC POINT].

I'm working on something similar at [COMPANY] and would love to connect and exchange ideas.

No pitch, just genuine curiosity about your approach to [RELEVANT TOPIC].

Looking forward to connecting!

[YOUR NAME]`,
    tags: ['networking', 'warm-outreach', 'connection']
  },
  {
    id: 4,
    category: 'linkedin-dm',
    title: 'Value-First Outreach',
    description: 'Lead with value before asking',
    platform: 'linkedin',
    uses: 2198,
    rating: 4.6,
    content: `Hi [NAME],

I came across your profile while researching [INDUSTRY/TOPIC].

I put together a quick resource on [RELEVANT TOPIC] that I thought might be useful for you:

[LINK or brief insight]

No strings attached - just thought it might help with [THEIR CHALLENGE].

If you find it valuable, I'd love to hear your thoughts.

Best,
[YOUR NAME]`,
    tags: ['value-first', 'outreach', 'lead-gen']
  },
  {
    id: 5,
    category: 'x-thread',
    title: 'Story Thread Template',
    description: 'Engaging narrative that builds to a lesson',
    platform: 'x',
    uses: 1567,
    rating: 4.8,
    content: `1/ [HOOK - something unexpected or controversial]

Here's a story most people don't know:

🧵

2/ It started when [SETUP - context and characters]

[Brief description of initial situation]

3/ The problem was [CONFLICT]

Everyone said [common advice].

But something didn't feel right.

4/ So I decided to [UNCONVENTIONAL ACTION]

The results?

[Specific outcomes with numbers]

5/ Here's what I learned:

→ [Lesson 1]
→ [Lesson 2]
→ [Lesson 3]

6/ The takeaway:

[One powerful sentence that summarizes everything]

Like this thread? Follow @[handle] for more [topic] insights.`,
    tags: ['storytelling', 'thread', 'viral']
  },
  {
    id: 6,
    category: 'email',
    title: 'Cold Email - AIDA Framework',
    description: 'Attention, Interest, Desire, Action',
    platform: 'email',
    uses: 4521,
    rating: 4.7,
    content: `Subject: Quick question about [THEIR COMPANY]'s [RELEVANT AREA]

Hi [NAME],

[ATTENTION - Personalized observation]
I noticed [COMPANY] recently [achievement/news]. Impressive work on [specific detail].

[INTEREST - Connect to their challenge]
I'm curious - with that growth, are you running into [common challenge in their situation]?

[DESIRE - Show the possibility]
We helped [SIMILAR COMPANY] solve this exact problem. They went from [before state] to [after state] in [timeframe].

[ACTION - Clear, low-commitment CTA]
Would you be open to a 15-minute chat to see if we could help [COMPANY] achieve similar results?

Either way, congrats on the momentum.

Best,
[YOUR NAME]

P.S. [Relevant social proof or additional hook]`,
    tags: ['cold-email', 'AIDA', 'b2b']
  },
  {
    id: 7,
    category: 'email',
    title: 'Follow-Up Sequence Email',
    description: 'Gentle persistence without being pushy',
    platform: 'email',
    uses: 3892,
    rating: 4.5,
    content: `Subject: Re: [Previous subject line]

Hi [NAME],

I know your inbox is probably buried, so I'll keep this brief.

My previous email was about [one-sentence summary].

Since then, I've been thinking about [THEIR COMPANY] and [specific observation or insight relevant to them].

Would any of these times work for a quick call?
• [Option 1]
• [Option 2]

If now isn't the right time, just let me know and I'll circle back in [timeframe].

Thanks,
[YOUR NAME]`,
    tags: ['follow-up', 'sequence', 'persistence']
  },
  {
    id: 8,
    category: 'cold-outreach',
    title: 'Event-Based Outreach',
    description: 'Leverage trigger events for timely outreach',
    platform: 'linkedin',
    uses: 1234,
    rating: 4.6,
    content: `Hi [NAME],

Congrats on [RECENT EVENT - funding, promotion, launch, etc.]!

[One sentence showing you understand what this means for them]

I work with [SIMILAR COMPANIES/ROLES] who are going through similar transitions. The #1 challenge they face is [RELEVANT CHALLENGE].

Would it be helpful if I shared how [COMPANY NAME] handled this? No pitch - just a quick insight that might save you some headaches.

Best,
[YOUR NAME]`,
    tags: ['trigger-event', 'timely', 'relevant']
  },
  {
    id: 9,
    category: 'linkedin-post',
    title: 'Contrarian Take',
    description: 'Challenge conventional wisdom',
    platform: 'linkedin',
    uses: 2876,
    rating: 4.9,
    content: `Unpopular opinion:

[CONTROVERSIAL STATEMENT about your industry]

I know this sounds crazy. But hear me out.

For years, we've been told to [COMMON PRACTICE].

But the data shows something different:

📊 [Stat 1]
📊 [Stat 2]
📊 [Stat 3]

What actually works?

[Your alternative approach in 3-5 bullets]

I'm not saying [COMMON PRACTICE] is always wrong.

I'm saying it's time we questioned it.

Agree? Disagree? Let's debate 👇`,
    tags: ['contrarian', 'debate', 'engagement']
  },
  {
    id: 10,
    category: 'x-thread',
    title: 'How-To Thread',
    description: 'Step-by-step actionable guide',
    platform: 'x',
    uses: 2103,
    rating: 4.7,
    content: `1/ How to [ACHIEVE OUTCOME] in [TIMEFRAME]:

A step-by-step guide 🧵

2/ Step 1: [FIRST ACTION]

[Brief explanation]
[Specific tip or tool]

3/ Step 2: [SECOND ACTION]

This is where most people mess up.

The secret? [Key insight]

4/ Step 3: [THIRD ACTION]

[Explanation]

Pro tip: [Advanced insight]

5/ Step 4: [FOURTH ACTION]

[Explanation with example]

6/ Step 5: [FIFTH ACTION]

[Final step explanation]

7/ Summary:

□ [Step 1]
□ [Step 2]
□ [Step 3]
□ [Step 4]
□ [Step 5]

Follow @[handle] for more [topic] threads.

RT the first tweet to help others 🙏`,
    tags: ['how-to', 'educational', 'actionable']
  }
];

function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = useCallback((template) => {
    navigator.clipboard.writeText(template.content);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleSave = useCallback((templateId) => {
    setSavedTemplates(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  }, []);

  const handleDownload = useCallback((template) => {
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'linkedin': return Linkedin;
      case 'x': return Twitter;
      case 'email': return Mail;
      default: return Briefcase;
    }
  };

  return (
    <div className="templates-page">
      <div className="templates-header">
        <div className="header-content">
          <h2>Template Gallery</h2>
          <p>Proven templates to accelerate your outreach and content creation</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <TrendingUp size={18} />
            <span>{templates.length} Templates</span>
          </div>
          <div className="stat">
            <Users size={18} />
            <span>25K+ Uses</span>
          </div>
        </div>
      </div>

      <div className="templates-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-pills">
          {templateCategories.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="templates-grid">
        {filteredTemplates.map(template => {
          const PlatformIcon = getPlatformIcon(template.platform);
          const isSaved = savedTemplates.includes(template.id);
          const isCopied = copiedId === template.id;

          return (
            <div key={template.id} className="template-card">
              <div className="template-header">
                <div className="platform-badge" data-platform={template.platform}>
                  <PlatformIcon size={16} />
                </div>
                <div className="template-meta">
                  <span className="uses">
                    <Users size={12} />
                    {template.uses.toLocaleString()} uses
                  </span>
                  <span className="rating">
                    <Star size={12} />
                    {template.rating}
                  </span>
                </div>
              </div>

              <h3 className="template-title">{template.title}</h3>
              <p className="template-description">{template.description}</p>

              <div className="template-preview">
                <pre>{template.content.substring(0, 200)}...</pre>
              </div>

              <div className="template-tags">
                {template.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>

              <div className="template-actions">
                <button
                  className={`action-btn ${isCopied ? 'copied' : ''}`}
                  onClick={() => handleCopy(template)}
                >
                  {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  className={`action-btn ${isSaved ? 'saved' : ''}`}
                  onClick={() => handleSave(template.id)}
                >
                  <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDownload(template)}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="empty-state">
          <Search size={48} />
          <h3>No templates found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}

      <div className="templates-footer">
        <div className="footer-content">
          <h3>Want to contribute?</h3>
          <p>Share your best-performing templates with the community</p>
          <button className="submit-btn">
            Submit a Template
          </button>
        </div>
      </div>
    </div>
  );
}

export default Templates;
