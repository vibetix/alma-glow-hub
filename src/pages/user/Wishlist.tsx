
import { UserLayout } from '@/components/UserLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
  // Mock wishlist data - replace with actual data from Supabase
  const wishlistItems = [
    {
      id: 1,
      name: 'Luxury Face Cream',
      price: 89.99,
      originalPrice: 109.99,
      image: '/placeholder.svg',
      inStock: true
    },
    {
      id: 2,
      name: 'Organic Hair Treatment',
      price: 45.00,
      originalPrice: null,
      image: '/placeholder.svg',
      inStock: true
    },
    {
      id: 3,
      name: 'Rejuvenating Eye Serum',
      price: 67.50,
      originalPrice: 75.00,
      image: '/placeholder.svg',
      inStock: false
    }
  ];

  const handleRemoveItem = (itemId: number) => {
    // Remove item from wishlist
    console.log('Remove item:', itemId);
  };

  const handleAddToCart = (itemId: number) => {
    // Add item to cart
    console.log('Add to cart:', itemId);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-alma-darkGreen mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite products for later.</p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium bg-black/70 px-3 py-1 rounded">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium text-alma-darkGreen mb-2">{item.name}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg font-semibold text-alma-gold">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-alma-gold hover:bg-alma-gold/90"
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item.id)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-4">Save products you love to view them later.</p>
              <Button className="bg-alma-gold hover:bg-alma-gold/90">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  );
};

export default Wishlist;
