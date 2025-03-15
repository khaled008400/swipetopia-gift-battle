
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, CreditCard, DollarSign, Plus, Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface WalletSectionProps {
  coins?: number;
}

const WalletSection: React.FC<WalletSectionProps> = ({ coins = 0 }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleAddFunds = () => {
    toast({
      title: "Funds added",
      description: `${amount} coins have been added to your wallet.`,
    });
    setOpenDialog(false);
    setAmount('');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Wallet Balance</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-yellow-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-2xl font-semibold">{coins} coins</p>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => setOpenDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Funds
        </Button>

        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
          {coins > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Deposit</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <p className="text-green-600">+100 coins</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <CreditCard className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Gift purchase</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <p className="text-red-600">-50 coins</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No transactions yet</p>
          )}
        </div>
      </CardContent>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Funds to Wallet</DialogTitle>
            <DialogDescription>
              Purchase coins to send gifts, tip creators, and more.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="coins" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coins">Buy Coins</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="coins" className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => setAmount('100')}>100 coins</Button>
                <Button variant="outline" onClick={() => setAmount('500')}>500 coins</Button>
                <Button variant="outline" onClick={() => setAmount('1000')}>1000 coins</Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Custom Amount</Label>
                <Input
                  id="amount"
                  placeholder="Enter coin amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div className="py-2">
                <p className="text-sm text-gray-500">
                  You will be charged $0.01 per coin plus processing fees.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Basic</p>
                      <p className="text-sm text-gray-500">1000 coins monthly</p>
                    </div>
                    <p className="font-medium">$9.99/mo</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 border-blue-200 bg-blue-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Premium</p>
                      <p className="text-sm text-gray-500">3000 coins monthly</p>
                    </div>
                    <p className="font-medium">$24.99/mo</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Best value! Save 16%</p>
                </div>
                
                <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Ultimate</p>
                      <p className="text-sm text-gray-500">10000 coins monthly</p>
                    </div>
                    <p className="font-medium">$74.99/mo</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddFunds}>Continue to Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WalletSection;
