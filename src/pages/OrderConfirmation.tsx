// pages/OrderConfirmation.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../stores/useOrderStore';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchOrderById, isLoading } = useOrderStore();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await fetchOrderById(Number(id));
      if (data) {
        setOrder(data);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Failed to load order details');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Order Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'Unable to load order details'}</p>
          <Link to="/orders" className="text-blue-600 hover:text-blue-700">
            View My Orders →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been received.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Order #: {order.id}
        </p>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Order Status</h2>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-600">Order Placed</p>
          </div>
          <div className="flex-1 h-0.5 bg-green-200 mx-2"></div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Processing</p>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Shipped</p>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Delivered</p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Order Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">
              {new Date(order.orderDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">Cash on Delivery</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Status:</span>
            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {order.status || 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
        <p className="text-gray-700">{order.shippingAddress}</p>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">Rs {item.subtotal?.toFixed(2) || (item.unitPrice * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>Rs {order.totalAmount?.toFixed(2) || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-center hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg text-center hover:bg-blue-50 transition"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;