<div align="center">

# 🧸 Wonderland Toy Store — Frontend

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&style=for-the-badge" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&style=for-the-badge" alt="TypeScript 5"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&style=for-the-badge" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Zustand-4-000000?style=for-the-badge" alt="Zustand"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&style=for-the-badge" alt="Vite 5"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&style=for-the-badge" alt="Vercel"/>
</p>

**A modern, responsive e-commerce frontend built with React 18, TypeScript, and Tailwind CSS**

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Project Structure](#-project-structure) • [Getting Started](#-getting-started) • [Deployment](#-deployment)

</div>

---

## 📌 Overview

The Wonderland Toy Store Frontend is a full-featured e-commerce UI built with modern React patterns. It delivers a seamless shopping experience with real-time cart updates, JWT-based authentication, intuitive product browsing, and a full admin dashboard.

- 🌐 **Live Demo:** [wonderland-toys.vercel.app](https://wonderland-toys.vercel.app)
- 🔗 **Backend API:** [Wonderland Toy Store API](https://github.com/XPSTARTS/wonderland-toy-store)

---

## ✨ Features

### 🔐 Authentication
- User registration and secure login
- JWT token management with refresh token support
- Protected routes for customers and admins
- Persistent auth state across sessions

### 🛍️ Shopping Experience
- Product browsing with pagination
- Search, filtering, and sorting (price, name, date)
- Detailed product pages
- Add-to-cart with real-time updates

### 🛒 Cart Management
- Add, remove, and update item quantities
- Persistent cart state via Zustand
- Dynamic cart count badge
- Accurate order summary

### 📝 Order Processing
- Checkout flow with shipping address input
- Multiple payment methods: Cash on Delivery, Card, Bank Transfer
- Order confirmation page
- Order history and real-time status tracking

### 👑 Admin Dashboard
- Dashboard statistics overview
- Product management (CRUD)
- Order management with status updates
- User management and role assignment
- Low stock alerts

### 🎨 User Experience
- Toast notifications for user actions
- Skeleton loading states
- Glass-morphism UI design
- Fully responsive across all screen sizes
- Animated page transitions

---

## 🛠️ Tech Stack

| Category           | Technology       | Version |
|--------------------|------------------|---------|
| Framework          | React            | 18      |
| Language           | TypeScript       | 5       |
| Build Tool         | Vite             | 5       |
| Styling            | Tailwind CSS     | 3       |
| State Management   | Zustand          | 4       |
| Routing            | React Router DOM | 6       |
| HTTP Client        | Axios            | 1       |
| Forms              | React Hook Form  | 7       |
| Icons              | Lucide React     | —       |
| Notifications      | React Hot Toast  | 2       |
| Animations         | Framer Motion    | —       |
| Deployment         | Vercel           | —       |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared components
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── ...
│   │   ├── products/            # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   └── ...
│   │   ├── cart/                # Cart components
│   │   ├── orders/              # Order components
│   │   └── admin/               # Admin components
│   │       ├── AdminLayout.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       └── AdminUsers.tsx
│   │
│   ├── pages/                   # Page-level views
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── OrderHistory.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── AboutUs.tsx
│   │
│   ├── stores/                  # Zustand state stores
│   │   ├── cartStore.ts
│   │   ├── productStore.ts
│   │   ├── orderStore.ts
│   │   └── adminStore.ts
│   │
│   ├── services/                # API service layer
│   │   ├── api.ts               # Axios instance & interceptors
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   └── adminService.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript interfaces & types
│   ├── utils/                   # Helper functions
│   └── assets/                  # Static assets
│
├── .env.example                 # Environment variable template
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A running instance of the [Wonderland Backend API](https://github.com/XPSTARTS/wonderland-toy-store)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/XPSTARTS/wonderland-toy-store-frontend.git
cd wonderland-toy-store-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Edit your `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5248/api

# For production, use your deployed backend URL
# VITE_API_URL=https://your-backend.railway.app/api
```

> ⚠️ Never commit your `.env` file. It is already excluded via `.gitignore`.

```bash
# 4. Start the development server
npm run dev
```

---

## 📡 API Integration

The frontend communicates with the backend via a configured Axios instance.

**Base setup:**

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});
```

**Auth interceptor — attaches JWT to every request:**

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 🔄 Key Flows

**Authentication**
```
Register / Login → Receive JWT tokens → Store in localStorage
→ Axios interceptor attaches token → Auto-refresh on expiry → Logout revokes token
```

**Cart**
```
Add item → Zustand updates instantly (optimistic UI)
→ Sync with backend → Persist in localStorage → Checkout → Clear cart
```

**Admin**
```
Admin login → Role-based route access → Dashboard stats
→ Manage products / orders / users
```

---

## 🎨 Design System

### Colors

| Role      | Color  | Hex       |
|-----------|--------|-----------|
| Primary   | Blue   | `#3B82F6` |
| Secondary | Indigo | `#6366F1` |
| Success   | Green  | `#10B981` |
| Danger    | Red    | `#EF4444` |
| Warning   | Yellow | `#F59E0B` |

### Responsive Breakpoints

| Breakpoint | Devices       | Layout        |
|------------|---------------|---------------|
| Mobile     | < 640px       | Single column |
| Tablet     | 640 – 1024px  | Two columns   |
| Desktop    | > 1024px      | Four columns  |

---

## 🗂️ State Management

| Store          | Purpose                                      |
|----------------|----------------------------------------------|
| `cartStore`    | Cart items, quantities, and totals           |
| `productStore` | Products, filters, and pagination            |
| `orderStore`   | Order creation and history                   |
| `adminStore`   | Admin dashboard data                         |

---

## 🛠️ Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build locally
npm run type-check    # Run TypeScript type checking
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

---

## 🧪 Testing

```bash
npm run test            # Run tests
npm run test:coverage   # Run tests with coverage report
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Set `VITE_API_URL` in the Vercel dashboard under **Environment Variables**
3. Vercel auto-deploys on every push to `main`

### Manual Build

```bash
npm run build
# Deploy the generated /dist folder to any static host
```

---

## 👨‍💻 Author

**Abdul Moid**
- GitHub: [@XPSTARTS](https://github.com/XPSTARTS)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

[React](https://react.dev) • [Vite](https://vitejs.dev) • [Tailwind CSS](https://tailwindcss.com) • [Zustand](https://zustand-demo.pmnd.rs) • [Lucide Icons](https://lucide.dev)

---

## 🔗 Related

- **Backend API:** [Wonderland Toy Store API](https://github.com/XPSTARTS/wonderland-toy-store)

---

<div align="center">

Built with ❤️ as a university semester project

<img src="https://img.shields.io/github/stars/XPSTARTS/wonderland-toy-store-frontend?style=social" alt="GitHub stars"/>
<img src="https://img.shields.io/github/forks/XPSTARTS/wonderland-toy-store-frontend?style=social" alt="GitHub forks"/>

</div>
