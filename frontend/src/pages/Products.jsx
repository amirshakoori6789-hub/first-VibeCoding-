import db from '@/api/api.js';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Package } from 'lucide-react';

export default function Products() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

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
    queryFn: () => db.entities.Product.list('sort_order'),
  });

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(catId);
    setSelectedSubcategoryId(null);
    const subs = subcategories.filter(s => s.category_id === catId);
    if (subs.length > 0) {
      setExpandedCategories(prev => ({ ...prev, [catId]: true }));
    }
  };

  const handleSubcategoryClick = (catId, subId) => {
    setSelectedCategoryId(catId);
    setSelectedSubcategoryId(subId);
  };

  const filteredProducts = products.filter(p => {
    if (selectedSubcategoryId) return p.subcategory_id === selectedSubcategoryId;
    if (selectedCategoryId) return p.category_id === selectedCategoryId;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#0F172A] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">محصولات ما</h1>
          <p className="text-gray-400 text-base sm:text-lg">پمپهای کفکش و لجنکش با بالاترین کیفیت</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar — Categories */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden sticky top-24">
              <div className="bg-[#0F172A] px-4 py-3">
                <h2 className="text-white font-bold text-sm">دستهبندیها</h2>
              </div>
              {categories.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">دستهبندی وجود ندارد</div>
              ) : (
                <ul className="divide-y">
                  <li>
                    <button
                      onClick={() => { setSelectedCategoryId(null); setSelectedSubcategoryId(null); }}
                      className={`w-full text-right px-4 py-3 text-sm font-medium transition-colors ${!selectedCategoryId ? 'bg-primary/10 text-primary' : 'text-[#334155] hover:bg-muted'}`}
                    >
                      همه محصولات
                    </button>
                  </li>
                  {categories.map(cat => {
                    const subs = subcategories.filter(s => s.category_id === cat.id);
                    const isExpanded = expandedCategories[cat.id];
                    const isSelected = selectedCategoryId === cat.id && !selectedSubcategoryId;
                    return (
                      <li key={cat.id}>
                        <div
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'text-[#334155] hover:bg-muted'}`}
                          onClick={() => handleCategoryClick(cat.id)}
                        >
                          <span className="text-sm font-medium">{cat.name}</span>
                          {subs.length > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleCategory(cat.id); }}
                              className="p-0.5"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        {subs.length > 0 && isExpanded && (
                          <ul className="bg-muted/40">
                            {subs.map(sub => (
                              <li key={sub.id}>
                                <button
                                  onClick={() => handleSubcategoryClick(cat.id, sub.id)}
                                  className={`w-full text-right px-8 py-2.5 text-sm transition-colors ${selectedSubcategoryId === sub.id ? 'text-primary font-semibold' : 'text-[#475569] hover:text-primary'}`}
                                >
                                  {sub.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          {/* Main Product Grid */}
          <main className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Package className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">محصولی یافت نشد</h2>
                <p className="text-muted-foreground text-sm">در این دستهبندی هنوز محصولی اضافه نشده است.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="overflow-hidden bg-muted" style={{ width: '100%', aspectRatio: '800/600' }}>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-[#0F172A] line-clamp-2">{product.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}