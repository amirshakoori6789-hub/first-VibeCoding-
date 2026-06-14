import db from '@/api/api.js';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Image, Link as LinkIcon, Save, AlertCircle } from 'lucide-react';

function validateImageDimensions(file, requiredW, requiredH) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img.width === requiredW && img.height === requiredH);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

export default function AdminBanners() {
  const queryClient = useQueryClient();
  const [newLink, setNewLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dimError, setDimError] = useState('');

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => db.entities.Banner.list('sort_order'),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Banner.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('بنر حذف شد');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Banner.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('بنر ذخیره شد');
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDimError('');

    const valid = await validateImageDimensions(file, 1920, 600);
    if (!valid) {
      setDimError('ابعاد تصویر باید دقیقاً ۱۹۲۰ در ۶۰۰ پیکسل باشد.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    await db.entities.Banner.create({
      image_url: file_url,
      link_url: newLink,
      sort_order: banners.length,
    });
    queryClient.invalidateQueries({ queryKey: ['banners'] });
    setNewLink('');
    setUploading(false);
    e.target.value = '';
    toast.success('بنر اضافه شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Image className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">مدیریت بنرها / اسلایدر</h2>
          <p className="text-xs text-muted-foreground">ابعاد مجاز: ۱۹۲۰ × ۶۰۰ پیکسل</p>
        </div>
      </div>

      {/* Upload New */}
      <div className="bg-muted/50 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-sm">افزودن بنر جدید</h3>
        <div>
          <Label className="mb-2 block text-sm">لینک بنر (اختیاری)</Label>
          <Input
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            placeholder="https://..."
            dir="ltr"
            className="text-left"
          />
        </div>
        <div>
          <Label className="mb-2 block text-sm">تصویر بنر (۱۹۲۰×۶۰۰)</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-muted-foreground file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
          />
        </div>
        {dimError && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {dimError}
          </div>
        )}
        {uploading && <p className="text-sm text-muted-foreground">در حال آپلود...</p>}
      </div>

      {/* Banner List */}
      <div className="space-y-4">
        {banners.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">بنری اضافه نشده است</p>
        )}
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={banner.image_url}
              alt="بنر"
              className="w-full sm:w-48 h-auto rounded-lg border object-cover"
              style={{ aspectRatio: '1920/600' }}
            />
            <div className="flex-1 space-y-2 w-full">
              <div>
                <Label className="text-xs mb-1 block">لینک</Label>
                <Input
                  defaultValue={banner.link_url || ''}
                  dir="ltr"
                  className="text-left text-sm"
                  onBlur={e => {
                    if (e.target.value !== (banner.link_url || '')) {
                      updateMutation.mutate({ id: banner.id, data: { link_url: e.target.value } });
                    }
                  }}
                />
              </div>
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="shrink-0"
              onClick={() => deleteMutation.mutate(banner.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}