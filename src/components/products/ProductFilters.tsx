import { Search, X } from 'lucide-react';
import { useProducts } from '../../stores/productContext';
import { useEffect, useState } from 'react';

const ProductFilters = () => {
  const { 
    searchTerm, 
    selectedCategory, 
    sortBy, 
    setSearchTerm, 
    setCategory, 
    setSortBy, 
    resetFilters,
    isLoading,
    products  // Add this to get products for categories
  } = useProducts();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  // Extract unique categories from products
  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category).filter(c => c && c !== ''))];
      setCategories(['All', ...uniqueCategories]);
      console.log('Categories loaded:', uniqueCategories);
    }
  }, [products]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearch);
  };
  
  const handleCategoryChange = (category: string) => {
    setCategory(category === 'All' ? '' : category);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="flex">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
        
        {/* Category Filter */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory || 'All'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={isLoading}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        {/* Sort By */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={isLoading}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
        
        {/* Reset Button */}
        {(searchTerm || selectedCategory || sortBy !== 'newest') && (
          <button
            onClick={resetFilters}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 mb-1"
            disabled={isLoading}
          >
            <X className="w-4 h-4" /> Reset Filters
          </button>
        )}
      </div>
      
      {/* Active Filters Display */}
      {(searchTerm || selectedCategory) && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Search: {searchTerm}
              <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Category: {selectedCategory}
              <button onClick={() => setCategory('')} className="hover:text-green-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;