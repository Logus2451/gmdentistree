import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ReportsTab: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');

  // Sample data
  const patientDemographics = [
    { ageGroup: '0-18', count: 45, percentage: 15 },
    { ageGroup: '19-35', count: 120, percentage: 40 },
    { ageGroup: '36-50', count: 90, percentage: 30 },
    { ageGroup: '51+', count: 45, percentage: 15 }
  ];

  const treatmentOutcomes = [
    { treatment: 'Cleaning', completed: 85, success: 98 },
    { treatment: 'Filling', completed: 65, success: 95 },
    { treatment: 'Root Canal', completed: 25, success: 92 },
    { treatment: 'Extraction', completed: 15, success: 100 }
  ];

  const financialMetrics = [
    { month: 'Jan', revenue: 45000, expenses: 25000, profit: 20000 },
    { month: 'Feb', revenue: 52000, expenses: 28000, profit: 24000 },
    { month: 'Mar', revenue: 48000, expenses: 26000, profit: 22000 },
    { month: 'Apr', revenue: 55000, expenses: 30000, profit: 25000 }
  ];

  const operationalData = [
    { metric: 'Average Wait Time', value: '12 mins', trend: 'down' },
    { metric: 'Appointment Utilization', value: '87%', trend: 'up' },
    { metric: 'Patient Satisfaction', value: '4.6/5', trend: 'up' },
    { metric: 'No-Show Rate', value: '8%', trend: 'down' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const exportReport = (type: string) => {
    const data = type === 'demographics' ? patientDemographics : 
                 type === 'treatments' ? treatmentOutcomes : financialMetrics;
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {operationalData.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.metric}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? '↗' : '↘'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Demographics */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Patient Demographics</h3>
            <button 
              onClick={() => exportReport('demographics')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Export CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={patientDemographics}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ ageGroup, percentage }) => `${ageGroup}: ${percentage}%`}
              >
                {patientDemographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Treatment Success Rates */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Treatment Success Rates</h3>
            <button 
              onClick={() => exportReport('treatments')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Export CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={treatmentOutcomes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="treatment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="success" fill="#00C49F" name="Success Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Performance */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Financial Performance</h3>
          <button 
            onClick={() => exportReport('financial')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={financialMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
            <Line type="monotone" dataKey="revenue" stroke="#0088FE" name="Revenue" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" strokeWidth={2} />
            <Line type="monotone" dataKey="profit" stroke="#00C49F" name="Profit" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Compliance & Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Compliance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sterilization Compliance</span>
              <span className="font-semibold text-green-600">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Documentation Complete</span>
              <span className="font-semibold text-green-600">98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Safety Protocol Adherence</span>
              <span className="font-semibold text-green-600">99%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance Claims Processed</span>
              <span className="font-semibold text-blue-600">95%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Quality Indicators</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Patient Retention Rate</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Treatment Plan Acceptance</span>
              <span className="font-semibold text-blue-600">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Referral Rate</span>
              <span className="font-semibold text-green-600">15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointment Punctuality</span>
              <span className="font-semibold text-green-600">88%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;