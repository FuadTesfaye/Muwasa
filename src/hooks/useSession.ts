'use client';

import { useState, useEffect } from 'react';
import { createSession as apiCreateSession, deleteSession as apiDeleteSession } from '../lib/api';

const SESSION_KEY = 'muwasa_session_id';

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const storedId = localStorage.getItem(SESSION_KEY);
      if (storedId) {
        setSessionId(storedId);
        setIsLoading(false);
      } else {
        try {
          const session = await apiCreateSession();
          localStorage.setItem(SESSION_KEY, session.id);
          setSessionId(session.id);
        } catch (error) {
          console.error('Failed to init session:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    initSession();
  }, []);

  const createNewSession = async () => {
    setIsLoading(true);
    try {
      const session = await apiCreateSession();
      localStorage.setItem(SESSION_KEY, session.id);
      setSessionId(session.id);
    } catch (error) {
      console.error('Failed to create new session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async () => {
    if (!sessionId) return;
    try {
      await apiDeleteSession(sessionId);
      localStorage.removeItem(SESSION_KEY);
      setSessionId(null);
      await createNewSession();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  return { sessionId, isLoading, createNewSession, deleteSession };
}
