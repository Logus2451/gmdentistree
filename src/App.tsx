import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';

import FAQPage from './pages/FAQPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import PatientRecordPage from './pages/PatientRecordPage';
import TreatmentsPage from './pages/TreatmentsPage';
import VideoConsultationPage from './pages/VideoConsultationPage';
import TwilioChat from './components/TwilioChat';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { AuthProvider } from './contexts/AuthContext';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <OfflineIndicator />
          <Header />
          <motion.main 
            className="flex-grow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/booking" element={<BookingPage />} />

              <Route path="/faq" element={<FAQPage />} />
              <Route path="/video-consultation" element={<VideoConsultationPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/patient/:patientId" element={
                <ProtectedRoute>
                  <PatientRecordPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/treatments" element={
                <ProtectedRoute>
                  <TreatmentsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </motion.main>
          <Footer />
          <TwilioChat />
          <InstallPrompt />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
