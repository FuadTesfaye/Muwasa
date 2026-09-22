'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, SourceCard } from '../lib/types';

export function useChat(sessionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      const assistantMsgId = (Date.now() + 1).toString();
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        sources: [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      setError(null);

      try {
        const historyPayload = messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.trim(),
            conversationId: sessionId || undefined,
            history: historyPayload,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || `Server responded with status ${response.status}`);
        }

        // Extract sources from custom response header
        const rawSourcesHeader = response.headers.get('X-Muwasa-Sources');
        let extractedSources: SourceCard[] = [];
        if (rawSourcesHeader) {
          try {
            const parsedSources = JSON.parse(decodeURIComponent(rawSourcesHeader));
            extractedSources = parsedSources.map((s: any) => ({
              type: s.type,
              citation: s.reference,
              verified: true,
              data: s,
            }));
          } catch (e) {
            console.warn('[useChat] Failed to parse sources header:', e);
          }
        }

        // Check if response is JSON (e.g. crisis response)
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: data.content || data.message || '',
                    sources: extractedSources,
                  }
                : msg
            )
          );
          setIsStreaming(false);
          return;
        }

        // Stream conversational prose chunks
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value, { stream: true });
            accumulatedContent += textChunk;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? {
                      ...msg,
                      content: accumulatedContent,
                      sources: extractedSources,
                    }
                  : msg
              )
            );
          }
        }
      } catch (err: any) {
        console.error('[useChat] Transmission error:', err);
        setError(err.message || 'Error generating reflection');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content:
                    'May Allah grant you ease. I encountered an unexpected difficulty while reflecting. Please speak again.',
                }
              : msg
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, sessionId]
  );

  return {
    messages,
    sendMessage,
    isStreaming,
    error,
    isConnecting: false,
  };
}
