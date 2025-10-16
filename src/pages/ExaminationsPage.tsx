import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit, Trash2, Eye, Stethoscope, User, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/AdminHeader';

interface Examination {
  id: string;
  patientId: string;
  patientName: string;
  toothNumber: string;
  examinationType: string;
  findings?: string;
  treatmentRequired: boolean;
  notes?: string;
  examinedBy?: string;
  examinationDate: string;
  createdAt: string;
}

const ExaminationsPage: React.FC = () => {
  const { currentClinic } = useAuth();
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [treatmentFilter, setTreatmentFilter] = useState<string>('all');

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    if (!currentClinic?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('examinations')
        .select(`
          *,
          patients!inner(full_name)
        `)
        .eq('clinic_id', currentClinic.id)
        .order('examination_date', { ascending: false });

      if (error) throw error;

      const transformedExaminations: Examination[] = data?.map(e => ({
        id: e.id,
        patientId: e.patient_id,
        patientName: e.patients.full_name,
        toothNumber: e.tooth_number,
        examinationType: e.examination_type,
        findings: e.findings || '',
        treatmentRequired: e.treatment_required || false,
        notes: e.notes || '',
        examinedBy: e.examined_by || '',
        examinationDate: e.examination_date,
        createdAt: e.created_at
      })) || [];

      setExaminations(transformedExaminations);
    } catch (error) {
      console.error('Error fetching examinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExaminations = examinations.filter(examination => {
    const matchesSearch = examination.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         examination.examinationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         examination.toothNumber.includes(searchTerm) ||
                         examination.examinedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTreatment = treatmentFilter === 'all' || 
                           (treatmentFilter === 'required' && examination.treatmentRequired) ||
                           (treatmentFilter === 'not_required' && !examination.treatmentRequired);
    
    return matchesSearch && matchesTreatment;
  });

  // Group examinations by patient
  const groupedExaminations = filteredExaminations.reduce((groups, examination) => {
    const key = examination.patientId;
    if (!groups[key]) {
      groups[key] = {
        patientId: examination.patientId,
        patientName: examination.patientName,
        examinations: []
      };
    }
    groups[key].examinations.push(examination);
    return groups;
  }, {} as Record<string, {
    patientId: string;
    patientName: string;
    examinations: Examination[];
  }>);

  const patientGroups = Object.values(groupedExaminations);

  const handleDelete = async (examinationId: string) => {
    if (!window.confirm('Are you sure you want to delete this examination?')) return;

    try {
      const { error } = await supabase
        .from('examinations')
        .delete()
        .eq('id', examinationId);

      if (error) throw error;
      fetchExaminations();
    } catch (error) {
      console.error('Error deleting examination:', error);
      alert('Failed to delete examination. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-pink-100 to-rose-200 rounded-xl shadow-lg p-6 mb-6 border border-pink-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Examinations Management</h1>
                  <p className="text-gray-600">Manage all dental examinations</p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-pink-200 text-gray-700 rounded-lg hover:bg-pink-300 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded shadow p-3">
                <div className="flex items-center">
                  <div className="bg-pink-100 p-1 rounded">
                    <Stethoscope className="h-3 w-3 text-pink-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-lg font-bold text-gray-900">{examinations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded shadow p-3">
                <div className="flex items-center">
                  <div className="bg-red-100 p-1 rounded">
                    <Plus className="h-3 w-3 text-red-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-gray-600">Treatment</p>
                    <p className="text-lg font-bold text-gray-900">
                      {examinations.filter(e => e.treatmentRequired).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded shadow p-3">
                <div className="flex items-center">
                  <div className="bg-green-100 p-1 rounded">
                    <Eye className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-gray-600">This Month</p>
                    <p className="text-lg font-bold text-gray-900">
                      {examinations.filter(e => 
                        new Date(e.examinationDate).getMonth() === new Date().getMonth()
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded shadow p-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded">
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-gray-600">Patients</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Set(examinations.map(e => e.patientId)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded shadow mb-4">
              <div className="p-3 border-b border-gray-200">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by patient, type, tooth, examiner..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={treatmentFilter}
                      onChange={(e) => setTreatmentFilter(e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="all">All</option>
                      <option value="required">Treatment Required</option>
                      <option value="not_required">No Treatment</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Examinations List */}
              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                  </div>
                ) : filteredExaminations.length === 0 ? (
                  <div className="text-center py-12">
                    <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No examinations</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || treatmentFilter !== 'all' 
                        ? 'No examinations match your search criteria.' 
                        : 'No examinations found. Examinations are created from patient records.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patientGroups.map((group) => (
                      <motion.div
                        key={group.patientId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-br from-white to-pink-25 border border-pink-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {/* Patient Header */}
                        <div className="bg-gradient-to-r from-pink-50 to-rose-100 px-4 py-3 rounded-t-xl border-b border-pink-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-pink-200 p-2 rounded-lg">
                                <User className="h-4 w-4 text-pink-700" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-800">{group.patientName}</h3>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <span>{group.examinations.length} exam{group.examinations.length > 1 ? 's' : ''}</span>
                                  {group.examinations.some(e => e.treatmentRequired) && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                                      Treatment Required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => window.open(`/admin/patient/${group.patientId}`, '_blank')}
                              className="p-2 bg-pink-200 text-pink-700 rounded-lg hover:bg-pink-300 transition-colors"
                              title="View Patient"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Examinations Grid */}
                        <div className="p-4">
                          <div className="grid grid-cols-1 gap-3">
                            {group.examinations.slice(0, 2).map((examination) => (
                              <motion.div 
                                key={examination.id} 
                                whileHover={{ scale: 1.01 }}
                                className="bg-gradient-to-r from-pink-25 to-rose-50 border border-pink-150 rounded-lg p-3 hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="px-2 py-1 bg-pink-200 text-pink-800 text-xs rounded-full font-medium">
                                        T{examination.toothNumber}
                                      </span>
                                      <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
                                        {examination.examinationType}
                                      </span>
                                      {examination.treatmentRequired && (
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3 text-pink-600" />
                                        <span>{new Date(examination.examinationDate).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Stethoscope className="h-3 w-3 text-rose-600" />
                                        <span>{examination.examinedBy || 'N/A'}</span>
                                      </div>
                                    </div>
                                    
                                    {examination.findings && (
                                      <div className="text-xs text-gray-800 mb-1 bg-white p-2 rounded border-l-3 border-pink-400">
                                        <strong className="text-pink-700">Findings:</strong> {examination.findings}
                                      </div>
                                    )}
                                    
                                    {examination.notes && (
                                      <div className="text-xs text-gray-800 bg-white p-2 rounded border-l-3 border-rose-400">
                                        <strong className="text-rose-700">Notes:</strong> {examination.notes}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <button
                                    onClick={() => handleDelete(examination.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors ml-2"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                            {group.examinations.length > 2 && (
                              <div className="text-center py-2">
                                <span className="text-xs text-gray-600 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
                                  +{group.examinations.length - 2} more examinations
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationsPage;