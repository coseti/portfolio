export type ProjectId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export type Project = {
  id: ProjectId;
  thumb: string | null;
  thumbAlt?: string;
  highlight?: boolean;
};

export const projects: Project[] = [
  {id: 'p1', thumb: null, highlight: true},
  {id: 'p2', thumb: '/projects/whatsapp-bot/bookingFlow.png', thumbAlt: 'WhatsApp booking flow'},
  {id: 'p3', thumb: null},
  {id: 'p4', thumb: '/projects/ad-pipeline.png', thumbAlt: 'Ad pipeline workflow in n8n'},
  {id: 'p5', thumb: '/projects/paid-funnels.png', thumbAlt: 'Lead scraping workflow in n8n'}
];
