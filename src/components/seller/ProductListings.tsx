
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Edit, Trash2, Eye, ShoppingBag, Search, 
  Filter, SortDesc, ChevronLeft, ChevronRight, Loader2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import { Product } from "@/services/shop.service";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ProductForm from "../admin/ProductForm";
import { ProductFormData } from "../admin/ProductForm";

const ProductListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          setProducts(data as Product[]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error loading products",
          description: "Could not load your products. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [user]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNewProduct = () => {
    setEditProduct(null);
    setShowDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setShowDialog(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error deleting product",
        description: "Could not delete the product. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (editProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: data.name,
            price: data.price,
            description: data.description,
            image_url: data.image,
            stock_quantity: data.inventory,
            category: data.category,
            status: data.status
          })
          .eq('id', editProduct.id);
          
        if (error) throw error;
        
        setProducts(products.map(p => 
          p.id === editProduct.id 
            ? {
                ...p,
                name: data.name,
                price: data.price,
                description: data.description || "",
                image_url: data.image,
                stock_quantity: data.inventory,
                category: data.category,
                status: data.status
              } 
            : p
        ));
        
        toast({
          title: "Product updated",
          description: "Product has been successfully updated."
        });
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            name: data.name,
            price: data.price,
            description: data.description,
            image_url: data.image,
            stock_quantity: data.inventory,
            category: data.category,
            seller_id: user?.id,
            status: data.status
          })
          .select()
          .single();
          
        if (error) throw error;
        
        if (newProduct) {
          setProducts([...products, newProduct as Product]);
        }
        
        toast({
          title: "Product created",
          description: "Product has been successfully created."
        });
      }
      
      setShowDialog(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error saving product",
        description: "Could not save the product. Please try again later.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 w-2/3">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SortDesc className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleNewProduct} className="bg-app-yellow text-app-black">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {currentProducts.length === 0 ? (
        <Card className="bg-app-gray-dark">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "No products match your search" : "You haven't added any products yet"}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewProduct} className="bg-app-yellow text-app-black">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProducts.map((product) => (
              <Card key={product.id} className="bg-app-gray-dark overflow-hidden">
                <div className="aspect-square relative">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      product.status === 'active' ? 'bg-green-500' : 
                      product.status === 'draft' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  >
                    {product.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <span className="text-app-yellow font-bold">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>Inventory: {product.stock_quantity}</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          
          <ProductForm
            initialData={editProduct ? {
              name: editProduct.name,
              price: editProduct.price,
              description: editProduct.description || "",
              image: editProduct.image_url || "",
              inventory: editProduct.stock_quantity || 0,
              category: editProduct.category || "other",
              status: editProduct.status || "active",
            } : undefined}
            onSubmit={handleSubmit}
            mode={editProduct ? 'edit' : 'create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductListings;
