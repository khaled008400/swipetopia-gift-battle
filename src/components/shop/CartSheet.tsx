
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, X, CreditCard, CheckCircle, Tag, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PricingService, { ShippingMethod } from "@/services/pricing.service";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    shippingCost,
    discountAmount,
    taxAmount,
    additionalFees,
    totalPrice,
    itemCount,
    appliedCoupons,
    appliedOffers,
    selectedShipping,
    addCoupon,
    removeCoupon,
    setShippingMethod,
    isCalculatingPrice
  } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "confirmation">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  // Fetch shipping methods when cart changes
  useEffect(() => {
    const fetchShippingMethods = async () => {
      if (items.length === 0) return;
      
      setIsLoadingShipping(true);
      try {
        const methods = await PricingService.getShippingMethods(subtotal);
        setShippingMethods(methods);
        
        // Auto-select first shipping method if none selected
        if (!selectedShipping && methods.length > 0) {
          setShippingMethod(methods[0]);
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
      } finally {
        setIsLoadingShipping(false);
      }
    };
    
    fetchShippingMethods();
  }, [items, subtotal]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    setIsApplyingCoupon(true);
    const success = await addCoupon(couponCode);
    if (success) {
      setCouponCode("");
    }
    setIsApplyingCoupon(false);
  };

  const handleCheckout = () => {
    setCheckoutStep("payment");
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep("confirmation");
    }, 1500);
  };

  const finishCheckout = () => {
    clearCart();
    setCheckoutStep("cart");
    onOpenChange(false);
    toast.success("Order placed successfully!");
  };

  const renderCartItems = () => (
    <div className="flex-1 overflow-y-auto px-1 py-2">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="bg-app-gray-dark p-5 rounded-full mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-app-yellow">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
          <p className="text-gray-400 text-sm mb-4">Add items to your cart to see them here</p>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 relative">
                <div className="h-20 w-20 min-w-20 bg-app-gray-dark rounded-md overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-app-yellow font-semibold">${item.price.toFixed(2)}</span>
                    {item.original_price && item.original_price > item.price && (
                      <span className="text-gray-400 text-sm line-through">${item.original_price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-1 bg-app-gray-dark rounded-full px-1 py-0.5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-app-gray-light"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-app-gray-light"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-red-100/10 hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Applied Offers and Coupons */}
          {(appliedOffers.length > 0 || appliedCoupons.length > 0) && (
            <div className="mt-6 mb-3">
              <h4 className="text-sm font-medium mb-2">Applied Discounts</h4>
              <div className="space-y-2">
                {appliedOffers.map(offer => (
                  <div key={offer.id} className="flex items-center bg-green-900/20 px-3 py-2 rounded-md">
                    <Tag className="h-4 w-4 text-green-500 mr-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{offer.name}</p>
                      <p className="text-xs text-gray-400">{offer.description}</p>
                    </div>
                  </div>
                ))}
                
                {appliedCoupons.map(coupon => (
                  <div key={coupon.id} className="flex items-center justify-between bg-indigo-900/20 px-3 py-2 rounded-md">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-indigo-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{coupon.code}</p>
                        <p className="text-xs text-gray-400">
                          {coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-full hover:bg-red-100/10 hover:text-red-500"
                      onClick={() => removeCoupon(coupon.code)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Input */}
          <div className="flex items-center gap-2 mt-6">
            <div className="relative flex-1">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-app-gray-dark border-app-gray-light"
              />
            </div>
            <Button 
              onClick={handleApplyCoupon} 
              size="sm"
              disabled={isApplyingCoupon || !couponCode.trim()}
            >
              {isApplyingCoupon ? "Applying..." : "Apply"}
            </Button>
          </div>

          {/* Shipping Options */}
          <div className="mt-5">
            <h4 className="text-sm font-medium mb-2">Shipping Method</h4>
            <div className="relative">
              {isLoadingShipping ? (
                <div className="h-10 bg-app-gray-dark rounded-md flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <Select 
                  value={selectedShipping?.id} 
                  onValueChange={(id) => {
                    const method = shippingMethods.find(m => m.id === id);
                    if (method) setShippingMethod(method);
                  }}
                >
                  <SelectTrigger className="bg-app-gray-dark border-app-gray-light">
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingMethods.map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{method.name}</span>
                          <span className="ml-2">${method.price.toFixed(2)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {selectedShipping && (
              <p className="text-xs text-gray-400 mt-1">
                {selectedShipping.description} ({selectedShipping.estimated_days})
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="flex-1 overflow-y-auto py-2">
      <div className="space-y-5">
        <div className="bg-app-gray-dark rounded-lg p-4">
          <h3 className="font-medium mb-3">Shipping Address</h3>
          <div className="space-y-2">
            <div className="flex items-center h-10 px-3 bg-app-gray-light rounded">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="bg-transparent border-none w-full focus:outline-none text-sm"
              />
            </div>
            <div className="flex items-center h-10 px-3 bg-app-gray-light rounded">
              <input 
                type="text" 
                placeholder="Address" 
                className="bg-transparent border-none w-full focus:outline-none text-sm"
              />
            </div>
            <div className="flex items-center h-10 px-3 bg-app-gray-light rounded">
              <input 
                type="text" 
                placeholder="City, State, ZIP" 
                className="bg-transparent border-none w-full focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-app-gray-dark rounded-lg p-4">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <div className="space-y-2">
            <div className="flex items-center h-10 px-3 bg-app-gray-light rounded">
              <input 
                type="text" 
                placeholder="Card Number" 
                className="bg-transparent border-none w-full focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center h-10 px-3 bg-app-gray-light rounded flex-1">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="bg-transparent border-none w-full focus:outline-none text-sm"
                />
              </div>
              <div className="flex items-center h-10 px-3 bg-app-gray-light rounded flex-1">
                <input 
                  type="text" 
                  placeholder="CVC" 
                  className="bg-transparent border-none w-full focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Order Confirmed!</h2>
      <p className="text-gray-400 mb-6">Your order has been placed successfully</p>
      <div className="bg-app-gray-dark rounded-lg p-4 w-full mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Order Number:</span>
          <span className="font-medium">#ORD-{Math.floor(Math.random() * 10000)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Items:</span>
          <span className="font-medium">{itemCount}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Total:</span>
          <span className="font-medium text-app-yellow">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => {
    if (items.length === 0 && checkoutStep === "cart") {
      return null;
    }

    if (checkoutStep === "cart") {
      return (
        <>
          <div className="space-y-3 mb-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {(shippingCost > 0 || selectedShipping) && (
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            {additionalFees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Additional Fees</span>
                <span>${additionalFees.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <div className="flex flex-col items-end">
                <span className="text-app-yellow">${totalPrice.toFixed(2)}</span>
                {isCalculatingPrice && (
                  <span className="text-xs text-gray-400 animate-pulse">Calculating...</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-app-gray-light text-white" onClick={() => clearCart()}>
              Clear
            </Button>
            <Button 
              className="flex-1 bg-app-yellow text-app-black hover:bg-app-yellow/90" 
              onClick={handleCheckout}
              disabled={items.length === 0 || !selectedShipping || isCalculatingPrice}
            >
              {isCalculatingPrice ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-app-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
        </>
      );
    }

    if (checkoutStep === "payment") {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-app-gray-light text-white"
            onClick={() => setCheckoutStep("cart")}
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button 
            className="flex-1 bg-app-yellow text-app-black hover:bg-app-yellow/90"
            onClick={simulatePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-app-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" /> 
                Pay ${totalPrice.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      );
    }

    if (checkoutStep === "confirmation") {
      return (
        <Button 
          className="w-full bg-app-yellow text-app-black hover:bg-app-yellow/90"
          onClick={finishCheckout}
        >
          Continue Shopping
        </Button>
      );
    }
  };

  const getTitleByStep = () => {
    switch (checkoutStep) {
      case "cart": return `Your Cart (${itemCount})`;
      case "payment": return "Checkout";
      case "confirmation": return "Order Confirmation";
      default: return "Your Cart";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-app-black border-app-gray-dark text-white p-0">
        <SheetHeader className="px-4 py-3 border-b border-app-gray-dark">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white flex items-center">
              {checkoutStep === "cart" && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-app-yellow mr-2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              )}
              {getTitleByStep()}
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col">
          {checkoutStep === "cart" && renderCartItems()}
          {checkoutStep === "payment" && renderPaymentStep()}
          {checkoutStep === "confirmation" && renderConfirmation()}
        </div>
        
        <div className="border-t border-app-gray-dark p-4">
          {renderFooter()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
