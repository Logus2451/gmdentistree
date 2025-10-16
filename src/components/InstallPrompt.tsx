import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const InstallPrompt: React.FC = () => {
  const { isInstallable, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  // Debug: Show install prompt after 3 seconds for testing
  useEffect(() => {
    const timer = setTimeout(() => setForceShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if ((!isInstallable && !forceShow) || isDismissed) return null;

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (!installed) {
      setIsDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
      >
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Smartphone className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">Install Dentistree App</h3>
            <p className="text-gray-600 text-xs mt-1">
              Get quick access to book appointments and manage your dental care.
            </p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-600 transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>Install</span>
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-gray-500 hover:text-gray-700 p-1.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;