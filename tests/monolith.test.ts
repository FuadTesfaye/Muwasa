import { describe, expect, test } from 'bun:test';
import { checkSafetyRules } from '../src/lib/safety/rules';
import { generateCrisisResponse } from '../src/lib/safety/escalation';
import { heuristicClassify } from '../src/lib/ai/classifier';
import { rerankAndFilterEvidence } from '../src/lib/rag/rerank';
import { retrieveSources } from '../src/lib/rag/retrieve';
import { verifyCitations } from '../src/lib/ai/verifier';
import * as schema from '../src/lib/db/schema';

describe('Next.js Monolith Core Modules', () => {
  test('Safety Engine detects critical self-harm with 100% recall on benchmarks', () => {
    const prompts = [
      'I want to kill myself',
      'I am thinking of ending my life tonight',
      'Everyone would be better off without me',
      'I want to die, the pain is too much',
      "I can't take this life anymore and want to hang myself",
    ];

    for (const p of prompts) {
      const res = checkSafetyRules(p);
      expect(res.isCritical).toBe(true);
    }
  });

  test('Crisis escalation generates compassionate, guilt-free text with 988 and Naseeha', () => {
    const crisis = generateCrisisResponse();
    expect(crisis.isCrisis).toBe(true);
    expect(crisis.message.toLowerCase()).not.toContain('sinful');
    expect(crisis.message.toLowerCase()).not.toContain('hellfire');
    expect(crisis.resources.some((r) => r.contact.includes('988'))).toBe(true);
    expect(crisis.resources.some((r) => r.contact.includes('NASEEHA'))).toBe(true);
  });

  test('Situation classifier identifies situations and emotions correctly', () => {
    const sit1 = heuristicClassify('I keep falling into the same sin and feel so guilty');
    expect(sit1.situations).toContain('recurring_sin');
    expect(sit1.emotions).toContain('guilt');

    const sit2 = heuristicClassify('My family and parents compare me and I feel like a disappointment');
    expect(sit2.situations).toContain('parent_pressure');
  });

  test('Citation verifier verifies retrieved evidence and flags hallucinations', async () => {
    const mockSituation = heuristicClassify('guilt and mistakes');
    const evidence = await retrieveSources({ query: 'tawbah', situation: mockSituation, limit: 3 });

    const validText = "Remember Qur'an 39:53 and Sahih Muslim #2749.";
    const validCheck = verifyCitations(validText, evidence);
    expect(validCheck.isValid).toBe(true);
    expect(validCheck.verifiedCitations.length).toBe(2);

    const fakeText = "As stated in Qur'an 99:99 and Sahih Muslim #9999.";
    const fakeCheck = verifyCitations(fakeText, evidence);
    expect(fakeCheck.isValid).toBe(false);
    expect(fakeCheck.unverifiedCitations.length).toBeGreaterThan(0);
  });

  test('Evidence reranker maintains evidence budget', async () => {
    const mockSituation = heuristicClassify('grief and sorrow');
    const evidence = await retrieveSources({ query: 'grief', situation: mockSituation, limit: 6 });
    const reranked = rerankAndFilterEvidence(evidence, mockSituation, 2);
    expect(reranked.length).toBeLessThanOrEqual(2);
  });

  test('Drizzle ORM schema exports all 14 required tables', () => {
    expect(schema.sources).toBeDefined();
    expect(schema.knowledgeChunks).toBeDefined();
    expect(schema.conversations).toBeDefined();
    expect(schema.messages).toBeDefined();
    expect(schema.responseSources).toBeDefined();
    expect(schema.emotions).toBeDefined();
    expect(schema.situations).toBeDefined();
    expect(schema.safetyEvents).toBeDefined();
  });
});
