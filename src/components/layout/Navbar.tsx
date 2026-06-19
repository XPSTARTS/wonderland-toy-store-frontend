// components/layout/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { authService } from '../../services/authService';
import { ShoppingCartIcon, User, LogOut, Home, Package, ShoppingBag, Users, LayoutDashboard, ChevronDown, Menu, X, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // ✅ Listen to auth changes - runs on every render
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [window.location.pathname]); // Re-run when URL changes

  // ✅ Listen to localStorage changes (for login/logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ Custom event for login/logout within the same tab
  useEffect(() => {
    const handleAuthChange = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    // Listen to custom auth change events
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsAdminDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsAdminDropdownOpen(false);
    }, 200);
  };
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    // ✅ Dispatch custom event
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.role === 'Admin';
  
  // Navigation links - centered
  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/about', label: 'About Us', icon: Info },
  ];
  
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <Link 
            to="/" 
            className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            Wonderland Toys
          </Link>
          
          {/* Centered Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>
          
          {/* Right side - Cart and User section */}
          <div className="flex items-center gap-2">
            {/* Cart Icon - Only show when logged in */}
            {user && (
              <Link 
                to="/cart" 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            
            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Admin Dropdown */}
                {isAdmin && (
                  <div 
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50">
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden lg:inline">Admin</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeInUp">
                        <div className="py-2">
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-500" />
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/products"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <Package className="w-4 h-4 text-blue-500" />
                            Manage Products
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <ShoppingBag className="w-4 h-4 text-blue-500" />
                            Manage Orders
                          </Link>
                          <Link
                            to="/admin/users"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            <Users className="w-4 h-4 text-blue-500" />
                            Manage Users
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* User Info */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-blue-50 to-indigo-50 rounded-full">
                  <div className="w-6 h-6 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                    {user.fullName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideDown">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Cart for Mobile - Only when logged in */}
              {user && (
                <Link
                  to="/cart"
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>Cart</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="bg-linear-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-0.5">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              
              {/* Admin Section for Mobile */}
              {isAdmin && (
                <>
                  <div className="px-4 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Admin Panel
                  </div>
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span>Manage Products</span>
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Manage Orders</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="w-5 h-5" />
                    <span>Manage Users</span>
                  </Link>
                </>
              )}
              
              {/* User Section for Mobile */}
              {user ? (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Create Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.2s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;