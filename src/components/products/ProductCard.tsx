import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { authService } from '../../services/authService';
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
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const user = authService.getCurrentUser();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    
    if (product.stockQuantity === 0) {
      toast.error('Out of stock');
      return;
    }
    
    setIsAdding(true);
    try {
      // Just add locally, don't sync
      addItemLocally(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      console.error('Add to cart error:', error);
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300'} 
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300';
          }}
        />
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <p className="text-blue-600 font-bold mt-1">Rs {product.price.toFixed(2)}</p>
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