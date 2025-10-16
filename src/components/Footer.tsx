import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/Logo.jpg"
                alt="Dr.G.M's Dentistree Logo"
                className="w-12 h-12 rounded"
              />
              <div>
                <h3 className="text-xl font-heading font-bold">
                  Dr.G.M's Dentistree
                </h3>
                <p className="text-gray-400 text-sm">Modern Dental Clinic</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Providing exceptional dental care with modern technology and a
              patient-first approach.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/dr.g.msdentistree?igshid=ZDdkNTZiNTM="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/#booking"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Book Appointment
                </a>
              </li>
              {/* <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li> */}
              {/* <li>
                <Link
                  to="/video-consultation"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Video Consultation
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>General Dentistry</li>
              <li>Cosmetic Dentistry</li>
              <li>Dental Implants</li>
              <li>Orthodontics</li>
              <li>Emergency Care</li>
              <li>Teeth Whitening</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-400" />
                <span className="text-gray-400">
                  No4, vasantham nagar, kappi kadai, near PPG institute of
                  technology,
                  <br />
                  Coimbatore, Tamil Nadu 641035
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <span className="text-gray-400">9952205380</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <span className="text-gray-400">
                  dr.gmsdentistree@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary-400" />
                <div className="text-gray-400">
                  <div>Mon-Sat: 9:30 AM - 1:00 PM & 4:30 AM - 8:00 PM</div>
                  <div>Sat: 9:00 AM - 3:00 PM</div>
                  <div>Sun: Emergency Only</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Dentistree Modern Dental Clinic. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
