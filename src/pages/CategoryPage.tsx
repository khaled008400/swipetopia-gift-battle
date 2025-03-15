
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopService } from '@/services/shop.service';
import { Product } from '@/types/product.types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { ArrowDownAZ, Filter, Home, Search } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { 
  Sheet, SheetContent, SheetDescription, SheetHeader, 
  SheetTitle, SheetTrigger 
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/loader';
import { Slider } from '@/components/ui/slider';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [availableFilters, setAvailableFilters] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await ShopService.getCategoryProducts(category || '');
        // @ts-ignore - we'll handle the type conversion in the component
        setProducts(data);
        setLoading(false);
        
        // Extract available filters from products
        const filters = Array.from(
          new Set(data.map((product: any) => product.category))
        );
        setAvailableFilters(filters as string[]);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((f) => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Implement sorting logic
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const filteredProducts = products
    .filter((product) => {
      // Filter by search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by selected filters
      if (selectedFilters.length > 0 && !selectedFilters.includes(product.category)) {
        return false;
      }
      
      // Filter by price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort products
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          // Default sort by popularity
          return 0;
      }
    });

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-1" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/shop')}>Shop</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>{category}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold capitalize mb-2">{category}</h1>
          <p className="text-gray-500">
            Browse our selection of {category} products
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Sheet open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Narrow down products by applying filters
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider 
                      defaultValue={[priceRange[0], priceRange[1]]}
                      max={1000}
                      step={10}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {availableFilters.map((filter) => (
                      <div key={filter} className="flex items-center space-x-2">
                        <Checkbox 
                          id={filter}
                          checked={selectedFilters.includes(filter)}
                          onCheckedChange={() => handleFilterChange(filter)}
                        />
                        <Label htmlFor={filter} className="capitalize">
                          {filter}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedFilters([]);
                      setPriceRange([0, 1000]);
                    }}
                  >
                    Reset
                  </Button>
                  <Button onClick={() => setFilterMenuOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue>
                {sortBy === 'popularity' && 'Most Popular'}
                {sortBy === 'price-low' && 'Price: Low to High'}
                {sortBy === 'price-high' && 'Price: High to Low'}
                {sortBy === 'newest' && 'Newest First'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">
                <div className="flex items-center">
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Most Popular
                </div>
              </SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search criteria
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => {
              setSearchQuery('');
              setSelectedFilters([]);
              setPriceRange([0, 1000]);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
