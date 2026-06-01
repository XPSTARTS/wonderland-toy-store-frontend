// pages/Cart.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { authService } from '../services/authService';
import { Trash2, Plus, Minus, ShoppingBag, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const {
    items,
    isLoading,
    updateQuantityLocally,
    removeItemLocally,
    clearCartLocally,
    syncWithBackend,
    getTotalItems,
    getTotalAmount,
  } = useCartStore();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const user = authService.getCurrentUser();
  
  // Only sync once when component mounts
  useEffect(() => {
    if (user && items.length === 0) {
      syncWithBackend();
    }
  }, []);
  
  const handleSync = async () => {
    setIsSyncing(true);
    await syncWithBackend();
    setIsSyncing(false);
    toast.success('Cart synced with server');
  };
  
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityLocally(productId, newQuantity);
    toast.success('Cart updated');
  };
  
  const handleRemoveItem = (productId: number, productName: string) => {
    removeItemLocally(productId);
    toast.success(`${productName} removed from cart`);
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCartLocally();
      toast.success('Cart cleared');
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is waiting</h2>
        <p className="text-gray-600 mb-6">Please login to view and manage your cart</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Login to Continue
        </Link>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 border-b py-4">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  const totalAmount = getTotalAmount();
  const totalItems = getTotalItems();
  const shipping = totalAmount > 5000 ? 0 : 500;
  const grandTotal = totalAmount + shipping;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart ({totalItems} items)</h1>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Cart'}
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border-b py-4">
              <img 
                src={item.imageUrl || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=100'} 
                alt={item.productName}
                className="w-24 h-24 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=100';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-gray-600">Rs {item.productPrice.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.productId, item.productName)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">Rs {item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items):</span>
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
          <Link to="/checkout">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;