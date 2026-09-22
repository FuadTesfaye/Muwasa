import { embed, embedMany } from 'ai';
import { embeddingModel } from '@/lib/ai/model';

export async function generateQueryEmbedding(query: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: embeddingModel,
      value: query,
    });
    return embedding;
  } catch (error) {
    console.warn('[Embed] Google embedding failed or unconfigured; generating pseudo-vector for testing.', error);
    // 768-dimensional deterministic normalized vector for offline tests
    return generateDeterministicVector(query, 768);
  }
}

export async function generateDocumentEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: embeddingModel,
      value: text,
    });
    return embedding;
  } catch (error) {
    return generateDeterministicVector(text, 768);
  }
}

function generateDeterministicVector(seedText: string, dims: number): number[] {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash << 5) - hash + seedText.charCodeAt(i);
    hash |= 0;
  }
  const vec = new Array(dims);
  let norm = 0;
  for (let i = 0; i < dims; i++) {
    const val = Math.sin(hash + i);
    vec[i] = val;
    norm += val * val;
  }
  norm = Math.sqrt(norm);
  return vec.map((v) => v / norm);
}
