
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Heart, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { sampleProducts } from '@/data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the product from an API
    const foundProduct = sampleProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${product?.name} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
    });
  };

  const handleAddToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.isSale && product.salePrice ? product.salePrice : product.price,
        quantity: quantity,
        image: product.imageUrl
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success animation and toast
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container-custom py-32 flex justify-center items-center">
          <div className="animate-pulse text-alma-gold">Loading product...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container-custom py-32 flex flex-col items-center">
          <h2 className="heading-2 mb-6">Product Not Found</h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop">
            <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white">
              Back to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const actualPrice = product.isSale && product.salePrice ? product.salePrice : product.price;

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container-custom py-32">
          <Link 
            to="/shop" 
            className="inline-flex items-center text-gray-600 hover:text-alma-gold transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Shop
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-alma-lightgray rounded-lg overflow-hidden">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-alma-gold text-white text-xs px-2 py-1 rounded">New</span>
                )}
                {product.isSale && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
                )}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <span className="text-alma-gold text-sm font-medium">{product.category}</span>
              <h1 className="heading-2 mt-2 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                {product.isSale && product.salePrice ? (
                  <>
                    <span className="text-2xl font-medium text-red-500">${product.salePrice.toFixed(2)}</span>
                    <span className="ml-3 text-gray-500 line-through text-lg">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-medium">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <div className="border-t border-b py-6 mb-6">
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
                  Sed euismod, nisl eget ultricies ultricies, nunc nisi ultricies nunc, 
                  vitae ultricies nunc nisi eget nunc.
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check size={16} className="text-alma-gold mr-2" />
                    <span>Premium, high-quality ingredients</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="text-alma-gold mr-2" />
                    <span>Ethically sourced and cruelty-free</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="text-alma-gold mr-2" />
                    <span>Made in small batches for freshness</span>
                  </li>
                </ul>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Quantity</span>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className={`flex-1 bg-alma-gold hover:bg-alma-gold/90 text-white relative overflow-hidden ${addedToCart ? 'pointer-events-none' : ''}`}
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <span className={`inline-flex items-center transition-transform duration-300 ${addedToCart ? 'translate-y-[-100%]' : 'translate-y-0'}`}>
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${addedToCart ? 'translate-y-0' : 'translate-y-[100%]'}`}>
                      <Check size={18} className="mr-2" />
                      Added!
                    </span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`h-12 w-12 ${isFavorite ? 'bg-red-50 border-red-200' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <Heart 
                      size={20} 
                      className={isFavorite ? "fill-red-500 text-red-500" : "fill-transparent"}
                    />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>SKU: PRD-{product.id}</p>
                <p>Category: {product.category}</p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
};

export default ProductDetail;
