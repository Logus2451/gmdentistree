import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Home, ArrowLeft, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/clinic';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, currentClinic, availableClinics, switchClinic, signOut } = useAuth();
  const [showClinicDropdown, setShowClinicDropdown] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isPatientRecord = location.pathname.includes('/admin/patient/');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              {isPatientRecord && (
                <button
                  onClick={() => navigate('/admin')}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <img 
                src={config.logo} 
                alt="Hospital Logo" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <h1 className="text-sm font-semibold text-gray-900 truncate">{config.name}</h1>
            </div>
            
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4 text-gray-600" />
              {!isPatientRecord && (
                <button
                  onClick={() => navigate('/admin')}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Dashboard"
                >
                  <Home className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {isPatientRecord && (
              <button
                onClick={() => navigate('/admin')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <img 
                src={config.logo} 
                alt="Hospital Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{config.name}</h1>
                <p className="text-sm text-gray-600">Admin Portal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Clinic Selector */}
            {availableClinics.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowClinicDropdown(!showClinicDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{currentClinic?.clinic_name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
                
                {showClinicDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {availableClinics.map((clinic) => (
                      <button
                        key={clinic.id}
                        onClick={() => {
                          switchClinic(clinic.id);
                          setShowClinicDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          currentClinic?.id === clinic.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        {clinic.clinic_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{adminUser?.full_name}</p>
              <p className="text-xs text-gray-600">{currentClinic?.clinic_name}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isPatientRecord && (
                <button
                  onClick={() => navigate('/admin')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Dashboard"
                >
                  <Home className="h-5 w-5" />
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;