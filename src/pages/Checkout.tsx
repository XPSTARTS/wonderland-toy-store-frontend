// pages/Checkout.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/useOrderStore';
import { cartService } from '../services/cart.service';
import { authService } from '../services/authService';
import { Loader2, CreditCard, Wallet, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { items, getTotalAmount, syncWithBackend, isLoading: cartLoading, clearCartLocally } = useCartStore();
  const { placeOrder, isLoading: orderLoading } = useOrderStore();

  const user = authService.getCurrentUser();
  const totalAmount = getTotalAmount();
  const shipping = totalAmount > 5000 ? 0 : 500;
  const grandTotal = totalAmount + shipping;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardInputChange = (field: keyof CardDetails, value: string) => {
    let formattedValue = value;
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }
    setCardDetails({ ...cardDetails, [field]: formattedValue });
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !isSyncing) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items.length, cartLoading, navigate, isSyncing]);

  const processPayment = async (orderId: number) => {
    try {
      setIsProcessingPayment(true);

      const paymentData = {
        orderId: orderId,
        paymentMethod: paymentMethod,
        ...(paymentMethod === 'card' && { cardDetails: cardDetails })
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/process/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Payment successful!');
        return true;
      } else {
        toast.error(result.message || 'Payment failed');
        return false;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Validate card details if card payment selected
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
        toast.error('Please enter a valid expiry date');
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }
      if (!cardDetails.cardHolderName) {
        toast.error('Please enter cardholder name');
        return;
      }
    }

    try {
      // Clear backend cart to avoid duplicates
      setIsSyncing(true);
      toast.loading('Preparing your cart...', { id: 'sync-cart' });
      
      try {
        await cartService.clearCart();
      } catch (error) {
        // Silent fail - continue with order
      }
      
      await syncWithBackend();
      setIsSyncing(false);
      toast.success('Cart ready!', { id: 'sync-cart' });

      // Build complete shipping address
      const shippingAddress = `${data.address}, ${data.city}, ${data.postalCode}`;

      // ✅ Place order
      toast.loading('Placing your order...', { id: 'place-order' });
      const order = await placeOrder(shippingAddress);

      // ✅ For COD: Order complete, no payment needed
      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully!', { id: 'place-order' });
        clearCartLocally();
        navigate(`/order-confirmation/${order.id}`);
        return;
      }

      // ✅ For Card/Bank: Process payment after order
      toast.loading('Processing payment...', { id: 'payment-processing' });
      const paymentSuccess = await processPayment(order.id);

      if (!paymentSuccess) {
        toast.error('Order placed but payment failed. Please contact support.', { id: 'payment-processing' });
        clearCartLocally();
        navigate(`/order-confirmation/${order.id}`, { state: { paymentFailed: true } });
        return;
      }

      toast.success('Payment successful!', { id: 'payment-processing' });
      clearCartLocally();
      navigate(`/order-confirmation/${order.id}`);

    } catch (error: any) {
      console.error('Order failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.', { id: 'place-order' });
      setIsSyncing(false);
    }
  };

  if (cartLoading || isSyncing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Preparing your cart...</p>
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
            {/* Shipping Information */}
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

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span>Cash on Delivery</span>
                  <span className="ml-auto text-sm text-gray-500">Pay when you receive</span>
                </label>

                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Credit / Debit Card</span>
                  <span className="ml-auto text-sm text-gray-500">Secure payment</span>
                </label>

                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <span>Bank Transfer</span>
                  <span className="ml-auto text-sm text-gray-500">Manual transfer</span>
                </label>
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3 p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardDetails.cardHolderName}
                        onChange={(e) => handleCardInputChange('cardHolderName', e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    🔒 Your card details are securely processed. We do not store any card information.
                  </p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Please transfer the amount to:</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-medium">Bank:</span> Wonderland Bank</p>
                    <p><span className="font-medium">Account:</span> 1234-5678-9012</p>
                    <p><span className="font-medium">IBAN:</span> PK12 WOND 1234 5678 9012</p>
                    <p className="text-xs text-gray-500 mt-2">Please use Order ID as reference when transferring.</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={orderLoading || isProcessingPayment}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {orderLoading || isProcessingPayment ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isProcessingPayment ? 'Processing Payment...' : 'Placing Order...'}
                </span>
              ) : (
                `Place Order • Rs ${grandTotal.toFixed(2)}`
              )}
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

          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-gray-500 text-center">
              {paymentMethod === 'cod' ? 'Pay on delivery' :
                paymentMethod === 'card' ? 'Secured payment via card' :
                  'Bank transfer'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;