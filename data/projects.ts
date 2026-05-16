export type ProjectId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';

export type ProjectImage = {src: string; alt: string};

export type Project = {
  id: ProjectId;
  images: ProjectImage[];
  highlight?: boolean;
};

// Cloudinary delivery. public_ids are FLAT (no folder path) — Cloudinary
// folders are only Media Library organization, not part of the URL.
// Explicit .png extension: this is the exact format Cloudinary serves for
// these assets (f_auto without extension was not resolving).
const CLOUD = 'https://res.cloudinary.com/df4zim15o/image/upload';
const img = (publicId: string, alt: string): ProjectImage => ({
  src: `${CLOUD}/${publicId}.png`,
  alt
});

export const projects: Project[] = [
  {
    id: 'p1',
    highlight: true,
    images: [
      img('01_my_investigations_2_kawsbt', 'Investigations dashboard'),
      img('02_trending_oyxnmc', 'Trending content detection'),
      img('03_investigate_1_d3dsws', 'Investigation view'),
      img('04_copies_mrcl6i', 'Generated scripts and copies'),
      img('05_my_investigations_1_zoi4rp', 'Investigations list')
    ]
  },
  {
    id: 'p2',
    images: [
      img('01_botWhatsapp_trogm7', 'WhatsApp bot conversation'),
      img('02_bookingFlow_rkf32s', 'Appointment booking flow'),
      img('03_cancelBooking_sw5kce', 'Cancel a booking'),
      img('04_createBooking_bsbwrr', 'Create booking in Cal.com'),
      img('05_checkNewMessages_wwjn89', 'Check new messages'),
      img('06_messaging_sufiqa', 'Messaging node'),
      img('07_greeting_lzftd1', 'Greeting flow'),
      img('08_knowledge_ibingo', 'RAG knowledge base lookup'),
      img('09_errorMessages_i1qbma', 'Error handling'),
      img('10_getTimeZone_bcaj3j', 'Time zone detection'),
      img('11_handoff_ommevo', 'Human handoff'),
      img('12_qualify_ddv49f', 'Lead qualification step'),
      img('13_reset_counter_zsx1dl', 'Reset counter logic'),
      img('14_saveChatHistory_vcmfsk', 'Persist chat history'),
      img('15_updatedate_tj4fvs', 'Reschedule a booking')
    ]
  },
  {
    id: 'p3',
    images: [img('01_voi_ai_agent_lufj92', 'Voice AI agent workflow')]
  },
  {
    id: 'p4',
    images: [
      img(
        '01_n8n_scraper_facebooks_ads_syb5a2',
        'Facebook ads scraper pipeline in n8n'
      )
    ]
  },
  {
    id: 'p5',
    images: [
      img('01_google_ads_zuzaug', 'Google Ads dashboard'),
      img('02_google_tag_manager_1_oktegc', 'Google Tag Manager setup')
    ]
  },
  {
    id: 'p6',
    images: [
      img(
        '01_scrapping_email_google_maps_vhijjw',
        'Google Maps lead scraper in n8n'
      )
    ]
  }
];
