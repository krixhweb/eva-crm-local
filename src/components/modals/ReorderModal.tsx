
import React, { useState, useMemo, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { suggestReorderQuantity, formatCurrency, cn } from '../../lib/utils';
import type { Product } from '../../types';
import { mockSuppliers, productLocations } from '../../data/inventoryMockData';
import { Icon } from '../shared/Icon';
import { DatePicker } from '../ui/DatePicker';

export interface ReplenishmentOrderPayload {
    orderId: string;
    productId: string;
    productName: string;
    sku: string;
    vendor: string;
    contactPerson: string;
    quantity: number;
    unitCost: number;
    taxRate: number;
    taxAmount: number;
    subtotal: number;
    totalCost: number;
    warehouse: string;
    deliveryDate: string;
    priority: string;
    reason: string;
    notes: string;
    attachments: File[];
    createdAt: string;
}

interface ReorderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ReplenishmentOrderPayload) => void;
    product: Product;
}

const ReorderModal: React.FC<ReorderModalProps> = ({ isOpen, onClose, onSubmit, product }) => {
    const suggestedQty = suggestReorderQuantity(product.stock, 20);
    
    // Form State
    const [orderId, setOrderId] = useState('');
    const [vendor, setVendor] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [quantity, setQuantity] = useState<number | string>('');
    const [unitCost, setUnitCost] = useState<number | string>('');
    const [taxRate, setTaxRate] = useState(18);
    const [warehouse, setWarehouse] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [priority, setPriority] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);

    // Validation State
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize Fields
    useEffect(() => {
        if (isOpen) {
            setOrderId(`RO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
            // Set defaults to empty/blank
            setVendor('');
            setWarehouse('');
            setDeliveryDate('');
            
            setPriority('');
            setReason('');
            setQuantity('');
            setUnitCost(''); // User must enter manually
            setTaxRate(18);
            setContactPerson('');
            setNotes('');
            setAttachments([]);
            
            // Reset validation
            setErrors({});
            setTouched({});
        }
    }, [isOpen, product]);

    // Validation Logic
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!vendor) newErrors.vendor = "Vendor is required";
        
        if (quantity === '' || quantity === undefined || quantity === null) {
            newErrors.quantity = "Order Quantity is required";
        } else if (Number(quantity) <= 0) {
            newErrors.quantity = "Value must be greater than zero";
        }
        
        if (unitCost === '' || unitCost === undefined || unitCost === null) {
            newErrors.unitCost = "Unit Cost is required";
        } else if (Number(unitCost) <= 0) {
            newErrors.unitCost = "Value must be greater than zero";
        }
        
        if (!warehouse) newErrors.warehouse = "Receiving Warehouse is required";
        if (!deliveryDate) newErrors.deliveryDate = "Expected Delivery Date is required";
        if (!priority) newErrors.priority = "Priority is required";
        if (!reason) newErrors.reason = "Reason for Replenishment is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isOpen && Object.keys(touched).length > 0) {
            validateForm();
        }
    }, [vendor, quantity, unitCost, warehouse, deliveryDate, priority, reason, isOpen, touched]);

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    // Calculations
    const qtyNum = typeof quantity === 'number' ? quantity : 0;
    const costNum = typeof unitCost === 'number' ? unitCost : 0;

    const subtotal = useMemo(() => qtyNum * costNum, [qtyNum, costNum]);
    const taxAmount = useMemo(() => subtotal * (taxRate / 100), [subtotal, taxRate]);
    const totalCost = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

    const handleSubmit = () => {
        // Mark all as touched to show errors
        setTouched({
            vendor: true,
            quantity: true,
            unitCost: true,
            warehouse: true,
            deliveryDate: true,
            priority: true,
            reason: true
        });

        const isValid = validateForm();

        if (isValid) {
            const payload: ReplenishmentOrderPayload = {
                orderId,
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                vendor,
                contactPerson,
                quantity: Number(quantity),
                unitCost: Number(unitCost),
                taxRate,
                taxAmount,
                subtotal,
                totalCost,
                warehouse,
                deliveryDate,
                priority,
                reason,
                notes,
                attachments,
                createdAt: new Date().toISOString()
            };
            onSubmit(payload);
        }
    };

    const isFormValid = Object.keys(errors).length === 0;

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl" resizable>
                <DrawerHeader className="border-b px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <DrawerTitle className="text-xl">Create Replenishment Order</DrawerTitle>
                            <DrawerDescription className="mt-1 flex items-center gap-2">
                                For item: <span className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</span>
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded font-mono">{product.sku}</span>
                            </DrawerDescription>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Icon name="package" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                        
                        {/* SECTION 1: VENDOR INFORMATION */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Icon name="users" className="w-3.5 h-3.5" /> Vendor Information
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Replenishment Order ID</Label>
                                    <Input value={orderId} readOnly className="bg-gray-50 dark:bg-gray-900/50 font-mono text-gray-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label className={cn(touched.vendor && errors.vendor && "text-red-500")}>
                                        Vendor <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={vendor} onValueChange={setVendor}>
                                        <SelectTrigger 
                                            className={cn(touched.vendor && errors.vendor && "border-red-500 focus:ring-red-500")}
                                            onBlur={() => handleBlur('vendor')}
                                        >
                                            <SelectValue placeholder="Select Vendor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {touched.vendor && errors.vendor && <p className="text-xs text-red-500">{errors.vendor}</p>}
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Vendor Contact Person</Label>
                                    <Input 
                                        placeholder="e.g. Account Manager Name" 
                                        value={contactPerson}
                                        onChange={(e) => setContactPerson(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* SECTION 2: ORDER DETAILS */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Icon name="shoppingCart" className="w-3.5 h-3.5" /> Order Details
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={cn(touched.quantity && errors.quantity && "text-red-500")}>
                                        Order Quantity <span className="text-red-500">*</span>
                                    </Label>
                                    <Input 
                                        type="number" 
                                        value={quantity} 
                                        onChange={e => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))} 
                                        onBlur={() => handleBlur('quantity')}
                                        className={cn(touched.quantity && errors.quantity && "border-red-500 focus-visible:ring-red-500")}
                                    />
                                    {touched.quantity && errors.quantity ? (
                                        <p className="text-xs text-red-500">{errors.quantity}</p>
                                    ) : (
                                        <p className="text-xs text-blue-600 flex items-center gap-1">
                                            <Icon name="trendingUp" className="w-3 h-3" /> Suggested Quantity: {suggestedQty}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className={cn(touched.unitCost && errors.unitCost && "text-red-500")}>
                                        Unit Cost <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <Input 
                                            type="number" 
                                            className={cn("pl-7", touched.unitCost && errors.unitCost && "border-red-500 focus-visible:ring-red-500")}
                                            value={unitCost} 
                                            onChange={e => setUnitCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            onBlur={() => handleBlur('unitCost')} 
                                        />
                                    </div>
                                    {touched.unitCost && errors.unitCost && <p className="text-xs text-red-500 mt-1">{errors.unitCost}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input 
                                        type="number" 
                                        value={taxRate} 
                                        onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax Amount</Label>
                                    <Input 
                                        value={formatCurrency(taxAmount)} 
                                        readOnly 
                                        className="bg-gray-50 dark:bg-gray-900/50 text-gray-500" 
                                    />
                                </div>
                            </div>

                            {/* Cost Summary Card */}
                            <div className="mt-4 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-3">
                                    <span className="text-gray-500">Tax ({taxRate}%)</span>
                                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-gray-900 dark:text-gray-100">Total Cost</span>
                                    <span className="font-bold text-lg text-green-600">{formatCurrency(totalCost)}</span>
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* SECTION 3: DELIVERY DETAILS */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Icon name="package" className="w-3.5 h-3.5" /> Delivery Details
                                </h3>
                                <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 text-xs">
                                    Copy Standard Address
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={cn(touched.warehouse && errors.warehouse && "text-red-500")}>
                                        Receiving Warehouse <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={warehouse} onValueChange={setWarehouse}>
                                        <SelectTrigger 
                                            className={cn(touched.warehouse && errors.warehouse && "border-red-500 focus:ring-red-500")}
                                            onBlur={() => handleBlur('warehouse')}
                                        >
                                            <SelectValue placeholder="Select Location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {touched.warehouse && errors.warehouse && <p className="text-xs text-red-500">{errors.warehouse}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={cn(touched.deliveryDate && errors.deliveryDate && "text-red-500")}>
                                        Expected Delivery Date <span className="text-red-500">*</span>
                                    </Label>
                                    <DatePicker
                                        value={deliveryDate ? new Date(deliveryDate) : null}
                                        onChange={(d) => setDeliveryDate(d ? d.toISOString().split('T')[0] : '')}
                                    />
                                    {touched.deliveryDate && errors.deliveryDate && <p className="text-xs text-red-500">{errors.deliveryDate}</p>}
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* SECTION 4: ADDITIONAL INFORMATION */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Icon name="fileText" className="w-3.5 h-3.5" /> Additional Information
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={cn(touched.priority && errors.priority && "text-red-500")}>
                                        Priority <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={priority} onValueChange={setPriority}>
                                        <SelectTrigger 
                                            className={cn(touched.priority && errors.priority && "border-red-500 focus:ring-red-500")}
                                            onBlur={() => handleBlur('priority')}
                                        >
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Normal">Normal</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {touched.priority && errors.priority && <p className="text-xs text-red-500">{errors.priority}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={cn(touched.reason && errors.reason && "text-red-500")}>
                                        Reason <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={reason} onValueChange={setReason}>
                                        <SelectTrigger 
                                            className={cn(touched.reason && errors.reason && "border-red-500 focus:ring-red-500")}
                                            onBlur={() => handleBlur('reason')}
                                        >
                                            <SelectValue placeholder="Select Reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low Stock">Low Stock</SelectItem>
                                            <SelectItem value="Damage Replacement">Damage Replacement</SelectItem>
                                            <SelectItem value="Forecasted Demand">Forecasted Demand</SelectItem>
                                            <SelectItem value="Backorders">Backorders</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {touched.reason && errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Additional Instructions</Label>
                                <Textarea 
                                    placeholder="Enter any specific instructions for the vendor..." 
                                    className="min-h-[80px]"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Attachments</Label>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    id="attachmentInput"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setAttachments(Array.from(e.target.files));
                                        }
                                    }}
                                />
                                <div
                                    onClick={() => document.getElementById("attachmentInput")?.click()}
                                    className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                >
                                    <Icon name="paperclip" className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        {attachments.length > 0
                                            ? `${attachments.length} file(s) selected`
                                            : "Click to upload purchase requisition or other docs"}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <DrawerFooter className="flex flex-row justify-end gap-3 border-t px-6 py-4">
                    <Button variant="outline" onClick={onClose} className="w-24">Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!isFormValid && Object.keys(touched).length > 0}
                        className={cn(
                            "w-32 shadow-sm",
                            !isFormValid && Object.keys(touched).length > 0
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                                : "bg-green-600 hover:bg-green-700 text-white"
                        )}
                    >
                        Submit Order
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ReorderModal;
