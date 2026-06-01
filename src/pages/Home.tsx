import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../stores/productContext'; // Changed import
import ProductCard from '../components/products/ProductCard';
import { useCartStore } from '../stores/cartStore';
import { Button } from '@/components/ui/button';
import { Loader2, Truck, Shield, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  // Use the new context instead of Zustand
  const { products, isLoading, fetchProducts, error } = useProducts();
  const { addItemLocally } = useCartStore();

  // Debug: Log when products change
  useEffect(() => {
    console.log('🏠 Home: products from context:', products);
    console.log('🏠 Home: products length:', products?.length);
  }, [products]);

  const handleAddToCart = (product: any) => {
    try {
      addItemLocally(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || 'Failed to add to cart');
    }
  };

  const featuredProducts = products && products.length > 0 ? products.slice(0, 8) : [];

  // Show error if any
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => fetchProducts()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to Wonderland Toy Store
              </h1>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                Discover magical toys that spark imagination and create joy!
              </p>
              <div className="flex gap-4">
                <Link to="/products">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXa1Ahd9CYyYJRUcYF2ROfp3eXi1NWXHlGNQ&s"
                alt="Toys Collection"
                className="rounded-lg shadow-xl min-h-70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <Truck className="h-10 w-10 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders over Rs 5000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <Shield className="h-10 w-10 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-500">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <Gift className="h-10 w-10 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Gift Wrapping</h3>
                <p className="text-sm text-gray-500">Free gift wrapping available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-500">Discover our most popular toys this season</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-100">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Debug: Products count from API: {products?.length || 0}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products && products.length > 8 && (
            <div className="text-center mt-8">
              <Link to="/products">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  View All Products →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-blue-100 mb-6">
            Get the latest updates on new products and special offers
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}