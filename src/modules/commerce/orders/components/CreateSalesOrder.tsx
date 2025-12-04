
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Textarea } from '../../../../components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { DatePicker } from '../../../../components/ui/DatePicker';
import { Icon } from '../../../../components/shared/Icon';
import { Switch } from '../../../../components/ui/Switch';
import { formatCurrency, cn } from '../../../../lib/utils';
import { mockCustomers } from '../../../../data/mockData';
import { mockProducts } from '../../../../data/inventoryMockData';
import type { Customer, Product, SalesOrder } from '../../../../types';
import { CustomerAutocomplete } from './CustomerAutocomplete';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';

// --- TYPES ---

interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

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
  onClose?: () => void;
  onSave?: (order: SalesOrder) => void;
  initialData?: Partial<SalesOrder>;
}

// --- MAIN COMPONENT ---

export default function CreateSalesOrder({ onClose, onSave, initialData }: CreateSalesOrderProps) {
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
  const [billingAddress, setBillingAddress] = useState<Address>({ street: '', city: '', province: '', postalCode: '', country: '' });
  const [shippingAddress, setShippingAddress] = useState<Address>({ street: '', city: '', province: '', postalCode: '', country: '' });
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(false);

  // --- STATE: Products ---
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [productSearchOpen, setProductSearchOpen] = useState<string | null>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // --- STATE: Summary ---
  const [discount, setDiscount] = useState<number | string>(0);
  const [shippingCharges, setShippingCharges] = useState<number | string>(0);
  const [notes, setNotes] = useState("");

  // --- STATE: Validation Errors ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- EFFECTS ---

  // Sync customer address when selected
  useEffect(() => {
    if (selectedCustomer) {
      setOrderInfo(prev => ({ ...prev, contactName: selectedCustomer.name }));
      setBillingAddress({
        street: selectedCustomer.address.street,
        city: selectedCustomer.address.city,
        province: selectedCustomer.address.state,
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
      // Clear shipping errors as they are derived from billing or hidden
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

  // Close product dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productSearchOpen && 
        productDropdownRef.current && 
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setProductSearchOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [productSearchOpen]);

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
        if (!billingAddress.province.trim()) newErrors.billingProvince = "State is required.";
        if (!billingAddress.postalCode.trim()) newErrors.billingPostalCode = "Zip Code is required.";
        if (!billingAddress.country.trim()) newErrors.billingCountry = "Country is required.";

        // Shipping Address
        if (!isShippingSameAsBilling) {
            if (!shippingAddress.street.trim()) newErrors.shippingStreet = "Street is required.";
            if (!shippingAddress.city.trim()) newErrors.shippingCity = "City is required.";
            if (!shippingAddress.province.trim()) newErrors.shippingProvince = "State is required.";
            if (!shippingAddress.postalCode.trim()) newErrors.shippingPostalCode = "Zip Code is required.";
            if (!shippingAddress.country.trim()) newErrors.shippingCountry = "Country is required.";
        }
        
        if (Object.keys(newErrors).filter(k => k.startsWith('billing') || k.startsWith('shipping')).length > 0) isValid = false;
        if (Number(shippingCharges) < 0) isValid = false; 
    }

    setErrors(newErrors);
    if (!isValid) {
        const firstErrorKey = Object.keys(newErrors)[0];
        const elementIdMap: Record<string, string> = {
            customer: 'field-customer', subject: 'field-subject', dueDate: 'field-dueDate', status: 'field-status', carrier: 'field-carrier', lineItems: 'field-lineItems',
            billingStreet: 'field-billingStreet', billingCity: 'field-billingCity', billingProvince: 'field-billingProvince', billingPostalCode: 'field-billingPostalCode', billingCountry: 'field-billingCountry',
            shippingStreet: 'field-shippingStreet', shippingCity: 'field-shippingCity', shippingProvince: 'field-shippingProvince', shippingPostalCode: 'field-shippingPostalCode', shippingCountry: 'field-shippingCountry',
        };
        const elementId = elementIdMap[firstErrorKey];
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('animate-pulse');
                setTimeout(() => element.classList.remove('animate-pulse'), 500);
            }
        }
    }
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
    setProductSearchOpen(null);
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
    };
    if (onSave) onSave(newOrder);
    push({ title: mode === 'draft' ? "Draft Saved" : "Order Created", description: mode === 'draft' ? "Sales order saved as draft." : "Sales order has been successfully created.", variant: "success" });
    setIsSubmitting(false);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      
      {/* --- 1. FIXED HEADER --- */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-20 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Sales Order</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details to create a new sales order.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="ghost" onClick={onClose}>Cancel</Button>
           <Button variant="outline" onClick={() => handleSave('draft')}>Save as Draft</Button>
           <Button onClick={() => handleSave('full')} className="bg-green-600 hover:bg-green-700 text-white">Save</Button>
        </div>
      </div>

      {/* --- 2. SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-white dark:bg-zinc-950/50 scroll-smooth">
        
        {/* SECTION: Customer */}
        <div className="grid grid-cols-1 gap-6">
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
        </div>

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

        {/* SECTION: Address Info */}
        <div className="grid grid-cols-1 gap-6">
             <Card className="border border-gray-200 dark:border-zinc-800 shadow-none">
                 <CardHeader className="pb-3 px-5 pt-5 border-b border-gray-100 dark:border-zinc-800">
                    <CardTitle className="text-base">Billing Address</CardTitle>
                 </CardHeader>
                 <CardContent className="p-5 space-y-3">
                    <div className="space-y-1" id="field-billingStreet">
                        <Input placeholder="Billing Street *" value={billingAddress.street} onChange={(e) => { setBillingAddress({...billingAddress, street: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, billingStreet: ''})); }} className={cn("h-9", errors.billingStreet && "border-red-500 focus-visible:ring-red-500")} />
                        {errors.billingStreet && <p className="text-[10px] text-red-500 font-medium">{errors.billingStreet}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1" id="field-billingCity"><Input placeholder="City *" value={billingAddress.city} onChange={(e) => { setBillingAddress({...billingAddress, city: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, billingCity: ''})); }} className={cn("h-9", errors.billingCity && "border-red-500 focus-visible:ring-red-500")} /></div>
                        <div className="space-y-1" id="field-billingProvince"><Input placeholder="State/Province *" value={billingAddress.province} onChange={(e) => { setBillingAddress({...billingAddress, province: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, billingProvince: ''})); }} className={cn("h-9", errors.billingProvince && "border-red-500 focus-visible:ring-red-500")} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1" id="field-billingPostalCode"><Input placeholder="Postal Code *" value={billingAddress.postalCode} onChange={(e) => { setBillingAddress({...billingAddress, postalCode: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, billingPostalCode: ''})); }} className={cn("h-9", errors.billingPostalCode && "border-red-500 focus-visible:ring-red-500")} /></div>
                        <div className="space-y-1" id="field-billingCountry"><Input placeholder="Country *" value={billingAddress.country} onChange={(e) => { setBillingAddress({...billingAddress, country: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, billingCountry: ''})); }} className={cn("h-9", errors.billingCountry && "border-red-500 focus-visible:ring-red-500")} /></div>
                    </div>
                 </CardContent>
             </Card>
              
             <Card className={cn("border border-gray-200 dark:border-zinc-800 shadow-none transition-opacity duration-200", isShippingSameAsBilling && "opacity-60 pointer-events-none")}>
                <CardHeader className="pb-3 px-5 pt-5 border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Shipping Address</CardTitle>
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <Label htmlFor="sameAsBilling" className="text-xs font-medium cursor-pointer text-gray-600 dark:text-gray-400">Same as Billing</Label>
                        <Switch id="sameAsBilling" checked={isShippingSameAsBilling} onClick={() => setIsShippingSameAsBilling(!isShippingSameAsBilling)} />
                    </div>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                    <div className="space-y-1" id="field-shippingStreet">
                        <Input placeholder="Shipping Street *" value={shippingAddress.street} onChange={(e) => { setShippingAddress({...shippingAddress, street: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, shippingStreet: ''})); }} className={cn("h-9", errors.shippingStreet && !isShippingSameAsBilling && "border-red-500 focus-visible:ring-red-500")} tabIndex={isShippingSameAsBilling ? -1 : 0} />
                        {errors.shippingStreet && !isShippingSameAsBilling && <p className="text-[10px] text-red-500 font-medium">{errors.shippingStreet}</p>}
                    </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1" id="field-shippingCity"><Input placeholder="City *" value={shippingAddress.city} onChange={(e) => { setShippingAddress({...shippingAddress, city: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, shippingCity: ''})); }} className={cn("h-9", errors.shippingCity && !isShippingSameAsBilling && "border-red-500 focus-visible:ring-red-500")} tabIndex={isShippingSameAsBilling ? -1 : 0} /></div>
                        <div className="space-y-1" id="field-shippingProvince"><Input placeholder="State/Province *" value={shippingAddress.province} onChange={(e) => { setShippingAddress({...shippingAddress, province: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, shippingProvince: ''})); }} className={cn("h-9", errors.shippingProvince && !isShippingSameAsBilling && "border-red-500 focus-visible:ring-red-500")} tabIndex={isShippingSameAsBilling ? -1 : 0} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1" id="field-shippingPostalCode"><Input placeholder="Postal Code *" value={shippingAddress.postalCode} onChange={(e) => { setShippingAddress({...shippingAddress, postalCode: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, shippingPostalCode: ''})); }} className={cn("h-9", errors.shippingPostalCode && !isShippingSameAsBilling && "border-red-500 focus-visible:ring-red-500")} tabIndex={isShippingSameAsBilling ? -1 : 0} /></div>
                        <div className="space-y-1" id="field-shippingCountry"><Input placeholder="Country *" value={shippingAddress.country} onChange={(e) => { setShippingAddress({...shippingAddress, country: e.target.value}); if(e.target.value) setErrors(prev => ({...prev, shippingCountry: ''})); }} className={cn("h-9", errors.shippingCountry && !isShippingSameAsBilling && "border-red-500 focus-visible:ring-red-500")} tabIndex={isShippingSameAsBilling ? -1 : 0} /></div>
                    </div>
                </CardContent>
             </Card>
        </div>

        {/* SECTION: Products */}
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
                                    <div className="relative">
                                        <Input 
                                        value={item.name}
                                        placeholder="Search..."
                                        onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                                        onFocus={() => setProductSearchOpen(item.id)}
                                        className="border-none shadow-none bg-transparent focus:ring-0 px-0 font-medium h-8"
                                        />
                                        {productSearchOpen === item.id && (
                                        <div ref={productDropdownRef} className="absolute top-full left-0 w-[300px] mt-1 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                                            {mockProducts.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase()) || p.sku.toLowerCase().includes(item.name.toLowerCase())).map(p => (
                                            <div key={p.id} className="px-4 py-2 hover:bg-green-50 dark:hover:bg-zinc-800 cursor-pointer flex justify-between items-center" onClick={() => selectProduct(item.id, p)}>
                                                <div className="truncate pr-2"><span className="text-sm">{p.name}</span></div>
                                                <span className="text-xs font-mono text-gray-500 shrink-0">{formatCurrency(p.sellingPrice)}</span>
                                            </div>
                                            ))}
                                            {mockProducts.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase())).length === 0 && <div className="p-3 text-center text-gray-500 text-xs">No products found.</div>}
                                        </div>
                                        )}
                                    </div>
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

        {/* SECTION: Summary */}
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 space-y-2">
                <Label>Internal Notes & Terms</Label>
                <Textarea 
                  placeholder="Enter terms or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                />
            </div>
            <div className="lg:w-1/2">
                 <Card className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 shadow-none">
                    <CardContent className="p-5 space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(totals.subtotal)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Taxes</span><span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(totals.taxTotal)}</span></div>
                        
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Discount</span>
                            <div className="relative w-24">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">-</span>
                                <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="h-7 pl-5 text-right text-sm bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700" placeholder="0" />
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Shipping</span>
                            <div className="relative w-24">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">+</span>
                                <Input type="number" value={shippingCharges} onChange={(e) => setShippingCharges(e.target.value)} className="h-7 pl-5 text-right text-sm bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700" placeholder="0" />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-zinc-700 pt-3 mt-2">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-gray-900 dark:text-gray-100">Grand Total</span>
                                <span className="text-xl font-extrab