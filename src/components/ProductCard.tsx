
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
  className?: string;
}

export const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  category,
  isNew = false,
  isSale = false,
  salePrice,
  className,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      existingCart.push({
        id,
        name,
        price: isSale && salePrice ? salePrice : price,
        quantity: 1,
        image: imageUrl
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    setTimeout(() => {
      setIsAddingToCart(false);
      
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart.`,
      });
    }, 500);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${name} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
    });
  };

  return (
    <Link to={`/product/${id}`}>
      <div 
        className={cn(
          "group relative overflow-hidden bg-white rounded-lg transition-all duration-300 hover:shadow-md",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-alma-lightgray relative">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {isNew && (
              <span className="bg-alma-gold text-white text-xs px-2 py-1 rounded">New</span>
            )}
            {isSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
            )}
          </div>
          
          {/* Quick Actions */}
          <div 
            className={cn(
              "absolute inset-0 bg-black/0 flex items-center justify-center transition-all duration-300",
              isHovered ? "bg-black/10" : ""
            )}
          >
            <div 
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-white p-3 flex justify-center transform transition-transform duration-300",
                isHovered ? "translate-y-0" : "translate-y-full"
              )}
            >
              <Button 
                className={cn(
                  "bg-alma-gold hover:bg-opacity-90 text-black w-full relative overflow-hidden",
                  isAddingToCart ? "pointer-events-none" : ""
                )}
                onClick={handleAddToCart}
              >
                <span className={cn(
                  "inline-flex items-center transition-transform duration-300",
                  isAddingToCart ? "translate-y-[-100%]" : "translate-y-0"
                )}>
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </span>
                <span className={cn(
                  "absolute inset-0 flex items-center justify-center transition-transform duration-300",
                  isAddingToCart ? "translate-y-0" : "translate-y-[100%]"
                )}>
                  <Check size={16} className="mr-2" />
                  Added
                </span>
              </Button>
            </div>
          </div>
          
          {/* Favorite Button */}
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-all duration-300 hover:bg-alma-gold hover:text-white"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={16} 
              className={cn(
                "transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "fill-transparent"
              )} 
            />
          </button>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <span className="text-xs uppercase tracking-wider text-alma-gold">{category}</span>
          <h3 className="font-medium mt-1 text-lg leading-tight">{name}</h3>
          <div className="mt-2 flex items-center">
            {isSale && salePrice ? (
              <>
                <span className="font-medium text-red-500">${salePrice.toFixed(2)}</span>
                <span className="ml-2 text-gray-500 line-through text-sm">${price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-medium">${price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
