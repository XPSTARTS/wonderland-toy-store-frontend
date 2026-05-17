import { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import ProductCard from '../components/products/ProductCard';
import { useCartStore } from '../stores/useCartStore'; // We'll create this next
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addItem(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Wonderland Toy Store</h1>
        <p className="text-lg mb-6">Discover magical toys that spark imagination and create joy!</p>
        <Button className="bg-white text-blue-600 hover:bg-gray-100">
          Shop Now
        </Button>
      </div>

      {/* Products Grid */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}