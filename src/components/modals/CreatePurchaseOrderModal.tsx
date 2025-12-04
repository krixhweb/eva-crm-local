
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { mockSuppliers } from '../../data/inventoryMockData';
import { mockProducts } from '../../data/inventoryMockData';
import type { PurchaseOrder, PurchaseOrderItem, Product, Address, Attachment } from '../../types';
import { DatePicker } from '../ui/DatePicker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Icon } from '../shared/Icon';
import { formatCurrency, cn } from '../../lib/utils';
import { useGlassyToasts } from '../ui/GlassyToastProvider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

interface CreatePurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (po: PurchaseOrder) => void;
}

const STATUSES = ["Draft", "Created", "Approved", "Ordered", "Delivered", "Closed", "Cancelled"];
const PRIORITIES = ["Low", "Medium", "High"];
const CARRIERS = ["FedEx", "DHL", "UPS", "BlueDart", "Delhivery", "Truck Freight"];
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt", "Cash on Delivery"];
const WAREHOUSES = ["Warehouse A", "Warehouse B", "Storefront", "Drop Ship"];

// Mock Addresses for Auto-fill
const VENDOR_ADDRESS_MOCK: Address = {
    street: "123 Vendor Lane, Industrial Area",
    city: "Pune",
    state: "MH",
    postalCode: "411057",
    country: "India"
};

const MY_BILLING_ADDRESS: Address = {
    street: "45 Corporate Park, Sector 62",
    city: "Noida",
    state: "UP",
    postalCode: "201301",
    country: "India"
};

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({ isOpen, onClose, onSave }) => {
    const { push } = useGlassyToasts();
    const [activeTab, setActiveTab] = useState("items");

    // --- Header Info ---
    const [poNumber, setPoNumber] = useState("");
    const [poDate, setPoDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [expectedDate, setExpectedDate] = useState<string>("");
    const [reference, setReference] = useState("");
    const [status, setStatus] = useState("Draft");
    const [priority, setPriority] = useState("Medium");
    const [paymentTerms, setPaymentTerms] = useState("Net 30");

    // --- Vendor Info ---
    const [vendorId, setVendorId] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [vendorEmail, setVendorEmail] = useState("");

    // --- Addresses ---
    const [billingAddress, setBillingAddress] = useState<Address>(MY_BILLING_ADDRESS);
    const [shippingAddress, setShippingAddress] = useState<Address>(MY_BILLING_ADDRESS);

    // --- Items ---
    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [globalDiscount, setGlobalDiscount] = useState<number>(0);
    const [globalDiscountType, setGlobalDiscountType] = useState<'percent' | 'fixed'>('fixed');
    const [shippingCharges, setShippingCharges] = useState<number>(0);
    const [adjustments, setAdjustments] = useState<number>(0);

    // --- Logistics & Other ---
    const [carrier, setCarrier] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [terms, setTerms] = useState("Standard Terms: Goods must meet quality standards. Payment within agreed terms.");
    const [notes, setNotes] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Initialization ---
    useEffect(() => {
        if (isOpen) {
            setPoNumber(`PO-${Date.now().toString().slice(-6)}`);
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setExpectedDate(nextWeek.toISOString().split('T')[0]);
        }
    }, [isOpen]);

    // --- Auto-fill Vendor Details ---
    const handleVendorChange = (id: string) => {
        setVendorId(id);
        const vendor = mockSuppliers.find(s => s.id === id);
        if (vendor) {
            setContactPerson("John Doe (Mock)"); // In real app, fetch from vendor
            setVendorEmail("orders@vendor.com");
            // Simulate vendor address autofill (usually separate from shipping/billing of us)
        }
    };

    const copyBillingToShipping = () => {
        setShippingAddress({ ...billingAddress });
        push({ title: "Copied", description: "Billing address copied to shipping.", variant: "info" });
    };

    // --- Item Logic ---
    const addItem = () => {
        const newItem: PurchaseOrderItem = {
            id: `item-${Date.now()}`,
            productId: "",
            productName: "",
            sku: "",
            quantity: 1,
            unitPrice: 0,
            taxRate: 0,
            discountPercent: 0,
            warehouseId: "Warehouse A",
            total: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: string, field: keyof PurchaseOrderItem, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                // Auto-calc logic
                const qty = field === 'quantity' ? Number(value) : item.quantity;
                const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
                const discPct = field === 'discountPercent' ? Number(value) : item.discountPercent;
                const taxRate = field === 'taxRate' ? Number(value) : item.taxRate;

                const grossAmount = qty * price;
                const discountAmount = grossAmount * (discPct / 100);
                const taxableAmount = grossAmount - discountAmount;
                const taxAmount = taxableAmount * (taxRate / 100);
                const total = taxableAmount + taxAmount;

                return { ...updated, total };
            }
            return item;
        }));
    };

    const selectProduct = (itemId: string, product: Product) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const price = product.pricing.cost || 0;
                const tax = product.pricing.taxRate || 18;
                
                // Initial Calc
                const grossAmount = 1 * price;
                const taxAmount = grossAmount * (tax / 100);
                const total = grossAmount + taxAmount;

                return {
                    ...item,
                    productId: product.id,
                    productName: product.name,
                    sku: product.sku,
                    vendorSku: product.supplier?.supplierSKU,
                    unitPrice: price,
                    taxRate: tax,
                    quantity: 1,
                    image: product.images?.[0],
                    category: product.category,
                    stock: product.totalStock,
                    total: total
                };
            }
            return item;
        }));
    };

    // --- Financial Calculations ---
    const financials = useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const itemLevelDiscount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.discountPercent/100)), 0);
        
        let globalDiscAmount = 0;
        if (globalDiscountType === 'fixed') {
            globalDiscAmount = globalDiscount;
        } else {
            globalDiscAmount = (subtotal - itemLevelDiscount) * (globalDiscount / 100);
        }

        const taxableTotal = subtotal - itemLevelDiscount - globalDiscAmount;
        
        // Simplification: Tax calculated on the aggregated taxable amount for display, 
        // though technically it's per item.
        const taxTotal = items.reduce((sum, item) => {
            const itemTaxable = (item.quantity * item.unitPrice) * (1 - item.discountPercent/100);
            // Distribute global discount proportionally or just calculate tax on item line? 
            // Standard is tax on line item. Global discount usually applies before tax if trade discount, or after if cash discount.
            // Let's assume it reduces taxable value.
            return sum + (itemTaxable * (item.taxRate / 100));
        }, 0);

        const grandTotal = taxableTotal + taxTotal + Number(shippingCharges) + Number(adjustments);

        return { subtotal, itemLevelDiscount, globalDiscAmount, taxTotal, grandTotal };
    }, [items, globalDiscount, globalDiscountType, shippingCharges, adjustments]);

    // --- Handlers ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).map((f: any) => ({
                name: f.name,
                url: URL.createObjectURL(f)
            }));
            setAttachments([...attachments, ...files]);
        }
    };

    const handleSave = () => {
        if (!vendorId) {
            push({ title: "Validation Error", description: "Please select a vendor.", variant: "error" });
            return;
        }
        if (items.length === 0) {
            push({ title: "Validation Error", description: "Please add at least one item.", variant: "error" });
            return;
        }

        const supplierName = mockSuppliers.find(s => s.id === vendorId)?.name || "Unknown";

        const newPO: PurchaseOrder = {
            id: poNumber,
            supplierName,
            supplierId: vendorId,
            createdDate: poDate,
            expectedDelivery: expectedDate,
            status: status as any,
            priority: priority as any,
            totalCost: financials.grandTotal,
            items,
            billingAddress,
            shippingAddress,
            referenceNumber: reference,
            paymentTerms,
            carrier,
            trackingNumber,
            subtotal: financials.subtotal,
            taxTotal: financials.taxTotal,
            discountTotal: financials.itemLevelDiscount + financials.globalDiscAmount,
            shippingCharges,
            adjustments,
            notes,
            terms,
            documents: attachments
        };

        onSave(newPO);
        push({ title: "Success", description: `Purchase Order ${poNumber} saved.`, variant: "success" });
        onClose();
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="w-full md:w-[95vw] max-w-[1400px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl h-[95vh] md:h-screen" resizable>
                
                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                            <Icon name="shoppingCart" className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">New Purchase Order</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Create a new procurement order for your vendors.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right mr-4 hidden sm:block">
                            <p className="text-xs text-gray-500 uppercase font-bold">Grand Total</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(financials.grandTotal)}</p>
                        </div>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]" onClick={handleSave}>
                            <Icon name="check" className="w-4 h-4 mr-2" /> Save Order
                        </Button>
                    </div>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-zinc-950/50">
                    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
                        
                        {/* SECTION 1: VENDOR & PO DETAILS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* VENDOR CARD */}
                            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-2">Vendor Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="mb-1.5 block">Vendor Name <span className="text-red-500">*</span></Label>
                                        <Select value={vendorId} onValueChange={handleVendorChange}>
                                            <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                                            <SelectContent>
                                                {mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                                <div className="p-2 border-t dark:border-zinc-700">
                                                    <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600 h-8">
                                                        <Icon name="plus" className="w-3 h-3 mr-2" /> Create New Vendor
                                                    </Button>
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {vendorId && (
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-sm space-y-1 animate-in fade-in">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{contactPerson}</p>
                                            <p className="text-gray-500">{VENDOR_ADDRESS_MOCK.street}, {VENDOR_ADDRESS_MOCK.city}</p>
                                            <p className="text-blue-500 text-xs cursor-pointer hover:underline">View Vendor Profile</p>
                                        </div>
                                    )}
                                    <div>
                                        <Label className="mb-1.5 block">Reference #</Label>
                                        <Input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. REF-2024-001" />
                                    </div>
                                </div>
                            </div>

                            {/* PO INFO CARD */}
                            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-4">Order Information</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-1.5">
                                        <Label>PO Number</Label>
                                        <Input value={poNumber} onChange={e => setPoNumber(e.target.value)} className="font-mono" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>PO Date</Label>
                                        <Input type="date" value={poDate} onChange={e => setPoDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Exp. Delivery</Label>
                                        <Input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Payment Terms</Label>
                                        <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{PAYMENT_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Status</Label>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Priority</Label>
                                        <Select value={priority} onValueChange={setPriority}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TABS FOR DETAILS */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="flex items-center justify-between mb-4">
                                <TabsList className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-1 h-auto rounded-lg">
                                    <TabsTrigger value="items" className="px-4 py-2 text-sm data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-zinc-800">Items & Cost</TabsTrigger>
                                    <TabsTrigger value="logistics" className="px-4 py-2 text-sm data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-zinc-800">Logistics & Addresses</TabsTrigger>
                                    <TabsTrigger value="other" className="px-4 py-2 text-sm data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-zinc-800">Terms & Docs</TabsTrigger>
                                </TabsList>
                            </div>

                            {/* TAB 1: ITEMS */}
                            <TabsContent value="items" className="mt-0 space-y-6">
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-gray-50 dark:bg-zinc-800/50">
                                                <TableRow>
                                                    <TableHead className="w-[50px]">#</TableHead>
                                                    <TableHead className="min-w-[250px]">Item Details</TableHead>
                                                    <TableHead className="w-[140px]">Warehouse</TableHead>
                                                    <TableHead className="w-[100px] text-right">Qty</TableHead>
                                                    <TableHead className="w-[120px] text-right">Rate</TableHead>
                                                    <TableHead className="w-[100px] text-right">Disc (%)</TableHead>
                                                    <TableHead className="w-[100px] text-right">Tax (%)</TableHead>
                                                    <TableHead className="w-[140px] text-right">Amount</TableHead>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {items.map((item, index) => (
                                                    <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20">
                                                        <TableCell className="text-gray-500">{index + 1}</TableCell>
                                                        <TableCell>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <div className="flex items-center gap-3 cursor-pointer group">
                                                                        <div className="h-10 w-10 rounded border bg-gray-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                                                            {item.image ? (
                                                                                <img src={item.image} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <Icon name="image" className="h-4 w-4 text-gray-400" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            {item.productName ? (
                                                                                <>
                                                                                    <p className="font-medium text-sm truncate text-blue-600 group-hover:underline">{item.productName}</p>
                                                                                    <p className="text-[10px] text-gray-500">SKU: {item.sku}</p>
                                                                                </>
                                                                            ) : (
                                                                                <p className="text-sm text-gray-400 italic">Select a product...</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[300px] p-0" align="start">
                                                                    <div className="max-h-64 overflow-y-auto p-1">
                                                                        {mockProducts.map(p => (
                                                                            <div key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer rounded-sm" onClick={() => selectProduct(item.id, p)}>
                                                                                <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center shrink-0">{p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover rounded"/> : <Icon name="box" className="h-4 w-4"/>}</div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm font-medium truncate">{p.name}</p>
                                                                                    <p className="text-xs text-gray-500">{p.sku} • Stock: {p.stock}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select value={item.warehouseId} onValueChange={(v) => updateItem(item.id, 'warehouseId', v)}>
                                                                <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                                                                <SelectContent>
                                                                    {WAREHOUSES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell><Input type="number" className="h-8 text-right" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} /></TableCell>
                                                        <TableCell><Input type="number" className="h-8 text-right" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', e.target.value)} /></TableCell>
                                                        <TableCell><Input type="number" className="h-8 text-right" value={item.discountPercent} onChange={e => updateItem(item.id, 'discountPercent', e.target.value)} /></TableCell>
                                                        <TableCell><Input type="number" className="h-8 text-right" value={item.taxRate} onChange={e => updateItem(item.id, 'taxRate', e.target.value)} /></TableCell>
                                                        <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeItem(item.id)}>
                                                                <Icon name="close" className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={9} className="p-2">
                                                        <Button variant="ghost" size="sm" className="w-full border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={addItem}>
                                                            <Icon name="plus" className="w-4 h-4 mr-2" /> Add Line Item
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                
                                {/* FINANCIAL SUMMARY */}
                                <div className="flex justify-end">
                                    <div className="w-full lg:w-1/3 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                            <span className="font-medium">{formatCurrency(financials.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Item Discounts</span>
                                            <span className="text-red-500">- {formatCurrency(financials.itemLevelDiscount)}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between gap-4 py-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Global Discount</span>
                                                <div className="flex bg-gray-100 dark:bg-zinc-800 rounded p-0.5">
                                                    <button onClick={() => setGlobalDiscountType('fixed')} className={cn("text-[10px] px-1.5 rounded", globalDiscountType === 'fixed' ? 'bg-white shadow text-black' : 'text-gray-500')}>₹</button>
                                                    <button onClick={() => setGlobalDiscountType('percent')} className={cn("text-[10px] px-1.5 rounded", globalDiscountType === 'percent' ? 'bg-white shadow text-black' : 'text-gray-500')}>%</button>
                                                </div>
                                            </div>
                                            <Input 
                                                type="number" 
                                                className="h-7 w-20 text-right text-xs" 
                                                value={globalDiscount} 
                                                onChange={e => setGlobalDiscount(Number(e.target.value))} 
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-400 text-xs">
                                            <span>Applied Discount</span>
                                            <span>- {formatCurrency(financials.globalDiscAmount)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Total Tax</span>
                                            <span>{formatCurrency(financials.taxTotal)}</span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 py-1">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Shipping Charges</span>
                                            <Input type="number" className="h-7 w-24 text-right text-xs" value={shippingCharges} onChange={e => setShippingCharges(Number(e.target.value))} />
                                        </div>
                                        <div className="flex items-center justify-between gap-4 py-1">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Adjustments</span>
                                            <Input type="number" className="h-7 w-24 text-right text-xs" value={adjustments} onChange={e => setAdjustments(Number(e.target.value))} placeholder="+/-" />
                                        </div>

                                        <div className="border-t dark:border-zinc-800 pt-3 mt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-bold">Grand Total</span>
                                                <span className="text-xl font-bold text-blue-600">{formatCurrency(financials.grandTotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB 2: LOGISTICS & ADDRESSES */}
                            <TabsContent value="logistics" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                        <div className="flex justify-between items-center border-b dark:border-zinc-800 pb-2">
                                            <h4 className="font-semibold text-sm">Billing Address</h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <Input placeholder="Street" value={billingAddress.street} onChange={e => setBillingAddress({...billingAddress, street: e.target.value})} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input placeholder="City" value={billingAddress.city} onChange={e => setBillingAddress({...billingAddress, city: e.target.value})} />
                                                <Input placeholder="State" value={billingAddress.state} onChange={e => setBillingAddress({...billingAddress, state: e.target.value})} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input placeholder="Zip Code" value={billingAddress.postalCode} onChange={e => setBillingAddress({...billingAddress, postalCode: e.target.value})} />
                                                <Input placeholder="Country" value={billingAddress.country} onChange={e => setBillingAddress({...billingAddress, country: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                        <div className="flex justify-between items-center border-b dark:border-zinc-800 pb-2">
                                            <h4 className="font-semibold text-sm">Shipping Address</h4>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600" onClick={copyBillingToShipping}>Copy Billing</Button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <Input placeholder="Street" value={shippingAddress.street} onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input placeholder="City" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
                                                <Input placeholder="State" value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input placeholder="Zip Code" value={shippingAddress.postalCode} onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})} />
                                                <Input placeholder="Country" value={shippingAddress.country} onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                    <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-2">Logistics Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1.5">
                                            <Label>Carrier</Label>
                                            <Select value={carrier} onValueChange={setCarrier}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>{CARRIERS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Tracking Number</Label>
                                            <Input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-4 pt-6">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="partial" className="rounded border-gray-300" />
                                                <Label htmlFor="partial" className="font-normal cursor-pointer">Allow Partial Delivery</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="dropship" className="rounded border-gray-300" />
                                                <Label htmlFor="dropship" className="font-normal cursor-pointer">Drop Ship</Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB 3: TERMS & DOCS */}
                            <TabsContent value="other" className="mt-0 space-y-6">
                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Terms & Conditions</Label>
                                        <Select onValueChange={(v) => setTerms(v)}>
                                            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Insert Template" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Standard Terms: Goods must meet quality standards. Payment within agreed terms.">Standard</SelectItem>
                                                <SelectItem value="Urgent Delivery: Penalty applies for late delivery.">Urgent Delivery</SelectItem>
                                                <SelectItem value="International: Incoterms 2020 apply.">International</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Textarea className="min-h-[100px]" value={terms} onChange={e => setTerms(e.target.value)} />
                                    
                                    <Label className="mt-4 block">Internal Notes</Label>
                                    <Textarea className="min-h-[80px]" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Private notes for the team..." />
                                </div>

                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                    <Label>Attachments</Label>
                                    <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <Icon name="paperclip" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Click to upload purchase requisition, quotes, or specs (Max 10 files)</p>
                                        <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                    </div>
                                    {attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {attachments.map((file, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded border dark:border-zinc-700">
                                                    <span className="text-sm truncate">{file.name}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}>
                                                        <Icon name="close" className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* FOOTER */}
                <DrawerFooter className="flex flex-row justify-end gap-3 border-t border-gray-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-900 shrink-0">
                     {/* Mobile Actions (duplicate of header for accessibility on small screens) */}
                     <div className="flex md:hidden w-full gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button className="flex-1 bg-blue-600 text-white" onClick={handleSave}>Save</Button>
                     </div>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    );
};

export default CreatePurchaseOrderModal;
