export interface SafetyRuleResult {
  isCritical: boolean;
  category?: 'suicide' | 'self_harm' | 'harm_to_others' | 'abuse';
  matchedPattern?: string;
}

const CRITICAL_PATTERNS = [
  // Suicidal ideation & self-harm
  /\b(kill|killing|end|ending)\s+(my\s*self|my\s*life)\b/i,
  /\b(want|going)\s+to\s+die\b/i,
  /\b(commit|committing)\s+suicide\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bno\s+reason\s+to\s+(live|stay\s+alive)\b/i,
  /\b(hang|shoot|overdose|drown|poison)\s+myself\b/i,
  /\b(cut|slit|burn)\s+my\s*(wrists?|skin|arms?)\b/i,
  /\bdon['’]?t\s+want\s+to\s+(wake\s+up|live|exist)\s*(anymore|any\s*longer)?\b/i,
  /\bwish\s+i\s+(was|were)\s+dead\b/i,
  /\bcan['’]?t\s+take\s+(this\s+life|it)\s+(anymore|any\s*longer)\b/i,
  /\b(everyone|people)\s+(would\s+be\s+)?better\s+(off\s+)?without\s+me\b/i,
  /\bwant\s+to\s+hang\s+myself\b/i,
];

const HARM_TO_OTHERS_PATTERNS = [
  /\b(kill|murder|stab|shoot)\s+(him|her|them|someone|everyone)\b/i,
  /\bgoing\s+to\s+hurt\s+someone\b/i,
];

export function checkSafetyRules(text: string): SafetyRuleResult {
  const normalized = text.toLowerCase().trim();

  for (const pattern of CRITICAL_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isCritical: true,
        category: 'suicide',
        matchedPattern: pattern.source,
      };
    }
  }

  for (const pattern of HARM_TO_OTHERS_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isCritical: true,
        category: 'harm_to_others',
        matchedPattern: pattern.source,
      };
    }
  }

  return { isCritical: false };
}
