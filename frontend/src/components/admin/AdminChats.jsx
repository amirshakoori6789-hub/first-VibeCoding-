import db from '@/api/api.js';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { MessageCircle, Trash2, Send, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatDate = (str) => {
  if (!str) return '';
  return new Date(str).toLocaleString('fa-IR', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export default function AdminChats() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const messagesEndRef = useRef(null);

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ['chat-threads'],
    queryFn: () => db.entities.ChatThread.list('-last_message_at'),
    refetchInterval: 5000,
  });

  const selectedThread = threads.find(t => t.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.messages]);

  const deleteThread = useMutation({
    mutationFn: (id) => db.entities.ChatThread.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['chat-threads']);
      if (selectedId === confirmDelete) setSelectedId(null);
      setConfirmDelete(null);
    },
  });

  const sendReply = async () => {
    if (!replyText.trim() || !selectedThread || sending) return;
    setSending(true);
    const newMsg = { role: 'admin', text: replyText.trim(), timestamp: new Date().toISOString() };
    const updated = [...(selectedThread.messages || []), newMsg];
    await db.entities.ChatThread.update(selectedThread.id, {
      messages: updated,
      last_message_at: new Date().toISOString(),
    });
    qc.invalidateQueries(['chat-threads']);
    setReplyText('');
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const lastMessage = (thread) => {
    const msgs = thread.messages || [];
    if (msgs.length === 0) return 'بدون پیام';
    return msgs[msgs.length - 1].text;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#0F172A]">چتهای پشتیبانی</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">هیچ چتی وجود ندارد.</p>
        </div>
      ) : (
        <div className="flex gap-4 h-[520px]">
          {/* Thread List */}
          <div className="w-64 shrink-0 border rounded-xl overflow-y-auto bg-[#F8FAFC]">
            {threads.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-right px-4 py-3 border-b hover:bg-white transition-colors ${selectedId === t.id ? 'bg-white border-r-2 border-r-primary' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground truncate">{formatDate(t.last_message_at)}</span>
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-[#334155] mt-1 truncate">{lastMessage(t)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{(t.messages || []).length} پیام</p>
              </button>
            ))}
          </div>

          {/* Chat View */}
          {selectedThread ? (
            <div className="flex-1 flex flex-col border rounded-xl overflow-hidden bg-white">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b flex items-center justify-between bg-[#F8FAFC] shrink-0">
                <div className="text-sm">
                  <span className="font-semibold text-[#0F172A]">گفتگوی بازدیدکننده</span>
                  <span className="text-xs text-muted-foreground mr-2">{(selectedThread.messages || []).length} پیام</span>
                </div>
                {confirmDelete === selectedThread.id ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-destructive font-medium text-xs">آیا مطمئن هستید؟</span>
                    <Button size="sm" variant="destructive" onClick={() => deleteThread.mutate(selectedThread.id)} disabled={deleteThread.isPending}>
                      بله، حذف
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)}>خیر</Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(selectedThread.id)}
                    className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف چت
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#F8FAFC]" style={{ direction: 'rtl' }}>
                {(selectedThread.messages || []).length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">بدون پیام</p>
                ) : (
                  (selectedThread.messages || []).map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'visitor' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-6 ${
                        msg.role === 'visitor'
                          ? 'bg-white border text-[#334155] rounded-tr-sm'
                          : 'bg-primary text-white rounded-tl-sm'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.role === 'visitor' ? 'text-muted-foreground' : 'text-white/60'}`}>
                          {formatDate(msg.timestamp)} — {msg.role === 'visitor' ? 'بازدیدکننده' : 'پشتیبان'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply */}
              <div className="px-3 py-3 border-t bg-white flex items-center gap-2 shrink-0" style={{ direction: 'rtl' }}>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim() || sending}
                  className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
                <input
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="پاسخ خود را بنویسید..."
                  className="flex-1 text-sm bg-[#F8FAFC] border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-right"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 border rounded-xl flex items-center justify-center bg-[#F8FAFC]">
              <div className="text-center text-muted-foreground">
                <ChevronRight className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">یک گفتگو را از لیست انتخاب کنید</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}