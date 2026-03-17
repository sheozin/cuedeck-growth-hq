export const mockSequences = [
  {
    id: '1',
    name: 'Cold Outreach Wave 3',
    contacts: 156,
    currentStep: 3,
    totalSteps: 5,
    openRate: 34,
    replyRate: 9,
    status: 'active',
    steps: [
      { step: 1, type: 'email', subject: 'Quick question about your event tech stack', sent: 156, opened: 53, replied: 8 },
      { step: 2, type: 'email', subject: 'Re: Quick question about your event tech stack', sent: 148, opened: 50, replied: 6 },
      { step: 3, type: 'email', subject: 'One more thing about CueDeck', sent: 142, opened: 48, replied: 0 },
      { step: 4, type: 'email', subject: 'Last chance to see CueDeck in action', sent: 0, opened: 0, replied: 0 },
      { step: 5, type: 'email', subject: 'Closing the loop', sent: 0, opened: 0, replied: 0 },
    ],
    contacts_list: [
      { id: '1', name: 'Agnieszka Kowalska', company: 'Infoshare', step: 3, status: 'active', lastSent: '2024-01-14T09:00:00Z' },
      { id: '2', name: 'Hans Mueller', company: 'TechConf Berlin', step: 2, status: 'active', lastSent: '2024-01-14T08:00:00Z' },
      { id: '3', name: 'Magdalena Kaczmarek', company: 'Poznań Convention Bureau', step: 2, status: 'active', lastSent: '2024-01-14T12:00:00Z' },
    ],
  },
  {
    id: '2',
    name: 'LinkedIn Follow-Up',
    contacts: 43,
    currentStep: 1,
    totalSteps: 3,
    openRate: 51,
    replyRate: 14,
    status: 'active',
    steps: [
      { step: 1, type: 'email', subject: 'Great connecting on LinkedIn, {firstName}', sent: 43, opened: 22, replied: 6 },
      { step: 2, type: 'email', subject: 'Quick demo of CueDeck?', sent: 0, opened: 0, replied: 0 },
      { step: 3, type: 'email', subject: 'Worth 15 minutes?', sent: 0, opened: 0, replied: 0 },
    ],
    contacts_list: [
      { id: '4', name: 'Piotr Zieliński', company: 'Kraków Congress Centre', step: 1, status: 'active', lastSent: '2024-01-12T10:00:00Z' },
      { id: '7', name: 'Katarzyna Dąbrowska', company: 'Event Masters Poland', step: 1, status: 'active', lastSent: '2024-01-12T10:30:00Z' },
    ],
  },
  {
    id: '3',
    name: 'Re-engagement: No Reply 30d',
    contacts: 28,
    currentStep: 2,
    totalSteps: 4,
    openRate: 18,
    replyRate: 3,
    status: 'active',
    steps: [
      { step: 1, type: 'email', subject: 'Still interested in improving your event workflow?', sent: 28, opened: 5, replied: 1 },
      { step: 2, type: 'email', subject: 'New feature you might like', sent: 27, opened: 5, replied: 0 },
      { step: 3, type: 'email', subject: 'Quick update from CueDeck', sent: 0, opened: 0, replied: 0 },
      { step: 4, type: 'email', subject: 'Last attempt - should I close your file?', sent: 0, opened: 0, replied: 0 },
    ],
    contacts_list: [
      { id: '8', name: 'James Wilson', company: 'London Events Group', step: 2, status: 'active', lastSent: '2024-01-10T09:00:00Z' },
      { id: '14', name: 'Emma Thompson', company: 'UK Conference Services', step: 2, status: 'active', lastSent: '2024-01-10T09:30:00Z' },
    ],
  },
];

export const mockDomains = [
  { id: '1', domain: 'outreach@cuedeck-mail.io', warmupScore: 82, dailyLimit: 50, status: 'Ready' },
  { id: '2', domain: 'hello@cuedeckhq.com', warmupScore: 41, dailyLimit: 20, status: 'Warming' },
];
