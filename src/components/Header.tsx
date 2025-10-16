import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Phone, Mail } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Don't show header on homepage and admin pages as they have their own integrated headers
  if (location.pathname === "/" || location.pathname.startsWith("/admin")) {
    return null;
  }

  const navigation = [
    { name: "Home", href: "/" },

    { name: "Book Appointment", href: "/booking" },
    { name: "Video Consultation", href: "/video-consultation" },
    { name: "FAQ", href: "/faq" },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <header className="bg-white shadow-lg relative z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 w-6 h-6 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <span>
                Ganeshmoorthy Building, Dental Colony, Tamil Nadu, India
              </span>
            </div>
            <div className="flex items-center space-x-6 mt-2 sm:mt-0">
              <a
                href="tel:+919952205380"
                className="flex items-center space-x-2 hover:text-green-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>9952205380</span>
              </a>
              <a
                href="mailto:dr.gmsdentistree@gmail.com?subject=Dental Appointment Inquiry&body=Hi Dr. G.M's Dentistree,%0D%0A%0D%0AI would like to inquire about dental services.%0D%0A%0D%0AThank you."
                className="flex items-center space-x-2 hover:text-green-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>dr.gmsdentistree@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-green-500 w-10 h-10 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Dentistree
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile menu button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Book Now
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors touch-manipulation ${
                  isActive(item.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 mt-4 text-center text-white bg-gradient-to-r from-primary-500 to-teal-500 rounded-lg font-medium touch-manipulation active:from-primary-600 active:to-teal-600"
            >
              Book Appointment
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
