import { useEffect, useState } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import ProductCard from '../components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Products() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: any) => {
    try {
      await addItem(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  // Filter products by search
  let filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-500">Browse our complete collection of magical toys</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded-md px-3 py-2 bg-white"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-100">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search.</p>
          <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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