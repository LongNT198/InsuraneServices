import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="size-6 text-blue-500" />
              <span className="text-white">SecureLife Insurance</span>
            </div>
            <p className="text-sm">
              Your trusted partner in comprehensive insurance solutions. Protecting what matters most to you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/life-insurance" className="hover:text-blue-400 transition">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link to="/medical-insurance" className="hover:text-blue-400 transition">
                  Medical Insurance
                </Link>
              </li>
              <li>
                <Link to="/motor-insurance" className="hover:text-blue-400 transition">
                  Motor Insurance
                </Link>
              </li>
              <li>
                <Link to="/home-insurance" className="hover:text-blue-400 transition">
                  Home Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/calculator" className="hover:text-blue-400 transition">
                  Premium Calculator
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-blue-400 transition">
                  Schemes & Strategies
                </Link>
              </li>
              <li>
                <Link to="/loan-facility" className="hover:text-blue-400 transition">
                  Loan Facility
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-blue-400 transition">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="size-4 mt-0.5 flex-shrink-0" />
                <span>support@securelife.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="size-4 mt-0.5 flex-shrink-0" />
                <span>1-800-INSURANCE</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>123 Insurance Plaza, Financial District, NY 10004</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 SecureLife Insurance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


