import db from '@/api/api.js';

import React, { useState, useEffect, useRef } from 'react';

import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const VISITOR_ID_KEY = 'asa_pump_visitor_id';
const THREAD_ID_KEY = 'asa_pump_chat_thread_id';

function getOrCreateVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const visitorId = getOrCreateVisitorId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load or create thread when widget opens
  useEffect(() => {
    if (!open) return;
    loadThread();
  }, [open]);

  // Poll for new messages while open
  useEffect(() => {
    if (!open || !threadId) return;
    pollRef.current = setInterval(() => {
      refreshMessages();
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [open, threadId]);

  const loadThread = async () => {
    setLoading(true);
    const cachedId = localStorage.getItem(THREAD_ID_KEY);
    if (cachedId) {
      try {
        const thread = await db.entities.ChatThread.get(cachedId);
        if (thread) {
          setThreadId(cachedId);
          setMessages(thread.messages || []);
          setLoading(false);
          return;
        }
      } catch { }
    }
    // Try to find existing thread for this visitor
    const existing = await db.entities.ChatThread.filter({ visitor_id: visitorId });
    if (existing.length > 0) {
      const t = existing[0];
      setThreadId(t.id);
      setMessages(t.messages || []);
      localStorage.setItem(THREAD_ID_KEY, t.id);
    } else {
      // Create new thread
      const t = await db.entities.ChatThread.create({
        visitor_id: visitorId,
        messages: [],
        last_message_at: new Date().toISOString(),
      });
      setThreadId(t.id);
      setMessages([]);
      localStorage.setItem(THREAD_ID_KEY, t.id);
    }
    setLoading(false);
  };

  const refreshMessages = async () => {
    if (!threadId) return;
    try {
      const thread = await db.entities.ChatThread.get(threadId);
      if (thread) {
        setMessages(thread.messages || []);
      }
    } catch { }
  };

  const sendMessage = async () => {
    if (!input.trim() || !threadId || sending) return;
    setSending(true);
    const newMsg = { role: 'visitor', text: input.trim(), timestamp: new Date().toISOString() };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput('');
    await db.entities.ChatThread.update(threadId, {
      messages: updated,
      last_message_at: new Date().toISOString(),
    });
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all"
        style={{ direction: 'rtl' }}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">پشتیبانی آنلاین</span>
      </button>

      {/* Chat Popup */}
      {open && (
        <div
          className="fixed bottom-20 left-6 z-50 w-80 sm:w-96 flex flex-col bg-white rounded-2xl shadow-2xl border overflow-hidden"
          style={{ maxHeight: '480px', direction: 'rtl' }}
        >
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">پشتیبانی آنلاین</p>
                <p className="text-xs text-white/70">آسا پمپ</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#F8FAFC]" style={{ minHeight: 0 }}>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">سلام! چطور میتوانم کمک کنم؟</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'visitor' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-6 ${msg.role === 'visitor'
                      ? 'bg-white border text-[#334155] rounded-tr-sm'
                      : 'bg-primary text-white rounded-tl-sm'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t bg-white flex items-center gap-2 shrink-0">
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 text-sm bg-[#F8FAFC] border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-right"
            />
          </div>
        </div>
      )}
    </>
  );
}