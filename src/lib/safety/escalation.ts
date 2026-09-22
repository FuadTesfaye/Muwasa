export interface CrisisResponse {
  message: string;
  isCrisis: boolean;
  resources: {
    name: string;
    contact: string;
    description: string;
    url?: string;
  }[];
}

export function generateCrisisResponse(): CrisisResponse {
  return {
    isCrisis: true,
    message: `I hear how overwhelming, exhausting, and deeply painful things feel for you right now. Please take an unhurried breath: your life, your breathing, and your presence carry immense, sacred value in the sight of Allah.

Experiencing this depth of despair does NOT mean you have weak faith, and it does NOT make you a bad Muslim. Even the prophets of Allah called upon Him in moments of suffocating constriction. When suffering reaches this intensity, Islam teaches us to reach out for immediate human care.

Please connect with someone who can hold this weight with you right now:`,
    resources: [
      {
        name: '988 Suicide & Crisis Lifeline',
        contact: '988',
        description: 'Free, confidential, available 24/7 by call or text (US & Canada).',
        url: 'https://988lifeline.org',
      },
      {
        name: 'Naseeha Muslim Mental Health Helpline',
        contact: '1-866-NASEEHA (1-866-627-3342)',
        description: '24/7 confidential, faith-informed support for Muslims worldwide.',
        url: 'https://naseeha.org',
      },
      {
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        description: 'Free 24/7 crisis support via text message.',
        url: 'https://www.crisistextline.org',
      },
      {
        name: 'International Helplines Directory',
        contact: 'findahelpline.com',
        description: 'Free, confidential support services in over 130 countries.',
        url: 'https://findahelpline.com',
      },
    ],
  };
}
