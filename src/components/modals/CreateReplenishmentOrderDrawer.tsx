
import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Icon } from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { Switch } from '../ui/Switch';
import { useToast } from '../../hooks/use-toast';
import { mockProducts, mockSuppliers, productLocations } from '../../data/inventoryMockData';
import { mockTeamMembers } from '../../data/mockData';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { cn, formatCurrency, getStockStatus } from '../../lib/utils';
import type { Product } from '../../types';
import MultiSelect from '../ui/MultiSelect';

// --- Enterprise Payload Interface ---
export interface ReplenishmentOrderPayload {
  id: string;
  mode: "restock" | "new";

  // Product
  productId: string;
  productName: string;
  sku: string;
  category: string;
  brand: string;

  // Stock
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  moq: number;
  maxStock: number;
  recommendedQty: number;
  avgDailySales: number;

  // Order Details
  requiredQty: number;
  bufferQty: number;
  warehouseId: string;
  storefrontIds: string[];
  expectedDelivery: string;
  reason: string;
  priority: string;

  // Supplier
  supplierId: string;
  supplierName: string;
  leadTime: number;
  shippingMethod: string;

  // Financials
  lastPurchasePrice: number;
  estimatedCost: number;
  tax: number;
  freight: number;
  additionalCharges: number;
  totalEstimatedCost: number;
  paymentTerms: string;
  costCenter: string;

  // Approval
  approvalRequired: boolean;
  approverId: string;
  approvalNotes: string;

  // Audit
  requestedBy: string;
  createdBy: string;
  createdAt: string;

  // Notes + Attachments
  notes: string;
  warehouseNotes: string;
  attachments: string[];
}

interface CreateReplenishmentOrderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null; // If provided, triggers "Restock" mode
  onSave: (order: ReplenishmentOrderPayload) => void;
}

// --- Constants ---
const ORDER_REASONS = ["Low Stock", "Out of Stock", "New Store Requirement", "Safety Stock Fill", "New Launch", "Forecast Demand Increase", "Warehouse Transfer", "Supplier Offer", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const SHIPPING_METHODS = ["Standard Ground", "Express", "Scheduled", "Pickup", "Air Freight"];
const PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "Advance", "Partial Advance"];
const COST_CENTERS = ["CC-101 (Operations)", "CC-205 (Inventory)", "CC-301 (R&D)", "CC-900 (Emergency)"];
const APPROVAL_THRESHOLD = 50000; // Cost above this requires approval

const CreateReplenishmentOrderDrawer: React.FC<CreateReplenishmentOrderDrawerProps> = ({
  open,
  onOpenChange,
  product,
  onSave,
}) => {
  const { toast } = useToast();
  const mode = product ? 'restock' : 'new';

  // --- State ---
  // Identity
  const [orderId, setOrderId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Order Details
  const [requestedBy, setRequestedBy] = useState('');
  const [reason, setReason] = useState('Low Stock');
  const [priority, setPriority] = useState('Medium');
  const [warehouseId, setWarehouseId] = useState('');
  const [storefrontIds, setStorefrontIds] = useState<string[]>([]); 
  const [quantity, setQuantity] = useState<number>(0);
  const [bufferQty, setBufferQty] = useState<number>(0);
  const [deliveryDate, setDeliveryDate] = useState('');

  // Supplier & Logistics
  const [supplierId, setSupplierId] = useState('');
  const [shippingMethod, setShippingMethod] = useState('Standard Ground');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [insuranceRequired, setInsuranceRequired] = useState(false);

  // Financials
  const [unitCost, setUnitCost] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [freightCost, setFreightCost] = useState<number>(0);
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);
  const [costCenter, setCostCenter] = useState('CC-205 (Inventory)');

  // Approval
  const [approverId, setApproverId] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');

  // Notes
  const [purchasingNotes, setPurchasingNotes] = useState('');
  const [warehouseNotes, setWarehouseNotes] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Computed Values ---
  
  // Mock "Avg Daily Sales"
  const avgDailySales = useMemo(() => selectedProduct ? Math.max(1, Math.floor(selectedProduct.totalStock / 20)) : 0, [selectedProduct]);

  // Recommendation Formula: (ReorderLevel - CurrentStock) + SafetyStock
  const recommendedQty = useMemo(() => {
    if (!selectedProduct) return 0;
    const reorderPoint = selectedProduct.stockRules?.reorderPoint || 0;
    const safetyStock = selectedProduct.stockRules?.safetyStock || 0;
    const currentStock = selectedProduct.totalStock || 0;
    
    const need = (reorderPoint - currentStock) + safetyStock;
    return Math.max(0, need);
  }, [selectedProduct]);

  // Financial Totals
  const estimatedPurchaseCost = quantity * unitCost;
  const taxAmount = estimatedPurchaseCost * (taxPercent / 100);
  const totalEstimatedCost = estimatedPurchaseCost + taxAmount + freightCost + additionalCharges;
  const approvalRequired = totalEstimatedCost > APPROVAL_THRESHOLD;

  const stockStatus = useMemo(() => {
    if (!selectedProduct) return { text: 'Unknown', variant: 'gray' };
    return getStockStatus(selectedProduct.totalStock, selectedProduct.stockRules?.lowStockThreshold || 10);
  }, [selectedProduct]);

  // --- Effects ---

  useEffect(() => {
    if (open) {
      // Generate Auto ID: RO-YYYYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setOrderId(`RO-${dateStr}-${randomNum}`);

      // Reset or Pre-fill
      if (product) {
        handleProductSelect(product);
      } else {
        resetForm();
      }
      
      setRequestedBy('TM-802'); // Default to John Smith (mock)
    }
  }, [open, product]);

  const resetForm = () => {
    setSelectedProduct(null);
    setSearchQuery('');
    setReason('Low Stock');
    setPriority('Medium');
    setWarehouseId('');
    setStorefrontIds([]);
    setQuantity(0);
    setBufferQty(0);
    setSupplierId('');
    setUnitCost(0);
    setFreightCost(0);
    setAdditionalCharges(0);
    setPurchasingNotes('');
    setWarehouseNotes('');
    setErrors({});
  };

  const handleProductSelect = (p: Product) => {
    setSelectedProduct(p);
    setSearchQuery(p.name);
    setIsSearchOpen(false);
    
    // Auto-fill
    if (p.supplier?.id) setSupplierId(p.supplier.id);
    
    const defaultWh = p.inventoryByLocation?.find(l => l.type === 'Warehouse')?.locationId || productLocations[0].id;
    setWarehouseId(defaultWh);
    
    // Pre-calc Quantity
    const recQty = Math.max(0, (p.stockRules?.reorderPoint || 0) - (p.stock || 0) + (p.stockRules?.safetyStock || 0));
    const moq = p.supplier?.supplierMOQ || 1;
    setQuantity(Math.max(recQty, moq));
    
    // Cost
    setUnitCost(p.pricing?.cost || 0);

    // Delivery Date
    const lead = p.supplier?.leadTime || 7;
    const target = new Date();
    target.setDate(target.getDate() + lead);
    setDeliveryDate(target.toISOString().split('T')[0]);
  };

  // --- Validation ---
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedProduct) newErrors.product = "Product selection is required.";
    if (!requestedBy) newErrors.requestedBy = "Requester is required.";
    if (!warehouseId) newErrors.warehouse = "Receiving warehouse is required.";
    if (!supplierId) newErrors.supplier = "Supplier is required.";
    if (quantity <= 0) newErrors.quantity = "Quantity must be greater than 0.";
    
    if (selectedProduct) {
         const moq = selectedProduct.supplier?.supplierMOQ || 0;
         if (quantity < moq) newErrors.quantity = `Quantity must be at least MOQ (${moq}).`;
    }

    if (!deliveryDate) newErrors.deliveryDate = "Expected delivery date is required.";
    if (approvalRequired && !approverId) newErrors.approver = "High value orders require an approver.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
        toast({ title: "Validation Failed", description: "Please correct the highlighted errors.", variant: "destructive" });
        return;
    }

    if (!selectedProduct) return;

    const payload: ReplenishmentOrderPayload = {
      id: orderId,
      mode,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      category: selectedProduct.category,
      brand: selectedProduct.brand || '',

      currentStock: selectedProduct.totalStock,
      reorderLevel: selectedProduct.stockRules?.reorderPoint || 0,
      safetyStock: selectedProduct.stockRules?.safetyStock || 0,
      moq: selectedProduct.supplier?.supplierMOQ || 1,
      maxStock: 1000, // Mock max
      recommendedQty,
      avgDailySales,

      requiredQty: quantity,
      bufferQty,
      warehouseId,
      storefrontIds,
      expectedDelivery: deliveryDate,
      reason,
      priority,

      supplierId,
      supplierName: mockSuppliers.find(s => s.id === supplierId)?.name || 'Unknown',
      leadTime: selectedProduct.supplier?.leadTime || 0,
      shippingMethod,

      lastPurchasePrice: selectedProduct.pricing?.cost || 0,
      estimatedCost: estimatedPurchaseCost,
      tax: taxAmount,
      freight: freightCost,
      additionalCharges,
      totalEstimatedCost,
      paymentTerms,
      costCenter,

      approvalRequired,
      approverId,
      approvalNotes,

      requestedBy,
      createdBy: "Current User", // Mock
      createdAt: new Date().toISOString(),

      notes: purchasingNotes,
      warehouseNotes,
      attachments: attachments.map(f => f.name),
    };

    onSave(payload);
    onOpenChange(false);
  };

  // Search Filter
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return mockProducts.slice(0, 10);
    const lower = searchQuery.toLowerCase();
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.sku.toLowerCase().includes(lower)
    );
  }, [searchQuery]);

  const storefrontOptions = productLocations.filter(l => l.id.includes('loc_3')).map(l => l.name); // Mock logic for storefronts

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-full md:w-[1000px] p-0 overflow-hidden rounded-l-3xl border-l bg-white dark:bg-zinc-950" resizable>
        
        {/* HEADER */}
        <DrawerHeader className="border-b border-gray-100 dark:border-zinc-800 px-6 py-5 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0">
          <div className="flex items-center gap-4">
             <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-sm", mode === 'restock' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600")}>
                <Icon name={mode === 'restock' ? "refreshCw" : "plus"} className="w-6 h-6" />
             </div>
             <div>
                <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {mode === 'restock' ? 'Restock Inventory' : 'New Replenishment Order'}
                </DrawerTitle>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    <span className="font-mono bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300">{orderId}</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
             </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
             <Button variant="outline" onClick={() => toast({ title: "Draft Saved", description: "Order saved as draft." })}>Save Draft</Button>
             <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>Submit Order</Button>
          </div>
        </DrawerHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 dark:bg-zinc-950/50 scroll-smooth">
            
            {/* 1. PRODUCT INFO */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                        <Icon name="package" className="w-4 h-4" /> Product Information
                    </h3>
                    
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-1 shadow-sm">
                         {mode === 'restock' ? (
                            <div className="p-4 flex items-start gap-4">
                                <div className="h-16 w-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 border dark:border-zinc-700">
                                    {selectedProduct?.images?.[0] ? (
                                        <img src={selectedProduct.images[0]} alt="" className="h-full w-full object-cover rounded-lg" />
                                    ) : (
                                        <Icon name="image" className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{selectedProduct?.name}</h4>
                                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                                        <span>SKU: <span className="font-mono text-gray-700 dark:text-gray-300">{selectedProduct?.sku}</span></span>
                                        <span>Brand: {selectedProduct?.brand}</span>
                                        <span>Category: {selectedProduct?.category}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4">
                                <Label className={cn("mb-1.5 block", errors.product && "text-red-500")}>Search Product *</Label>
                                <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="relative">
                                            <Input 
                                                placeholder="Type name, SKU or brand..." 
                                                value={searchQuery}
                                                onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                                                onFocus={() => setIsSearchOpen(true)}
                                                className={cn("pl-10", errors.product && "border-red-500 focus-visible:ring-red-500")}
                                            />
                                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[300px] overflow-y-auto" align="start">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((p) => (
                                                <div key={p.id} onClick={() => handleProductSelect(p)} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer flex justify-between items-center border-b last:border-0 dark:border-zinc-800">
                                                    <div>
                                                        <p className="font-medium text-sm">{p.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono">{p.sku}</p>
                                                    </div>
                                                    <Badge variant={p.totalStock === 0 ? 'red' : 'green'} className="text-[10px] h-5">{p.totalStock} in stock</Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                                        )}
                                    </PopoverContent>
                                </Popover>
                                {errors.product && <p className="text-xs text-red-500 mt-1">{errors.product}</p>}
                            </div>
                        )}

                        {selectedProduct && (
                            <div className="grid grid-cols-4 gap-px bg-gray-100 dark:bg-zinc-800 border-t dark:border-zinc-800">
                                <div className="bg-white dark:bg-zinc-900 p-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Current Stock</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold">{selectedProduct.totalStock}</span>
                                        <Badge variant={stockStatus.variant as any} className="text-[10px] h-5 px-1.5">{stockStatus.text}</Badge>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 p-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Reorder / Safety</p>
                                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                        {selectedProduct.stockRules?.reorderPoint} <span className="text-gray-400">/</span> {selectedProduct.stockRules?.safetyStock}
                                    </span>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 p-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Avg Daily Sales</p>
                                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">~{avgDailySales}</span>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 p-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Max Stock</p>
                                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">1000</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-4">
                     <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                        <Icon name="activity" className="w-4 h-4" /> Quick Stats
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Recommended Qty</span>
                            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{recommendedQty}</span>
                        </div>
                        <div className="h-px bg-blue-200 dark:bg-blue-800"></div>
                        <div className="flex justify-between items-center text-sm">
                             <span className="text-blue-600 dark:text-blue-400">Last Vendor</span>
                             <span className="font-medium text-blue-800 dark:text-blue-200">{selectedProduct?.supplier?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                             <span className="text-blue-600 dark:text-blue-400">Last Price</span>
                             <span className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(selectedProduct?.pricing?.cost || 0)}</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-blue-600 dark:text-blue-400">Lead Time</span>
                             <span className="font-medium text-blue-800 dark:text-blue-200">{selectedProduct?.supplier?.leadTime || '-'} Days</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ORDER DETAILS */}
            <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                    <Icon name="fileText" className="w-4 h-4" /> Order Specification
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                         <Label className={cn(errors.requestedBy && "text-red-500")}>Requested By *</Label>
                         <Select value={requestedBy} onValueChange={setRequestedBy}>
                             <SelectTrigger className={cn(errors.requestedBy && "border-red-500")}><SelectValue placeholder="Select Employee" /></SelectTrigger>
                             <SelectContent>
                                 {mockTeamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                             </SelectContent>
                         </Select>
                         {errors.requestedBy && <p className="text-xs text-red-500">{errors.requestedBy}</p>}
                    </div>
                    <div className="space-y-2">
                         <Label>Order Reason</Label>
                         <Select value={reason} onValueChange={setReason}>
                             <SelectTrigger><SelectValue /></SelectTrigger>
                             <SelectContent>
                                 {ORDER_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                             </SelectContent>
                         </Select>
                    </div>
                    <div className="space-y-2">
                         <Label>Priority</Label>
                         <Select value={priority} onValueChange={setPriority}>
                             <SelectTrigger><SelectValue /></SelectTrigger>
                             <SelectContent>
                                 {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                             </SelectContent>
                         </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className={cn(errors.warehouse && "text-red-500")}>Destination Warehouse *</Label>
                        <Select value={warehouseId} onValueChange={setWarehouseId}>
                            <SelectTrigger className={cn(errors.warehouse && "border-red-500")}><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                            <SelectContent>
                                {productLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.warehouse && <p className="text-xs text-red-500">{errors.warehouse}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Storefronts (Optional)</Label>
                        <MultiSelect 
                            options={storefrontOptions}
                            value={storefrontIds}
                            onChange={setStorefrontIds}
                            placeholder="Select Storefronts"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={cn(errors.deliveryDate && "text-red-500")}>Expected Delivery *</Label>
                        <Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className={cn(errors.deliveryDate && "border-red-500")} />
                        {errors.deliveryDate && <p className="text-xs text-red-500">{errors.deliveryDate}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="space-y-2">
                        <Label className={cn(errors.quantity && "text-red-500")}>Required Qty *</Label>
                        <Input 
                            type="number" 
                            value={quantity} 
                            onChange={e => setQuantity(Number(e.target.value))} 
                            className={cn("font-bold", errors.quantity && "border-red-500")}
                        />
                        {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
                     </div>
                     <div className="space-y-2">
                        <Label>Buffer Qty</Label>
                        <Input type="number" value={bufferQty} onChange={e => setBufferQty(Number(e.target.value))} placeholder="0" />
                     </div>
                     <div className="space-y-2">
                         <Label>UOM</Label>
                         <Input value={selectedProduct?.unitOfMeasurement || 'Piece'} disabled className="bg-gray-50 dark:bg-zinc-800 text-gray-500" />
                     </div>
                     <div className="space-y-2">
                         <Label>MOQ</Label>
                         <Input value={selectedProduct?.supplier?.supplierMOQ || 1} disabled className="bg-gray-50 dark:bg-zinc-800 text-gray-500" />
                     </div>
                </div>
            </section>

            {/* 3. FINANCIALS & LOGISTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financials */}
                <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
                     <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                        <Icon name="dollarSign" className="w-4 h-4" /> Financial Details
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Unit Cost</Label>
                            <Input type="number" value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} className="w-32 text-right" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Tax %</Label>
                            <Input type="number" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))} className="w-32 text-right" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Freight / Shipping</Label>
                            <Input type="number" value={freightCost} onChange={e => setFreightCost(Number(e.target.value))} className="w-32 text-right" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Additional Charges</Label>
                            <Input type="number" value={additionalCharges} onChange={e => setAdditionalCharges(Number(e.target.value))} className="w-32 text-right" />
                        </div>
                        
                        <div className="border-t dark:border-zinc-800 pt-3 flex items-center justify-between">
                            <span className="font-bold text-gray-900 dark:text-gray-100">Total Estimated Cost</span>
                            <span className="text-xl font-bold text-green-600">{formatCurrency(totalEstimatedCost)}</span>
                        </div>

                         <div className="grid grid-cols-2 gap-4 pt-2">
                             <div className="space-y-1.5">
                                <Label>Budget Code</Label>
                                <Select value={costCenter} onValueChange={setCostCenter}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{COST_CENTERS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                             </div>
                             <div className="space-y-1.5">
                                <Label>Payment Terms</Label>
                                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{PAYMENT_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                </Select>
                             </div>
                         </div>
                    </div>
                </section>

                {/* Logistics */}
                <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
                     <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                        <Icon name="package" className="w-4 h-4" /> Supplier & Logistics
                    </h3>
                    
                    <div className="space-y-4">
                         <div className="space-y-1.5">
                             <Label className={cn(errors.supplier && "text-red-500")}>Supplier *</Label>
                             <Select value={supplierId} onValueChange={setSupplierId}>
                                <SelectTrigger className={cn(errors.supplier && "border-red-500")}><SelectValue placeholder="Select Supplier" /></SelectTrigger>
                                <SelectContent>{mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                             </Select>
                             {errors.supplier && <p className="text-xs text-red-500">{errors.supplier}</p>}
                         </div>
                         <div className="space-y-1.5">
                             <Label>Shipping Method</Label>
                             <Select value={shippingMethod} onValueChange={setShippingMethod}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{SHIPPING_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                             </Select>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                 <Label>Preferred Transporter</Label>
                                 <Input placeholder="e.g. FedEx" />
                             </div>
                              <div className="space-y-1.5">
                                 <Label>Import/Export Code</Label>
                                 <Input placeholder="Optional" />
                             </div>
                         </div>
                         
                         <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                             <Label className="cursor-pointer" htmlFor="insurance">Transit Insurance Required</Label>
                             <Switch id="insurance" checked={insuranceRequired} onClick={() => setInsuranceRequired(!insuranceRequired)} />
                         </div>
                         
                         <div className="space-y-1.5">
                             <Label>Packaging Requirements</Label>
                             <Input placeholder="e.g. Palletized, Double Box" />
                         </div>
                    </div>
                </section>
            </div>

            {/* 4. APPROVAL WORKFLOW (Conditional) */}
            {approvalRequired && (
                 <section className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-900/50 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-500 mb-2">
                        <Icon name="alertTriangle" className="w-5 h-5" />
                        <h3 className="font-bold text-sm uppercase tracking-wider">Approval Required</h3>
                    </div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                        The estimated cost exceeds <strong>{formatCurrency(APPROVAL_THRESHOLD)}</strong>. Manager approval is required before processing.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className={errors.approver ? "text-red-500" : ""}>Approver *</Label>
                            <Select value={approverId} onValueChange={setApproverId}>
                                <SelectTrigger className={cn("bg-white dark:bg-zinc-900", errors.approver && "border-red-500")}><SelectValue placeholder="Select Manager" /></SelectTrigger>
                                <SelectContent>
                                    {mockTeamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.role || 'Staff'})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.approver && <p className="text-xs text-red-500">{errors.approver}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Approval Notes</Label>
                            <Input value={approvalNotes} onChange={e => setApprovalNotes(e.target.value)} placeholder="Reason for high value order..." className="bg-white dark:bg-zinc-900" />
                        </div>
                    </div>
                 </section>
            )}

            {/* 5. NOTES & ATTACHMENTS */}
            <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
                 <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                    <Icon name="paperclip" className="w-4 h-4" /> Internal Notes & Docs
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Purchasing Team Notes</Label>
                        <Textarea value={purchasingNotes} onChange={e => setPurchasingNotes(e.target.value)} className="min-h-[100px]" placeholder="Internal comments..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Warehouse Instructions</Label>
                        <Textarea value={warehouseNotes} onChange={e => setWarehouseNotes(e.target.value)} className="min-h-[100px]" placeholder="Receiving instructions..." />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Attachments</Label>
                    <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                        <Icon name="paperclip" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Drag and drop files here, or click to browse (Quotes, Invoices, Specs)</p>
                        <input type="file" className="hidden" multiple onChange={(e) => {
                            if(e.target.files) setAttachments([...attachments, ...Array.from(e.target.files)]);
                        }} />
                    </div>
                    {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {attachments.map((f, i) => (
                                <Badge key={i} variant="secondary" className="gap-2 pr-1">
                                    {f.name} <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}><Icon name="close" className="w-3 h-3" /></button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </div>

        {/* Footer */}
        <DrawerFooter className="flex flex-row justify-end gap-3 border-t border-gray-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-900 shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-24">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-6 shadow-sm">
                <Icon name="check" className="w-4 h-4 mr-2" />
                Submit Order
            </Button>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  );
};

export default CreateReplenishmentOrderDrawer;
