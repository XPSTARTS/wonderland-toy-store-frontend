// components/layout/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { authService } from '../../services/authService';
import { ShoppingCartIcon, User, LogOut, Home, Package, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [user, setUser] = useState(authService.getCurrentUser());
  
  // Update user state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Also check for user on component mount and after navigation
  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [window.location.pathname]);
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
    window.location.reload(); // Force reload to clear all state
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
            Wonderland Toys
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </Link>
            
            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
              <ShoppingCartIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.fullName?.split(' ')[0] || user.email}
                  </span>
                </div>
                
                {user.role === 'Admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition text-sm">
                    Admin
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;