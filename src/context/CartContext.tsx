
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import PricingService, { Coupon, Offer, ShippingMethod, PriceCalculationResult } from "../services/pricing.service";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  original_price?: number; // For showing discounted prices
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  appliedCoupons: Coupon[];
  appliedOffers: Offer[];
  selectedShipping: ShippingMethod | null;
  shippingCost: number;
  discountAmount: number;
  taxAmount: number;
  additionalFees: number;
  totalPrice: number;
  addCoupon: (code: string) => Promise<boolean>;
  removeCoupon: (code: string) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  isCalculatingPrice: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
  const [appliedOffers, setAppliedOffers] = useState<Offer[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);
  const [priceDetails, setPriceDetails] = useState<{
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    taxAmount: number;
    additionalFees: number;
    totalPrice: number;
  }>({
    subtotal: 0,
    shippingCost: 0,
    discountAmount: 0,
    taxAmount: 0,
    additionalFees: 0,
    totalPrice: 0
  });
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart data", error);
      }
    }
    
    const savedCoupons = localStorage.getItem("appliedCoupons");
    if (savedCoupons) {
      try {
        setAppliedCoupons(JSON.parse(savedCoupons));
      } catch (error) {
        console.error("Error parsing coupons data", error);
      }
    }
    
    const savedShipping = localStorage.getItem("selectedShipping");
    if (savedShipping) {
      try {
        setSelectedShipping(JSON.parse(savedShipping));
      } catch (error) {
        console.error("Error parsing shipping data", error);
      }
    }
  }, []);
  
  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
    localStorage.setItem("appliedCoupons", JSON.stringify(appliedCoupons));
    if (selectedShipping) {
      localStorage.setItem("selectedShipping", JSON.stringify(selectedShipping));
    }
  }, [items, appliedCoupons, selectedShipping]);
  
  // Calculate pricing whenever cart items, coupons or shipping changes
  useEffect(() => {
    const calculatePricing = async () => {
      if (items.length === 0) {
        setPriceDetails({
          subtotal: 0,
          shippingCost: 0,
          discountAmount: 0,
          taxAmount: 0,
          additionalFees: 0,
          totalPrice: 0
        });
        setAppliedOffers([]);
        return;
      }
      
      setIsCalculatingPrice(true);
      try {
        const cartItems = items.map(item => ({ id: item.id, quantity: item.quantity }));
        const couponCodes = appliedCoupons.map(coupon => coupon.code);
        const shippingId = selectedShipping?.id;
        
        const result = await PricingService.calculatePrice(
          cartItems,
          couponCodes,
          shippingId
        );
        
        setPriceDetails({
          subtotal: result.subtotal,
          shippingCost: result.shipping_cost,
          discountAmount: result.discount_amount,
          taxAmount: result.tax_amount,
          additionalFees: result.additional_fees,
          totalPrice: result.total
        });
        
        setAppliedOffers(result.applied_offers);
      } catch (error) {
        console.error("Error calculating price:", error);
        // Fallback to simple calculation if API fails
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
        setPriceDetails({
          subtotal,
          shippingCost: selectedShipping?.price || 0,
          discountAmount: 0,
          taxAmount: 0,
          additionalFees: 0,
          totalPrice: subtotal + (selectedShipping?.price || 0)
        });
      } finally {
        setIsCalculatingPrice(false);
      }
    };
    
    calculatePricing();
  }, [items, appliedCoupons, selectedShipping]);
  
  const addItem = (product: Omit<CartItem, "quantity">) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        toast.success(`Added another ${product.name} to your cart`);
        return updatedItems;
      } else {
        // Add new item with quantity 1
        toast.success(`${product.name} added to your cart`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  
  const removeItem = (id: string) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.id === id);
      if (item) {
        toast.info(`${item.name} removed from your cart`);
      }
      return prevItems.filter(item => item.id !== id);
    });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    setAppliedCoupons([]);
    setSelectedShipping(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("appliedCoupons");
    localStorage.removeItem("selectedShipping");
    toast.info("Cart cleared");
  };
  
  const addCoupon = async (code: string): Promise<boolean> => {
    // Check if coupon is already applied
    if (appliedCoupons.some(coupon => coupon.code === code)) {
      toast.error("This coupon is already applied");
      return false;
    }
    
    try {
      const coupon = await PricingService.validateCoupon(code);
      if (coupon) {
        setAppliedCoupons([...appliedCoupons, coupon]);
        toast.success(`Coupon "${code}" applied successfully`);
        return true;
      } else {
        toast.error("Invalid or expired coupon");
        return false;
      }
    } catch (error) {
      toast.error("Error applying coupon");
      return false;
    }
  };
  
  const removeCoupon = (code: string) => {
    setAppliedCoupons(appliedCoupons.filter(coupon => coupon.code !== code));
    toast.info(`Coupon "${code}" removed`);
  };
  
  const setShippingMethod = (method: ShippingMethod) => {
    setSelectedShipping(method);
    toast.success(`Shipping method updated to ${method.name}`);
  };
  
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        itemCount,
        subtotal: priceDetails.subtotal,
        appliedCoupons,
        appliedOffers,
        selectedShipping,
        shippingCost: priceDetails.shippingCost,
        discountAmount: priceDetails.discountAmount,
        taxAmount: priceDetails.taxAmount,
        additionalFees: priceDetails.additionalFees,
        totalPrice: priceDetails.totalPrice,
        addCoupon,
        removeCoupon,
        setShippingMethod,
        isCalculatingPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
