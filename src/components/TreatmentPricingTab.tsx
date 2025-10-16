import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TreatmentPrice {
  id: string;
  treatment_name: string;
  price: number;
  currency: string;
  is_active: boolean;
}

const TreatmentPricingTab: React.FC = () => {
  const { currentClinic } = useAuth();
  const [treatments, setTreatments] = useState<TreatmentPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TreatmentPrice | null>(null);
  const [formData, setFormData] = useState({
    treatment_name: '',
    price: '',
    currency: '₹'
  });

  const commonTreatments = [
    'General Checkup & Cleaning',
    'Dental Filling',
    'Root Canal Treatment',
    'Tooth Extraction',
    'Teeth Whitening',
    'Dental Crown',
    'Dental Bridge',
    'Dental Implant',
    'Orthodontic Consultation',
    'Periodontal Treatment',
    'Oral Surgery',
    'Emergency Treatment'
  ];

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    console.log('Current clinic:', currentClinic);
    if (!currentClinic?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('treatment_pricing')
        .select('*')
        .eq('clinic_id', currentClinic.id)
        .eq('is_active', true)
        .order('price', { ascending: true });

      console.log('Treatment pricing data:', data, 'Error:', error);
      if (error) throw error;
      setTreatments(data || []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClinic?.id) {
      alert('No clinic selected');
      return;
    }
    
    try {
      const treatmentData = {
        treatment_name: formData.treatment_name,
        price: parseFloat(formData.price),
        currency: formData.currency,
        clinic_id: currentClinic.id
      };

      if (editingTreatment) {
        const { error } = await supabase
          .from('treatment_pricing')
          .update(treatmentData)
          .eq('id', editingTreatment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('treatment_pricing')
          .insert([treatmentData]);
        if (error) throw error;
      }

      setShowForm(false);
      setEditingTreatment(null);
      setFormData({ treatment_name: '', price: '', currency: '₹' });
      fetchTreatments();
    } catch (error) {
      console.error('Error saving treatment:', error);
      alert('Failed to save treatment pricing');
    }
  };

  const handleEdit = (treatment: TreatmentPrice) => {
    setEditingTreatment(treatment);
    setFormData({
      treatment_name: treatment.treatment_name,
      price: treatment.price.toString(),
      currency: treatment.currency
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this treatment pricing?')) return;

    try {
      const { error } = await supabase
        .from('treatment_pricing')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      fetchTreatments();
    } catch (error) {
      console.error('Error deleting treatment:', error);
      alert('Failed to delete treatment pricing');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Treatment Pricing</h3>
        <button
          onClick={() => {
            setEditingTreatment(null);
            setFormData({ treatment_name: '', price: '', currency: '₹' });
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Treatment</span>
        </button>
      </div>

      {/* Treatment List */}
      {treatments.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No treatment pricing</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding treatment prices.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {treatments.map((treatment) => (
            <div key={treatment.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{treatment.treatment_name}</h4>
                  <p className="text-lg font-bold text-primary-600">
                    {treatment.currency}{treatment.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(treatment)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(treatment.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTreatment ? 'Edit Treatment Price' : 'Add Treatment Price'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Name</label>
                <input
                  type="text"
                  required
                  list="treatments"
                  value={formData.treatment_name}
                  onChange={(e) => setFormData({ ...formData, treatment_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter or select treatment"
                />
                <datalist id="treatments">
                  {commonTreatments.map((treatment) => (
                    <option key={treatment} value={treatment} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editingTreatment ? 'Update' : 'Add'} Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentPricingTab;