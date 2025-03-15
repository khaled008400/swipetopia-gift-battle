
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowUpDown, Check, CreditCard, DollarSign, Filter, Loader2, Wallet } from 'lucide-react';
import AdminService from '@/services/admin.service';

const AdminWallets = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch transactions (mocked for now)
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['walletTransactions', filterStatus, filterType, sortDirection],
    queryFn: () => {
      // In a real implementation, this would call a method from AdminService
      // return AdminService.getWalletTransactions({ status: filterStatus, type: filterType, sort: sortDirection });
      
      // Mock data for demonstration
      return {
        data: [
          {
            id: '1',
            user: { id: 'u1', username: 'user1' },
            amount: 1000,
            coins: 1000,
            type: 'purchase',
            status: 'completed',
            createdAt: new Date().toISOString(),
            method: 'credit_card'
          },
          {
            id: '2',
            user: { id: 'u2', username: 'streamer1' },
            amount: 45,
            coins: null,
            type: 'withdrawal',
            status: 'pending',
            createdAt: new Date().toISOString(),
            method: 'bank_transfer'
          },
          {
            id: '3',
            user: { id: 'u3', username: 'user2' },
            amount: 500,
            coins: 500,
            type: 'purchase',
            status: 'completed',
            createdAt: new Date().toISOString(),
            method: 'paypal'
          }
        ],
        total: 3
      };
    }
  });
  
  // Toggle sort direction
  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  // Get transaction type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge className="bg-blue-500">Purchase</Badge>;
      case 'withdrawal':
        return <Badge className="bg-purple-500">Withdrawal</Badge>;
      case 'gift':
        return <Badge className="bg-pink-500">Gift</Badge>;
      case 'refund':
        return <Badge className="bg-orange-500">Refund</Badge>;
      default:
        return <Badge className="bg-gray-500">{type}</Badge>;
    }
  };
  
  // Render payment method
  const renderPaymentMethod = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <div className="flex items-center"><CreditCard className="h-4 w-4 mr-2" /> Credit Card</div>;
      case 'paypal':
        return <div className="flex items-center">PayPal</div>;
      case 'bank_transfer':
        return <div className="flex items-center">Bank Transfer</div>;
      default:
        return method;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wallet & Payments Management</h2>
      </div>
      
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="coin-packs">Coin Packs</TabsTrigger>
          <TabsTrigger value="payout-settings">Payout Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>From coin purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12,345.67</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Pending Payouts</CardTitle>
                <CardDescription>Awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$789.10</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Transactions</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,234</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white rounded-md shadow">
            <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-auto">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-auto">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="purchase">Purchases</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="gift">Gifts</SelectItem>
                      <SelectItem value="refund">Refunds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={toggleSort}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
              </Button>
            </div>
          
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.data?.length > 0 ? (
                      transactions.data.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                          <TableCell className="font-medium">{transaction.user.username}</TableCell>
                          <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                          <TableCell>
                            {transaction.type === 'purchase' ? (
                              <div>
                                <div className="font-medium">${transaction.amount}</div>
                                <div className="text-xs text-muted-foreground">{transaction.coins} coins</div>
                              </div>
                            ) : (
                              <div>${transaction.amount}</div>
                            )}
                          </TableCell>
                          <TableCell>{renderPaymentMethod(transaction.method)}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No transactions found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways Configuration</CardTitle>
              <CardDescription>Configure payment methods for the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Stripe</h3>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="stripe-public">Publishable Key</Label>
                      <Input id="stripe-public" type="password" value="pk_test_•••••••••••••••••••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe-secret">Secret Key</Label>
                      <Input id="stripe-secret" type="password" value="sk_test_•••••••••••••••••••••••••" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">P</span>
                      </div>
                      <h3 className="text-lg font-medium">PayPal</h3>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="paypal-client">Client ID</Label>
                      <Input id="paypal-client" type="password" value="client_•••••••••••••••••••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypal-secret">Client Secret</Label>
                      <Input id="paypal-secret" type="password" value="secret_•••••••••••••••••••••••••" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Apple Pay / Google Pay</h3>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <div className="bg-yellow-50 p-3 rounded-md flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <p className="text-yellow-700 text-sm">
                        Apple Pay and Google Pay require Stripe integration to be enabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button>
                  <Check className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coin-packs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Currency Packages</CardTitle>
              <CardDescription>Configure coin packages available for purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Coins</TableHead>
                    <TableHead>Price (USD)</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Starter Pack</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>$0.99</TableCell>
                    <TableCell>0%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Standard Pack</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>$4.99</TableCell>
                    <TableCell>0%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Value Pack</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>$9.99</TableCell>
                    <TableCell>5%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium Pack</TableCell>
                    <TableCell>5000</TableCell>
                    <TableCell>$49.99</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ultimate Pack</TableCell>
                    <TableCell>10000</TableCell>
                    <TableCell>$99.99</TableCell>
                    <TableCell>15%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="flex justify-end mt-4">
                <Button>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add New Package
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payout-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>Configure how creators receive their earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-payout">Minimum Payout Amount (USD)</Label>
                    <Input id="min-payout" type="number" defaultValue={25} />
                    <p className="text-xs text-muted-foreground">
                      Creators must earn at least this amount before requesting a payout
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payout-schedule">Payout Schedule</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="payout-schedule">
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Allowed Payout Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="paypal-enabled" defaultChecked />
                      <Label htmlFor="paypal-enabled">PayPal</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="bank-transfer-enabled" defaultChecked />
                      <Label htmlFor="bank-transfer-enabled">Bank Transfer</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="crypto-enabled" />
                      <Label htmlFor="crypto-enabled">Cryptocurrency</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Payout Fees</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paypal-fee">PayPal Fee (%)</Label>
                      <Input id="paypal-fee" type="number" defaultValue={1.5} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bank-fee">Bank Transfer Fee (%)</Label>
                      <Input id="bank-fee" type="number" defaultValue={0.5} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-approve" defaultChecked />
                    <Label htmlFor="auto-approve">Automatically Approve Payouts</Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    If disabled, all payout requests will require manual approval
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button>
                  <Check className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWallets;
