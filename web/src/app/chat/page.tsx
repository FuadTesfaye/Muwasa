'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useChat } from '@/hooks/useChat';
import ChatContainer from '@/components/chat/ChatContainer';
import CrisisBanner from '@/components/safety/CrisisBanner';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { ArrowLeft, Trash2 } from 'lucide-react';

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

  const hasCrisisContent = messages.some(
    (m) =>
      m.role === 'assistant' &&
      (m.content.includes('988') || m.content.includes('immense value in the sight of Allah'))
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-center bg-[#f8f7f4] dark:bg-[#0e1015]">
        <span className="font-arabic text-2xl text-[#6f6758] dark:text-[#8e8a80]">مُوَاسَاة</span>
        <p className="text-xs font-mono text-[#8a8f9d] dark:text-[#555a66]">Opening sanctuary...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8f7f4] dark:bg-[#0e1015] transition-colors duration-200">
      {/* Crisis Protocol Banner */}
      {hasCrisisContent && <CrisisBanner />}

      {/* Top Header */}
      <header className="shrink-0 h-14 border-b border-[#e4dfd5] dark:border-[#1b1f28] flex items-center justify-between px-6 z-20 bg-[#f8f7f4] dark:bg-[#0e1015] transition-colors duration-200">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-xs text-[#636877] dark:text-[#717684] hover:text-[#1c1e24] dark:hover:text-[#e4e1da] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sanctuary</span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <span className="font-arabic text-base text-[#1c1e24] dark:text-[#d4d1c9]">مُوَاسَاة</span>
          <span className="text-xs text-[#8a8f9d] dark:text-[#555a66] font-mono">•</span>
          <span className="text-xs text-[#6e685b] dark:text-[#717684] font-serif-heading italic">Muwāsā</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1 text-xs text-[#8a3541] dark:text-[#e06c75] hover:text-[#b01e2f] dark:hover:text-[#ff9fa8] transition-colors"
            title="Delete conversation immediately"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End &amp; Clear</span>
          </button>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#ffffff] dark:bg-[#141720] border border-[#ded8cb] dark:border-[#262a36] rounded-xl p-6 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#edeae3]">
                Clear this conversation?
              </h3>
              <p className="text-xs text-[#636875] dark:text-[#808696] font-light leading-relaxed">
                This will immediately delete this conversation from active memory. Because Muwāsā is private by design, it cannot be recovered.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 text-xs text-[#636875] dark:text-[#717684] hover:text-[#1c1e24] dark:hover:text-[#d4d1c9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 rounded-lg text-xs bg-[#fae8ea] hover:bg-[#f5d4d7] text-[#8e2936] border border-[#f0c3c8] dark:bg-[#2b1f22] dark:hover:bg-[#3d262b] dark:text-[#f2a8b0] dark:border-[#4d2931] transition-colors font-medium"
              >
                Wipe Conversation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading / Conversation Canvas */}
      <ChatContainer
        messages={messages}
        onSendMessage={sendMessage}
        isStreaming={isStreaming}
      />
    </div>
  );
}
