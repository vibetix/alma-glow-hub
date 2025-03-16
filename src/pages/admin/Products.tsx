
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, X, Upload, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Revitalizing Face Serum",
    description: "A lightweight serum that hydrates and revitalizes the skin.",
    price: 49.99,
    category: "skin care",
    stock: 25,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ]
  },
  {
    id: 2,
    name: "Nourishing Hair Mask",
    description: "Deep conditioning treatment for damaged hair.",
    price: 34.99,
    category: "hair",
    stock: 42,
    images: [
      "/placeholder.svg",
    ]
  },
  {
    id: 3,
    name: "Essential Oil Set",
    description: "Collection of 6 essential oils for aromatherapy and massage.",
    price: 79.99,
    category: "spa",
    stock: 18,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ]
  },
  {
    id: 4,
    name: "Relaxing Bath Salts",
    description: "Mineral-rich bath salts for a relaxing soak.",
    price: 24.99,
    category: "spa",
    stock: 37,
    images: [
      "/placeholder.svg",
    ]
  },
  {
    id: 5,
    name: "Anti-Aging Moisturizer",
    description: "Rich moisturizer that reduces fine lines and wrinkles.",
    price: 59.99,
    category: "skin care",
    stock: 31,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ]
  },
];

const Products = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  // For image upload
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (productImages.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one product image.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would save the product to the database
    const newProductData = {
      id: products.length + 1,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      images: productImages,
    };

    setProducts([...products, newProductData]);
    setIsAddModalOpen(false);
    
    // Reset form
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    });
    setProductImages([]);
    
    toast({
      title: "Product added",
      description: "The product has been added successfully.",
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been removed.",
    });
  };

  // Simulate image upload
  const handleImageUpload = () => {
    setIsUploading(true);
    
    // In a real app, this would be an actual file upload
    setTimeout(() => {
      setProductImages([...productImages, "/placeholder.svg"]);
      setIsUploading(false);
      
      toast({
        title: "Image uploaded",
        description: "The image has been added to the product.",
      });
    }, 1000);
  };
  
  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout title="Product Management">
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex gap-1">
                      <Plus size={18} />
                      <span className="hidden md:inline">Add Product</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Create a new product listing to sell on your shop.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Product Name*</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newProduct.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={newProduct.description}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price ($)*</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="stock">Stock Quantity*</Label>
                          <Input
                            id="stock"
                            name="stock"
                            type="number"
                            min="0"
                            value={newProduct.stock}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category*</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) =>
                            setNewProduct((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="skin care">Skin Care</SelectItem>
                            <SelectItem value="hair">Hair</SelectItem>
                            <SelectItem value="spa">Spa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Images*</Label>
                        <div className="border rounded-md p-3">
                          <div className="flex flex-wrap gap-3 mb-3">
                            {productImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={image} 
                                  alt="Product" 
                                  className="w-20 h-20 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full flex items-center justify-center gap-2"
                            onClick={handleImageUpload}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              "Uploading..."
                            ) : (
                              <>
                                <Upload size={16} />
                                Upload Image
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Upload multiple images of your product. First image will be used as the main thumbnail.
                          </p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsAddModalOpen(false);
                        setProductImages([]);
                        setNewProduct({
                          name: "",
                          description: "",
                          price: "",
                          category: "",
                          stock: "",
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct}>Add Product</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Manage your product listings and inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="skin care">Skin Care</SelectItem>
                      <SelectItem value="hair">Hair</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden md:table-cell">Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground hidden md:block line-clamp-1">
                                {product.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell capitalize">
                            {product.category}
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.stock}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <Edit size={16} className="mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 size={16} className="mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Monitor and update your product inventory levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Inventory management features will be implemented here. This will include stock
                level tracking, low stock alerts, and inventory history.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Products;
