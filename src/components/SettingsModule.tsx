import React, { useState } from 'react';
import { Users, DollarSign, Building2, CreditCard, Settings } from 'lucide-react';
import StaffManagementTab from './StaffManagementTab';
import TreatmentPricingTab from './TreatmentPricingTab';
import CurrencySettingsTab from './CurrencySettingsTab';
import HospitalOverviewTab from './HospitalOverviewTab';
import SubscriptionTab from './SubscriptionTab';

const SettingsModule: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    { id: 'staff', label: 'Staff Management', icon: Users, description: 'Manage staff members and roles', color: 'bg-blue-500' },
    { id: 'pricing', label: 'Treatment Pricing', icon: DollarSign, description: 'Set treatment prices per clinic', color: 'bg-green-500' },
    { id: 'currency', label: 'Currency Settings', icon: Settings, description: 'Configure currency and formats', color: 'bg-purple-500' },
    { id: 'hospital', label: 'Hospital Overview', icon: Building2, description: 'View hospital and clinic details', color: 'bg-orange-500' },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, description: 'Manage subscription plans', color: 'bg-red-500' }
  ];

  if (activeModule) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveModule(null)}
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            ← Back to Settings
          </button>
          <h3 className="text-lg font-semibold">
            {modules.find(m => m.id === activeModule)?.label}
          </h3>
        </div>
        
        <div>
          {activeModule === 'staff' && <StaffManagementTab />}
          {activeModule === 'pricing' && <TreatmentPricingTab />}
          {activeModule === 'currency' && <CurrencySettingsTab />}
          {activeModule === 'hospital' && <HospitalOverviewTab />}
          {activeModule === 'subscription' && <SubscriptionTab />}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
      {modules.map((module) => {
        const IconComponent = module.icon;
        return (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200 text-center group"
          >
            <div className={`${module.color} p-2 rounded-lg mb-2 transition-colors inline-block`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">{module.label}</h3>
            <p className="text-xs text-gray-500">{module.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsModule;