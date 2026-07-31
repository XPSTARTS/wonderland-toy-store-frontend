// ============================================
// AUTH TYPES
// ============================================
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
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: 'Customer' | 'Admin';
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

// ✅ NEW: 2FA Response Type
export interface TwoFactorResponse {
  requiresTwoFactor: true;
  email: string;
  message: string;
}

// ============================================
// PRODUCT TYPES
// ============================================
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetProductsParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  sortBy?: string;
}

// ============================================
// CART TYPES
// ============================================
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

// ============================================
// ORDER TYPES
// ============================================
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

export interface UpdateOrderStatusRequest {
  status: string;
}

// ============================================
// ADMIN TYPES
// ============================================
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

export interface UpdateUserRoleRequest {
  role: 'Customer' | 'Admin';
}