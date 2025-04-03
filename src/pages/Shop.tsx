import { useState, useEffect } from 'react';
import { SearchIcon, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const categories = ["All", "Skin Care", "Hair Care", "Bath & Body", "Tools"];
const ITEMS_PER_PAGE = 6;

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("recommended");
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [noProductsExist, setNoProductsExist] = useState(false);
  
  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          if (data.length === 0) {
            setNoProductsExist(true);
            setAllProducts([]);
            setFilteredProducts([]);
            return;
          }
          
          // Convert database products to frontend format
          const formattedProducts = data.map(product => ({
            ...product,
            id: product.id,
            name: product.name,
            price: Number(product.price),
            sale_price: product.sale_price ? Number(product.sale_price) : undefined,
            imageUrl: product.image_url || '/placeholder.svg',
            category: product.category,
            is_new: product.is_new || false,
            is_sale: product.is_sale || false
          }));
          
          setAllProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
          setNoProductsExist(false);
          
          // Get max price for price range slider
          const maxPrice = Math.max(...formattedProducts.map(p => Number(p.price)), 100);
          setPriceRange([0, maxPrice]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: "Please refresh the page or try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, 
        (payload) => {
          console.log('Realtime update:', payload);
          fetchProducts(); // Refresh products when there's a change
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Filter and sort products
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    let result = [...allProducts];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Filter by price range
    result = result.filter(product => {
      const price = product.is_sale && product.sale_price 
        ? Number(product.sale_price) 
        : Number(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sort products
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const priceA = a.is_sale && a.sale_price ? Number(a.sale_price) : Number(a.price);
        const priceB = b.is_sale && b.sale_price ? Number(b.sale_price) : Number(b.price);
        return priceA - priceB;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const priceA = a.is_sale && a.sale_price ? Number(a.sale_price) : Number(a.price);
        const priceB = b.is_sale && b.sale_price ? Number(b.sale_price) : Number(b.price);
        return priceB - priceA;
      });
    } else if (sortBy === "new") {
      result.sort((a, b) => (a.is_new === b.is_new) ? 0 : a.is_new ? -1 : 1);
    }
    
    setFilteredProducts(result);
    setTotalPages(Math.max(1, Math.ceil(result.length / ITEMS_PER_PAGE)));
    
    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Check if any filters are applied
    setIsFiltered(
      searchTerm !== "" || 
      selectedCategory !== "All" || 
      priceRange[0] > 0 || 
      priceRange[1] < (Math.max(...allProducts.map(p => Number(p.price)), 100)) ||
      sortBy !== "recommended"
    );
  }, [searchTerm, selectedCategory, priceRange, sortBy, allProducts]);
  
  // Get current page items
  useEffect(() => {
    const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    setProducts(currentProducts);
  }, [filteredProducts, currentPage]);
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    const maxPrice = Math.max(...allProducts.map(p => Number(p.price)), 100);
    setPriceRange([0, maxPrice]);
    setSortBy("recommended");
  };
  
  const staggeredAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-alma-lightgray">
        <div className="container-custom">
          <h1 className="heading-2 text-center">Shop Our Collection</h1>
          <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover our premium selection of beauty products curated for exceptional results.
          </p>
        </div>
      </section>
      
      {/* Shop Content */}
      <section className="py-16">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-12 w-12 animate-spin text-alma-gold mb-4" />
              <p className="text-lg text-gray-600">Loading products...</p>
            </div>
          ) : noProductsExist ? (
            <div className="flex flex-col items-center justify-center py-32">
              <h3 className="text-2xl font-medium mb-4">No products available</h3>
              <p className="text-lg text-gray-600 mb-4">Our shop will be stocked soon!</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Desktop Filter */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="pb-6 border-b">
                    <h3 className="font-medium text-lg mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox 
                            id={`category-${category}`}
                            checked={selectedCategory === category}
                            onCheckedChange={() => setSelectedCategory(category)}
                            className="text-alma-gold"
                          />
                          <Label 
                            htmlFor={`category-${category}`}
                            className="ml-2 cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="py-6 border-b">
                    <h3 className="font-medium text-lg mb-4">Price Range</h3>
                    <Slider 
                      defaultValue={priceRange} 
                      max={Math.max(...allProducts.map(p => Number(p.price)), 100)} 
                      step={1} 
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-6 mb-4"
                    />
                    <div className="flex justify-between text-sm">
                      <span>₵{priceRange[0]}</span>
                      <span>₵{priceRange[1]}</span>
                    </div>
                  </div>
                  
                  {isFiltered && (
                    <Button 
                      variant="outline" 
                      className="mt-6 w-full border-alma-gold text-alma-gold hover:bg-alma-gold/10"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1">
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      type="search" 
                      placeholder="Search products..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Mobile Filter */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden">
                          <Filter size={18} className="mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right">
                        <SheetHeader>
                          <SheetTitle>Filter Products</SheetTitle>
                          <SheetDescription>
                            Refine your product selection
                          </SheetDescription>
                        </SheetHeader>
                        
                        <div className="py-4 h-full flex flex-col">
                          <div className="flex-1 overflow-auto pr-2">
                            <div className="pb-6 border-b">
                              <h3 className="font-medium text-lg mb-4">Categories</h3>
                              <div className="space-y-3">
                                {categories.map((category) => (
                                  <div key={category} className="flex items-center">
                                    <Checkbox 
                                      id={`mobile-category-${category}`}
                                      checked={selectedCategory === category}
                                      onCheckedChange={() => setSelectedCategory(category)}
                                    />
                                    <Label 
                                      htmlFor={`mobile-category-${category}`}
                                      className="ml-2 cursor-pointer"
                                    >
                                      {category}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="py-6 border-b">
                              <h3 className="font-medium text-lg mb-4">Price Range</h3>
                              <Slider 
                                max={Math.max(...allProducts.map(p => Number(p.price)), 100)}
                                step={1} 
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="mt-6 mb-4"
                              />
                              <div className="flex justify-between text-sm">
                                <span>₵{priceRange[0]}</span>
                                <span>₵{priceRange[1]}</span>
                              </div>
                            </div>
                          </div>
                          
                          <SheetFooter className="pt-4 border-t">
                            <SheetClose asChild>
                              <Button 
                                type="submit" 
                                className="w-full bg-alma-gold text-black hover:bg-opacity-90"
                              >
                                Apply Filters
                              </Button>
                            </SheetClose>
                            
                            {isFiltered && (
                              <Button 
                                variant="outline" 
                                className="w-full mt-2"
                                onClick={resetFilters}
                              >
                                Reset Filters
                              </Button>
                            )}
                          </SheetFooter>
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    {/* Sort Dropdown */}
                    <Select 
                      value={sortBy} 
                      onValueChange={setSortBy}
                    >
                      <SelectTrigger className="min-w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="new">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Active Filters */}
                {isFiltered && (
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">Active Filters:</span>
                    
                    {selectedCategory !== "All" && (
                      <span className="text-xs bg-alma-lightgray px-3 py-1 rounded-full flex items-center">
                        Category: {selectedCategory}
                        <button 
                          onClick={() => setSelectedCategory("All")} 
                          className="ml-2 text-gray-500 hover:text-black"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    
                    {(priceRange[0] > 0 || priceRange[1] < Math.max(...allProducts.map(p => Number(p.price)), 100)) && (
                      <span className="text-xs bg-alma-lightgray px-3 py-1 rounded-full flex items-center">
                        Price: ₵{priceRange[0]} - ₵{priceRange[1]}
                        <button 
                          onClick={() => setPriceRange([0, Math.max(...allProducts.map(p => Number(p.price)), 100)])} 
                          className="ml-2 text-gray-500 hover:text-black"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    
                    {sortBy !== "recommended" && (
                      <span className="text-xs bg-alma-lightgray px-3 py-1 rounded-full flex items-center">
                        Sort: {sortBy === "price-asc" 
                          ? "Price: Low to High" 
                          : sortBy === "price-desc" 
                          ? "Price: High to Low" 
                          : "Newest First"}
                        <button 
                          onClick={() => setSortBy("recommended")} 
                          className="ml-2 text-gray-500 hover:text-black"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    
                    <button 
                      onClick={resetFilters}
                      className="text-xs text-alma-gold hover:underline ml-2"
                    >
                      Clear All
                    </button>
                  </div>
                )}
                
                {/* Products Grid */}
                {products.length > 0 ? (
                  <>
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      variants={staggeredAnimation}
                      initial="hidden"
                      animate="visible"
                    >
                      {products.map((product) => (
                        <motion.div key={product.id} variants={fadeInUp}>
                          <ProductCard 
                            id={product.id}
                            name={product.name}
                            price={Number(product.price)}
                            imageUrl={product.image_url || '/placeholder.svg'}
                            category={product.category}
                            isNew={product.is_new || false}
                            isSale={product.is_sale || false}
                            salePrice={product.sale_price ? Number(product.sale_price) : undefined}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {/* Pagination */}
                    {renderPagination()}
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <h3 className="text-xl font-medium mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any products matching your criteria.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                      className="border-alma-gold text-alma-gold hover:bg-alma-gold/10"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Shop;
