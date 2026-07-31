import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthResponse } from '../types';

const Verify2FA = () => {
  const navigate = useNavigate();
  const syncWithBackend = useCartStore((state) => state.syncWithBackend);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Retrieve the email that was saved during login
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('2faEmail');
    if (!storedEmail) {
      toast.error('No 2FA session found. Please login again.');
      navigate('/login');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || isNaN(Number(code))) {
      toast.error('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      // ✅ We use { email, code } directly, no special type needed!
      const response = await authService.verifyTwoFactor({ email, code }) as AuthResponse;
      
      // Save user data
      localStorage.setItem('user', JSON.stringify({
        email: response.email,
        fullName: response.fullName,
        role: response.role
      }));
      
      await syncWithBackend();
      window.dispatchEvent(new Event('auth-change'));
      sessionStorage.removeItem('2faEmail');

      toast.success('2FA verified! Welcome back!');
      navigate('/', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor behavior
    try {
      await authService.sendTwoFactorCode(email);
      toast.success('New code sent to your email');
    } catch (error: any) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Enter the 6-digit code sent to your email"
      alternateText="Didn't receive a code?"
      alternateLink="#"
      alternateLinkText="Resend Code"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-center text-white/60 text-sm">
          We've sent a verification code to <span className="text-white font-medium">{email}</span>
        </p>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 text-center">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            className="w-full py-3 text-center text-2xl tracking-[0.5em] bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent transition outline-none text-white placeholder-white/40"
            placeholder="000000"
            required
            maxLength={6}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Verify Code'
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Verify2FA;