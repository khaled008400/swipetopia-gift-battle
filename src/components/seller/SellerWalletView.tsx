import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Wallet, ArrowDown, ArrowUp, CalendarDays } from "lucide-react";
import { format, subDays } from "date-fns";
import { SellerWallet, WalletTransaction } from "@/types/product.types";
import { supabase } from "@/lib/supabase";

const SellerWalletView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<SellerWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<WalletTransaction[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    if (user?.id) {
      fetchWalletData();
    }
  }, [user]);

  useEffect(() => {
    if (wallet) {
      fetchTransactionHistory();
    }
  }, [wallet, dateRange]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seller_wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        toast({
          title: "Error fetching wallet",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setWallet(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionHistory = async () => {
    if (!wallet) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .gte('created_at', dateRange.from?.toISOString() || '')
        .lte('created_at', dateRange.to?.toISOString() || '')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching transactions",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setTransactionHistory(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use a mock wallet with the correct type structure
  const mockWallet: SellerWallet = {
    id: "wallet-1",
    user_id: "user-1",
    balance: 2500.00,
    pending_balance: 750.00,
    total_earnings: 5000.00,
    currency: "USD",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    can_withdraw: true,
    minimum_withdrawal: 100.00,
    seller_id: "seller-1", // Added for compatibility
    pending_amount: 750.00, // Added for compatibility
    last_payout_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    transactions: [
      {
        id: "txn-1",
        wallet_id: "wallet-1",
        amount: 50.00,
        type: "sale",
        status: "completed",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        description: "Sale of Summer T-Shirt",
        reference_id: "order-1"
      },
      {
        id: "txn-2",
        wallet_id: "wallet-1",
        amount: 1000.00,
        type: "withdrawal",
        status: "completed",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        description: "Withdrawal to bank account",
        reference_id: "withdrawal-1"
      },
      {
        id: "txn-3",
        wallet_id: "wallet-1",
        amount: 25.00,
        type: "refund",
        status: "completed",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        description: "Refund for damaged product",
        reference_id: "refund-1"
      }
    ]
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
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Wallet className="h-8 w-8 text-app-yellow" />
            <div>
              <h3 className="text-2xl font-semibold">${wallet?.balance.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground">Available Balance</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Pending Balance</h4>
              <p className="text-lg font-semibold">${wallet?.pending_balance.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Total Earnings</h4>
              <p className="text-lg font-semibold">${wallet?.total_earnings.toFixed(2)}</p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium">Last Payout Date</h4>
              <p className="text-sm">{wallet?.last_payout_date ? format(new Date(wallet?.last_payout_date), "MMM d, yyyy") : "N/A"}</p>
            </div>
            <Button className="bg-app-yellow text-app-black hover:bg-yellow-500">Withdraw Funds</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4" />
            <p className="text-sm">Filter by Date Range:</p>
            <input
              type="date"
              value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
              onChange={(e) => setDateRange({ ...dateRange, from: new Date(e.target.value) })}
              className="border rounded-md px-2 py-1 text-sm"
            />
            <span className="mx-1">to</span>
            <input
              type="date"
              value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
              onChange={(e) => setDateRange({ ...dateRange, to: new Date(e.target.value) })}
              className="border rounded-md px-2 py-1 text-sm"
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {transactionHistory.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {transaction.type === "sale" && <ArrowUp className="h-4 w-4 text-green-500" />}
                    {transaction.type === "refund" && <ArrowDown className="h-4 w-4 text-red-500" />}
                    {transaction.type === "withdrawal" && <ArrowDown className="h-4 w-4 text-blue-500" />}
                    <p className="text-sm">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {transaction.type === "withdrawal" ? "-" : "+"}
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{format(new Date(transaction.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerWalletView;
