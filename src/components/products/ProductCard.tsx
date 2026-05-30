import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const addItemLocally = useCartStore((state) => state.addItemLocally);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // This app uses a local-first cart store.
    // If you want auth enforcement, wire it to useAuthStore instead.
    const user = null;
    
    if (user === null) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    if (product.stockQuantity === 0) {
      toast.error('Out of stock');
      return;
    }
    
    setIsAdding(true);
    try {
      addItemLocally(
        { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl },
        1
      );
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }


  };
  
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <p className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
        <p className={`text-sm mt-1 ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stockQuantity === 0}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;