import React, { useState, useEffect } from 'react';
import { Printer, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { clinicConfig } from '../config/clinic';

interface Treatment {
  id: string;
  treatmentType: string;
  teeth: string[];
  cost: number;
  discount: number;
  totalCost: number;
  notes?: string;
  treatedBy?: string;
  treatmentDate: string;
  status: string;
}

interface Patient {
  id: string;
  fullName: string;
  patientCode: string;
  phone: string;
  address?: string;
}

interface BillingTabProps {
  patientId: string;
  patient: Patient;
}

const BillingTab: React.FC<BillingTabProps> = ({ patientId, patient }) => {
  const { currentClinic } = useAuth();
  const [completedTreatments, setCompletedTreatments] = useState<Treatment[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedTreatments();
  }, [patientId]);

  const fetchCompletedTreatments = async () => {
    if (!currentClinic?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinic_id', currentClinic.id)
        .eq('status', 'completed')
        .order('treatment_date', { ascending: false });

      if (error) throw error;

      const transformedTreatments: Treatment[] = data?.map(t => ({
        id: t.id,
        treatmentType: t.treatment_type,
        teeth: t.teeth || [],
        cost: t.cost,
        discount: t.discount,
        totalCost: t.total_cost,
        notes: t.notes || '',
        treatedBy: t.treated_by || '',
        treatmentDate: t.treatment_date,
        status: t.status
      })) || [];

      setCompletedTreatments(transformedTreatments);
    } catch (error) {
      console.error('Error fetching completed treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const selected = completedTreatments.filter(t => selectedTreatments.includes(t.id));
    const subtotal = selected.reduce((sum, t) => sum + t.cost, 0);
    const totalDiscount = selected.reduce((sum, t) => sum + t.discount, 0);
    const grandTotal = selected.reduce((sum, t) => sum + t.totalCost, 0);
    return { subtotal, totalDiscount, grandTotal };
  };

  const handleSelectTreatment = (treatmentId: string) => {
    setSelectedTreatments(prev => 
      prev.includes(treatmentId) 
        ? prev.filter(id => id !== treatmentId)
        : [...prev, treatmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTreatments.length === completedTreatments.length) {
      setSelectedTreatments([]);
    } else {
      setSelectedTreatments(completedTreatments.map(t => t.id));
    }
  };

  const handlePrint = () => {
    if (selectedTreatments.length === 0) {
      alert('Please select treatments to print');
      return;
    }
    
    const selectedTreatmentData = completedTreatments.filter(t => selectedTreatments.includes(t.id));
    const { subtotal, totalDiscount, grandTotal } = calculateTotals();
    
    const printContent = `
      <html>
        <head>
          <title>Treatment Bill - ${patient.patientCode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .clinic-name { font-size: 24px; font-weight: bold; color: #2563eb; }
            .clinic-info { margin: 10px 0; color: #666; }
            .patient-info { margin: 20px 0; }
            .patient-info div { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .text-right { text-align: right; }
            .totals { margin-top: 20px; }
            .totals table { width: 50%; margin-left: auto; }
            .grand-total { font-weight: bold; background-color: #e3f2fd; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">${clinicConfig.name}</div>
            <div class="clinic-info">${clinicConfig.address}</div>
            <div class="clinic-info">Phone: ${clinicConfig.phone} | Email: ${clinicConfig.email}</div>
          </div>
          
          <div class="patient-info">
            <h3>Patient Information</h3>
            <div><strong>Name:</strong> ${patient.fullName}</div>
            <div><strong>Patient ID:</strong> ${patient.patientCode}</div>
            <div><strong>Phone:</strong> ${patient.phone}</div>
            ${patient.address ? `<div><strong>Address:</strong> ${patient.address}</div>` : ''}
            <div><strong>Bill Date:</strong> ${new Date().toLocaleDateString()}</div>
          </div>

          <h3>Treatment Details</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Treatment</th>
                <th>Teeth</th>
                <th>Treated By</th>
                <th class="text-right">Cost</th>
                <th class="text-right">Discount</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedTreatmentData.map(treatment => `
                <tr>
                  <td>${new Date(treatment.treatmentDate).toLocaleDateString()}</td>
                  <td>${treatment.treatmentType}</td>
                  <td>${treatment.teeth.join(', ') || 'N/A'}</td>
                  <td>${treatment.treatedBy || 'N/A'}</td>
                  <td class="text-right">₹${treatment.cost.toFixed(2)}</td>
                  <td class="text-right">₹${treatment.discount.toFixed(2)}</td>
                  <td class="text-right">₹${treatment.totalCost.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td class="text-right">₹${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total Discount:</strong></td>
                <td class="text-right">₹${totalDiscount.toFixed(2)}</td>
              </tr>
              <tr class="grand-total">
                <td><strong>Grand Total:</strong></td>
                <td class="text-right"><strong>₹${grandTotal.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>Thank you for choosing ${clinicConfig.name}</p>
            <p>This is a computer generated bill</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { subtotal, totalDiscount, grandTotal } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Billing & Invoices</h3>
        <div className="flex items-center space-x-4">
          {completedTreatments.length > 0 && (
            <>
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {selectedTreatments.length === completedTreatments.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handlePrint}
                disabled={selectedTreatments.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer className="h-4 w-4" />
                <span>Print Bill ({selectedTreatments.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {completedTreatments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-gray-500 mt-4">No completed treatments found for billing</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <h4 className="text-lg font-medium mb-4">Completed Treatments</h4>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedTreatments.length === completedTreatments.length && completedTreatments.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teeth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treated By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedTreatments.map((treatment) => (
                    <tr key={treatment.id} className={selectedTreatments.includes(treatment.id) ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="checkbox"
                          checked={selectedTreatments.includes(treatment.id)}
                          onChange={() => handleSelectTreatment(treatment.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(treatment.treatmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {treatment.treatmentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {treatment.teeth.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {treatment.teeth.map((tooth) => (
                              <span key={tooth} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {tooth}
                              </span>
                            ))}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {treatment.treatedBy || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{treatment.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{treatment.discount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        ₹{treatment.totalCost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {completedTreatments.map((treatment) => (
                <div key={treatment.id} className={`border rounded-lg p-4 ${selectedTreatments.includes(treatment.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedTreatments.includes(treatment.id)}
                        onChange={() => handleSelectTreatment(treatment.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{treatment.treatmentType}</h5>
                        <p className="text-sm text-gray-500">{new Date(treatment.treatmentDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{treatment.totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Cost:</span>
                      <span className="ml-2 text-gray-900">₹{treatment.cost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Discount:</span>
                      <span className="ml-2 text-gray-900">₹{treatment.discount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Treated By:</span>
                      <span className="ml-2 text-gray-900">{treatment.treatedBy || 'N/A'}</span>
                    </div>
                    {treatment.teeth.length > 0 && (
                      <div>
                        <span className="text-gray-500">Teeth:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {treatment.teeth.map((tooth) => (
                            <span key={tooth} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {tooth}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-64">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Discount:</span>
                    <span>₹{totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;