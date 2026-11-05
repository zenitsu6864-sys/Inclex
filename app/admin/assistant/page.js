'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageSquareText, RefreshCw, Sparkles } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

export default function AssistantConversationsPage() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadChats() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/assistant/chats', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load conversations.');
      setChats(Array.isArray(data.chats) ? data.chats : []);
      setSelected((current) => current || data.chats?.[0]?.conversationId || '');
    } catch (err) {
      setError(err.message || 'Could not load conversations.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadChats(); }, []);

  const active = useMemo(() => chats.find((chat) => chat.conversationId === selected), [chats, selected]);
  const totalMessages = chats.reduce((total, chat) => total + (chat.messages?.length || 0), 0);

  return (
    <AdminShell
      title="AI Conversations"
      subtitle={`${chats.length} conversations · ${totalMessages} messages in the latest 100 chats`}
      actions={<button onClick={loadChats} className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-3 py-2 text-xs"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>}
    >
      {error && <div className="mb-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="grid min-h-[560px] gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-sm border border-black/10 bg-white">
          <div className="border-b border-black/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Recent conversations</div>
          {loading ? <div className="p-8 text-center text-sm text-neutral-500">Loading conversations…</div> : chats.length === 0 ? <div className="p-8 text-center text-sm text-neutral-500">No AI conversations yet.</div> : (
            <div className="max-h-[680px] divide-y divide-black/[0.06] overflow-y-auto">
              {chats.map((chat) => {
                const last = chat.messages?.[chat.messages.length - 1];
                return (
                  <button key={chat.conversationId} onClick={() => setSelected(chat.conversationId)} className={`w-full px-4 py-3 text-left transition hover:bg-[#F8F7F4] ${selected === chat.conversationId ? 'bg-[#F8F7F4] ring-1 ring-inset ring-[#C9A227]/50' : ''}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-800">Website visitor</span>
                      <span className="text-[10px] text-neutral-400">{chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : ''}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{last?.text || 'Conversation started'}</p>
                    <span className="mt-2 inline-block text-[9px] uppercase tracking-widest text-neutral-400">{chat.messages?.length || 0} messages</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="flex min-h-[560px] flex-col overflow-hidden rounded-sm border border-black/10 bg-white">
          <div className="flex items-center gap-2 border-b border-black/10 px-5 py-4">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-black text-[#C9A227]"><Sparkles size={15} /></div>
            <div>
              <div className="font-serif text-lg">Conversation transcript</div>
              <div className="text-[10px] text-neutral-400">Emails, phone numbers and order IDs are redacted where recognized.</div>
            </div>
          </div>
          {!active ? <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-sm text-neutral-400"><MessageSquareText size={28} /><span>Select a conversation to read its messages.</span></div> : (
            <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8F7F4] p-4 sm:p-6">
              {(active.messages || []).map((message, index) => (
                <div key={`${index}-${message.at || ''}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 ${message.role === 'user' ? 'bg-[#171717] text-white' : 'border border-black/5 bg-white text-neutral-800'}`}>
                    <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] opacity-50">{message.role === 'user' ? 'Customer' : 'INCLEX AI'}</div>
                    <p className="whitespace-pre-wrap break-words text-xs leading-6">{message.text}</p>
                    {message.at && <div className="mt-2 text-right text-[9px] opacity-40">{new Date(message.at).toLocaleString()}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <p className="mt-3 text-[10px] leading-5 text-neutral-400">Only the latest 100 conversations are shown. Conversations are stored in MongoDB in the ai_support_chats collection.</p>
    </AdminShell>
  );
}
