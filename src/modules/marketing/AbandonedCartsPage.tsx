
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Icon } from '../../components/shared/Icon';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../../components/ui/Drawer';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import { mockAbandonedCarts, mockCartRecoveryCampaigns } from '../../data/mockData';

// --- COMMON DASHBOARD ---
const AbandonedCartsDashboard = () => {
    const combinedStats = [
        { label: "Total Abandoned", value: "156", icon: 'shoppingCart' as const, color: "text-red-500" },
        { label: "Total Cart Value", value: formatCurrency(3618400), icon: 'dollarSign' as const, color: "text-red-500" },
        { label: "Carts Recovered", value: "145", icon: 'checkCircle' as const, color: "text-green-500" },
        { label: "Recovery Rate", value: "32.5%", icon: 'trendingUp' as const, color: "text-green-500" },
        { label: "Revenue Generated", value: formatCurrency(18450), icon: 'dollarSign' as const, color: "text-green-500" },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {combinedStats.map(stat => (
                 <Card key={stat.label}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 ${stat.color}`}>
                                <Icon name={stat.icon} className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// --- TAB 1: Abandoned Carts List ---
const AbandonedCartsList = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Carts Pending Recovery</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Cart Value</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Abandoned</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAbandonedCarts.map(cart => (
                        <TableRow key={cart.id}>
                          <TableCell className="font-medium">{cart.customer}</TableCell>
                          <TableCell>{cart.email}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(cart.value)}</TableCell>
                          <TableCell>{cart.items}</TableCell>
                          <TableCell>{cart.abandoned}</TableCell>
                          <TableCell>
                            <Badge variant={
                                cart.status === 'New' ? 'blue' :
                                cart.status === 'Email Sent' ? 'yellow' :
                                cart.status === 'Recovered' ? 'green' : 'red'
                            }>{cart.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

// --- TAB 2: Recovery Campaigns ---
const CartRecoveryTab = () => {
    const [campaigns, setCampaigns] = useState(mockCartRecoveryCampaigns);
  
    const handleStatusChange = (campaignId: number, newStatus: boolean) => {
      setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: newStatus ? 'active' : 'paused' } : c));
    };
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Recovery Automations</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Automated email sequences to recover abandoned carts</p>
          </div>
          <Drawer>
            <DrawerTrigger>
                <Button className="gap-2">
                    <Icon name="plus" className="h-4 w-4" /> Create Campaign
                </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
              <DrawerHeader className="border-b px-6 py-4"><DrawerTitle>Create Recovery Campaign</DrawerTitle></DrawerHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-gray-500">This is where you would configure the automation workflow for cart recovery.</p>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
  
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle>{campaign.name}</CardTitle>
                    <Badge variant={campaign.status === "active" ? "green" : "gray"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={campaign.status === "active"} onClick={() => handleStatusChange(campaign.id, campaign.status !== 'active')} />
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Duplicate</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-8">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <Icon name="clock" className="h-4 w-4" />
                      Trigger: {campaign.trigger}
                    </div>
                    <div className="space-y-3">
                      {campaign.emails.map((email, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-medium">
                            {idx + 1}
                          </div>
                          {idx < campaign.emails.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                          )}
                          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-3 ml-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon name="mail" className="h-4 w-4 text-green-500" />
                                <span className="font-medium text-sm">{email.subject}</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">After {email.delay}</span>
                            </div>
                            <div className="flex gap-6 text-xs">
                              <span className="text-gray-500 dark:text-gray-400"> Open Rate: <span className="font-medium text-gray-800 dark:text-gray-200">{email.openRate}%</span> </span>
                              <span className="text-gray-500 dark:text-gray-400"> Click Rate: <span className="font-medium text-gray-800 dark:text-gray-200">{email.clickRate}%</span> </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Carts Recovered</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{campaign.recovered}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Revenue Generated</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(campaign.revenue)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recovery Rate</p>
                        <p className="text-3xl font-bold">{campaign.rate}%</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
// --- MAIN PAGE COMPONENT ---
const AbandonedCartsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Abandoned Carts & Recovery</h1>
            <p className="text-gray-500 dark:text-gray-400">Monitor abandoned carts and manage recovery campaigns to boost revenue.</p>
    
            <AbandonedCartsDashboard />

            <Tabs defaultValue="carts">
                <TabsList>
                    <TabsTrigger value="carts">Abandoned Carts List</TabsTrigger>
                    <TabsTrigger value="recovery">Recovery Campaigns</TabsTrigger>
                </TabsList>
                
                <TabsContent value="carts" className="mt-6">
                    <AbandonedCartsList />
                </TabsContent>
                <TabsContent value="recovery" className="mt-6">
                    <CartRecoveryTab />
                </TabsContent>
            </Tabs>
      </div>
    );
  };
  
  export default AbandonedCartsPage;
