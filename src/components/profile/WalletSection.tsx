import React, { useState } from 'react';
import { UserProfile } from '@/types/auth.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Coins, DollarSign, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface WalletSectionProps {
  profile: UserProfile;
  onUpdate?: () => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({ profile, onUpdate }) => {
  const [coins, setCoins] = useState(profile.coins || 0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, you would process payment here
      // For demo purposes, we'll just add the coins directly
      
      const { error } = await supabase.rpc(
        'add_coins',
        { user_id: profile.id, coin_amount: purchaseAmount }
      );
      
      if (error) throw error;
      
      // Update local state
      setCoins(prev => prev + purchaseAmount);
      toast({
        title: "Purchase Successful",
        description: `You have purchased ${purchaseAmount} coins!`,
        variant: "default"
      });
      
      // Close dialog
      setIsAddDialogOpen(false);
      
      // Call onUpdate if provided
      if (onUpdate) onUpdate();
      
    } catch (error: any) {
      console.error("Error purchasing coins:", error);
      toast({
        title: "Purchase Failed",
        description: error.message || "There was an error processing your purchase",
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const predefinedAmounts = [10, 50, 100, 200, 500];

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="mr-2 h-5 w-5 text-amber-500" />
            Your Wallet
          </CardTitle>
          <CardDescription>Manage your coins and payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="text-xl font-bold flex items-center">
              <Coins className="mr-2 h-5 w-5 text-amber-500" />
              <span>{profile.coins || 0} Coins</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Use coins to send gifts during live streams and videos</p>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Coins
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buy Coins</DialogTitle>
                  <DialogDescription>
                    Purchase coins to use across the platform
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-3 gap-2 my-4">
                  {predefinedAmounts.map(amount => (
                    <Button 
                      key={amount}
                      variant={purchaseAmount === amount ? "default" : "outline"} 
                      onClick={() => setPurchaseAmount(amount)}
                    >
                      {amount} Coins
                    </Button>
                  ))}
                </div>
                
                <div className="my-4">
                  <label className="block text-sm mb-1">Custom Amount</label>
                  <Input 
                    type="number" 
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                    min="5"
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handlePurchase} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin mr-2">⚪</span>
                        Processing...
                      </>
                    ) : (
                      `Buy for $${(purchaseAmount * 0.1).toFixed(2)}`
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Methods
            </h3>
            
            {profile.payment_methods && profile.payment_methods.length > 0 ? (
              <div className="space-y-2">
                {profile.payment_methods.map(method => (
                  <div key={method.id} className="border rounded-md p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
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
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={() => console.log('Edit payment method', method)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => console.log('Remove payment method', method)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No payment methods added yet</p>
                <Button variant="outline" className="mt-2">
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSection;
