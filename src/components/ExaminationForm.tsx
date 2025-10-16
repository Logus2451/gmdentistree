import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Examination {
  id?: string;
  tooth_number: string;
  examination_type: string;
  findings: string;
  treatment_required: boolean;
  notes: string;
  examined_by: string;
  examination_date: string;
}

interface ExaminationFormProps {
  examination?: Examination;
  patientId: string;
  selectedTooth: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ExaminationForm: React.FC<ExaminationFormProps> = ({
  examination,
  patientId,
  selectedTooth,
  isOpen,
  onClose,
  onSave
}) => {
  const { currentClinic } = useAuth();
  const [formData, setFormData] = useState<Examination>({
    tooth_number: selectedTooth,
    examination_type: '',
    findings: '',
    treatment_required: false,
    notes: '',
    examined_by: '',
    examination_date: new Date().toISOString().split('T')[0]
  });

  const examinationTypes = [
    'Tooth Investigation',
    'Missing Tooth',
    'Implant',
    'Caries - Occlusal',
    'Caries - Mesial',
    'Caries - Distal',
    'Caries - Buccal',
    'Caries - Lingual',
    'Restoration - Amalgam',
    'Restoration - Composite',
    'Restoration - Crown',
    'Restoration - Inlay/Onlay',
    'Root Canal Treatment',
    'Extraction',
    'Periodontal Disease',
    'Gingivitis',
    'Calculus',
    'Plaque',
    'Mobility',
    'Fracture',
    'Abscess',
    'Sensitivity',
    'Normal'
  ];

  useEffect(() => {
    if (examination) {
      setFormData(examination);
    } else {
      setFormData({
        tooth_number: selectedTooth,
        examination_type: '',
        findings: '',
        treatment_required: false,
        notes: '',
        examined_by: '',
        examination_date: new Date().toISOString().split('T')[0]
      });
    }
  }, [examination, selectedTooth, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClinic?.id) {
      alert('No clinic selected');
      return;
    }
    
    try {
      const examData = {
        patient_id: patientId,
        clinic_id: currentClinic.id,
        tooth_number: formData.tooth_number,
        examination_type: formData.examination_type,
        findings: formData.findings,
        treatment_required: formData.treatment_required,
        notes: formData.notes,
        examined_by: formData.examined_by,
        examination_date: formData.examination_date
      };

      if (examination?.id) {
        const { error } = await supabase
          .from('examinations')
          .update(examData)
          .eq('id', examination.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('examinations')
          .insert([examData]);
        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving examination:', error);
      alert('Failed to save examination');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {examination ? 'Edit' : 'Add'} Examination - Tooth {selectedTooth}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Examination Type *
            </label>
            <select
              value={formData.examination_type}
              onChange={(e) => setFormData({ ...formData, examination_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select examination type</option>
              {examinationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Findings
            </label>
            <textarea
              value={formData.findings}
              onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Examination findings..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="treatment_required"
              checked={formData.treatment_required}
              onChange={(e) => setFormData({ ...formData, treatment_required: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="treatment_required" className="ml-2 text-sm text-gray-700">
              Treatment Required
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Examined By
            </label>
            <input
              type="text"
              value={formData.examined_by}
              onChange={(e) => setFormData({ ...formData, examined_by: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Doctor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Examination Date *
            </label>
            <input
              type="date"
              value={formData.examination_date}
              onChange={(e) => setFormData({ ...formData, examination_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExaminationForm;