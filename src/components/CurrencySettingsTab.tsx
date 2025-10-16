import React, { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ClinicSettings {
  id?: string;
  currency_symbol: string;
  currency_code: string;
  date_format: string;
  time_format: string;
}

const CurrencySettingsTab: React.FC = () => {
  const { currentClinic } = useAuth();
  const [settings, setSettings] = useState<ClinicSettings>({
    currency_symbol: '₹',
    currency_code: 'INR',
    date_format: 'DD/MM/YYYY',
    time_format: '12h'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currencies = [
    { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
    { symbol: '$', code: 'USD', name: 'US Dollar' },
    { symbol: '€', code: 'EUR', name: 'Euro' },
    { symbol: '£', code: 'GBP', name: 'British Pound' },
    { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
    { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
    { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (31-12-2023)' }
  ];

  const timeFormats = [
    { value: '12h', label: '12 Hour (2:30 PM)' },
    { value: '24h', label: '24 Hour (14:30)' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!currentClinic?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('clinic_id', currentClinic.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentClinic?.id) {
      alert('No clinic selected');
      return;
    }
    
    setSaving(true);
    try {
      const settingsData = {
        clinic_id: currentClinic.id,
        currency_symbol: settings.currency_symbol,
        currency_code: settings.currency_code,
        date_format: settings.date_format,
        time_format: settings.time_format
      };

      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('clinic_settings')
          .update(settingsData)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('clinic_settings')
          .insert([settingsData])
          .select()
          .single();
        if (error) throw error;
        setSettings({ ...settings, id: data.id });
      }

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSettings({
        ...settings,
        currency_symbol: currency.symbol,
        currency_code: currency.code
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Currency & Format Settings</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Currency Settings */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Currency Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.currency_code}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                <span className="text-lg font-semibold text-primary-600">
                  {settings.currency_symbol}1,500.00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Format Settings */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Date Format</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={settings.date_format}
                onChange={(e) => setSettings({ ...settings, date_format: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {dateFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                <span className="text-gray-900">
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Format Settings */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Time Format</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
              <select
                value={settings.time_format}
                onChange={(e) => setSettings({ ...settings, time_format: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {timeFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                <span className="text-gray-900">
                  {settings.time_format === '12h' 
                    ? new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
                    : new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-blue-900">Settings Information</h5>
              <p className="text-sm text-blue-700 mt-1">
                These settings will be applied to all financial transactions, reports, and date/time displays in your clinic.
                Changes will take effect immediately after saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettingsTab;