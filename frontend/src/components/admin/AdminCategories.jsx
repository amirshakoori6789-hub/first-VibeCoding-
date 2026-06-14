import db from '@/api/api.js';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, ChevronDown, ChevronLeft } from 'lucide-react';

export default function AdminCategories() {
  const qc = useQueryClient();
  const [newCatName, setNewCatName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubCatId, setNewSubCatId] = useState('');
  const [expandedCats, setExpandedCats] = useState({});

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => db.entities.Category.list('sort_order'),
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => db.entities.Subcategory.list('sort_order'),
  });

  const createCat = useMutation({
    mutationFn: (name) => db.entities.Category.create({ name, sort_order: categories.length }),
    onSuccess: () => { qc.invalidateQueries(['categories']); setNewCatName(''); },
  });

  const deleteCat = useMutation({
    mutationFn: (id) => db.entities.Category.delete(id),
    onSuccess: () => { qc.invalidateQueries(['categories']); qc.invalidateQueries(['subcategories']); },
  });

  const createSub = useMutation({
    mutationFn: ({ name, category_id }) => db.entities.Subcategory.create({ name, category_id, sort_order: 0 }),
    onSuccess: () => { qc.invalidateQueries(['subcategories']); setNewSubName(''); setNewSubCatId(''); },
  });

  const deleteSub = useMutation({
    mutationFn: (id) => db.entities.Subcategory.delete(id),
    onSuccess: () => qc.invalidateQueries(['subcategories']),
  });

  const toggleExpand = (id) => setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-[#0F172A]">مدیریت دستهبندیها</h2>

      {/* Add Category */}
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm text-[#334155]">افزودن دستهبندی جدید</h3>
        <div className="flex gap-2">
          <Input
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            placeholder="نام دستهبندی"
            className="flex-1"
          />
          <Button
            onClick={() => newCatName.trim() && createCat.mutate(newCatName.trim())}
            disabled={!newCatName.trim() || createCat.isPending}
          >
            <Plus className="w-4 h-4 ml-1" />
            افزودن
          </Button>
        </div>
      </div>

      {/* Add Subcategory */}
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm text-[#334155]">افزودن زیردسته جدید</h3>
        <div className="flex gap-2 flex-col sm:flex-row">
          <select
            value={newSubCatId}
            onChange={e => setNewSubCatId(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">انتخاب دستهبندی</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Input
            value={newSubName}
            onChange={e => setNewSubName(e.target.value)}
            placeholder="نام زیردسته"
            className="flex-1"
          />
          <Button
            onClick={() => newSubName.trim() && newSubCatId && createSub.mutate({ name: newSubName.trim(), category_id: newSubCatId })}
            disabled={!newSubName.trim() || !newSubCatId || createSub.isPending}
          >
            <Plus className="w-4 h-4 ml-1" />
            افزودن
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-6">هیچ دستهبندی وجود ندارد.</p>
        )}
        {categories.map(cat => {
          const subs = subcategories.filter(s => s.category_id === cat.id);
          const expanded = expandedCats[cat.id];
          return (
            <div key={cat.id} className="border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleExpand(cat.id)} className="text-muted-foreground">
                    {subs.length > 0 ? (expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />) : <span className="w-4 h-4 inline-block" />}
                  </button>
                  <span className="font-semibold text-sm text-[#0F172A]">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">({subs.length} زیردسته)</span>
                </div>
                <button onClick={() => deleteCat.mutate(cat.id)} className="text-destructive hover:opacity-70 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {expanded && subs.length > 0 && (
                <ul className="bg-muted/30 divide-y border-t">
                  {subs.map(sub => (
                    <li key={sub.id} className="flex items-center justify-between px-8 py-2.5">
                      <span className="text-sm text-[#334155]">{sub.name}</span>
                      <button onClick={() => deleteSub.mutate(sub.id)} className="text-destructive hover:opacity-70 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}