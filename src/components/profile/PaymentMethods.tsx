import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentMethodsProps {
  methods: any[];
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const PaymentMethods = ({ methods, onRemove, onSetDefault }: PaymentMethodsProps) => {
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <div 
          key={method.id} 
          className={`p-4 border rounded-md flex justify-between items-center ${
            method.is_default ? 'bg-accent/30' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {method.type === 'credit_card' ? (
              <CreditCard className="h-5 w-5 text-gray-500" />
            ) : (
              <Wallet className="h-5 w-5 text-gray-500" />
            )}
            <div>
              <p className="font-medium">
                {method.type === 'credit_card' 
                  ? `${method.name} •••• ${method.last4}`
                  : method.name}
              </p>
              {method.type === 'credit_card' && (
                <p className="text-sm text-muted-foreground">
                  Expires {method.exp_month}/{method.exp_year}
                </p>
              )}
              {method.is_default && (
                <Badge variant="outline" className="mt-1">Default</Badge>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!method.is_default && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSetDefault(method.id)}
              >
                Make Default
              </Button>
            )}
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onRemove(method.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
