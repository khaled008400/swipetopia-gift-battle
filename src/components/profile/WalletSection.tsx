
import React, { useState } from 'react';
import { UserProfile } from '@/types/auth.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Plus, CreditCard, Wallet, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface WalletSectionProps {
  profile: UserProfile;
}

const WalletSection: React.FC<WalletSectionProps> = ({ profile }) => {
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardType, setNewCardType] = useState('visa');
  const [makeDefault, setMakeDefault] = useState(false);

  const coins = profile?.coins || 0;
  const paymentMethods = profile?.payment_methods || [];
  
  const handleAddCard = () => {
    // Implementation would connect to payment processor
    console.log('Adding card:', { newCardNumber, newCardName, newCardExpiry, newCardCvv, newCardType, makeDefault });
    setAddCardOpen(false);
    // Clear form
    setNewCardNumber('');
    setNewCardName('');
    setNewCardExpiry('');
    setNewCardCvv('');
    setNewCardType('visa');
    setMakeDefault(false);
  };

  const formatCardNumber = (number: string) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };
  
  return (
    <div className="space-y-6">
      {/* Coins Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Coins Balance</CardTitle>
          <Coins className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{coins.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Use coins to send gifts, unlock premium content, or support creators
          </p>
          <Button size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Buy More Coins
          </Button>
        </CardContent>
      </Card>
      
      {/* Payment Methods */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new card to your account. We use secure processing for all transactions.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={newCardExpiry}
                      onChange={(e) => setNewCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">Security Code</Label>
                    <Input
                      id="card-cvv"
                      placeholder="123"
                      value={newCardCvv}
                      onChange={(e) => setNewCardCvv(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card-type">Card Type</Label>
                  <Select
                    value={newCardType}
                    onValueChange={setNewCardType}
                  >
                    <SelectTrigger id="card-type">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                      <SelectItem value="discover">Discover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="make-default"
                    checked={makeDefault}
                    onCheckedChange={setMakeDefault}
                  />
                  <Label htmlFor="make-default">Make default payment method</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddCardOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCard}>
                  Add Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {paymentMethods && paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {method.type === 'card' ? (
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      ) : (
                        <Wallet className="h-5 w-5 mr-2 text-primary" />
                      )}
                      <div>
                        <p className="font-medium">
                          {method.type === 'card' ? formatCardNumber(method.last4 || '0000') : method.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {method.isDefault && 'Default • '}
                          {method.type === 'card' ? 'Credit Card' : method.type === 'paypal' ? 'PayPal' : 'Bank Account'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                You haven't added any payment methods yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WalletSection;
