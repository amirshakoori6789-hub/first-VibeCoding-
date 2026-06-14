import db from '@/api/api.js';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Bell } from 'lucide-react';

export default function AdminNotifications() {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(true);

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => db.entities.SiteSetting.list(),
    initialData: [],
  });

  const notification = settings.find(s => s.key === 'notification_text');

  useEffect(() => {
    if (notification) {
      setText(notification.value || '');
      setEnabled(notification.enabled !== false);
    }
  }, [notification]);

  const saveMutation = useMutation({
    mutationFn: () => db.entities.SiteSetting.update(notification.id, { value: text, enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('تنظیمات ذخیره شد');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">مدیریت نوار اطلاعرسانی</h2>
          <p className="text-xs text-muted-foreground">متن و وضعیت نمایش نوار بالای سایت</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">متن اطلاعرسانی</Label>
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="متن نوار اطلاعرسانی..." />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <Label>{enabled ? 'نمایش فعال' : 'نمایش غیرفعال'}</Label>
        </div>
      </div>

      <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="rounded-xl">
        <Save className="w-4 h-4 ml-2" />
        ذخیره تغییرات
      </Button>
    </div>
  );
}