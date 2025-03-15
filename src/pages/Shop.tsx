
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
import { sampleProducts } from '@/data/products';

const categories = ["All", "Skin Care", "Hair Care", "Bath & Body", "Tools"];

const Shop = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("recommended");
  const [isFiltered, setIsFiltered] = useState(false);
  
  useEffect(() => {
    let filteredProducts = [...sampleProducts];
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filteredProducts = filteredProducts.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(product => {
      const price = product.isSale && product.salePrice 
        ? product.salePrice 
        : product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sort products
    if (sortBy === "price-asc") {
      filteredProducts.sort((a, b) => {
        const priceA = a.isSale && a.salePrice ? a.salePrice : a.price;
        const priceB = b.isSale && b.salePrice ? b.salePrice : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price-desc") {
      filteredProducts.sort((a, b) => {
        const priceA = a.isSale && a.salePrice ? a.salePrice : a.price;
        const priceB = b.isSale && b.salePrice ? b.salePrice : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "new") {
      filteredProducts.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
    }
    
    setProducts(filteredProducts);
    
    // Check if any filters are applied
    setIsFiltered(
      searchTerm !== "" || 
      selectedCategory !== "All" || 
      priceRange[0] > 0 || 
      priceRange[1] < 100 ||
      sortBy !== "recommended"
    );
  }, [searchTerm, selectedCategory, priceRange, sortBy]);
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceRange([0, 100]);
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
                    defaultValue={[0, 100]} 
                    max={100} 
                    step={1} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-6 mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
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
                              defaultValue={[0, 100]} 
                              max={100} 
                              step={1} 
                              value={priceRange}
                              onValueChange={setPriceRange}
                              className="mt-6 mb-4"
                            />
                            <div className="flex justify-between text-sm">
                              <span>${priceRange[0]}</span>
                              <span>${priceRange[1]}</span>
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
                  
                  {(priceRange[0] > 0 || priceRange[1] < 100) && (
                    <span className="text-xs bg-alma-lightgray px-3 py-1 rounded-full flex items-center">
                      Price: ${priceRange[0]} - ${priceRange[1]}
                      <button 
                        onClick={() => setPriceRange([0, 100])} 
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
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggeredAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  {products.map((product) => (
                    <motion.div key={product.id} variants={fadeInUp}>
                      <ProductCard {...product} />
                    </motion.div>
                  ))}
                </motion.div>
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
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Shop;
