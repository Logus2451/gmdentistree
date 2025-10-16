import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ToothSelector from './ToothSelector';

interface Treatment {
  id?: string;
  patientId: string;
  treatmentType: string;
  teeth: string[];
  cost: number;
  discount: number;
  totalCost: number;
  notes?: string;
  treatedBy?: string;
  treatmentDate?: string;
  status?: string;
}

interface TreatmentFormProps {
  treatment?: Treatment;
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ treatment, patientId, isOpen, onClose, onSave }) => {
  const { currentClinic } = useAuth();
  const [formData, setFormData] = useState<Treatment>({
    patientId,
    treatmentType: '',
    teeth: [],
    cost: 0,
    discount: 0,
    totalCost: 0,
    notes: '',
    treatedBy: '',
    treatmentDate: new Date().toISOString().split('T')[0],
    status: 'planned'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToothSelector, setShowToothSelector] = useState(false);
  const [treatmentPricing, setTreatmentPricing] = useState<{treatment_name: string; price: number}[]>([]);

  useEffect(() => {
    if (isOpen && currentClinic?.id) {
      fetchTreatmentPricing();
    }
  }, [isOpen, currentClinic?.id]);

  const fetchTreatmentPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('treatment_pricing')
        .select('treatment_name, price')
        .eq('clinic_id', currentClinic?.id)
        .eq('is_active', true)
        .order('treatment_name');
      
      if (error) throw error;
      setTreatmentPricing(data || []);
    } catch (error) {
      console.error('Error fetching treatment pricing:', error);
    }
  };

  // Auto calculate cost based on treatment type and teeth count
  useEffect(() => {
    if (formData.treatmentType && formData.teeth.length > 0) {
      const selectedTreatment = treatmentPricing.find(t => t.treatment_name === formData.treatmentType);
      if (selectedTreatment) {
        const calculatedCost = selectedTreatment.price * formData.teeth.length;
        setFormData(prev => ({ ...prev, cost: calculatedCost }));
      }
    }
  }, [formData.treatmentType, formData.teeth.length, treatmentPricing]);

  useEffect(() => {
    if (treatment) {
      setFormData({
        patientId,
        treatmentType: treatment.treatmentType,
        teeth: treatment.teeth,
        cost: treatment.cost,
        discount: treatment.discount,
        totalCost: treatment.totalCost,
        notes: treatment.notes || '',
        treatedBy: treatment.treatedBy || '',
        treatmentDate: treatment.treatmentDate || new Date().toISOString().split('T')[0],
        status: treatment.status || 'planned'
      });
    } else {
      setFormData({
        patientId,
        treatmentType: '',
        teeth: [],
        cost: 0,
        discount: 0,
        totalCost: 0,
        notes: '',
        treatedBy: '',
        treatmentDate: new Date().toISOString().split('T')[0],
        status: 'planned'
      });
    }
  }, [treatment, patientId]);

  const statusOptions = ['planned', 'in_progress', 'completed', 'cancelled'];

  useEffect(() => {
    const total = formData.cost - formData.discount;
    setFormData(prev => ({ ...prev, totalCost: Math.max(0, total) }));
  }, [formData.cost, formData.discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClinic?.id) {
      setError('No clinic selected');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const treatmentData = {
        patient_id: patientId,
        clinic_id: currentClinic.id,
        treatment_type: formData.treatmentType,
        teeth: formData.teeth,
        cost: formData.cost,
        discount: formData.discount,
        total_cost: formData.totalCost,
        notes: formData.notes || null,
        treated_by: formData.treatedBy || null,
        treatment_date: formData.treatmentDate,
        status: formData.status
      };

      if (treatment?.id) {
        const { error } = await supabase
          .from('treatments')
          .update(treatmentData)
          .eq('id', treatment.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('treatments')
          .insert(treatmentData);
        
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {treatment ? 'Edit Treatment' : 'Add New Treatment'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Treatment Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Treatment Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Treatment Type *</label>
                      <input
                        type="text"
                        required
                        list="treatmentTypes"
                        value={formData.treatmentType}
                        onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Select or type treatment type"
                      />
                      <datalist id="treatmentTypes">
                        {treatmentPricing.map((treatment) => (
                          <option key={treatment.treatment_name} value={treatment.treatment_name} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Treatment Date</label>
                        <input
                          type="date"
                          value={formData.treatmentDate}
                          onChange={(e) => setFormData({ ...formData, treatmentDate: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Treated By</label>
                      <input
                        type="text"
                        value={formData.treatedBy}
                        onChange={(e) => setFormData({ ...formData, treatedBy: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Doctor name"
                      />
                    </div>
                  </div>
                </div>

                {/* Teeth Selection */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Teeth Involved
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 px-2 py-2 border border-purple-200 rounded bg-white/70 min-h-[40px]">
                      {formData.teeth.length === 0 ? (
                        <span className="text-gray-500 text-sm">No teeth selected</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {formData.teeth.map((tooth) => (
                            <span key={tooth} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              {tooth}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowToothSelector(true)}
                      className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Select</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Pricing */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Pricing Details
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Cost (₹) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Discount (₹)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.discount}
                          onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 rounded-lg p-3">
                      <label className="block text-xs font-medium text-emerald-800 mb-1">Total Amount</label>
                      <div className="text-2xl font-bold text-emerald-700">₹{formData.totalCost.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    Treatment Notes
                  </h3>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                    placeholder="Treatment notes, instructions, or observations..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md"
              >
                <Save className="h-3 w-3" />
                <span>{loading ? 'Saving...' : 'Save Treatment'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <ToothSelector
        selectedTeeth={formData.teeth}
        onTeethChange={(teeth) => setFormData({ ...formData, teeth })}
        isOpen={showToothSelector}
        onClose={() => setShowToothSelector(false)}
      />
    </>
  );
};

export default TreatmentForm;