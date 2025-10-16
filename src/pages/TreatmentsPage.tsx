import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Clock, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Treatment {
  id: string;
  patient_id: string;
  patient_name: string;
  treatment_type: string;
  treatment_date: string;
  status: string;
  notes?: string;
}

interface GroupedTreatments {
  [patientId: string]: {
    patientName: string;
    treatments: Treatment[];
  };
}

const TreatmentsPage: React.FC = () => {
  const { currentClinic } = useAuth();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [groupedTreatments, setGroupedTreatments] = useState<GroupedTreatments>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentClinic?.id) {
      fetchTreatments();
    }
  }, [currentClinic?.id]);

  const fetchTreatments = async () => {
    if (!currentClinic?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('treatments')
        .select(`
          id,
          patient_id,
          treatment_type,
          treatment_date,
          status,
          notes,
          patients!inner(full_name)
        `)
        .eq('clinic_id', currentClinic.id)
        .order('treatment_date', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedTreatments: Treatment[] = data?.map(t => ({
        id: t.id,
        patient_id: t.patient_id,
        patient_name: t.patients.full_name,
        treatment_type: t.treatment_type,
        treatment_date: t.treatment_date,
        status: t.status,
        notes: t.notes
      })) || [];

      setTreatments(transformedTreatments);

      // Group treatments by patient
      const grouped: GroupedTreatments = {};
      transformedTreatments.forEach(treatment => {
        if (!grouped[treatment.patient_id]) {
          grouped[treatment.patient_id] = {
            patientName: treatment.patient_name,
            treatments: []
          };
        }
        grouped[treatment.patient_id].treatments.push(treatment);
      });

      setGroupedTreatments(grouped);
    } catch (err: any) {
      console.error('Error fetching treatments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error loading treatments</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-100 to-teal-200 p-4 rounded-xl shadow-lg border border-green-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-green-200 p-2 rounded-lg">
              <User className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Treatment Management</h3>
              <p className="text-gray-600 text-sm">Patient treatment records and history</p>
            </div>
          </div>
          <div className="bg-green-200 text-gray-700 px-3 py-1 rounded-lg">
            <span className="text-sm font-medium">Total: {treatments.length}</span>
          </div>
        </div>
      </div>

      {Object.keys(groupedTreatments).length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No treatments</h3>
          <p className="mt-1 text-sm text-gray-500">No treatment records available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groupedTreatments).map(([patientId, patientData]) => (
            <motion.div
              key={patientId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-green-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Patient Header */}
              <div className="bg-gradient-to-r from-green-50 to-teal-100 px-4 py-3 border-b border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-200 p-2 rounded-lg">
                      <User className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{patientData.patientName}</h4>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                          {patientData.treatments.length} treatment{patientData.treatments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment Cards */}
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {patientData.treatments.map((treatment, index) => (
                    <div key={treatment.id} className="bg-gradient-to-br from-white to-green-25 rounded-lg p-2 border border-green-150 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <h5 className="font-bold text-gray-800 text-sm truncate">{treatment.treatment_type}</h5>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(treatment.status)}`}>
                          {treatment.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex space-x-2">
                          <div className="bg-blue-50 p-1 rounded border border-blue-200 flex-1">
                            <p className="text-xs text-blue-600 font-medium">Date</p>
                            <p className="text-sm font-bold text-blue-800">{new Date(treatment.treatment_date).toLocaleDateString()}</p>
                          </div>
                          <div className="bg-purple-50 p-1 rounded border border-purple-200 flex-1">
                            <p className="text-xs text-purple-600 font-medium">Time</p>
                            <p className="text-sm font-bold text-purple-800">{new Date(treatment.treatment_date).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>
                      {treatment.notes && (
                        <div className="mt-2 p-1 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <p className="text-xs text-yellow-800">
                            <span className="font-medium">Notes:</span> {treatment.notes.substring(0, 60)}{treatment.notes.length > 60 ? '...' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreatmentsPage;