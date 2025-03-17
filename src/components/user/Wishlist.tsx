
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Heart, ShoppingCart, Trash } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for wishlist items
const wishlistItems = [
  {
    id: 1,
    name: "Alma Rejuvenating Serum",
    image: "/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png",
    price: 79.99,
    inStock: true,
  },
  {
    id: 2,
    name: "Hydrating Clay Mask",
    image: "/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png",
    price: 35.00,
    inStock: true,
  },
  {
    id: 3,
    name: "Exfoliating Body Scrub",
    image: "/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png",
    price: 29.99,
    inStock: false,
  },
];

export const Wishlist = () => {
  const handleRemoveFromWishlist = (id: number) => {
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist."
    });
  };
  
  const handleAddToCart = (id: number) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart."
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-red-500 fill-red-500" />
          Your Wishlist
        </CardTitle>
        <CardDescription>
          {wishlistItems.length} saved items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Your wishlist is empty</p>
              <Button variant="link" asChild className="mt-2">
                <Link to="/shop">Browse products</Link>
              </Button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
                    {!item.inStock && (
                      <span className="text-xs text-red-500">Out of stock</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!item.inStock}
                    onClick={() => handleAddToCart(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
