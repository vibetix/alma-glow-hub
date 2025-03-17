
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Search, Plus, X, Upload, Edit, Trash2, AlertCircle, Archive, ShoppingBag, ArrowUpDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

// New inventory activity log data
const INVENTORY_ACTIVITIES = [
  {
    id: 1,
    productId: 1,
    productName: "Revitalizing Face Serum",
    type: "restock",
    quantity: 10,
    date: new Date(2023, 6, 10),
    user: "Admin User"
  },
  {
    id: 2,
    productId: 2,
    productName: "Nourishing Hair Mask",
    type: "sale",
    quantity: -2,
    date: new Date(2023, 6, 12),
    user: "System"
  },
  {
    id: 3,
    productId: 3,
    productName: "Essential Oil Set",
    type: "restock",
    quantity: 5,
    date: new Date(2023, 6, 14),
    user: "Admin User"
  },
  {
    id: 4,
    productId: 1,
    productName: "Revitalizing Face Serum",
    type: "adjustment",
    quantity: -1,
    date: new Date(2023, 6, 15),
    user: "Admin User"
  },
  {
    id: 5,
    productId: 4,
    productName: "Relaxing Bath Salts",
    type: "sale",
    quantity: -3,
    date: new Date(2023, 6, 18),
    user: "System"
  }
];

// Low stock threshold
const LOW_STOCK_THRESHOLD = 20;

const Products = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [inventoryActivities] = useState(INVENTORY_ACTIVITIES);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restockProduct, setRestockProduct] = useState<any>(null);

  // For new/edit product
  const [productForm, setProductForm] = useState({
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

  // Get low stock products
  const lowStockProducts = products.filter(
    (product) => product.stock <= LOW_STOCK_THRESHOLD
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    });
    setProductImages([]);
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.stock) {
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
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      stock: parseInt(productForm.stock),
      images: productImages,
    };

    setProducts([...products, newProductData]);
    setIsAddModalOpen(false);
    
    // Reset form
    resetForm();
    
    toast({
      title: "Product added",
      description: "The product has been added successfully.",
    });
  };

  const handleEditProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.stock) {
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

    if (!selectedProduct) return;

    // Update the product in the state
    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          category: productForm.category,
          stock: parseInt(productForm.stock),
          images: productImages,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setIsEditModalOpen(false);
    
    // Reset form
    resetForm();
    
    toast({
      title: "Product updated",
      description: "The product has been updated successfully.",
    });
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
    });
    setProductImages([...product.images]);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    setProductToDelete(null);
    setIsConfirmDeleteOpen(false);
    
    toast({
      title: "Product deleted",
      description: "The product has been removed.",
    });
  };

  const confirmDelete = (id: number) => {
    setProductToDelete(id);
    setIsConfirmDeleteOpen(true);
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

  // Handle restocking products
  const openRestockModal = (product: any) => {
    setRestockProduct(product);
    setRestockQuantity("");
    setIsRestockModalOpen(true);
  };

  const handleRestock = () => {
    if (!restockProduct || !restockQuantity || parseInt(restockQuantity) <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity greater than zero.",
        variant: "destructive",
      });
      return;
    }

    // Update the product stock in state
    const updatedProducts = products.map(product => {
      if (product.id === restockProduct.id) {
        return {
          ...product,
          stock: product.stock + parseInt(restockQuantity)
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setIsRestockModalOpen(false);
    
    toast({
      title: "Inventory updated",
      description: `Added ${restockQuantity} units to ${restockProduct.name}.`,
    });
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
                          value={productForm.name}
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
                          value={productForm.description}
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
                            value={productForm.price}
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
                            value={productForm.stock}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category*</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value) =>
                            setProductForm((prev) => ({
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
                        resetForm();
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
                            <div className={`flex items-center ${
                              product.stock <= LOW_STOCK_THRESHOLD ? "text-amber-500" : ""
                            }`}>
                              {product.stock}
                              {product.stock <= LOW_STOCK_THRESHOLD && (
                                <AlertCircle size={16} className="ml-2" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openEditModal(product)}
                              >
                                <Edit size={16} className="mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => confirmDelete(product.id)}
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
        
        <TabsContent value="inventory" className="space-y-6">
          {/* Low stock alert card */}
          <Card className={`${lowStockProducts.length > 0 ? "border-amber-300" : ""}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>
                Products that need to be restocked soon (below {LOW_STOCK_THRESHOLD} units).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-muted-foreground">
                  No products are running low on stock.
                </p>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{product.category}</TableCell>
                          <TableCell className="text-amber-500 font-medium">{product.stock}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => openRestockModal(product)}
                            >
                              Restock
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory summary card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {new Set(products.map(p => p.category)).size} categories
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.reduce((total, product) => total + product.stock, 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total units across all products
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">
                  {lowStockProducts.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Products with less than {LOW_STOCK_THRESHOLD} units
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Inventory management card */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Monitor and update your product inventory levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className={product.stock <= LOW_STOCK_THRESHOLD ? "text-amber-500 font-medium" : ""}>
                          {product.stock}
                        </TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRestockModal(product)}
                            className="mr-2"
                          >
                            Restock
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(product)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Inventory activity card */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Activity Log</CardTitle>
              <CardDescription>
                Recent inventory changes and activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Updated By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{format(activity.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>{activity.productName}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            activity.type === "restock" 
                              ? "bg-green-100 text-green-800" 
                              : activity.type === "sale"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {activity.type === "restock" && <ArrowUpDown className="mr-1 h-3 w-3" />}
                            {activity.type === "sale" && <ShoppingBag className="mr-1 h-3 w-3" />}
                            {activity.type === "adjustment" && <Archive className="mr-1 h-3 w-3" />}
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className={`font-medium ${
                          activity.quantity > 0 
                            ? "text-green-600" 
                            : "text-red-600"
                        }`}>
                          {activity.quantity > 0 ? `+${activity.quantity}` : activity.quantity}
                        </TableCell>
                        <TableCell>{activity.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information and inventory details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name*</Label>
              <Input
                id="edit-name"
                name="name"
                value={productForm.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                rows={4}
                value={productForm.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price ($)*</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock Quantity*</Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category*</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) =>
                  setProductForm((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
                required
              >
                <SelectTrigger id="edit-category">
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
              setIsEditModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Modal */}
      <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
            <DialogDescription>
              {restockProduct && `Add inventory to ${restockProduct.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="restock-quantity">Quantity to Add</Label>
              <Input
                id="restock-quantity"
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            {restockProduct && (
              <div className="text-sm">
                <p>Current stock: <span className="font-medium">{restockProduct.stock}</span></p>
                <p className="mt-1">New stock will be: <span className="font-medium">{restockProduct.stock + (parseInt(restockQuantity) || 0)}</span></p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestock}>Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Products;
