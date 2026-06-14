import db from '@/api/api.js';

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ArrowRight, Download, Package, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductDetail() {
  const { id } = useParams();
  const [showOrderPopup, setShowOrderPopup] = useState(false);

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => db.entities.Product.get(id),
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.subcategory_id, product?.category_id, id],
    queryFn: () => {
      if (product?.subcategory_id) {
        return db.entities.Product.filter({ subcategory_id: product.subcategory_id });
      }
      return db.entities.Product.filter({ category_id: product.category_id });
    },
    enabled: !!product,
    select: data => data.filter(p => p.id !== id),
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fileUrls = product.file_urls || [];
  const fileNames = product.file_names || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-[#0F172A] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/products" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            محصولات
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Image — right side */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ width: '100%', aspectRatio: '800/600' }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{product.name}</h1>

            {/* Specifications */}
            {product.specifications && (
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4 pb-2 border-b">مشخصات فنی</h2>
                <div className="text-sm text-[#334155] leading-7 whitespace-pre-line">{product.specifications}</div>
              </div>
            )}

            {/* Files */}
            {fileUrls.length > 0 && (
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4 pb-2 border-b">فایلهای محصول</h2>
                <ul className="space-y-2">
                  {fileUrls.map((url, idx) => (
                    <li key={idx}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors text-sm text-primary font-medium"
                      >
                        <Download className="w-4 h-4 shrink-0" />
                        {fileNames[idx] || `فایل ${idx + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Order Button */}
            <Button
              size="lg"
              className="w-full sm:w-auto px-10"
              onClick={() => setShowOrderPopup(true)}
            >
              ثبت سفارش
            </Button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-6">محصولات مرتبط</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="overflow-hidden bg-muted" style={{ width: '100%', aspectRatio: '800/600' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="group-hover:scale-105 transition-transform duration-300" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[#0F172A] line-clamp-2">{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Popup */}
      {showOrderPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowOrderPopup(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">ثبت سفارش</h3>
            <p className="text-muted-foreground text-sm mb-4">برای ثبت سفارش با ما تماس بگیرید:</p>
            <a href="tel:09157372377" className="text-2xl font-bold text-primary" dir="ltr">09157372377</a>
            <Button variant="outline" className="mt-6 w-full" onClick={() => setShowOrderPopup(false)}>بستن</Button>
          </div>
        </div>
      )}
    </div>
  );
}