import { useState, useEffect } from 'react';

interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
}

export const useNotification = () => {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    isSupported: false
  });

  useEffect(() => {
    if ('Notification' in window) {
      setState({
        permission: Notification.permission,
        isSupported: true
      });
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!state.isSupported) return 'denied';
    
    const permission = await Notification.requestPermission();
    setState(prev => ({ ...prev, permission }));
    return permission;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (state.permission === 'granted' && state.isSupported) {
      new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      });
    }
  };

  return {
    ...state,
    requestPermission,
    sendNotification
  };
};