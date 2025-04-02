
import React, { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search, Plus, Edit, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCedis } from "@/lib/formatters";
import { Product } from "@/types/database";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "skin_care",
    price: 0,
    sale_price: 0,
    is_sale: false,
    is_featured: false,
    is_new: true,
    stock_count: 0
  });

  useEffect(() => {
    fetchProducts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Products change received:', payload);
          fetchProducts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Failed to load products",
        description: "There was an error loading the product list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
        
      setImageUrl(data.publicUrl);
      toast({
        title: "Image uploaded",
        description: "Your image has been successfully uploaded",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewProduct((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      category: "skin_care",
      price: 0,
      sale_price: 0,
      is_sale: false,
      is_featured: false,
      is_new: true,
      stock_count: 0
    });
    setImageUrl(null);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...newProduct,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Product added",
        description: "The product has been successfully added",
      });
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Failed to add product",
        description: "There was an error adding the product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...selectedProduct,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Product updated",
        description: "The product has been successfully updated",
      });
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Failed to update product",
        description: "There was an error updating the product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Failed to delete product",
        description: "There was an error deleting the product",
        variant: "destructive",
      });
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                         (product.description || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Product Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your inventory and product listings
                </CardDescription>
              </div>
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
                      Fill out the form below to add a new product to your inventory.
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
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={newProduct.description || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category*</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="skin_care">Skin Care</SelectItem>
                            <SelectItem value="hair_care">Hair Care</SelectItem>
                            <SelectItem value="spa">Spa</SelectItem>
                            <SelectItem value="tools">Tools</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                            <SelectItem value="makeup">Makeup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stock_count">Stock Count*</Label>
                        <Input
                          id="stock_count"
                          name="stock_count"
                          type="number"
                          min={0}
                          value={newProduct.stock_count}
                          onChange={handleNumberInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Regular Price (₵)*</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min={0}
                          step={0.01}
                          value={newProduct.price}
                          onChange={handleNumberInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sale_price">Sale Price (₵)</Label>
                        <Input
                          id="sale_price"
                          name="sale_price"
                          type="number"
                          min={0}
                          step={0.01}
                          value={newProduct.sale_price || ""}
                          onChange={handleNumberInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Product Image</Label>
                      <Input type="file" onChange={handleFileUpload} accept="image/*" />
                      {uploading && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      )}
                      {imageUrl && (
                        <div className="mt-2">
                          <img
                            src={imageUrl}
                            alt="Product preview"
                            className="max-h-40 rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="is_sale"
                          checked={newProduct.is_sale}
                          onCheckedChange={(checked) => handleCheckboxChange("is_sale", !!checked)}
                        />
                        <Label htmlFor="is_sale">On Sale</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="is_featured"
                          checked={newProduct.is_featured}
                          onCheckedChange={(checked) => handleCheckboxChange("is_featured", !!checked)}
                        />
                        <Label htmlFor="is_featured">Featured</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="is_new"
                          checked={newProduct.is_new}
                          onCheckedChange={(checked) => handleCheckboxChange("is_new", !!checked)}
                        />
                        <Label htmlFor="is_new">New Arrival</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setIsAddModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct}>Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="skin_care">Skin Care</SelectItem>
                  <SelectItem value="hair_care">Hair Care</SelectItem>
                  <SelectItem value="spa">Spa</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Stock</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Loading products...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                                No img
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="hidden md:block text-sm text-muted-foreground truncate max-w-[200px]">
                                {product.description?.substring(0, 50) || "No description"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize">
                          {product.category.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          {product.is_sale && product.sale_price ? (
                            <div>
                              <div className="font-medium">
                                {formatCedis(product.sale_price)}
                              </div>
                              <div className="text-sm line-through text-muted-foreground">
                                {formatCedis(product.price)}
                              </div>
                            </div>
                          ) : (
                            formatCedis(product.price)
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.stock_count <= 0 ? (
                            <span className="text-red-500">Out of stock</span>
                          ) : product.stock_count < 5 ? (
                            <span className="text-yellow-500">Low stock ({product.stock_count})</span>
                          ) : (
                            product.stock_count
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {product.is_featured && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                Featured
                              </span>
                            )}
                            {product.is_new && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                New
                              </span>
                            )}
                            {product.is_sale && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                Sale
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash className="h-4 w-4" />
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
      </div>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={selectedProduct.description || ""}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={selectedProduct.category}
                    onValueChange={(value) => setSelectedProduct({ ...selectedProduct, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skin_care">Skin Care</SelectItem>
                      <SelectItem value="hair_care">Hair Care</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="makeup">Makeup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock Count</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    min={0}
                    value={selectedProduct.stock_count}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, stock_count: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Regular Price (₵)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min={0}
                    step={0.01}
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-sale-price">Sale Price (₵)</Label>
                  <Input
                    id="edit-sale-price"
                    type="number"
                    min={0}
                    step={0.01}
                    value={selectedProduct.sale_price || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, sale_price: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-is-sale"
                    checked={selectedProduct.is_sale}
                    onCheckedChange={(checked) => setSelectedProduct({ ...selectedProduct, is_sale: !!checked })}
                  />
                  <Label htmlFor="edit-is-sale">On Sale</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-is-featured"
                    checked={selectedProduct.is_featured}
                    onCheckedChange={(checked) => setSelectedProduct({ ...selectedProduct, is_featured: !!checked })}
                  />
                  <Label htmlFor="edit-is-featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-is-new"
                    checked={selectedProduct.is_new}
                    onCheckedChange={(checked) => setSelectedProduct({ ...selectedProduct, is_new: !!checked })}
                  />
                  <Label htmlFor="edit-is-new">New Arrival</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Products;
