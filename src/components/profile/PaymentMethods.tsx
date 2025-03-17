
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/product.types";
import { PlusCircle, CreditCard, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: () => void;
  onRemovePaymentMethod: (id: string) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
}

const PaymentMethods = ({ 
  paymentMethods, 
  onAddPaymentMethod, 
  onRemovePaymentMethod,
  onSetDefault
}: PaymentMethodsProps) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRemove = async (id: string) => {
    setIsDeleting(id);
    try {
      await onRemovePaymentMethod(id);
      toast({
        title: "Payment method removed",
        description: "The payment method has been removed from your account.",
      });
    } catch (error) {
      toast({
        title: "Error removing payment method",
        description: "There was a problem removing your payment method.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setIsSettingDefault(id);
    try {
      await onSetDefault(id);
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating default payment method",
        description: "There was a problem updating your default payment method.",
        variant: "destructive",
      });
    } finally {
      setIsSettingDefault(null);
    }
  };

  return (
    <Card className="w-full bg-app-gray-dark">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-app-yellow" />
          Payment Methods
        </CardTitle>
        <CardDescription>
          Manage your payment methods for buying coins and gifts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-gray-400 mb-4">No payment methods added yet</p>
            <Button 
              onClick={onAddPaymentMethod}
              className="bg-app-yellow text-black hover:bg-app-yellow/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className={`flex items-center justify-between p-3 rounded-md ${
                  method.is_default ? "bg-app-gray-light border border-app-yellow/50" : "bg-app-gray-light"
                }`}
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3 text-app-yellow" />
                  <div>
                    <p className="font-medium">{method.name || `${method.type.toUpperCase()} Card`}</p>
                    {method.last4 && (
                      <p className="text-sm text-gray-400">•••• {method.last4}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={isSettingDefault === method.id}
                    >
                      {isSettingDefault === method.id ? "Setting..." : "Set Default"}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs text-red-500 hover:text-red-600"
                    onClick={() => handleRemove(method.id)}
                    disabled={isDeleting === method.id}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              onClick={onAddPaymentMethod}
              className="w-full mt-4 bg-app-yellow text-black hover:bg-app-yellow/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
