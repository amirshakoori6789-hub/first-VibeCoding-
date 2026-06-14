import db from '@/api/api.js';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { MessageSquare, User, Phone, Calendar, MessagesSquare } from 'lucide-react';
import AdminChats from './AdminChats';

export default function AdminMessages() {
  const [tab, setTab] = useState('contact');

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: () => db.entities.ContactMessage.list('-created_date'),
    enabled: tab === 'contact',
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#0F172A]">مدیریت پیامها</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-0">
        <button
          onClick={() => setTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'contact' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-[#334155]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          پیامهای تماس
        </button>
        <button
          onClick={() => setTab('chats')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'chats' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-[#334155]'
          }`}
        >
          <MessagesSquare className="w-4 h-4" />
          چتهای پشتیبانی
        </button>
      </div>

      {/* Contact Form Messages */}
      {tab === 'contact' && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">هیچ پیامی دریافت نشده است.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="border rounded-2xl p-5 bg-white shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                      <User className="w-4 h-4 text-primary" />
                      {msg.full_name}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1.5 text-[#334155]" dir="ltr">
                        <Phone className="w-4 h-4 text-primary" />
                        {msg.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-muted-foreground text-xs mr-auto">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(msg.created_date)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">موضوع:</p>
                    <p className="text-sm font-medium text-[#0F172A]">{msg.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">متن پیام:</p>
                    <p className="text-sm text-[#334155] leading-7 whitespace-pre-line">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Live Support Chats */}
      {tab === 'chats' && <AdminChats />}
    </div>
  );
}