import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Clock } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';

const OfflineIndicator: React.FC = () => {
  const { isOnline, pendingSync } = useOfflineSync();

  return (
    <AnimatePresence>
      {(!isOnline || pendingSync > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium z-50"
        >
          <div className="flex items-center justify-center space-x-2">
            {!isOnline ? (
              <>
                <WifiOff className="h-4 w-4" />
                <span>You're offline. Data will sync when connection returns.</span>
              </>
            ) : pendingSync > 0 ? (
              <>
                <Clock className="h-4 w-4" />
                <span>Syncing {pendingSync} pending items...</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                <span>Back online! Data synced successfully.</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;