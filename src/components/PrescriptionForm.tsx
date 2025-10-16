import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Prescription {
  id?: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  mealInstruction: string;
  notes?: string;
  prescribedBy?: string;
  prescribedDate?: string;
}

interface PrescriptionFormProps {
  prescription?: Prescription;
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ prescription, patientId, isOpen, onClose, onSave }) => {
  const { currentClinic } = useAuth();
  const [formData, setFormData] = useState<Prescription>({
    patientId,
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    mealInstruction: '',
    notes: '',
    prescribedBy: '',
    prescribedDate: new Date().toISOString().split('T')[0]
  });

  React.useEffect(() => {
    if (prescription) {
      setFormData({
        patientId,
        medicationName: prescription.medicationName,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        mealInstruction: prescription.mealInstruction,
        notes: prescription.notes || '',
        prescribedBy: prescription.prescribedBy || '',
        prescribedDate: prescription.prescribedDate
      });
    } else {
      setFormData({
        patientId,
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        mealInstruction: '',
        notes: '',
        prescribedBy: '',
        prescribedDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [prescription, patientId]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const medications = [
    'Paracetamol', 'Tab. Decdan', 'Tab. Brufen', 'Stolin Gum Astringent', 'Tab. Neurobion Forte',
    'Tab. Pyrigesic', 'Syr. Ibugesic', 'Emoform Toothpaste', 'Cap. Wymox', 'Gumex',
    'Karvol inhalations', 'Tab. Metrogyl', 'Cap. Mox', 'Syr. Mox', 'G - 32 Gum Paint',
    'Orex-Lo', 'Tab. Crocin', 'Sensodent KF Toothpaste', 'Tab. Paracetamol', 'Tab. Voveran',
    'Tab. E-Mycin', 'Anabel', 'Cap. Proxyvon', 'Clohex Mouthwash', 'Dologel',
    'Cream Clobetesol', 'Tab. Neurobion', 'Cap. Spasmo-Proxyvon', 'Tab. Diclomol', 'Tab. Doxy-1',
    'Tab. Ciplox', 'Otrivin Nasal Drops', 'Tab. Sumo'
  ];

  const dosages = ['100mg', '1ml', '200mg', '2ml', '500mg', '5ml'];
  const frequencies = ['0-0-1', '0-1-0', '0-1-1', '1-0-1', '1-1-0', '1-1-1', '1-0-0'];
  const durations = ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '1 week', '2 weeks', '1 month'];
  const mealInstructions = ['After meal', 'Before meal'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClinic?.id) {
      setError('No clinic selected');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const prescriptionData = {
        patient_id: patientId,
        clinic_id: currentClinic.id,
        medication_name: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        meal_instruction: formData.mealInstruction,
        notes: formData.notes || null,
        prescribed_by: formData.prescribedBy || null,
        prescribed_date: formData.prescribedDate
      };

      if (prescription?.id) {
        const { error } = await supabase
          .from('prescriptions')
          .update(prescriptionData)
          .eq('id', prescription.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('prescriptions')
          .insert(prescriptionData);
        
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {prescription ? 'Edit Prescription' : 'Add New Prescription'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name *</label>
            <input
              type="text"
              required
              list="medications"
              value={formData.medicationName}
              onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Select or type medication name"
            />
            <datalist id="medications">
              {medications.map((med) => (
                <option key={med} value={med} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
              <input
                type="text"
                required
                list="dosages"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 100mg, 1ml"
              />
              <datalist id="dosages">
                {dosages.map((dosage) => (
                  <option key={dosage} value={dosage} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
              <input
                type="text"
                required
                list="frequencies"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 1-1-1"
              />
              <datalist id="frequencies">
                {frequencies.map((freq) => (
                  <option key={freq} value={freq} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input
                type="text"
                required
                list="durations"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 5 days, 1 week"
              />
              <datalist id="durations">
                {durations.map((duration) => (
                  <option key={duration} value={duration} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Instruction *</label>
              <select
                required
                value={formData.mealInstruction}
                onChange={(e) => setFormData({ ...formData, mealInstruction: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select instruction</option>
                {mealInstructions.map((instruction) => (
                  <option key={instruction} value={instruction}>
                    {instruction}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed By</label>
              <input
                type="text"
                value={formData.prescribedBy}
                onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Doctor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed Date</label>
              <input
                type="date"
                value={formData.prescribedDate}
                onChange={(e) => setFormData({ ...formData, prescribedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Additional notes or instructions"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Prescription'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PrescriptionForm;