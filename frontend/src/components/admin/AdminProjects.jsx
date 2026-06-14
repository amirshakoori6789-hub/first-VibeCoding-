import db from '@/api/api.js';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, FolderOpen, AlertCircle, Pencil, X, Save } from 'lucide-react';

function validateImageDimensions(file, w, h) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => { URL.revokeObjectURL(img.src); resolve(img.width === w && img.height === h); };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

export default function AdminProjects() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dimError, setDimError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.entities.Project.list('sort_order'),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Project.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success('پروژه حذف شد'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Project.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setEditingId(null); toast.success('ذخیره شد'); },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDimError('');
    if (!title.trim()) { toast.error('لطفاً عنوان پروژه را وارد کنید'); e.target.value = ''; return; }

    const valid = await validateImageDimensions(file, 400, 530);
    if (!valid) { setDimError('ابعاد تصویر باید دقیقاً ۴۰۰ در ۵۳۰ پیکسل باشد.'); e.target.value = ''; return; }

    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    await db.entities.Project.create({ title: title.trim(), image_url: file_url, sort_order: projects.length });
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setTitle('');
    setUploading(false);
    e.target.value = '';
    toast.success('پروژه اضافه شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">مدیریت پروژهها</h2>
          <p className="text-xs text-muted-foreground">ابعاد تصویر: ۴۰۰ × ۵۳۰ پیکسل (عمودی)</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-sm">افزودن پروژه جدید</h3>
        <div>
          <Label className="mb-2 block text-sm">عنوان پروژه</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان پروژه..." />
        </div>
        <div>
          <Label className="mb-2 block text-sm">تصویر پروژه (۴۰۰×۵۳۰)</Label>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading}
            className="block w-full text-sm text-muted-foreground file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer" />
        </div>
        {dimError && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />{dimError}
          </div>
        )}
        {uploading && <p className="text-sm text-muted-foreground">در حال آپلود...</p>}
      </div>

      <div className="space-y-4">
        {projects.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">پروژهای اضافه نشده است</p>}
        {projects.map((p) => (
          <div key={p.id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
            <img src={p.image_url} alt={p.title} className="w-24 h-32 rounded-lg border object-cover shrink-0" />
            <div className="flex-1">
              {editingId === p.id ? (
                <div className="flex gap-2 items-center">
                  <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-sm" />
                  <Button size="sm" onClick={() => updateMutation.mutate({ id: p.id, data: { title: editTitle } })}>
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <p className="font-medium text-[#0F172A]">{p.title}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="icon" onClick={() => { setEditingId(p.id); setEditTitle(p.title); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(p.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}