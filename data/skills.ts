export type SkillCategory = 'aiAutomation' | 'backend' | 'growth' | 'tools';

export const skillsByCategory: Record<SkillCategory, string[]> = {
  aiAutomation: [
    'n8n',
    'Vapi',
    'WhatsApp Business API',
    'RAG',
    'AI Agents',
    'MCP',
    'Workflow Automation',
    'Prompt Engineering',
    'Claude Code'
  ],
  backend: [
    'FastAPI',
    'Supabase',
    'PostgreSQL',
    'pgvector',
    'Celery',
    'Redis',
    'Next.js'
  ],
  growth: [
    'Google Ads',
    'Google Tag Manager',
    'GA4',
    'PPC',
    'Paid Media',
    'SEO',
    'WordPress'
  ],
  tools: ['Git', 'Apify', 'Gemini Vision', 'Claude', 'Veo 3', 'TypeScript']
};
