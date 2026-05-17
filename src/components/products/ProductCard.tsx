import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl || 'https://placehold.co/400x400?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="pt-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          {product.stockQuantity > 0 ? (
            <span className="text-xs text-green-600">In Stock</span>
          ) : (
            <span className="text-xs text-red-600">Out of Stock</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => onAddToCart?.(product)}
          disabled={product.stockQuantity === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}