// User Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'Customer' | 'Admin';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: 'Customer' | 'Admin';
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

// Cart Types
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

// Order Types
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

// Admin Types
export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

export interface RecentOrder {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stockQuantity: number;
  price: number;
}

// User Types - Make role a union type
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'Customer' | 'Admin';  // Union type, not string
  createdAt: string;
}

// Order Types - Fix status type
export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';  // Union type
  shippingAddress: string;
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
}

// Add missing types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface UpdateUserRoleRequest {
  role: 'Customer' | 'Admin';
}