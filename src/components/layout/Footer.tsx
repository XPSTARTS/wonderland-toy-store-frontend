import { Link } from 'react-router-dom';
import { Package, Heart, Phone, Mail, MapPin, Globe, Camera } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl text-white">Wonderland Toys</span>
            </div>
            <p className="text-sm mb-4">
              Your one-stop destination for magical toys that spark imagination and create joyful memories for children of all ages.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-blue-500 transition" aria-label="Facebook">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition" aria-label="Instagram">
                <Camera className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-500 transition">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-500 transition">All Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-500 transition">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-blue-500 transition">My Orders</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-500 transition">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition">Returns & Exchange</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <span className="text-sm">123 Wonderland Street, Fantasy City, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <span className="text-sm">+92 123 4567890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="text-sm">info@wonderlandtoys.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {currentYear} Wonderland Toys. All rights reserved.</p>
            <p className="flex items-center gap-1 mt-2 md:mt-0">
              Made with <Heart className="h-4 w-4 text-red-500" /> for little dreamers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}