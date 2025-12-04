
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Icon } from "../../../components/shared/Icon";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Progress } from "../../../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/DropdownMenu";
import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import { formatCurrency, getStockStatus } from "../../../lib/utils";
import CreateProductModal from "../../../components/modals/CreateProductModal";
import { useGlassyToasts } from "../../../components/ui/GlassyToastProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import type { RootState } from "../../../store/store";
import { updateProduct, deleteProduct } from "../../../store/inventorySlice";
import type { Product } from "../../../types";

export default function ProductProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { push } = useGlassyToasts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = useSelector((state: RootState) => 
    state.inventory.products.find((p) => p.id === id)
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // --- Derived Calculations ---
  const stockStatus = useMemo(() => {
    if (!product) return { text: 'Unknown', variant: 'gray', colorClass: 'bg-gray-100 text-gray-800' };
    const { lowStockThreshold, criticalThreshold } = product.stockRules;
    const current = product.totalStock;

    if (current === 0) return { text: 'Out of Stock', variant: 'destructive', colorClass: 'bg-red-100 text-red-800 border-red-200' };
    if (current < criticalThreshold) return { text: 'Critical', variant: 'red', colorClass: 'bg-orange-100 text-orange-800 border-orange-200' };
    if (current < lowStockThreshold) return { text: 'Low Stock', variant: 'yellow', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: 'Healthy', variant: 'green', colorClass: 'bg-green-100 text-green-800 border-green-200' };
  }, [product]);

  const inventoryValue = product ? product.totalStock * product.pricing.cost : 0;
  
  // --- Handlers ---
  const handleSave = (updatedProduct: Product) => {
    // Append history entry for update
    const newHistoryEntry = {
        id: `h_${Date.now()}`,
        action: 'Product Updated',
        actor: 'Current User',
        date: new Date().toISOString(),
        details: 'Manual update via profile'
    };
    
    const productWithHistory = {
        ...updatedProduct,
        history: [newHistoryEntry, ...(product?.history || [])]
    };

    dispatch(updateProduct(productWithHistory));
    setIsEditOpen(false);
    push({ title: "Product Updated", description: "Changes have been saved successfully.", variant: "success" });
  };

  const handleDelete = () => {
    if (product) {
        dispatch(deleteProduct(product.id));
        push({ title: "Product Deleted", description: `${product.name} removed.`, variant: "error" });
        navigate("/commerce/products");
    }
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'Active': return 'green';
          case 'Draft': return 'yellow';
          case 'Inactive': return 'gray';
          default: return 'gray';
      }
  };

  // Mock Charts Data
  const demandData = [
      { day: 'Today', demand: 5 },
      { day: '15 Days', demand: 12 },
      { day: '30 Days', demand: 28 },
      { day: '45 Days', demand: 45 },
  ];

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const mainImage = product.images?.[0];

  return (
    <div className="space-y-6 pb-10">
      
      {/* Back Link */}
      <div>
        <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 pl-0 hover:bg-transparent hover:text-green-600 text-gray-500 dark:text-gray-400 dark:hover:text-green-400" 
            onClick={() => navigate("/commerce/products")}
        >
            <Icon name="arrowLeft" className="w-4 h-4" /> Back to Product Catalog
        </Button>
      </div>
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-6">
            <div className="w-32 h-32 bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {mainImage ? (
                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <Icon name="image" className="w-10 h-10 text-gray-300" />
                )}
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                    <Badge variant={getStatusBadge(product.status)}>{product.status}</Badge>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>SKU: <span className="font-mono text-gray-700 dark:text-gray-300">{product.sku}</span></p>
                    <p>Brand: {product.brand} • Model: {product.modelNumber}</p>
                    <div className="flex gap-2 mt-1">
                        {product.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                </div>
            </div>
        </div>

        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => push({title: "Exporting...", description: "Product data CSV is downloading.", variant: "info"})}>
                <Icon name="download" className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button size="sm" onClick={() => setIsEditOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                <Icon name="edit" className="w-4 h-4 mr-2" /> Edit Product
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                        <Icon name="moreVertical" className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setIsDeleteOpen(true)}>
                        Delete Product
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* --- MAIN TABS --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
              {['Overview', 'Stock & Warehouses', 'Pricing', 'Sales & Demand', 'History', 'Files'].map(tab => (
                <TabsTrigger 
                  key={tab} 
                  value={tab.toLowerCase().split(' ')[0]} 
                >
                  {tab}
                </TabsTrigger>
              ))}
          </TabsList>

          {/* --- TAB: OVERVIEW --- */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Basic Info & Stats */}
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Product Overview</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {product.description || 'No description provided.'}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800">
                                <p className="text-xs text-gray-500 uppercase">Total Stock</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.totalStock}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800">
                                <p className="text-xs text-gray-500 uppercase">Inventory Value</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(inventoryValue)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800">
                                <p className="text-xs text-gray-500 uppercase">Profit Margin</p>
                                <p className="text-2xl font-bold text-green-600">{product.pricing.margin}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className={`${stockStatus.colorClass} border-none`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon name="alertTriangle" className="w-5 h-5" />
                                <h3 className="font-bold">Stock Status: {stockStatus.text}</h3>
                            </div>
                            <p className="text-sm opacity-80">
                                Current stock is <strong>{product.totalStock}</strong>. Reorder point is {product.stockRules.reorderPoint}.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Logistics */}
                    <Card>
                        <CardHeader><CardTitle>Logistics</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Weight</span><span>{product.logistics.weight} kg</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Dimensions</span><span>{product.logistics.length} x {product.logistics.width} x {product.logistics.height} cm</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Package</span><span>{product.logistics.packageType}</span></div>
                            <div className="flex gap-2 pt-2">
                                {product.logistics.fragile && <Badge variant="red">Fragile</Badge>}
                                {product.logistics.requiresInstallation && <Badge variant="blue">Install Req.</Badge>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
          </TabsContent>


          {/* --- TAB: STOCK --- */}
          <TabsContent value="stock" className="space-y-6 mt-6">
              <Card>
                  <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Warehouse Locations</CardTitle>
                        <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>Manage Locations</Button>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Location Name</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead className="text-right">Stock</TableHead>
                                  <TableHead className="text-center">Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {product.inventoryByLocation.length === 0 ? (
                                  <TableRow>
                                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">No locations configured.</TableCell>
                                  </TableRow>
                              ) : (
                                  product.inventoryByLocation.map((loc) => (
                                      <TableRow key={loc.locationId}>
                                          <TableCell className="font-medium">{loc.locationName}</TableCell>
                                          <TableCell><Badge variant="outline">{loc.type || 'Warehouse'}</Badge></TableCell>
                                          <TableCell className="text-right font-bold">{loc.stock}</TableCell>
                                          <TableCell className="text-center">
                                              <Badge variant={loc.stock > 0 ? 'green' : 'red'} className="text-[10px] py-0 h-5">
                                                  {loc.stock > 0 ? 'In Stock' : 'Empty'}
                                              </Badge>
                                          </TableCell>
                                          <TableCell className="text-right">
                                              <Button variant="ghost" size="sm" className="text-blue-600">Transfer</Button>
                                          </TableCell>
                                      </TableRow>
                                  ))
                              )}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </TabsContent>

          {/* --- TAB: PRICING --- */}
          <TabsContent value="pricing" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* KPIs */}
                  <Card className="md:col-span-3">
                      <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                          <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Selling Price</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(product.pricing?.sellingPrice)}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Cost Price</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(product.pricing?.cost)}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Profit / Unit</p>
                              <p className="text-2xl font-bold text-green-600">{formatCurrency(product.pricing?.profit)}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Margin</p>
                              <div className="flex items-center gap-2">
                                  <p className="text-2xl font-bold text-blue-600">{product.pricing?.margin}%</p>
                                  <Progress value={product.pricing?.margin} className="w-16 h-2" />
                              </div>
                          </div>
                      </CardContent>
                  </Card>

                  {/* Detailed Pricing */}
                  <Card className="md:col-span-2">
                      <CardHeader><CardTitle>Price List</CardTitle></CardHeader>
                      <CardContent>
                          <Table>
                              <TableBody>
                                  <TableRow>
                                      <TableCell className="font-medium">Retail Price (Standard)</TableCell>
                                      <TableCell className="text-right">{formatCurrency(product.pricing.retailPrice)}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                      <TableCell className="font-medium">B2B / Wholesale Price</TableCell>
                                      <TableCell className="text-right">{formatCurrency(product.pricing.b2bPrice)}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                      <TableCell className="font-medium">MRP (Max Retail Price)</TableCell>
                                      <TableCell className="text-right text-gray-500 decoration-slate-400">{formatCurrency(product.pricing.mrp)}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                      <TableCell className="font-medium text-orange-600">Offer / Discount Price</TableCell>
                                      <TableCell className="text-right text-orange-600 font-bold">
                                          {product.pricing.offerPrice > 0 ? formatCurrency(product.pricing.offerPrice) : '-'}
                                      </TableCell>
                                  </TableRow>
                              </TableBody>
                          </Table>
                      </CardContent>
                  </Card>

                  {/* Tax Info */}
                  <Card>
                      <CardHeader><CardTitle>Tax Information</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Tax Rate</span>
                              <span className="font-medium">{product.pricing.taxRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">HSN Code</span>
                              <span className="font-mono text-sm">{product.hsn || 'N/A'}</span>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded text-xs text-gray-500 mt-4">
                              Prices shown are inclusive of tax unless otherwise configured in global settings.
                          </div>
                      </CardContent>
                  </Card>
              </div>
          </TabsContent>


          {/* --- TAB: SALES --- */}
          <TabsContent value="sales" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Demand Forecast (Placeholder)</CardTitle>
                        <CardDescription>Projected demand for the next 45 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={demandData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="demand" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                 </Card>
                 <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Sales Velocity</p>
                                <p className="text-xl font-bold">12 <span className="text-sm font-normal text-gray-400">units/week</span></p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Reorder Frequency</p>
                                <p className="text-xl font-bold">24 <span className="text-sm font-normal text-gray-400">days</span></p>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
              </div>
          </TabsContent>

          {/* --- TAB: HISTORY --- */}
          <TabsContent value="history" className="space-y-6 mt-6">
              <Card>
                  <CardHeader><CardTitle>Product History</CardTitle></CardHeader>
                  <CardContent>
                      <div className="space-y-6 pl-4 border-l border-gray-200 dark:border-zinc-800">
                          {(product.history || []).map((h, i) => (
                              <div key={i} className="relative pl-6">
                                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-950" />
                                  <div>
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{h.action}</p>
                                      <p className="text-xs text-gray-500">{h.details || 'No details'}</p>
                                      <p className="text-[10px] text-gray-400 mt-1">{new Date(h.date).toLocaleString()} by {h.actor}</p>
                                  </div>
                              </div>
                          ))}
                          {(!product.history || product.history.length === 0) && (
                              <p className="text-sm text-gray-500">No history available.</p>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>

          {/* --- TAB: FILES --- */}
          <TabsContent value="files" className="space-y-6 mt-6">
              <Card>
                  <CardHeader>
                      <div className="flex justify-between items-center">
                          <CardTitle>Documents</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                              <Icon name="arrowUp" className="w-4 h-4 mr-2" /> Upload
                          </Button>
                          <input type="file" className="hidden" ref={fileInputRef} onChange={() => push({title: "Uploaded", description: "File uploaded successfully.", variant: "success"})} />
                      </div>
                  </CardHeader>
                  <CardContent>
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                          <Icon name="fileText" className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-500">No files attached yet.</p>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>

      </Tabs>

      {/* EDIT DRAWER */}
      {isEditOpen && (
          <CreateProductModal 
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              product={product}
              onSave={handleSave}
          />
      )}

      {/* DELETE DIALOG */}
      <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
