// pages/Checkout.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/useOrderStore';
import { authService } from '../services/authService';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  const { items, getTotalAmount, syncWithBackend, isLoading: cartLoading } = useCartStore();
  const { placeOrder, isLoading: orderLoading } = useOrderStore();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const user = authService.getCurrentUser();
  const totalAmount = getTotalAmount();
  const shipping = totalAmount > 5000 ? 0 : 500;
  const grandTotal = totalAmount + shipping;
  
  // Sync cart with backend when component mounts
  useEffect(() => {
    const syncCart = async () => {
      if (user && items.length > 0) {
        setIsSyncing(true);
        toast.loading('Syncing cart...', { id: 'sync-cart' });
        await syncWithBackend();
        toast.success('Cart synced!', { id: 'sync-cart' });
        setIsSyncing(false);
      }
    };
    
    syncCart();
  }, []);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !isSyncing) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items.length, cartLoading, navigate, isSyncing]);
  
  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    
    try {
      // First, ensure cart is synced with backend
      if (!isSyncing) {
        setIsSyncing(true);
        toast.loading('Syncing cart before order...', { id: 'pre-order-sync' });
        await syncWithBackend();
        toast.success('Cart synced!', { id: 'pre-order-sync' });
        setIsSyncing(false);
      }
      
      // Build complete shipping address
      const shippingAddress = `${data.address}, ${data.city}, ${data.postalCode}`;
      
      toast.loading('Placing your order...', { id: 'place-order' });
      // placeOrder expects a string (shippingAddress)
      const order = await placeOrder(shippingAddress);
      
      toast.success('Order placed successfully!', { id: 'place-order' });
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error: any) {
      console.error('Order failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.', { id: 'place-order' });
    }
  };
  
  if (cartLoading || isSyncing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Syncing your cart...</p>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items before checking out</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={user?.fullName || ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={user?.email || ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    {...register('address', { required: 'Address is required' })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                  <input
                    {...register('postalCode', { required: 'Postal code is required' })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 03XXXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={orderLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {orderLoading ? 'Placing Order...' : `Place Order • Rs ${grandTotal.toFixed(2)}`}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({items.length} items):</span>
              <span>Rs {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'Free' : `Rs ${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-500">Add Rs {(5000 - totalAmount).toFixed(2)} more for free shipping</p>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>Rs {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Items in your order:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productName} x{item.quantity}</span>
                  <span>Rs {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;