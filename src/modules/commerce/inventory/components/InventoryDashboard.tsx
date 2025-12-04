
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Icon } from "../../../../components/shared/Icon";
import { Badge } from "../../../../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/Tabs";
import { Progress } from "../../../../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { formatCurrency, getStockStatus } from "../../../../lib/utils";
import type { Product } from "../../../../types";
import { mockSuppliers } from "../../../../data/inventoryMockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const InventoryDashboard = ({ products, onReorder }: { products: Product[], onReorder: (product: Product) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // --- Derived Metrics ---
    const stats = useMemo(() => {
        const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
        const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
        const lowStock = products.filter(p => getStockStatus(p.stock, 20).text === 'Low Stock').length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const active = products.filter(p => p.status === 'Active').length;
        const healthy = active - lowStock - outOfStock;
        const healthScore = totalItems > 0 ? Math.round((healthy / active) * 100) : 0;
        
        // Mocking Warehouse Data derived from product locations
        const warehouseCounts: Record<string, number> = {};
        products.forEach(p => {
            // Use inventoryByLocation instead of legacy locations
            if (p.inventoryByLocation) {
                p.inventoryByLocation.forEach(l => {
                    warehouseCounts[l.locationName] = (warehouseCounts[l.locationName] || 0) + l.stock;
                });
            }
        });
        const warehouseData = Object.keys(warehouseCounts).map(k => ({ name: k, value: warehouseCounts[k] }));

        return { totalValue, totalItems, lowStock, outOfStock, active, healthy, healthScore, warehouseData };
    }, [products]);

    const filteredStock = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.sku.toLowerCase().includes(lower)
        );
    }, [products, searchTerm]);

    // --- Mock Chart Data ---
    const trendData = [
        { name: 'Jan', value: 1800000, items: 1200 },
        { name: 'Feb', value: 2100000, items: 1350 },
        { name: 'Mar', value: 1950000, items: 1280 },
        { name: 'Apr', value: 2400000, items: 1500 },
        { name: 'May', value: 2300000, items: 1420 },
        { name: 'Jun', value: stats.totalValue || 2500000, items: stats.totalItems },
    ];

    // Mock Data for Top Moving Products (Simulated Velocity)
    const topMovingProducts = useMemo(() => {
        // Take first 3 products and simulate sales data
        return products.slice(0, 3).map((p, i) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            sold: 150 - (i * 20) + Math.floor(Math.random() * 10),
            trend: 10 - (i * 2) + Math.floor(Math.random() * 5)
        }));
    }, [products]);

    return (
        <div className="space-y-6">
            
            {/* 1. Merged KPI Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1: Inventory Overview */}
                <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-300">Inventory Overview</CardTitle>
                            <Badge variant="outline" className="font-normal text-xs">Health Score: {stats.healthScore}/100</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-end justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="text-sm text-gray-500">Total Asset Value</p>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatCurrency(stats.totalValue)}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-emerald-600 flex items-center justify-end gap-1">
                                        <Icon name="trendingUp" className="w-4 h-4" /> +12.5%
                                    </p>
                                    <p className="text-xs text-gray-400">vs last month</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 divide-x dark:divide-gray-800">
                                <div className="px-2 text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Healthy</p>
                                    <p className="text-lg font-bold text-emerald-600">{stats.healthy}</p>
                                </div>
                                <div className="px-2 text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Low Stock</p>
                                    <p className="text-lg font-bold text-amber-500">{stats.lowStock}</p>
                                </div>
                                <div className="px-2 text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Critical</p>
                                    <p className="text-lg font-bold text-red-500">{stats.outOfStock}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Operational Insights */}
                <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-300">Operational Insights</CardTitle>
                            <Icon name="activity" className="w-4 h-4 text-gray-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full items-center">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                        <Icon name="refreshCw" className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Turnover</span>
                                </div>
                                <p className="text-2xl font-bold">4.2x</p>
                                <p className="text-xs text-gray-400">Yearly avg</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-purple-600">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                        <Icon name="package" className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization</span>
                                </div>
                                <p className="text-2xl font-bold">87%</p>
                                <Progress value={87} className="h-1.5" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-orange-600">
                                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                                        <Icon name="clock" className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Picking Time</span>
                                </div>
                                <p className="text-2xl font-bold">12m</p>
                                <p className="text-xs text-gray-400">-30s vs last week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Analytics & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Unified Trend Chart */}
                <Card className="lg:col-span-2 shadow-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-base">Inventory Value Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} tickFormatter={(val) => `₹${val/1000}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Tabbed Panel: Warehouse & Top Moving */}
                <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
                    <Tabs defaultValue="warehouse" className="h-full flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Distribution</CardTitle>
                                <TabsList className="h-8">
                                    <TabsTrigger value="warehouse" className="text-xs px-2 h-6">Warehouses</TabsTrigger>
                                    <TabsTrigger value="moving" className="text-xs px-2 h-6">Top Moving</TabsTrigger>
                                </TabsList>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <TabsContent value="warehouse" className="h-[250px] mt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.warehouseData} layout="vertical" margin={{ left: 20, right: 30, top: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={90} tick={{fontSize: 11, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                                        <RechartsTooltip 
                                            cursor={{fill: 'transparent'}} 
                                            contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                            formatter={(value: number) => [value, 'Stock Items']}
                                        />
                                        <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </TabsContent>
                            <TabsContent value="moving" className="h-[250px] mt-0 overflow-y-auto pr-2">
                                <div className="space-y-4 mt-4">
                                    {topMovingProducts.map((p, idx) => (
                                        <div key={p.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className={`text-xs font-bold w-4 ${idx === 0 ? 'text-amber-500' : 'text-gray-400'}`}>{idx + 1}.</span>
                                                <div className="truncate">
                                                    <p className="font-medium truncate text-gray-800 dark:text-gray-200">{p.name}</p>
                                                    <p className="text-[10px] text-gray-500">{p.sku}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-gray-100">{p.sold} <span className="text-[10px] font-normal text-gray-500">sold</span></p>
                                                <p className="text-[10px] font-medium text-green-600 flex items-center justify-end gap-0.5">
                                                    <Icon name="trendingUp" className="w-3 h-3" /> {p.trend}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>

            {/* 3. Low Stock Alerts (Preserved) */}
            <Card className="border-l-4 border-l-amber-500 shadow-sm">
                <CardHeader className="pb-3"><CardTitle className="text-base text-amber-700 flex items-center gap-2"><Icon name="alertTriangle" className="w-4 h-4" /> Low Stock Alerts</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {products.filter(p => p.stock < 20).map(p => (
                            <div key={p.id} className="flex items-center gap-4 p-2 border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors rounded-md">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                                    {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-md"/> : <Icon name="image" className="w-5 h-5 text-gray-400"/>}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium truncate">{p.name}</p>
                                    <p className="text-xs text-gray-500">Supplier: {mockSuppliers[0]?.name}</p>
                                </div>
                                <div className="text-right mr-2">
                                    <p className="text-sm font-bold text-red-600">{p.stock} left</p>
                                    <p className="text-[10px] text-gray-400">Reorder: 20</p>
                                </div>
                                <Button size="sm" variant="default" onClick={() => onReorder(p)} className="h-7 text-xs">Restock</Button>
                            </div>
                        ))}
                        {products.filter(p => p.stock < 20).length === 0 && (
                            <div className="text-center text-gray-500 py-4 text-sm">Inventory levels are healthy. No alerts.</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 4. Multi-Location Stock Table (Preserved) */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                    <div className="flex flex-row items-center justify-between w-full gap-4">
                        <CardTitle className="whitespace-nowrap text-base">Multi-Location Stock</CardTitle>
                        <div className="relative w-64">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search stock..." 
                                className="pl-9 h-8 text-sm" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                    <TableHead className="w-[250px]">Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Warehouse A</TableHead>
                                    <TableHead className="text-right">Warehouse B</TableHead>
                                    <TableHead className="text-right">Storefront</TableHead>
                                    <TableHead className="text-right">Total Stock</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStock.slice(0, 20).map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium text-sm">{p.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-gray-500">{p.sku}</TableCell>
                                        {p.locations.map(l => <TableCell key={l.locationId} className="text-right text-sm">{l.stock}</TableCell>)}
                                        <TableCell className="font-bold text-right text-sm">{p.stock}</TableCell>
                                        <TableCell className="text-center"><Badge variant={getStockStatus(p.stock, 20).variant}>{getStockStatus(p.stock, 20).text}</Badge></TableCell>
                                    </TableRow>
                                ))}
                                {filteredStock.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                                            No products found matching "{searchTerm}".
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
