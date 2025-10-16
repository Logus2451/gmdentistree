import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, FileText, Download, Send, Calendar, Users, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RevenueData {
  todayRevenue: number;
  monthlyRevenue: number;
  outstandingPayments: number;
  averageTreatmentValue: number;
  treatmentRevenue: { [key: string]: number };
  monthlyTrend: { month: string; revenue: number }[];
  paymentMethods: { cash: number; insurance: number; card: number };
  topPatients: { name: string; revenue: number }[];
}

interface Treatment {
  id: string;
  treatmentType: string;
  totalCost: number;
  treatmentDate: string;
  status: string;
  patientName: string;
}

const RevenueTab: React.FC = () => {
  const { currentClinic } = useAuth();
  const [revenueData, setRevenueData] = useState<RevenueData>({
    todayRevenue: 0,
    monthlyRevenue: 0,
    outstandingPayments: 0,
    averageTreatmentValue: 0,
    treatmentRevenue: {},
    monthlyTrend: [],
    paymentMethods: { cash: 0, insurance: 0, card: 0 },
    topPatients: []
  });
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  const fetchRevenueData = async () => {
    if (!currentClinic?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch treatments with patient names
      const { data: treatmentsData, error } = await supabase
        .from('treatments')
        .select(`
          *,
          patients!inner(full_name)
        `)
        .eq('clinic_id', currentClinic.id)
        .eq('status', 'completed')
        .gte('treatment_date', dateRange.start)
        .lte('treatment_date', dateRange.end)
        .order('treatment_date', { ascending: false });

      if (error) throw error;

      const transformedTreatments: Treatment[] = treatmentsData?.map(t => ({
        id: t.id,
        treatmentType: t.treatment_type,
        totalCost: t.total_cost,
        treatmentDate: t.treatment_date,
        status: t.status,
        patientName: t.patients.full_name
      })) || [];

      setTreatments(transformedTreatments);
      calculateRevenueMetrics(transformedTreatments);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenueMetrics = (treatments: Treatment[]) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Today's revenue
    const todayRevenue = treatments
      .filter(t => t.treatmentDate === today)
      .reduce((sum, t) => sum + t.totalCost, 0);

    // Monthly revenue
    const monthlyRevenue = treatments
      .filter(t => {
        const treatmentDate = new Date(t.treatmentDate);
        return treatmentDate.getMonth() === currentMonth && treatmentDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.totalCost, 0);

    // Treatment revenue breakdown
    const treatmentRevenue = treatments.reduce((acc, t) => {
      acc[t.treatmentType] = (acc[t.treatmentType] || 0) + t.totalCost;
      return acc;
    }, {} as { [key: string]: number });

    // Average treatment value
    const averageTreatmentValue = treatments.length > 0 ? 
      treatments.reduce((sum, t) => sum + t.totalCost, 0) / treatments.length : 0;

    // Top patients by revenue
    const patientRevenue = treatments.reduce((acc, t) => {
      acc[t.patientName] = (acc[t.patientName] || 0) + t.totalCost;
      return acc;
    }, {} as { [key: string]: number });

    const topPatients = Object.entries(patientRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthRevenue = treatments
        .filter(t => {
          const treatmentDate = new Date(t.treatmentDate);
          return treatmentDate.getMonth() === date.getMonth() && 
                 treatmentDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, t) => sum + t.totalCost, 0);
      
      monthlyTrend.push({ month: monthName, revenue: monthRevenue });
    }

    setRevenueData({
      todayRevenue,
      monthlyRevenue,
      outstandingPayments: 0, // This would need a payments table
      averageTreatmentValue,
      treatmentRevenue,
      monthlyTrend,
      paymentMethods: { cash: monthlyRevenue * 0.6, insurance: monthlyRevenue * 0.3, card: monthlyRevenue * 0.1 },
      topPatients
    });
  };

  const exportReport = () => {
    const csvContent = [
      ['Treatment Type', 'Patient', 'Date', 'Amount'],
      ...treatments.map(t => [t.treatmentType, t.patientName, t.treatmentDate, t.totalCost])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Management</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{revenueData.todayRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{revenueData.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Treatment Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(revenueData.averageTreatmentValue).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Treatments</p>
              <p className="text-2xl font-bold text-gray-900">{treatments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Treatment</h4>
          <div className="space-y-3">
            {Object.entries(revenueData.treatmentRevenue)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([treatment, revenue]) => (
                <div key={treatment} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{treatment}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(revenue / Math.max(...Object.values(revenueData.treatmentRevenue))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">₹{revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Patients by Revenue</h4>
          <div className="space-y-3">
            {revenueData.topPatients.map((patient, index) => (
              <div key={patient.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-900">{patient.name}</span>
                </div>
                <span className="text-sm font-medium">₹{patient.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Treatments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h4 className="text-lg font-semibold text-gray-900">Recent Completed Treatments</h4>
        </div>
        <div className="p-6">
          {treatments.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-500 mt-2">No treatments found for selected date range</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Treatment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {treatments.slice(0, 10).map((treatment) => (
                    <tr key={treatment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{treatment.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{treatment.treatmentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(treatment.treatmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        ₹{treatment.totalCost.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;