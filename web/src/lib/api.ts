import { SessionInfo, FeedbackPayload } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function createSession(): Promise<SessionInfo> {
  const res = await fetch(`${API_URL}/api/v1/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function getSession(id: string): Promise<SessionInfo> {
  const res = await fetch(`${API_URL}/api/v1/sessions/${id}`);
  if (!res.ok) throw new Error('Failed to get session');
  return res.json();
}

export async function deleteSession(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/sessions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete session');
}

export async function sendMessage(sessionId: string, content: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/chat/${sessionId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to send message');
}

export async function getQuranVerse(verseKey: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/v1/sources/quran/${verseKey}`);
  if (!res.ok) throw new Error('Failed to fetch verse');
  return res.json();
}

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
}
