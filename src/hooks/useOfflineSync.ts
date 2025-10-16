import { useState, useEffect } from 'react';

interface OfflineData {
  id: string;
  type: 'appointment' | 'contact';
  data: any;
  timestamp: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending data from localStorage
    const stored = localStorage.getItem('pendingSync');
    if (stored) {
      setPendingSync(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToQueue = (type: 'appointment' | 'contact', data: any) => {
    const item: OfflineData = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now()
    };

    const updated = [...pendingSync, item];
    setPendingSync(updated);
    localStorage.setItem('pendingSync', JSON.stringify(updated));
  };

  const syncPendingData = async () => {
    if (!isOnline || pendingSync.length === 0) return;

    // Simulate sync process
    for (const item of pendingSync) {
      try {
        // Here you would sync with your backend
        console.log('Syncing:', item);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Sync failed:', error);
        return;
      }
    }

    setPendingSync([]);
    localStorage.removeItem('pendingSync');
  };

  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      syncPendingData();
    }
  }, [isOnline]);

  return {
    isOnline,
    pendingSync: pendingSync.length,
    addToQueue,
    syncPendingData
  };
};