
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, DollarSign, Send, PiggyBank, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { SellerWallet } from "@/types/product.types";
import { supabase } from "@/lib/supabase";

const SellerWalletView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<SellerWallet | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutMethod, setPayoutMethod] = useState<string>("bank_transfer");
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch actual wallet data from the database
      // For now, we'll create mock data
      const mockWallet: SellerWallet = {
        id: "mock-wallet-1",
        seller_id: user?.id || "",
        balance: 2450.75,
        currency: "USD",
        last_payout_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        pending_amount: 320.50,
        created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setWalletData(mockWallet);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast({
        title: "Error",
        description: "Could not load wallet data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // In a real app, this would fetch transaction history from the database
      // For now, we'll create mock data
      const mockTransactions = [
        {
          id: "tx-1",
          type: "sale",
          amount: 49.99,
          status: "completed",
          description: "Order #12345",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "tx-2",
          type: "sale",
          amount: 129.50,
          status: "completed",
          description: "Order #12346",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "tx-3",
          type: "payout",
          amount: -500.00,
          status: "completed",
          description: "Bank Transfer",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "tx-4",
          type: "sale",
          amount: 79.99,
          status: "completed",
          description: "Order #12340",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "tx-5",
          type: "refund",
          amount: -29.99,
          status: "completed",
          description: "Refund for Order #12339",
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleRequestPayout = async () => {
    if (!payoutAmount || payoutAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payout amount.",
        variant: "destructive",
      });
      return;
    }

    if (payoutAmount > (walletData?.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: "Payout amount exceeds your available balance.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayout(true);
    try {
      // In a real app, this would send a request to the backend to process the payout
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local wallet data
      if (walletData) {
        setWalletData({
          ...walletData,
          balance: walletData.balance - payoutAmount,
          last_payout_date: new Date().toISOString(),
        });
      }
      
      // Add transaction to history
      const newTransaction = {
        id: `tx-${Date.now()}`,
        type: "payout",
        amount: -payoutAmount,
        status: "processing",
        description: `${payoutMethod.replace('_', ' ')}`,
        date: new Date().toISOString(),
      };
      
      setTransactions([newTransaction, ...transactions]);
      
      toast({
        title: "Payout requested",
        description: `Your payout of $${payoutAmount.toFixed(2)} has been requested and is being processed.`,
      });
      
      setIsPayoutDialogOpen(false);
      setPayoutAmount(0);
    } catch (error) {
      console.error("Error requesting payout:", error);
      toast({
        title: "Error",
        description: "Failed to process payout request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seller Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-app-gray-dark">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Available Balance</p>
                    <h3 className="text-2xl font-bold text-app-yellow">
                      ${walletData?.balance.toFixed(2)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-app-yellow/20 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-app-yellow" />
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-app-yellow text-app-black hover:bg-yellow-500"
                  onClick={() => {
                    setPayoutAmount(walletData?.balance || 0);
                    setIsPayoutDialogOpen(true);
                  }}
                >
                  Request Payout
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-app-gray-dark">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Pending Amount</p>
                    <h3 className="text-2xl font-bold text-white">
                      ${walletData?.pending_amount.toFixed(2)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center">
                    <PiggyBank className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  Pending amounts are released after the buyer confirms receipt of the product
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-app-gray-dark">
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-400">Last Payout</p>
                  <h3 className="text-2xl font-bold text-white">
                    {walletData?.last_payout_date 
                      ? format(new Date(walletData.last_payout_date), 'MMM d, yyyy')
                      : 'No payouts yet'}
                  </h3>
                </div>
                <div className="mt-4">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-app-yellow flex items-center">
                      Payout Methods <ChevronDown className="ml-1 h-4 w-4" />
                    </summary>
                    <div className="mt-2 pl-2 border-l-2 border-gray-600">
                      <p className="text-gray-400">Bank Transfer (2-3 business days)</p>
                      <p className="text-gray-400">PayPal (Instant)</p>
                      <p className="text-gray-400">Store Credit (Instant)</p>
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.type === 'sale' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.type === 'payout'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="bg-app-gray-dark text-white">
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the amount you wish to withdraw from your seller account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="pl-7"
                  min={1}
                  max={walletData?.balance || 0}
                  step={0.01}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Payout Method
              </Label>
              <select
                id="method"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="col-span-3 bg-app-black border border-app-gray-light rounded p-2"
              >
                <option value="bank_transfer">Bank Transfer (2-3 business days)</option>
                <option value="paypal">PayPal (Instant)</option>
                <option value="store_credit">Store Credit (Instant)</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPayoutDialogOpen(false)}
              disabled={isProcessingPayout}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRequestPayout}
              disabled={isProcessingPayout || payoutAmount <= 0 || payoutAmount > (walletData?.balance || 0)}
              className="bg-app-yellow text-app-black hover:bg-yellow-500"
            >
              {isProcessingPayout ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirm Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerWalletView;
