import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Staff {
  id: string;
  name: string;
  role: 'hospital_admin' | 'doctor' | 'assistant' | 'receptionist';
  phone?: string;
  email?: string;
  can_switch_clinics: boolean;
  is_active: boolean;
  clinic_id: string;
  hospital_id: string;
}

const StaffManagementTab: React.FC = () => {
  const { currentClinic, adminUser } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'assistant' as Staff['role'],
    phone: '',
    email: '',
    can_switch_clinics: false
  });

  useEffect(() => {
    if (currentClinic?.id) {
      fetchStaff();
    }
  }, [currentClinic?.id]);

  const fetchStaff = async () => {
    if (!currentClinic?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('clinic_id', currentClinic.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClinic?.id || !adminUser?.hospital_id) {
      alert('Clinic or hospital information not found');
      return;
    }
    
    try {
      const staffData = {
        ...formData,
        clinic_id: currentClinic.id,
        hospital_id: adminUser.hospital_id
      };

      if (editingStaff) {
        const { error } = await supabase
          .from('staff')
          .update(staffData)
          .eq('id', editingStaff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('staff')
          .insert([staffData]);
        if (error) throw error;
      }

      setShowForm(false);
      setEditingStaff(null);
      setFormData({ name: '', role: 'assistant', phone: '', email: '', can_switch_clinics: false });
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member');
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      phone: staffMember.phone || '',
      email: staffMember.email || '',
      can_switch_clinics: staffMember.can_switch_clinics
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff member');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'hospital_admin': return 'bg-purple-100 text-purple-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'assistant': return 'bg-green-100 text-green-800';
      case 'receptionist': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
        <button
          onClick={() => {
            setEditingStaff(null);
            setFormData({ name: '', role: 'assistant', phone: '', email: '', can_switch_clinics: false });
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Staff List */}
      {staff.length === 0 ? (
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a staff member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    {member.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {member.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.can_switch_clinics && (
                  <div className="text-xs text-blue-600 font-medium">Can switch clinics</div>
                )}
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
              {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Staff['role'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="assistant">Assistant</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="doctor">Doctor</option>
                  <option value="hospital_admin">Hospital Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="can_switch_clinics"
                  checked={formData.can_switch_clinics}
                  onChange={(e) => setFormData({ ...formData, can_switch_clinics: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="can_switch_clinics" className="ml-2 block text-sm text-gray-900">
                  Can switch between clinics
                </label>
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
                  {editingStaff ? 'Update' : 'Add'} Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementTab;