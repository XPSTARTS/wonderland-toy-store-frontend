import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Package, 
  LayoutDashboard, 
  Box, 
  ShoppingBag,
  Users 
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">Wonderland Toys</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Shop
            </Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              New Arrivals
            </Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Sale
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition">
                My Orders
              </Link>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Admin Dropdown */}
                {user?.role === 'Admin' && (
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Panel
                    </Button>
                    
                    {isAdminMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIsAdminMenuOpen(false)}
                        />
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                          <div className="py-1">
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsAdminMenuOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                            <Link
                              to="/admin/products"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsAdminMenuOpen(false)}
                            >
                              <Box className="h-4 w-4 mr-2" />
                              Manage Products
                            </Link>
                            <Link
                              to="/admin/orders"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsAdminMenuOpen(false)}
                            >
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Manage Orders
                            </Link>
                            <Link
                              to="/admin/users"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsAdminMenuOpen(false)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Manage Users
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <span className="text-sm text-gray-600 hidden md:inline">
                  Hi, {user?.fullName?.split(' ')[0]}
                </span>
                
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}