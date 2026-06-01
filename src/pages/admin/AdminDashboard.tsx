// pages/admin/AdminDashboard.tsx
import { useEffect } from 'react';
import { useAdminStore } from '../../stores/useAdminStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { stats, fetchStats, isLoading, error } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  // Show error if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `Rs ${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-semibold">{stats?.pendingOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipped</span>
                <span className="font-semibold">{stats?.shippedOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivered</span>
                <span className="font-semibold text-green-600">{stats?.deliveredOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled</span>
                <span className="font-semibold text-red-600">{stats?.cancelledOrders || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.lowStockProducts || stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-500">All products have sufficient stock</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span>{product.name}</span>
                    <span className="text-red-600 font-semibold">
                      Only {product.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">#{order.id}</td>
                      <td className="py-3 px-4">{order.customerName || 'Guest'}</td>
                      <td className="py-3 px-4">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">Rs {order.totalAmount?.toFixed(2) || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}