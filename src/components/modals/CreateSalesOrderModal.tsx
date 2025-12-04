
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Icon } from '../shared/Icon';
import { Switch } from '../ui/Switch';
import { formatCurrency, cn } from '../../lib/utils';
import { mockCustomers } from '../../data/mockData';
import { mockProducts } from '../../data/inventoryMockData';
import type { Customer, Product, SalesOrder, Address } from '../../types';
import { CustomerAutocomplete } from '../modals/Autocomplete';
import { useGlassyToasts } from '../../components/ui/GlassyToastProvider';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';

interface LineItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  image?: string;
  price: number;
  quantity: number;
  taxRate: number;
  total: number;
}

interface SalesOrderState {
  owner: string;
  subject: string;
  dueDate: Date | undefined;
  contactName: string;
  status: string;
  carrier: string;
}

interface CreateSalesOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: SalesOrder) => void;
  initialData?: Partial<SalesOrder>;
}

export default function CreateSalesOrderModal({ isOpen, onClose, onSave, initialData }: CreateSalesOrderProps) {
  const { push } = useGlassyToasts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE: Customer ---
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // --- STATE: Order Info ---
  const [orderInfo, setOrderInfo] = useState<SalesOrderState>({
    owner: "Current User",
    subject: "",
    dueDate: new Date(),
    contactName: "",
    status: "Draft",
    carrier: "",
  });

  // --- STATE: Addresses ---
  const [billingAddress, setBillingAddress] = useState<Address>({ street: '', city: '', state: '', postalCode: '', country: '' });
  const [shippingAddress, setShippingAddress] = useState<Address>({ street: '', city: '', state: '', postalCode: '', country: '' });
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(false);

  // --- STATE: Products ---
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  
  // --- STATE: Summary ---
  const [discount, setDiscount] = useState<number | string>(0);
  const [shippingCharges, setShippingCharges] = useState<number | string>(0);
  const [notes, setNotes] = useState("");

  // --- STATE: Validation Errors ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync customer address when selected
  useEffect(() => {
    if (selectedCustomer) {
      setOrderInfo(prev => ({ ...prev, contactName: selectedCustomer.name }));
      setBillingAddress({
        street: selectedCustomer.address.street,
        city: selectedCustomer.address.city,
        state: selectedCustomer.address.state,
        postalCode: selectedCustomer.address.postalCode,
        country: 'India' // Default for mock
      });
      if (errors.customer) setErrors(prev => ({ ...prev, customer: '' }));
    }
  }, [selectedCustomer]);

  // Sync Shipping with Billing if toggle is active
  useEffect(() => {
    if (isShippingSameAsBilling) {
      setShippingAddress(billingAddress);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.shippingStreet;
        delete newErrors.shippingCity;
        delete newErrors.shippingProvince;
        delete newErrors.shippingPostalCode;
        delete newErrors.shippingCountry;
        return newErrors;
      });
    }
  }, [billingAddress, isShippingSameAsBilling]);

  // --- CALCULATIONS ---

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxTotal = lineItems.reduce((acc, item) => acc + ((item.price * item.quantity) * (item.taxRate / 100)), 0);
    const numDiscount = Number(discount) || 0;
    const numShipping = Number(shippingCharges) || 0;
    const preTotal = subtotal + taxTotal + numShipping - numDiscount;
    const grandTotal = Math.max(0, preTotal); 

    return { subtotal, taxTotal, grandTotal, numDiscount, numShipping };
  }, [lineItems, discount, shippingCharges]);

  // --- VALIDATION ---
  const validate = (mode: 'draft' | 'full') => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!selectedCustomer) { newErrors.customer = "Customer is required."; isValid = false; }
    if (!orderInfo.subject.trim()) { newErrors.subject = "Subject is required."; isValid = false; }
    if (lineItems.length === 0) { newErrors.lineItems = "At least one product is required."; isValid = false; }

    if (mode === 'full') {
        if (!orderInfo.dueDate) { newErrors.dueDate = "Due Date is required."; isValid = false; }
        else if (new Date(orderInfo.dueDate) < new Date(new Date().setHours(0,0,0,0))) { newErrors.dueDate = "Due Date cannot be in the past."; isValid = false; }

        if (!orderInfo.status) { newErrors.status = "Status is required."; isValid = false; }
        if (orderInfo.status === 'Confirmed' && !orderInfo.carrier) { newErrors.carrier = "Carrier is required for confirmed orders."; isValid = false; }

        lineItems.forEach((item) => {
            if (!item.productId || item.price <= 0 || item.quantity < 1) { newErrors.lineItems = "Invalid line items."; isValid = false; }
        });

        // Billing Address
        if (!billingAddress.street.trim()) newErrors.billingStreet = "Street is required.";
        if (!billingAddress.city.trim()) newErrors.billingCity = "City is required.";
        if (!billingAddress.state.trim()) newErrors.billingProvince = "State is required.";
        if (!billingAddress.postalCode.trim()) newErrors.billingPostalCode = "Zip Code is required.";
        if (!billingAddress.country.trim()) newErrors.billingCountry = "Country is required.";

        // Shipping Address
        if (!isShippingSameAsBilling) {
            if (!shippingAddress.street.trim()) newErrors.shippingStreet = "Street is required.";
            if (!shippingAddress.city.trim()) newErrors.shippingCity = "City is required.";
            if (!shippingAddress.state.trim()) newErrors.shippingProvince = "State is required.";
            if (!shippingAddress.postalCode.trim()) newErrors.shippingPostalCode = "Zip Code is required.";
            if (!shippingAddress.country.trim()) newErrors.shippingCountry = "Country is required.";
        }
        
        if (Object.keys(newErrors).filter(k => k.startsWith('billing') || k.startsWith('shipping')).length > 0) isValid = false;
        if (Number(shippingCharges) < 0) isValid = false; 
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- HANDLERS ---

  const addLineItem = () => {
    const newItem: LineItem = { id: Math.random().toString(36).substr(2, 9), productId: "", name: "", sku: "", price: 0, quantity: 1, taxRate: 0, total: 0 };
    setLineItems([...lineItems, newItem]);
    if (errors.lineItems) setErrors(prev => ({ ...prev, lineItems: '' }));
  };

  const removeLineItem = (id: string) => setLineItems(lineItems.filter(item => item.id !== id));

  const calculateRowTotal = (price: number, qty: number, tax: number) => {
      const base = price * qty;
      return base + (base * (tax / 100));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'price' || field === 'quantity' || field === 'taxRate') {
           const p = field === 'price' ? Number(value) : item.price;
           const q = field === 'quantity' ? Number(value) : item.quantity;
           const t = field === 'taxRate' ? Number(value) : item.taxRate;
           updated.total = calculateRowTotal(p, q, t);
        }
        return updated;
      }
      return item;
    }));
  };

  const selectProduct = (id: string, product: Product) => {
    const taxRate = 18; 
    setLineItems(prev => prev.map(item => {
        if (item.id === id) {
            return {
                ...item, productId: product.id, name: product.name, sku: product.sku, image: product.images[0], price: product.sellingPrice, quantity: 1, taxRate: taxRate, total: calculateRowTotal(product.sellingPrice, 1, taxRate)
            };
        }
        return item;
    }));
  };

  const handleSave = async (mode: 'draft' | 'full') => {
    if (!validate(mode)) {
        push({ title: "Validation Error", description: "Please check required fields.", variant: "error" });
        return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const newOrder: SalesOrder = {
      id: initialData?.id || `SO-${Date.now().toString().slice(-6)}`,
      customerName: selectedCustomer!.name,
      orderDate: new Date().toISOString().split('T')[0],
      itemCount: lineItems.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: totals.subtotal,
      taxes: totals.taxTotal,
      totalAmount: totals.grandTotal,
      status: mode === 'draft' ? 'Draft' : (orderInfo.status as any),
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
      carrier: orderInfo.carrier,
      // Add items to the object
      items: lineItems.map(li => ({
        id: li.id,
        name: li.name,
        sku: li.sku,
        quantity: li.quantity,
        price: li.price,
        total: li.total
      }))
    };
    if (onSave) onSave(newOrder);
    push({ title: mode === 'draft' ? "Draft Saved" : "Order Created", description: mode === 'draft' ? "Sales order saved as draft." : "Sales order has been successfully created.", variant: "success" });
    setIsSubmitting(false);
    if (onClose) onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
      
        {/* --- 1. HEADER --- */}
        <DrawerHeader className="border-b px-6 py-4 shrink-0 bg-white dark:bg-zinc-900 z-10">
            <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Sales Order</DrawerTitle>
            <DrawerDescription>Fill in the details to create a new sales order.</DrawerDescription>
        </DrawerHeader>

        {/* --- 2. SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 dark:bg-zinc-950/50 scroll-smooth">
            
            {/* SECTION: Customer */}
            <Card className="border border-gray-200 dark:border-zinc-800 shadow-none">
                <CardContent className="p-5 space-y-4">
                    <div className="space-y-2" id="field-customer">
                        <Label>Customer Name <span className="text-red-500">*</span></Label>
                        {selectedCustomer ? (
                            <div className="relative p-3 bg-green-50/50 dark:bg-zinc-800/80 border border-green-100 dark:border-zinc-700 rounded-md flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex items-center justify-center font-bold text-xs">
                                        {selectedCustomer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{selectedCustomer.name}</p>
                                        <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedCustomer(null); setOrderInfo(prev => ({...prev, contactName: ''})); }} className="text-xs h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2">Change</Button>
                            </div>
                        ) : (
                            <div className={cn(errors.customer && "ring-1 ring-red-500 rounded-md")}>
                                <CustomerAutocomplete customers={mockCustomers} value={selectedCustomer} onChange={setSelectedCustomer} placeholder="Type to search customers..." />
                            </div>
                        )}
                        {errors.customer && !selectedCustomer && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.customer}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Contact Person</Label>
                            <Input value={orderInfo.contactName} onChange={(e) => setOrderInfo({...orderInfo, contactName: e.target.value})} placeholder="Defaults to customer name" />
                        </div>
                            <div className="space-y-2">
                            <Label>Sales Order Owner</Label>
                            <Select value={orderInfo.owner} onValueChange={(v) => setOrderInfo({...orderInfo, owner: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Current User">Current User</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ... (Rest of content similar to previous but wrapped in scrollable div) */}
            {/* SECTION: Order Info */}
            <div className="grid grid-cols-1 gap-6">
                <Card className="border border-gray-200 dark:border-zinc-800 shadow-none">
                    <CardHeader className="pb-3 px-5 pt-5 border-b border-gray-100 dark:border-zinc-800">
                        <CardTitle className="text-base">Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5" id="field-subject">
                                    <Label>Subject <span className="text-red-500">*</span></Label>
                                    <Input value={orderInfo.subject} onChange={(e) => { setOrderInfo({...orderInfo, subject: e.target.value}); if (e.target.value.trim()) setErrors(prev => ({ ...prev, subject: '' })); }} className={cn(errors.subject && "border-red-500 focus-visible:ring-red-500")} placeholder="e.g. Q3 Furniture Order" />
                                    {errors.subject && <p className="text-[10px] text-red-500 font-medium">{errors.subject}</p>}
                            </div>
                            <div className="space-y-1.5" id="field-dueDate">
                                    <Label>Due Date <span className="text-red-500">*</span></Label>
                                    <div className={cn("relative rounded-md shadow-sm", errors.dueDate && "ring-1 ring-red-500")}>
                                        <DatePicker value={orderInfo.dueDate || null} onChange={(d) => { setOrderInfo({...orderInfo, dueDate: d}); if (d) setErrors(prev => ({ ...prev, dueDate: '' })); }} className="w-full border-gray-300 dark:border-gray-700 shadow-sm" />
                                    </div>
                                    {errors.dueDate && <p className="text-[10px] text-red-500 font-medium">{errors.dueDate}</p>}
                            </div>
                                <div className="space-y-1.5" id="field-status">
                                <Label>Status <span className="text-red-500">*</span></Label>
                                <Select value={orderInfo.status} onValueChange={(v) => { setOrderInfo({...orderInfo, status: v}); if (v !== 'Confirmed' && errors.carrier) setErrors(prev => ({...prev, carrier: ''})); if (v) setErrors(prev => ({...prev, status: ''})); }}>
                                    <SelectTrigger className={cn(errors.status && "border-red-500 focus:ring-red-500")}><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Sent">Sent</SelectItem><SelectItem value="Confirmed">Confirmed</SelectItem></SelectContent>
                                </Select>
                                {errors.status && <p className="text-[10px] text-red-500 font-medium">{errors.status}</p>}
                                </div>
                                <div className="space-y-1.5" id="field-carrier">
                                <Label>Carrier {orderInfo.status === 'Confirmed' && <span className="text-red-500">*</span>}</Label>
                                <Select value={orderInfo.carrier} onValueChange={(v) => { setOrderInfo({...orderInfo, carrier: v}); if(v) setErrors(prev => ({...prev, carrier: ''})); }}>
                                    <SelectTrigger className={cn(errors.carrier && "border-red-500 focus:ring-red-500")}><SelectValue placeholder="Select Carrier" /></SelectTrigger>
                                    <SelectContent><SelectItem value="FedEx">FedEx</SelectItem><SelectItem value="DHL">DHL</SelectItem><SelectItem value="UPS">UPS</SelectItem></SelectContent>
                                </Select>
                                {errors.carrier && <p className="text-[10px] text-red-500 font-medium">{errors.carrier}</p>}
                                </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Product Table (simplified for brevity in this view, assume same logic) */}
            <div id="field-lineItems">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Ordered Items</h3>
                 <Button onClick={addLineItem} size="sm" variant="outline" className="border-dashed border-gray-300 text-gray-600 hover:text-green-600 hover:border-green-500">
                    <Icon name="plus" className="w-4 h-4 mr-2" /> Add Product
                 </Button>
              </div>

              <Card className={cn("overflow-visible border border-gray-200 dark:border-zinc-800 shadow-none", errors.lineItems && "ring-1 ring-red-500")}>
                 <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                            <tr>
                            <th className="py-3 px-4 text-left font-medium text-gray-500 w-10">#</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500 min-w-[200px]">Product</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-500 w-24">Price</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-500 w-20">Qty</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-500 w-20">Tax %</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-500 w-28">Total</th>
                            <th className="py-3 px-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-zinc-800">
                            {lineItems.length === 0 ? (
                                <tr>
                                <td colSpan={7} className="py-10 text-center text-gray-400">
                                    {errors.lineItems ? <span className="text-red-500 font-medium flex items-center justify-center gap-2"><Icon name="alertCircle" className="w-4 h-4"/>{errors.lineItems}</span> : "Add products to start building the order."}
                                </td>
                                </tr>
                            ) : (
                                lineItems.map((item, idx) => (
                                    <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                                    <td className="py-2 px-4 text-gray-400">{idx + 1}</td>
                                    <td className="py-2 px-4 relative">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Input 
                                                    value={item.name}
                                                    placeholder="Search..."
                                                    onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="border-none shadow-none bg-transparent focus:ring-0 px-0 font-medium h-8"
                                                />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                                                    <div className="max-h-64 overflow-y-auto p-1">
                                                    {mockProducts.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase()) || p.sku.toLowerCase().includes(item.name.toLowerCase())).map(p => (
                                                        <div key={p.id} className="px-4 py-2 hover:bg-green-50 dark:hover:bg-zinc-800 cursor-pointer flex justify-between items-center rounded-sm" onClick={() => selectProduct(item.id, p)}>
                                                            <div className="truncate pr-2"><span className="text-sm">{p.name}</span></div>
                                                            <span className="text-xs font-mono text-gray-500 shrink-0">{formatCurrency(p.sellingPrice)}</span>
                                                        </div>
                                                    ))}
                                                    {mockProducts.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase())).length === 0 && <div className="p-3 text-center text-gray-500 text-xs">No products found.</div>}
                                                    </div>
                                            </PopoverContent>
                                        </Popover>
                                    </td>
                                    <td className="py-2 px-4"><Input type="number" value={item.price} onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value))} className="text-right border-transparent bg-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-green-500 h-8 px-1" min={0} /></td>
                                    <td className="py-2 px-4"><Input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value))} className="text-right border-transparent bg-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-green-500 h-8 px-1" min={1} /></td>
                                    <td className="py-2 px-4"><Input type="number" value={item.taxRate} onChange={(e) => updateLineItem(item.id, 'taxRate', parseFloat(e.target.value))} className="text-right border-transparent bg-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-green-500 h-8 px-1" /></td>
                                    <td className="py-2 px-4 text-right font-medium">{formatCurrency(item.total)}</td>
                                    <td className="py-2 px-4 text-center"><button onClick={() => removeLineItem(item.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="close" className="w-4 h-4" /></button></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        </table>
                    </div>
                 </CardContent>
              </Card>
            </div>

        </div>

        {/* --- 3. FIXED FOOTER --- */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end gap-3 shrink-0 z-30">
            <Button 
                variant="ghost" 
                onClick={onClose} 
                className="hover:bg-gray-100 text-gray-600"
                disabled={isSubmitting}
            >
                Cancel
            </Button>
            <Button 
                variant="outline" 
                onClick={() => handleSave('draft')} 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={isSubmitting}
            >
                {isSubmitting ? <Icon name="refreshCw" className="animate-spin w-4 h-4 mr-2" /> : null}
                Save as Draft
            </Button>
            <Button 
                onClick={() => handleSave('full')} 
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all disabled:opacity-70"
                disabled={isSubmitting}
            >
                {isSubmitting ? <Icon name="refreshCw" className="animate-spin w-4 h-4 mr-2" /> : <Icon name="check" className="w-4 h-4 mr-2" />}
                Save Order
            </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
