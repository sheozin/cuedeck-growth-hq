import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockLeads } from '../data/mockLeads';
import { mockActivity } from '../data/mockActivity';
import { mockSequences } from '../data/mockSequences';
import { mockContent } from '../data/mockContent';

const useStore = create(
  persist(
    (set, get) => ({
      // Leads
      leads: mockLeads,
      selectedLead: null,
      setSelectedLead: (lead) => set({ selectedLead: lead }),
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === id ? { ...lead, ...updates } : lead
        ),
      })),
      addLead: (lead) => set((state) => ({
        leads: [...state.leads, { ...lead, id: Date.now().toString() }],
      })),

      // Agent Statuses
      agentStatuses: {
        orchestrator: { status: 'running', task: 'Delegating 3 tasks to LinkedIn and Email agents', tasksToday: 24 },
        contentGenerator: { status: 'running', task: 'Drafting LinkedIn post for conference organizer ICP', tasksToday: 18 },
        linkedinAgent: { status: 'running', task: 'Sent 12 connection requests, 3 profile views queued', tasksToday: 31 },
        xAgent: { status: 'paused', task: 'Rate limit reached — resuming in 47 min', tasksToday: 9 },
        emailAgent: { status: 'running', task: 'Running sequence: Cold Outreach Wave 3', tasksToday: 22 },
        crmAgent: { status: 'running', task: 'Updated 6 lead stages, flagged 2 hot leads', tasksToday: 14 },
      },
      updateAgentStatus: (agent, updates) => set((state) => ({
        agentStatuses: {
          ...state.agentStatuses,
          [agent]: { ...state.agentStatuses[agent], ...updates },
        },
      })),

      // Activity Feed
      activities: mockActivity,
      addActivity: (activity) => set((state) => ({
        activities: [{ ...activity, id: Date.now().toString(), timestamp: new Date().toISOString() }, ...state.activities].slice(0, 100),
      })),

      // Content Queue
      contentQueue: mockContent,
      addToContentQueue: (content) => set((state) => ({
        contentQueue: [...state.contentQueue, { ...content, id: Date.now().toString(), status: 'Draft' }],
      })),
      updateContentItem: (id, updates) => set((state) => ({
        contentQueue: state.contentQueue.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      })),
      removeFromContentQueue: (id) => set((state) => ({
        contentQueue: state.contentQueue.filter((item) => item.id !== id),
      })),

      // Sequences
      sequences: mockSequences,
      updateSequence: (id, updates) => set((state) => ({
        sequences: state.sequences.map((seq) =>
          seq.id === id ? { ...seq, ...updates } : seq
        ),
      })),

      // Settings & API Keys
      settings: {
        apiKeys: {
          claude: '',
          phantombuster: '',
          phantombusterAgentId: '',
          instantly: '',
          apollo: '',
          airtableKey: '',
          airtableBaseId: '',
          n8nWebhook: '',
        },
        integrationStatus: {
          claude: 'disconnected',
          phantombuster: 'disconnected',
          instantly: 'disconnected',
          apollo: 'disconnected',
          airtable: 'disconnected',
          n8n: 'disconnected',
        },
        icpProfile: {
          jobTitles: ['Conference Manager', 'Event Director', 'AV Production Manager', 'Head of Events'],
          industries: ['Conferences & Events', 'Corporate Events'],
          companySize: ['50-200', '200-500'],
          regions: ['Poland', 'Germany', 'UAE', 'UK'],
          annualEvents: '5-20',
        },
        brandVoice: {
          companyName: 'CueDeck',
          tagline: 'Run every session. Own every moment.',
          valueProps: 'CueDeck is a real-time conference control platform. Key features: 8-state session machine, 6 operator roles, AI Incident Advisor, live signage, simultaneous interpretation control, post-event reports. Pricing: €39/event, €59/mo Starter, €99/mo Pro.',
          toneAdjectives: ['Professional', 'Direct', 'Confident', 'Helpful'],
          wordsToAvoid: ['cheap', 'basic', 'simple'],
          samplePost: '',
        },
        notifications: {
          hotLeadFlagged: true,
          replyReceived: true,
          agentError: true,
          dailySummary: false,
          dailySummaryEmail: '',
          linkedinAccepted: true,
        },
        linkedinConfig: {
          dailyConnectLimit: 20,
          dailyMessageLimit: 15,
          connectionTemplate: 'Hi {firstName}, I noticed your work in event production at {company}. We built CueDeck specifically for teams running complex conferences — happy to show you how it works.',
          targetTitles: 'Conference Manager, Event Director, AV Manager',
          industries: ['Conferences & Events'],
          companySize: '50-500',
          regions: ['Poland', 'Germany', 'UAE', 'UK'],
        },
        xConfig: {
          dailyFollowLimit: 20,
          replyTone: 'Supportive',
          hashtags: ['#eventprof', '#conferences', '#AVproduction', '#eventtech'],
          keywords: 'conference management, event production, AV technology',
          accountsToEngage: '',
        },
      },
      updateApiKey: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          apiKeys: { ...state.settings.apiKeys, [key]: value },
        },
      })),
      updateIntegrationStatus: (key, status) => set((state) => ({
        settings: {
          ...state.settings,
          integrationStatus: { ...state.settings.integrationStatus, [key]: status },
        },
      })),
      updateIcpProfile: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          icpProfile: { ...state.settings.icpProfile, ...updates },
        },
      })),
      updateBrandVoice: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          brandVoice: { ...state.settings.brandVoice, ...updates },
        },
      })),
      updateNotifications: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          notifications: { ...state.settings.notifications, ...updates },
        },
      })),
      updateLinkedinConfig: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          linkedinConfig: { ...state.settings.linkedinConfig, ...updates },
        },
      })),
      updateXConfig: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          xConfig: { ...state.settings.xConfig, ...updates },
        },
      })),

      // UI State
      isLeadDrawerOpen: false,
      openLeadDrawer: (lead) => set({ isLeadDrawerOpen: true, selectedLead: lead }),
      closeLeadDrawer: () => set({ isLeadDrawerOpen: false, selectedLead: null }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'cuedeck-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);

export default useStore;
