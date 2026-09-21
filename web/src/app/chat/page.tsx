'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useChat } from '@/hooks/useChat';
import ChatContainer from '@/components/chat/ChatContainer';
import CrisisBanner from '@/components/safety/CrisisBanner';
import { Button } from '@/components/ui/button';
import { Trash2, Home, Shield, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { sessionId, isLoading, deleteSession } = useSession();
  const { messages, sendMessage, isStreaming } = useChat(sessionId);
  const initialMessageProcessed = useRef(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isLoading && sessionId && !initialMessageProcessed.current) {
      const initialMessage = sessionStorage.getItem('initial_message');
      if (initialMessage) {
        sendMessage(initialMessage);
        sessionStorage.removeItem('initial_message');
        initialMessageProcessed.current = true;
      }
    }
  }, [isLoading, sessionId, sendMessage]);

  const confirmDelete = async () => {
    await deleteSession();
    setShowDeleteModal(false);
    router.push('/');
  };

  // Check if any message in history triggered crisis safety response
  const hasCrisisContent = messages.some(
    (m) =>
      m.role === 'assistant' &&
      (m.content.includes('988') || m.content.includes('immense value in the sight of Allah'))
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-arabic text-xl text-emerald-400">مُوَاسَاة</p>
        <p className="text-xs text-slate-500 tracking-wider">Opening Private Sanctuary...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#070b14] relative">
      {/* Dynamic Crisis Safety Banner */}
      {hasCrisisContent && <CrisisBanner />}

      {/* Sanctuary Top Navigation */}
      <header className="shrink-0 h-16 border-b border-emerald-950/40 flex items-center justify-between px-4 md:px-8 z-20 bg-slate-950/80 backdrop-blur-xl shadow-lg">
        {/* Left: Home link */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-xl transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Sanctuary</span>
          </Button>

          {/* Privacy Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/30 text-[11px] text-emerald-400 font-light">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Private & Ephemeral</span>
          </div>
        </div>

        {/* Center: Brand Heading */}
        <div className="flex items-center gap-2 text-center">
          <span className="font-arabic text-2xl font-bold text-slate-100">مُوَاسَاة</span>
          <span className="text-xs font-serif-heading italic text-slate-400 hidden sm:inline">• Muwāsā</span>
        </div>

        {/* Right: Delete Conversation Action */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-all"
          title="Delete this conversation"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          <span className="text-xs">End & Clear</span>
        </Button>
      </header>

      {/* Confirmation Modal for Session Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-400" />
                Clear this conversation?
              </h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                This will immediately delete this entire conversation from active memory. Because Muwāsā is privacy-first, once deleted, this conversation cannot be recovered.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-950"
              >
                Yes, Delete Conversation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Chat Canvas */}
      <ChatContainer
        messages={messages}
        onSendMessage={sendMessage}
        isStreaming={isStreaming}
      />
    </div>
  );
}
