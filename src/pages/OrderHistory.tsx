// pages/OrderHistory.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../stores/useOrderStore';
import { Package, Loader2 } from 'lucide-react';

const OrderHistory = () => {
  const { orders, isLoading, getUserOrders } = useOrderStore(); // Changed from fetchOrders to getUserOrders
  
  useEffect(() => {
    getUserOrders(); // Changed from fetchOrders to getUserOrders
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }
  
  // Safe check - ensure orders exists and is an array
  const ordersList = orders || [];
  
  if (ordersList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Start Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {ordersList.map((order: any) => (
          <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                  ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                  ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {order.status}
                </span>
                <p className="font-semibold mt-1">Rs {order.totalAmount?.toFixed(2) || 0}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Shipping to: {order.shippingAddress}</p>
              <Link 
                to={`/order-confirmation/${order.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;