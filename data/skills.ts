export type SkillCategory = 'aiAutomation' | 'fullStack' | 'growth';

export const skillsByCategory: Record<SkillCategory, string[]> = {
  aiAutomation: [
    'AI/LLM integration',
    'AI agents',
    'RAG',
    'MCP',
    'Prompt Engineering',
    'Workflow Automation',
    'AI-Assisted Development',
    'Claude Code',
    'n8n',
    'Vapi',
    'WhatsApp Business API'
  ],
  fullStack: [
    'Full-Stack Development',
    'Next.js',
    'FastAPI',
    'PostgreSQL',
    'WordPress'
  ],
  growth: [
    'PPC',
    'Paid Media',
    'Google Ads',
    'Google Analytics 4',
    'Google Tag Manager',
    'SEO'
  ]
};
