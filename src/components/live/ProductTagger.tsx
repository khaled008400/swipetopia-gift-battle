import React, { useState, useEffect } from 'react';
import { Tag, Search, Plus, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LiveStreamService from '@/services/live-stream.service';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category?: string;
}

interface ProductTaggerProps {
  streamId: string;
  onProductTagged?: () => void;
}

const ProductTagger = ({ streamId, onProductTagged }: ProductTaggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [featured, setFeatured] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch seller's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch products where user is the seller
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', user.id)
          .eq('status', 'active');

        if (error) throw error;
        
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your products',
          variant: 'destructive'
        });
      }
    };

    fetchProducts();
  }, [toast]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleAddProduct = async () => {
    if (!selectedProductId) {
      toast({
        title: 'No product selected',
        description: 'Please select a product to add to your stream',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Only apply discount if it's greater than 0
      const discountToApply = discountPercentage > 0 ? discountPercentage : undefined;
      
      await LiveStreamService.tagProduct(
        selectedProductId, 
        streamId, 
        featured,
        discountToApply
      );
      
      toast({
        title: 'Product added',
        description: 'Product has been added to your stream'
      });
      
      // Reset form
      setSelectedProductId(null);
      setFeatured(false);
      setDiscountPercentage(0);
      setIsOpen(false);
      
      // Notify parent component
      if (onProductTagged) {
        onProductTagged();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product to stream',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center"
        >
          <Tag className="h-4 w-4 mr-2" />
          Tag Product
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Product to Stream</DialogTitle>
          <DialogDescription>
            Tag products to sell during your live stream
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="h-48 overflow-y-auto border rounded-md p-1">
            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                No products found
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      selectedProductId === product.id ? 'bg-gray-100 border border-gray-300' : ''
                    }`}
                    onClick={() => setSelectedProductId(product.id)}
                  >
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded-md mr-3" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-app-yellow text-xs font-bold">${product.price.toFixed(2)}</p>
                    </div>
                    
                    {selectedProductId === product.id && (
                      <Plus className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Feature this product</Label>
              <Switch 
                id="featured" 
                checked={featured} 
                onCheckedChange={setFeatured} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Discount percentage: {discountPercentage}%</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2" 
                  onClick={() => setDiscountPercentage(0)}
                  disabled={discountPercentage === 0}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              <Slider
                value={[discountPercentage]}
                max={70}
                step={5}
                onValueChange={(value) => setDiscountPercentage(value[0])}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleAddProduct}
              disabled={!selectedProductId || loading}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductTagger;
