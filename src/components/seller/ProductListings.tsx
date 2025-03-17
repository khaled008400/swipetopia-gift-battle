
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Product, AdminProduct } from "@/types/product.types";
import { supabase } from "@/lib/supabase";

const ProductListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<AdminProduct>({
    id: '',
    name: '',
    price: 0,
    description: '',
    image_url: '',
    stock_quantity: 0,
    category: 'other',
    status: 'active',
    seller_id: '',
    created_at: '',
    updated_at: '',
    is_featured: false
  });

  useEffect(() => {
    if (user?.id) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
    
      if (data) {
        // Ensure all required properties for Product type are present
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description || '',
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
          category: product.category,
          status: product.status || 'active',
          seller_id: product.seller_id,
          created_at: product.created_at,
          updated_at: product.updated_at,
          is_featured: product.is_featured || false
        }));
      
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load your products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    
    setEditingProduct(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setEditingProduct(prev => ({
      ...prev,
      category: value,
    }));
  };
  
  const handleStatusChange = (value: string) => {
    setEditingProduct(prev => ({
      ...prev,
      status: value as "active" | "draft" | "unavailable",
    }));
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      category: product.category,
      status: product.status,
      seller_id: product.seller_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
      is_featured: product.is_featured
    });
    setFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
      });
      
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setSubmitting(true);
    
      const productData = {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price.toString()),
        description: editingProduct.description,
        image_url: editingProduct.image_url,
        stock_quantity: parseInt(editingProduct.stock_quantity.toString()),
        category: editingProduct.category,
        status: editingProduct.status,
        seller_id: user?.id,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    
      if (isEditing && editingProduct.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
      
        toast({
          title: "Product Updated",
          description: `${editingProduct.name} has been updated.`,
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
      
        toast({
          title: "Product Added",
          description: `${editingProduct.name} has been added to your store.`,
        });
      }
    
      setFormOpen(false);
      setEditingProduct({
        id: '',
        name: '',
        price: 0,
        description: '',
        image_url: '',
        stock_quantity: 0,
        category: 'other',
        status: 'active',
        seller_id: '',
        created_at: '',
        updated_at: '',
        is_featured: false
      });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Listings</h2>
        <Button onClick={() => {
            setIsEditing(false);
            setFormOpen(true);
          }} className="bg-app-yellow text-app-black">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
      
      <Card className="bg-app-gray-dark">
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-app-yellow" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground">No products listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-muted rounded-md p-3">
                  <div className="aspect-w-4 aspect-h-3 mb-2">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-cover rounded-md w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={handleNumberInputChange}
                    placeholder="Price"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Inventory</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    value={editingProduct.stock_quantity}
                    onChange={handleNumberInputChange}
                    placeholder="Inventory"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="text"
                    value={editingProduct.image_url}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={handleCategoryChange} defaultValue={editingProduct.category}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="homegoods">Home Goods</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={handleStatusChange} defaultValue={editingProduct.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-app-yellow text-app-black" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditing ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductListings;
