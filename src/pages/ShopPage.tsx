import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/ProductCard";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import shopService from '@/services/shop.service';

const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shopItems, setShopItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [priceRange, setPriceRange] = useState([0, 100]);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const filterByPrice = (items) => {
    return items.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);
  };

  const filterItems = (term) => {
    if (!term) {
      return shopItems;
    }
    const lowerTerm = term.toLowerCase();
    return shopItems.filter(item =>
      item.name.toLowerCase().includes(lowerTerm)
    );
  };

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        // Use proper method from shop service
        const shopData = await shopService.getProducts(); // Changed from getShopProfile
        setShopItems(shopData);
        setFilteredItems(shopData);
        setFavorites(new Set());
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, []);

  useEffect(() => {
    const termFiltered = filterItems(searchTerm);
    const priceFiltered = filterByPrice(termFiltered);
    setFilteredItems(priceFiltered);
  }, [searchTerm, priceRange, shopItems]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Shop</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <Input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Filter by Price
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <DropdownMenuLabel>Price Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex items-center space-x-2">
                <Label htmlFor="min">Min</Label>
                <Input
                  type="number"
                  id="min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-20"
                />
                <Label htmlFor="max">Max</Label>
                <Input
                  type="number"
                  id="max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-20"
                />
              </div>
              <Slider
                defaultValue={priceRange}
                max={1000}
                step={10}
                onValueChange={(value) => setPriceRange(value)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url}
                rating={4.5}
                isLiked={favorites.has(product.id)}
                onToggleLike={() => toggleFavorite(product.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
