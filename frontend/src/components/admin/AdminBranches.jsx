import db from '@/api/api.js';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Building2, AlertCircle, Pencil, X, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function validateImageDimensions(file, w, h) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => { URL.revokeObjectURL(img.src); resolve(img.width === w && img.height === h); };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

export default function AdminBranches() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', phone: '', address: '', link_url: '' });
  const [uploading, setUploading] = useState(false);
  const [dimError, setDimError] = useState('');
  const [editBranch, setEditBranch] = useState(null);

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => db.entities.Branch.list('sort_order'),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Branch.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }); toast.success('شعبه حذف شد'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Branch.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }); setEditBranch(null); toast.success('ذخیره شد'); },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDimError('');
    if (!form.name.trim()) { toast.error('لطفاً نام شعبه را وارد کنید'); e.target.value = ''; return; }

    const valid = await validateImageDimensions(file, 600, 400);
    if (!valid) { setDimError('ابعاد تصویر باید دقیقاً ۶۰۰ در ۴۰۰ پیکسل باشد.'); e.target.value = ''; return; }

    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    await db.entities.Branch.create({
      ...form,
      image_url: file_url,
      sort_order: branches.length,
    });
    queryClient.invalidateQueries({ queryKey: ['branches'] });
    setForm({ name: '', phone: '', address: '', link_url: '' });
    setUploading(false);
    e.target.value = '';
    toast.success('شعبه اضافه شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">مدیریت شعب</h2>
          <p className="text-xs text-muted-foreground">ابعاد تصویر: ۶۰۰ × ۴۰۰ پیکسل</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-sm">افزودن شعبه جدید</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block text-sm">نام شعبه *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="نام شعبه" />
          </div>
          <div>
            <Label className="mb-2 block text-sm">تلفن</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="شماره تلفن" dir="ltr" className="text-left" />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-2 block text-sm">آدرس</Label>
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="آدرس شعبه" />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-2 block text-sm">لینک صفحه</Label>
            <Input value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." dir="ltr" className="text-left" />
          </div>
        </div>
        <div>
          <Label className="mb-2 block text-sm">تصویر شعبه (۶۰۰×۴۰۰)</Label>
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
        {branches.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">شعبهای اضافه نشده است</p>}
        {branches.map((b) => (
          <div key={b.id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
            {b.image_url && (
              <img src={b.image_url} alt={b.name} className="w-32 h-20 rounded-lg border object-cover shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-bold text-[#0F172A] mb-1">{b.name}</p>
              {b.phone && <p className="text-xs text-muted-foreground" dir="ltr">{b.phone}</p>}
              {b.address && <p className="text-xs text-muted-foreground mt-1">{b.address}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="icon" onClick={() => setEditBranch(b)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(b.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editBranch} onOpenChange={(open) => !open && setEditBranch(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش شعبه</DialogTitle>
          </DialogHeader>
          {editBranch && (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm">نام شعبه</Label>
                <Input defaultValue={editBranch.name} onChange={e => setEditBranch({ ...editBranch, name: e.target.value })} />
              </div>
              <div>
                <Label className="mb-2 block text-sm">تلفن</Label>
                <Input defaultValue={editBranch.phone} onChange={e => setEditBranch({ ...editBranch, phone: e.target.value })} dir="ltr" className="text-left" />
              </div>
              <div>
                <Label className="mb-2 block text-sm">آدرس</Label>
                <Input defaultValue={editBranch.address} onChange={e => setEditBranch({ ...editBranch, address: e.target.value })} />
              </div>
              <div>
                <Label className="mb-2 block text-sm">لینک صفحه</Label>
                <Input defaultValue={editBranch.link_url} onChange={e => setEditBranch({ ...editBranch, link_url: e.target.value })} dir="ltr" className="text-left" />
              </div>
              <Button onClick={() => updateMutation.mutate({
                id: editBranch.id,
                data: { name: editBranch.name, phone: editBranch.phone, address: editBranch.address, link_url: editBranch.link_url }
              })} className="w-full rounded-xl">
                <Save className="w-4 h-4 ml-2" />
                ذخیره تغییرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}