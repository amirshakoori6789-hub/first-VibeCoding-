import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, adminLogout } from '@/lib/adminAuth';
import { Bell, Image, Video, FolderOpen, Building2, LogOut, ChevronLeft, Tag, Package, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminNotifications from '@/components/admin/AdminNotifications';
import AdminBanners from '@/components/admin/AdminBanners';
import AdminVideo from '@/components/admin/AdminVideo';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminBranches from '@/components/admin/AdminBranches';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminMessages from '@/components/admin/AdminMessages';

const tabs = [
  { id: 'notifications', label: 'نوار اطلاعرسانی', icon: Bell },
  { id: 'banners', label: 'بنرها / اسلایدر', icon: Image },
  { id: 'video', label: 'ویدیو', icon: Video },
  { id: 'projects', label: 'پروژهها', icon: FolderOpen },
  { id: 'branches', label: 'شعب', icon: Building2 },
  { id: 'categories', label: 'دستهبندیها', icon: Tag },
  { id: 'products', label: 'محصولات', icon: Package },
  { id: 'messages', label: 'پیامها', icon: MessageSquare },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin');
    }
  }, [navigate]);

  if (!isAdminLoggedIn()) return null;

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications': return <AdminNotifications />;
      case 'banners': return <AdminBanners />;
      case 'video': return <AdminVideo />;
      case 'projects': return <AdminProjects />;
      case 'branches': return <AdminBranches />;
      case 'categories': return <AdminCategories />;
      case 'products': return <AdminProducts />;
      case 'messages': return <AdminMessages />;
      default: return null;
    }
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Bar */}
      <div className="bg-[#0F172A] text-white px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">آ</span>
            </div>
            <span className="font-bold">پنل مدیریت آسا پمپ</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4 ml-2" />
            خروج
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-[#334155] hover:bg-white'}`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile Tab Selector */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 px-2 py-2 flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all min-w-[64px] shrink-0
                  ${activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-[#334155]'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0 pb-24 lg:pb-0">
            <div className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}