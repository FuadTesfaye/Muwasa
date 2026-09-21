'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, StreamChunk, SourceCard } from '../lib/types';
import { sendMessage as apiSendMessage } from '../lib/api';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export function useChat(sessionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!sessionId || wsRef.current) return;
    setIsConnecting(true);

    const ws = new WebSocket(`${WS_URL}/api/v1/chat/${sessionId}/ws`);
    
    ws.onopen = () => {
      setIsConnecting(false);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const chunk: StreamChunk = JSON.parse(event.data);
        handleStreamChunk(chunk);
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    ws.onerror = (e) => {
      console.error('WS Error:', e);
      setError('Connection error');
      setIsConnecting(false);
    };

    ws.onclose = () => {
      wsRef.current = null;
      setIsConnecting(false);
      // Auto-reconnect after 3s
      setTimeout(connect, 3000);
    };

    wsRef.current = ws;
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      connect();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId, connect]);

  const handleStreamChunk = (chunk: StreamChunk) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];

      if (!lastMessage || lastMessage.role !== 'assistant') {
        if (chunk.type === 'text') {
          newMessages.push({
            id: Date.now().toString(),
            role: 'assistant',
            content: chunk.content as string,
            createdAt: new Date().toISOString(),
          });
        }
        setIsStreaming(true);
        return newMessages;
      }

      if (chunk.type === 'text') {
        lastMessage.content += chunk.content;
      } else if (chunk.type === 'source_card') {
        if (!lastMessage.sources) lastMessage.sources = [];
        lastMessage.sources.push(chunk.content as SourceCard);
      } else if (chunk.type === 'done') {
        setIsStreaming(false);
      } else if (chunk.type === 'error') {
        setIsStreaming(false);
        setError('Error generating response');
      }

      return newMessages;
    });
  };

  const sendMessage = async (content: string) => {
    if (!sessionId || !content.trim() || isStreaming) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    
    // Create placeholder for assistant response
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString()
    }]);

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ content }));
      } else {
        // Fallback to REST API if WS not available
        await apiSendMessage(sessionId, content);
      }
    } catch (err) {
      setError('Failed to send message');
      setIsStreaming(false);
    }
  };

  return { messages, sendMessage, isConnecting, isStreaming, error };
}
