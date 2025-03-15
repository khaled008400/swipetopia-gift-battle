
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/auth.types';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/card';

interface WalletSectionProps {
  profile?: UserProfile;
  onAddPaymentMethod?: (cardDetails: any) => void;
  onRemovePaymentMethod?: (id: string) => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({
  profile,
  onAddPaymentMethod,
  onRemovePaymentMethod
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const paymentMethods = profile?.payment_methods || [];

  const handleAddCard = () => {
    if (onAddPaymentMethod) {
      onAddPaymentMethod({
        cardNumber,
        expiry,
        cvc,
        name
      });
    }
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods for purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{method.name || 'Card'}</p>
                      <p className="text-sm text-muted-foreground">
                        •••• •••• •••• {method.last4}
                      </p>
                    </div>
                  </div>
                  {onRemovePaymentMethod && (
                    <Button variant="ghost" size="sm" onClick={() => onRemovePaymentMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-4 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No payment methods added</p>
              </div>
            )}
          </div>

          <Button onClick={() => setDialogOpen(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Payment Method
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new card for purchases within the app
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input 
                  id="card-number" 
                  value={cardNumber} 
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} 
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    value={expiry} 
                    onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))} 
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input 
                    id="cvc" 
                    value={cvc} 
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))} 
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCard}>Add Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default WalletSection;
