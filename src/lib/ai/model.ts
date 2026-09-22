import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || 'dummy-key-for-initialization';

export const google = createGoogleGenerativeAI({
  apiKey: googleApiKey,
});

// Primary reasoning & conversation model
export const chatModel = google(process.env.GEMINI_MODEL || 'gemini-2.5-flash');

// Embedding model for 768-dimensional text representations
export const embeddingModel = google.textEmbeddingModel(
  process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004'
);
