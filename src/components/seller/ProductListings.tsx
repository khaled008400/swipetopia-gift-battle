import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types/product.types";
import ShopService from "@/services/shop.service";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  inventory_count: number;
  category: string;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
}

const ProductListings = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    image_url: "",
    inventory_count: 0,
    category: "",
    status: "draft" as "active" | "draft" | "unavailable",
  });
  const [editProduct, setEditProduct] = useState({
    id: "",
    name: "",
    price: 0,
    description: "",
    image_url: "",
    inventory_count: 0,
    category: "",
    status: "draft" as "active" | "draft" | "unavailable",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdminProduct[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const productsData = await ShopService.getSellerProducts(user.id);
      setProducts(productsData);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleEditSelectChange = (value: string, name: string) => {
    setEditProduct({
      ...editProduct,
      [name]: value,
    });
  };

  const createProduct = async () => {
    if (!user) return;
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(String(newProduct.price)),
        inventory_count: parseInt(String(newProduct.inventory_count)),
        seller_id: user.id,
      };
      await ShopService.createProduct(productData);
      toast({
        title: "Success",
        description: "Product created successfully.",
      });
      setOpen(false);
      setNewProduct({
        name: "",
        price: 0,
        description: "",
        image_url: "",
        inventory_count: 0,
        category: "",
        status: "draft",
      });
      fetchProducts();
    } catch (err: any) {
      console.error("Error creating product:", err);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async () => {
    try {
      const productData = {
        ...editProduct,
        price: parseFloat(String(editProduct.price)),
        inventory_count: parseInt(String(editProduct.inventory_count)),
      };
      await ShopService.updateProduct(editProduct.id, productData);
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
      setEditOpen(false);
      setEditProduct({
        id: "",
        name: "",
        price: 0,
        description: "",
        image_url: "",
        inventory_count: 0,
        category: "",
        status: "draft",
      });
      fetchProducts();
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ShopService.deleteProduct(productId);
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        });
        fetchProducts();
      } catch (err: any) {
        console.error("Error deleting product:", err);
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await ShopService.searchProducts(searchQuery);
      setSearchResults(results);
      setError(null);
    } catch (err: any) {
      console.error("Error searching products:", err);
      setError(err.message || "Failed to search products");
      toast({
        title: "Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Update mock product data to include all required fields
  const mockProducts = [
    {
      id: "product-1",
      name: "Summer T-shirt",
      price: 29.99,
      description: "Comfortable cotton t-shirt perfect for summer.",
      image_url: "/products/tshirt.jpg",
      inventory_count: 45,
      category: "Clothing",
      status: "active" as const,
      seller_id: "seller-123", // Add required fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: "product-2",
      name: "Denim Jeans",
      price: 59.99,
      description: "Classic denim jeans for all occasions.",
      image_url: "/products/jeans.jpg",
      inventory_count: 30,
      category: "Clothing",
      status: "active" as const,
      seller_id: "seller-123", // Add required fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: true
    },
    {
      id: "product-3",
      name: "Leather Jacket",
      price: 129.99,
      description: "Stylish leather jacket to keep you warm.",
      image_url: "/products/jacket.jpg",
      inventory_count: 15,
      category: "Outerwear",
      status: "draft" as const,
      seller_id: "seller-123", // Add required fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: "product-4",
      name: "Running Shoes",
      price: 79.99,
      description: "Comfortable running shoes for your workouts.",
      image_url: "/products/shoes.jpg",
      inventory_count: 60,
      category: "Footwear",
      status: "active" as const,
      seller_id: "seller-123", // Add required fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: true
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Product Listings</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-app-yellow text-app-black hover:bg-yellow-500">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>Add a new product to your listings.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image_url" className="text-right">
                  Image URL
                </Label>
                <Input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={newProduct.image_url}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inventory_count" className="text-right">
                  Inventory
                </Label>
                <Input
                  type="number"
                  id="inventory_count"
                  name="inventory_count"
                  value={newProduct.inventory_count}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  type="text"
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select onValueChange={(value) => handleSelectChange(value, "status")}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" onClick={createProduct} className="bg-app-yellow text-app-black hover:bg-yellow-500">
                Create Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-app-yellow text-app-black hover:bg-yellow-500"
            size="sm"
          >
            <Search className="h-4 w-4" />
          </Button>
          {searchResults.length > 0 && (
            <Button
              onClick={clearSearch}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white hover:bg-gray-700"
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(searchResults.length > 0 ? searchResults : products).map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.inventory_count}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog open={editOpen && selectedProduct?.id === product.id} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditProduct({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            image_url: product.image_url,
                            inventory_count: product.inventory_count,
                            category: product.category,
                            status: product.status,
                          });
                          setEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>Edit the details of your product.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            value={editProduct.name}
                            onChange={handleEditInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Price
                          </Label>
                          <Input
                            type="number"
                            id="price"
                            name="price"
                            value={editProduct.price}
                            onChange={handleEditInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={editProduct.description}
                            onChange={handleEditInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="image_url" className="text-right">
                            Image URL
                          </Label>
                          <Input
                            type="text"
                            id="image_url"
                            name="image_url"
                            value={editProduct.image_url}
                            onChange={handleEditInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="inventory_count" className="text-right">
                            Inventory
                          </Label>
                          <Input
                            type="number"
                            id="inventory_count"
                            name="inventory_count"
                            value={editProduct.inventory_count}
                            onChange={handleEditInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Category
                          </Label>
                          <Input
                            type="text"
                            id="category"
                            name="category"
                            value={editProduct.category}
                            onChange={handleEditInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">
                            Status
                          </Label>
                          <Select onValueChange={(value) => handleEditSelectChange(value, "status")} defaultValue={editProduct.status}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" onClick={updateProduct} className="bg-app-yellow text-app-black hover:bg-yellow-500">
                          Update Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductListings;
