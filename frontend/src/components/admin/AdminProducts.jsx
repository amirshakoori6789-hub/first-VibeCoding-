import db from '@/api/api.js';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Upload, Loader2, Package } from 'lucide-react';

export default function AdminProducts() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    specifications: '',
    category_id: '',
    subcategory_id: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [productFiles, setProductFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => db.entities.Category.list('sort_order'),
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => db.entities.Subcategory.list('sort_order'),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => db.entities.Product.list('-created_date'),
  });

  const filteredSubs = subcategories.filter(s => s.category_id === form.category_id);

  const deleteProduct = useMutation({
    mutationFn: (id) => db.entities.Product.delete(id),
    onSuccess: () => qc.invalidateQueries(['products']),
  });

  const resizeImageTo800x600 = (file) => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      // Cover: scale to fill 800x600, crop center
      const scale = Math.max(800 / img.width, 600 / img.height);
      const sw = 800 / scale;
      const sh = 600 / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 800, 600);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.92);
    };
    img.src = url;
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const resized = await resizeImageTo800x600(file);
    setImageFile(resized);
    setImagePreview(URL.createObjectURL(resized));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setProductFiles(prev => [...prev, ...files]);
  };

  const removeFile = (idx) => {
    setProductFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.category_id) return;
    setUploading(true);
    let image_url = '';
    let file_urls = [];
    let file_names = [];

    if (imageFile) {
      const res = await db.integrations.Core.UploadFile({ file: imageFile });
      image_url = res.file_url;
    }

    for (const f of productFiles) {
      const res = await db.integrations.Core.UploadFile({ file: f });
      file_urls.push(res.file_url);
      file_names.push(f.name);
    }

    await db.entities.Product.create({
      name: form.name.trim(),
      specifications: form.specifications.trim(),
      category_id: form.category_id,
      subcategory_id: form.subcategory_id || undefined,
      image_url,
      file_urls,
      file_names,
      sort_order: products.length,
    });

    qc.invalidateQueries(['products']);
    setForm({ name: '', specifications: '', category_id: '', subcategory_id: '' });
    setImageFile(null);
    setImagePreview('');
    setProductFiles([]);
    setUploading(false);
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || '—';
  const getSubName = (id) => subcategories.find(s => s.id === id)?.name || '';

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-[#0F172A]">مدیریت محصولات</h2>

      {/* Add Product Form */}
      <div className="border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-sm text-[#334155]">افزودن محصول جدید</h3>

        {/* Image Upload */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">تصویر محصول</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
              <Upload className="w-4 h-4" />
              آپلود تصویر
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="" className="w-16 h-16 rounded-lg object-cover border" />
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">نام محصول *</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="نام محصول" />
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">مشخصات فنی</label>
          <textarea
            value={form.specifications}
            onChange={e => setForm(f => ({ ...f, specifications: e.target.value }))}
            placeholder="مشخصات فنی محصول را وارد کنید..."
            rows={4}
            className="w-full border rounded-md px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Files */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">فایلهای محصول (PDF و غیره)</label>
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors w-fit">
            <Upload className="w-4 h-4" />
            افزودن فایل
            <input type="file" multiple className="hidden" onChange={handleFilesChange} />
          </label>
          {productFiles.length > 0 && (
            <ul className="mt-2 space-y-1">
              {productFiles.map((f, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm px-3 py-1.5 bg-muted rounded-lg">
                  <span className="truncate">{f.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-destructive mr-2 shrink-0">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">دستهبندی *</label>
          <select
            value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value, subcategory_id: '' }))}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">انتخاب دستهبندی</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Subcategory — only if selected category has subs */}
        {form.category_id && filteredSubs.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">زیردسته</label>
            <select
              value={form.subcategory_id}
              onChange={e => setForm(f => ({ ...f, subcategory_id: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">بدون زیردسته</option>
              {filteredSubs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.category_id || uploading}
          className="w-full sm:w-auto"
        >
          {uploading ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />در حال آپلود...</> : <><Plus className="w-4 h-4 ml-2" />افزودن محصول</>}
        </Button>
      </div>

      {/* Products List */}
      <div>
        <h3 className="font-semibold text-sm text-[#334155] mb-3">لیست محصولات ({products.length})</h3>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">هیچ محصولی وجود ندارد.</p>
        ) : (
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="flex items-center gap-3 border rounded-xl p-3 bg-white">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0F172A] truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{getCategoryName(p.category_id)}{p.subcategory_id ? ` / ${getSubName(p.subcategory_id)}` : ''}</p>
                </div>
                <button onClick={() => deleteProduct.mutate(p.id)} className="text-destructive hover:opacity-70 p-1 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}