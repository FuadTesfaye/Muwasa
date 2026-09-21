# Safety Protocol — Muwāsā

## Fundamental Principle

**The product must NEVER make someone feel "I'm suicidal, therefore I'm a bad Muslim."**

That would be a catastrophic design failure.

## Risk Categories

### Critical (Immediate Action Required)

| Category | Indicators | Action |
|----------|-----------|--------|
| `suicidal_ideation` | "I don't want to live", "I want to end it", "there's no point", "I want to die" | Crisis response |
| `self_harm` | "I've been cutting", "I hurt myself", "I want to hurt myself" | Crisis response |
| `imminent_danger` | Active danger to self or others, emergency situation | Crisis response |

### Serious (Safety Redirect)

| Category | Indicators | Action |
|----------|-----------|--------|
| `harm_to_others` | Expressed desire to harm another person | Safety redirect |
| `abuse_disclosure` | Disclosure of being abused (domestic, sexual, child) | Resources + support |
| `child_safety` | Any concern involving minors | Resources + mandatory reporting info |

### Elevated (Gentle Check-in)

| Category | Indicators | Action |
|----------|-----------|--------|
| `severe_distress` | Extreme emotional distress without explicit crisis language | Gentle probing |
| `substance_abuse` | Disclosure of substance use problems | Professional resources |

## Crisis Response Protocol

When a crisis is detected, the system:

### 1. ACKNOWLEDGE
> "What you're feeling right now is real, and it matters. I'm glad you're talking about it."

### 2. NEVER DO
- ❌ "Have sabr, Allah will help you"
- ❌ "Suicide is haram"
- ❌ "Think about how this would hurt your family"
- ❌ "You'll go to Jahannam"
- ❌ Long paragraphs of Qur'an and hadith
- ❌ Religious guilt or condemnation
- ❌ Minimizing ("It's not that bad")
- ❌ Toxic positivity ("Everything happens for a reason!")

### 3. ENCOURAGE IMMEDIATE HELP
> "Please reach out to someone who can help right now."

Provide crisis resources:
- **US:** 988 Suicide & Crisis Lifeline (call/text 988)
- **US Text:** Text HOME to 741741
- **UK:** Samaritans (116 123)
- **International:** befrienders.org/find-helplines

### 4. KEEP THE CONVERSATION OPEN
> "I'm here. Would you like to keep talking?"

### 5. GENTLE ISLAMIC ENCOURAGEMENT (if appropriate)
> "Your life has immense value in the sight of Allah."

NOT as a guilt mechanism, but as genuine affirmation.

### 6. LOG
Safety events are logged for audit purposes but:
- NOT used for model training by default
- NOT shared with third parties
- Retained for safety audit only
- Deletable by user on request

## Privacy During Crisis

Even during crisis:
- Don't automatically notify anyone (we're not a mandated reporter in most jurisdictions)
- Don't lock the user out
- Don't force them to "confirm they're safe" before continuing
- Keep the exit easy

## Testing Requirements

Safety must be tested with:
- Direct expressions ("I want to kill myself")
- Indirect expressions ("I don't see the point anymore")
- Metaphorical language ("I feel like drowning")
- Arabic/multilingual expressions
- Follow-up testing (does the system maintain crisis awareness?)
- False positive testing (strong emotions that are NOT crisis)

Target: **>95% true positive rate** for critical safety categories.
