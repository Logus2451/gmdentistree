import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  monthly_price: number;
  yearly_price: number;
  billing_cycle: string;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  hospital_id: string;
}

interface Hospital {
  id: string;
  hospital_name: string;
  hospital_code: string;
}

const SubscriptionTab: React.FC = () => {
  const { adminUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    if (!adminUser?.hospital_id) {
      console.log('No hospital_id found in adminUser:', adminUser);
      return;
    }
    
    console.log('Fetching subscription for hospital_id:', adminUser.hospital_id);
    
    try {
      // Fetch hospital details
      const { data: hospitalData, error: hospitalError } = await supabase
        .from('hospitals')
        .select('id, hospital_name, hospital_code')
        .eq('id', adminUser.hospital_id)
        .single();

      if (hospitalError) {
        console.error('Hospital fetch error:', hospitalError);
        throw hospitalError;
      }
      console.log('Hospital data:', hospitalData);
      setHospital(hospitalData);

      // Fetch subscription for this hospital (get all, then take the first active one)
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('hospital_id', adminUser.hospital_id)
        .order('created_at', { ascending: false });

      console.log('Subscription query result:', { subscriptionData, subscriptionError });

      if (subscriptionError) {
        console.error('Subscription fetch error:', subscriptionError);
        throw subscriptionError;
      }
      
      if (subscriptionData && subscriptionData.length > 0) {
        // Take the most recent subscription
        setSubscription(subscriptionData[0]);
        console.log('Set subscription:', subscriptionData[0]);
      } else {
        console.log('No subscriptions found');
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'trial': return 'text-blue-600 bg-blue-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'expired': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'trial': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'suspended': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>

      {/* Hospital Info */}
      {hospital && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">{hospital.hospital_name}</h4>
              <p className="text-sm text-blue-700">Hospital Code: {hospital.hospital_code}</p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Information */}
      {subscription ? (
        <div className="space-y-4">
          {/* Current Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Current Plan</h4>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(subscription.status)}`}>
                {getStatusIcon(subscription.status)}
                <span className="text-sm font-medium capitalize">{subscription.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan Name</p>
                <p className="text-lg font-semibold text-gray-900">{subscription.plan_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Billing Cycle</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{subscription.billing_cycle}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-lg font-semibold text-primary-600">
                  ₹{subscription.billing_cycle === 'monthly' ? subscription.monthly_price : subscription.yearly_price}
                  <span className="text-sm text-gray-500">/{subscription.billing_cycle === 'monthly' ? 'month' : 'year'}</span>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Auto Renewal</p>
                <p className={`text-lg font-semibold ${subscription.auto_renew ? 'text-green-600' : 'text-red-600'}`}>
                  {subscription.auto_renew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(subscription.start_date).toLocaleDateString()}
                </p>
              </div>

              {subscription.end_date && (
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(subscription.end_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {subscription.end_date && (
                <div>
                  <p className="text-sm text-gray-600">Days Remaining</p>
                  <p className={`font-semibold ${
                    calculateDaysRemaining(subscription.end_date) > 30 
                      ? 'text-green-600' 
                      : calculateDaysRemaining(subscription.end_date) > 7 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {calculateDaysRemaining(subscription.end_date)} days
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`border-2 rounded-lg p-4 ${
                subscription.billing_cycle === 'monthly' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200'
              }`}>
                <div className="text-center">
                  <h5 className="font-semibold text-gray-900">Monthly Plan</h5>
                  <div className="text-2xl font-bold text-primary-600 my-2">
                    ₹{subscription.monthly_price}
                  </div>
                  <p className="text-sm text-gray-600">per month</p>
                  {subscription.billing_cycle === 'monthly' && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        Current Plan
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className={`border-2 rounded-lg p-4 ${
                subscription.billing_cycle === 'yearly' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200'
              }`}>
                <div className="text-center">
                  <h5 className="font-semibold text-gray-900">Yearly Plan</h5>
                  <div className="text-2xl font-bold text-primary-600 my-2">
                    ₹{subscription.yearly_price}
                  </div>
                  <p className="text-sm text-gray-600">per year</p>
                  <div className="text-xs text-green-600 font-medium">
                    Save ₹{(subscription.monthly_price * 12) - subscription.yearly_price}
                  </div>
                  {subscription.billing_cycle === 'yearly' && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        Current Plan
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Subscription Actions</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Upgrade Plan
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Renew Subscription
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Download Invoice
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Payment History
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Active Subscription</h3>
          <p className="mt-1 text-sm text-gray-500">
            No subscription found for this hospital. Contact support to set up a subscription plan.
          </p>
          <div className="mt-6">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTab;