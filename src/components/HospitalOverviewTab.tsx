import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, Users, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Hospital {
  id: string;
  hospital_name: string;
  hospital_code: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  is_active: boolean;
  created_at: string;
}

interface Clinic {
  id: string;
  clinic_name: string;
  clinic_code: string;
  address?: string;
  phone?: string;
  email?: string;
  total_patients: number;
  is_active: boolean;
}

const HospitalOverviewTab: React.FC = () => {
  const { adminUser, currentClinic } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminUser?.hospital_id) {
      fetchHospitalData();
    }
  }, [adminUser?.hospital_id]);

  const fetchHospitalData = async () => {
    if (!adminUser?.hospital_id) return;
    
    try {
      // Fetch hospital details
      const { data: hospitalData, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', adminUser.hospital_id)
        .single();

      if (hospitalError) throw hospitalError;
      setHospital(hospitalData);

      // Fetch all clinics under this hospital
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('*')
        .eq('hospital_id', adminUser.hospital_id)
        .eq('is_active', true)
        .order('clinic_name');

      if (clinicsError) throw clinicsError;
      setClinics(clinicsData || []);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  if (!hospital) {
    return (
      <div className="text-center py-8">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hospital information</h3>
        <p className="mt-1 text-sm text-gray-500">Hospital data not found for this clinic.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Hospital Overview</h3>

      {/* Hospital Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">{hospital.hospital_name}</h4>
            <p className="text-sm text-gray-600">Hospital Code: {hospital.hospital_code}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {hospital.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{hospital.address}</p>
                </div>
              </div>
            )}

            {hospital.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{hospital.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {hospital.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{hospital.email}</p>
                </div>
              </div>
            )}

            {hospital.contact_person && (
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Contact Person</p>
                  <p className="text-sm text-gray-600">{hospital.contact_person}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Established</p>
                <p className="text-sm text-gray-600">
                  {new Date(hospital.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinics Under Hospital */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Clinics ({clinics.length})
        </h4>

        {clinics.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No clinics found under this hospital.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clinics.map((clinic) => (
              <div 
                key={clinic.id} 
                className={`border rounded-lg p-4 ${
                  clinic.id === currentClinic?.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">{clinic.clinic_name}</h5>
                  {clinic.id === currentClinic?.id && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">Code: {clinic.clinic_code}</p>
                
                {clinic.address && (
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{clinic.address}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{clinic.total_patients} patients</span>
                  </div>
                  
                  {clinic.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{clinic.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hospital Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Hospital Statistics</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{clinics.length}</div>
            <div className="text-sm text-gray-600">Total Clinics</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {clinics.reduce((sum, clinic) => sum + clinic.total_patients, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {clinics.filter(c => c.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active Clinics</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(clinics.reduce((sum, clinic) => sum + clinic.total_patients, 0) / clinics.length) || 0}
            </div>
            <div className="text-sm text-gray-600">Avg Patients/Clinic</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalOverviewTab;