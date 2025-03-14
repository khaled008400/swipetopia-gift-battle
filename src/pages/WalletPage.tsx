
import { useState } from "react";
import { useAuth } from "../context/auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, CreditCard, History, Gift, ArrowRight, Plus } from "lucide-react";

// Mock transaction data
const MOCK_TRANSACTIONS = [
  { id: 1, type: "purchase", amount: 500, date: "2023-08-15", description: "Coin purchase" },
  { id: 2, type: "gift", amount: -100, date: "2023-08-14", description: "Gift to @dancequeen" },
  { id: 3, type: "received", amount: 50, date: "2023-08-12", description: "Gift from @fashionlover" },
  { id: 4, type: "purchase", amount: 200, date: "2023-08-10", description: "Coin purchase" },
];

// Mock package data
const COIN_PACKAGES = [
  { id: 1, coins: 100, price: 0.99, popular: false },
  { id: 2, coins: 500, price: 4.99, popular: true },
  { id: 3, coins: 1000, price: 9.99, popular: false },
  { id: 4, coins: 2000, price: 19.99, popular: false },
  { id: 5, coins: 5000, price: 49.99, popular: false },
];

const WalletPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("balance");

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-app-black p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Wallet className="w-6 h-6 mr-2" /> My Wallet
      </h1>

      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-app-gray-dark to-app-gray-light">
        <p className="text-gray-400 mb-1">Current Balance</p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold mr-2">{user.coins}</span>
          <span className="text-app-yellow">coins</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="balance">Buy Coins</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            {COIN_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`p-4 rounded-lg border ${
                  pkg.popular 
                    ? 'border-app-yellow neon-border' 
                    : 'border-app-gray-light'
                } flex flex-col items-center relative transition-all hover:scale-105`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 bg-app-yellow text-app-black text-xs font-bold py-1 px-2 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="flex items-center mb-2">
                  <span className="text-xl font-bold mr-1">{pkg.coins}</span>
                  <Gift className="w-4 h-4 text-app-yellow" />
                </div>
                <Button className={`w-full mt-2 ${
                  pkg.popular 
                    ? 'bg-app-yellow text-app-black hover:bg-app-yellow-hover' 
                    : 'bg-app-gray-dark hover:bg-app-gray-light'
                }`}>
                  ${pkg.price}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full border-dashed border-app-gray-light text-gray-400 hover:text-app-yellow hover:border-app-yellow">
              <Plus className="w-4 h-4 mr-2" /> Custom Amount
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="animate-fade-in">
          <div className="space-y-4">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="p-4 bg-app-gray-dark rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'purchase' 
                      ? 'bg-green-500/20' 
                      : tx.type === 'gift' 
                        ? 'bg-red-500/20' 
                        : 'bg-blue-500/20'
                  }`}>
                    {tx.type === 'purchase' ? (
                      <CreditCard className="w-5 h-5 text-green-500" />
                    ) : tx.type === 'gift' ? (
                      <Gift className="w-5 h-5 text-red-500" />
                    ) : (
                      <Gift className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletPage;
