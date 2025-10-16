import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  hospital_id: string;
}

interface Clinic {
  id: string;
  clinic_name: string;
  hospital_id: string;
}

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  currentClinic: Clinic | null;
  availableClinics: Clinic[];
  loading: boolean;
  error: string | null;
  switchClinic: (clinicId: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [currentClinic, setCurrentClinic] = useState<Clinic | null>(null);
  const [availableClinics, setAvailableClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async (userId: string) => {
    try {
      setError(null);
      
      // Get admin user data
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      setAdminUser(adminData);

      // Get available clinics for this hospital
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('id, clinic_name, hospital_id')
        .eq('hospital_id', adminData.hospital_id)
        .eq('is_active', true)
        .order('clinic_name');

      if (clinicsError) {
        throw new Error('Failed to load clinics');
      }

      setAvailableClinics(clinicsData || []);

      // Restore selected clinic from localStorage or set first as default
      const savedClinicId = localStorage.getItem('selectedClinicId');
      if (savedClinicId && clinicsData) {
        const savedClinic = clinicsData.find(c => c.id === savedClinicId);
        if (savedClinic) {
          setCurrentClinic(savedClinic);
        } else if (clinicsData.length > 0) {
          setCurrentClinic(clinicsData[0]);
        }
      } else if (clinicsData && clinicsData.length > 0) {
        setCurrentClinic(clinicsData[0]);
      }
    } catch (error: any) {
      console.error('Failed to load user data:', error);
      setError(error.message);
      setUser(null);
      setAdminUser(null);
      setAvailableClinics([]);
      setCurrentClinic(null);
    }
  }, []);

  const switchClinic = (clinicId: string) => {
    const clinic = availableClinics.find(c => c.id === clinicId);
    if (clinic) {
      setCurrentClinic(clinic);
      localStorage.setItem('selectedClinicId', clinicId);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdminUser(null);
    setCurrentClinic(null);
    setAvailableClinics([]);
    setError(null);
    localStorage.removeItem('selectedClinicId');
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        }
      } catch (error: any) {
        console.error('Auth initialization failed:', error);
        setError(error.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event, 'adminUser exists:', !!adminUser, 'mounted:', mounted);
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setAdminUser(null);
          setCurrentClinic(null);
          setAvailableClinics([]);
          setError(null);
          localStorage.removeItem('selectedClinicId');
          setLoading(false);
        }
        // Removed SIGNED_IN handling to prevent reload on app switch
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    adminUser,
    currentClinic,
    availableClinics,
    loading,
    error,
    switchClinic,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};