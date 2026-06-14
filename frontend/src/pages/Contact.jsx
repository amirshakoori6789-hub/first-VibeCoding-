import db from '@/api/api.js';

import React, { useState } from 'react';

import { Send, MapPin, Phone, MessageSquare, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.subject || !form.message) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }
    setSending(true);
    await db.entities.ContactMessage.create(form);
    toast.success('پیام شما با موفقیت ارسال شد');
    setForm({ full_name: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#0F172A] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">تماس با ما</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6">ارتباط با آسا پمپ</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="mb-2 block text-sm">نام و نام خانوادگی *</Label>
                  <Input
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    placeholder="نام خود را وارد کنید"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">تلفن</Label>
                  <Input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="شماره تلفن (اختیاری)"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">موضوع *</Label>
                  <Input
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="موضوع پیام"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm">پیام شما *</Label>
                  <Textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="پیام خود را بنویسید..."
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={sending} className="w-full text-base py-6 rounded-xl">
                  <Send className="w-4 h-4 ml-2" />
                  {sending ? 'در حال ارسال...' : 'ارسال پیام ✈'}
                </Button>
              </form>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 h-full">
              <h2 className="text-xl font-bold mb-8">اطلاعات تماس</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">آدرس</p>
                    <p className="text-sm leading-7">مشهد، ایثارگران، پیامبر اعظم، پیامبر اعظم، ۷۵، آزادی ۱۳۱/۳</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">تلفن</p>
                    <p className="text-sm" dir="ltr">09961244101 | 09157372377</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">کانال بله</p>
                    <p className="text-sm">@ASA_PUMP</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">ایمیل</p>
                    <p className="text-sm">Asa.pump@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}