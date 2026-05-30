import { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/common/Pagination';
import { ProductsGridSkeleton } from '../components/common/SkeletonLoader';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const { 
    products, 
    isLoading, 
    currentPage, 
    totalPages, 
    loadProducts, 
    setPage 
  } = useProductStore();
  
  useEffect(() => {
    loadProducts();
  }, []); // Load once on mount
  
  // Show skeleton only on initial load
  if (isLoading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <ProductsGridSkeleton />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Toys</h1>
      
      <ProductFilters />
      
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default Products;