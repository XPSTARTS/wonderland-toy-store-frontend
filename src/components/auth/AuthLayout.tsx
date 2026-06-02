// components/auth/AuthLayout.tsx - Update color schemes to be consistent blue

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, Star, Heart } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  alternateText: string;
  alternateLink: string;
  alternateLinkText: string;
  isLogin?: boolean;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  alternateText,
  alternateLink,
  alternateLinkText,
  isLogin = true,
}: AuthLayoutProps) => {
  // Floating elements for animation
  const floatingIcons = [
    { Icon: Sparkles, delay: '0s', top: '10%', left: '5%' },
    { Icon: Gift, delay: '2s', top: '20%', right: '8%' },
    { Icon: Star, delay: '4s', bottom: '15%', left: '10%' },
    { Icon: Heart, delay: '3s', bottom: '25%', right: '5%' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-20 -left-48"></div>
        <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000 bottom-20 -right-48"></div>
        <div className="absolute w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, top, left, right }, index) => (
        <div
          key={index}
          className="absolute text-white/20 animate-float"
          style={{ 
            top, 
            left, 
            right,
            animationDelay: delay,
            animationDuration: '6s'
          }}
        >
          <Icon className="w-12 h-12" />
        </div>
      ))}

      {/* Main Card */}
      <div className="max-w-5xl w-full relative z-10">
        <div className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20`}>
          
          {/* Left Side - Changes based on isLogin */}
          <div className={`md:w-1/2 p-8 md:p-12 transition-all duration-500 ${
            isLogin ? 'bg-linear-to-br from-blue-600/90 to-indigo-600/90' : 'bg-white/5'
          }`}>
            {isLogin ? (
              // Login Left Side - Branding
              <div className="h-full flex flex-col justify-between">
                <div>
                  <Link to="/">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🧸</span>
                      </div>
                      <h1 className="text-2xl font-bold text-white">Wonderland</h1>
                    </div>
                  </Link>
                  
                  <div className="mt-8">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Welcome Back!
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      Sign in to continue your magical journey and discover the perfect toys for your little ones.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>Fast & Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span>Free Shipping on Orders Over Rs 5000</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span>Premium Quality Toys</span>
                  </div>
                </div>
              </div>
            ) : (
              // Register Left Side - Form Side (when not login)
              <div className="h-full">
                {children}
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className={`md:w-1/2 p-8 md:p-12 transition-all duration-500 ${
            isLogin ? 'bg-white/5' : 'bg-linear-to-br from-blue-600/90 to-indigo-600/90'
          }`}>
            {isLogin ? (
              // Login Right Side - Form
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {title}
                </h2>
                <p className="text-white/70 mb-6">
                  {subtitle}
                </p>
                
                {children}
                
                <p className="text-center text-sm text-white/60 mt-6">
                  {alternateText}{' '}
                  <Link to={alternateLink} className="text-white font-semibold hover:text-white/80 transition">
                    {alternateLinkText}
                  </Link>
                </p>
              </div>
            ) : (
              // Register Right Side - Branding
              <div className="h-full flex flex-col justify-between">
                <div>
                  <Link to="/">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🧸</span>
                      </div>
                      <h1 className="text-2xl font-bold text-white">Wonderland</h1>
                    </div>
                  </Link>
                  
                  <div className="mt-8">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Join the Magic!
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      Create an account to unlock exclusive deals, track orders, and save your favorite toys.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>Exclusive Member Discounts</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span>Birthday Special Offers</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    <span>Wishlist & Save for Later</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;