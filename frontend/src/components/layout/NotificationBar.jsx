import db from '@/api/api.js';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { X } from 'lucide-react';

export default function NotificationBar() {
  const [dismissed, setDismissed] = React.useState(false);

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => db.entities.SiteSetting.list(),
    initialData: [],
  });

  const notification = settings.find(s => s.key === 'notification_text');
  
  if (!notification || !notification.enabled || !notification.value || dismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center text-sm font-medium relative">
      <span>{notification.value}</span>
      <button 
        onClick={() => setDismissed(true)}
        className="absolute left-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}