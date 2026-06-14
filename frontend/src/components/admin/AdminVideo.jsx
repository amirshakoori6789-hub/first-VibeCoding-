import db from '@/api/api.js';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Video, Upload } from 'lucide-react';

export default function AdminVideo() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => db.entities.SiteSetting.list(),
    initialData: [],
  });

  const videoSetting = settings.find(s => s.key === 'video_url');

  useEffect(() => {
    if (videoSetting) setUrl(videoSetting.value || '');
  }, [videoSetting]);

  const saveMutation = useMutation({
    mutationFn: () => db.entities.SiteSetting.update(videoSetting.id, { value: url, enabled: !!url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('ویدیو ذخیره شد');
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    setUrl(file_url);
    setUploading(false);
    toast.success('ویدیو آپلود شد — ذخیره را فشار دهید');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">مدیریت ویدیو</h2>
          <p className="text-xs text-muted-foreground">ویدیوی معرفی صفحه اصلی و درباره ما</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">آدرس ویدیو (URL)</Label>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            dir="ltr"
            className="text-left"
          />
        </div>

        <div>
          <Label className="mb-2 block">یا آپلود فایل ویدیو</Label>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-muted-foreground file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
          />
          {uploading && <p className="text-sm text-muted-foreground mt-2">در حال آپلود...</p>}
        </div>

        {url && (
          <div className="rounded-xl overflow-hidden bg-black aspect-video max-w-lg">
            <video src={url} controls className="w-full h-full object-cover" preload="metadata" />
          </div>
        )}
      </div>

      <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="rounded-xl">
        <Save className="w-4 h-4 ml-2" />
        ذخیره تغییرات
      </Button>
    </div>
  );
}