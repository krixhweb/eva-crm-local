
import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Textarea } from '../ui/Textarea';
import { Icon } from '../shared/Icon';
import { formatCurrency, calculateTotals, validateQuote } from '../../lib/utils';
import { useGlassyToasts } from '../ui/GlassyToastProvider';
import { mockCustomers } from '../../data/mockData';
import { mockProducts } from '../../data/inventoryMockData';
import type { Quote, LineItem } from '../../types';
import { DatePicker } from '../ui/DatePicker';

interface CreateEditQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quote: Quote) => void;
    quote?: Quote | null;
}

const CreateEditQuoteModal: React.FC<CreateEditQuoteModalProps> = ({ isOpen, onClose, onSave, quote }) => {
    const { push } = useGlassyToasts();
    const isEditing = !!quote?.id;

    const [formData, setFormData] = useState<Partial<Quote>>({
        customerId: '',
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems: [],
        discount: 0,
        terms: 'Payment due upon acceptance. Delivery within 14 business days.',
        notes: '',
    });

    useEffect(() => {
        if (isEditing && quote) {
            setFormData(quote);
        }
    }, [quote, isEditing]);
    
    const { subtotal, tax, total } = useMemo(
        () => calculateTotals(formData.lineItems || [], formData.discount),
        [formData.lineItems, formData.discount]
    );

    const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
        const updatedItems = (formData.lineItems || []).map(item => {
            if (item.id === id) {
                const newItem = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                    newItem.total = newItem.quantity * newItem.unitPrice;
                }
                return newItem;
            }
            return item;
        });
        setFormData(p => ({ ...p, lineItems: updatedItems }));
    };

    const addLineItem = () => {
        const product = mockProducts.find(p => p.id === 'prod_1')!; // default product
        const newLineItem: LineItem = {
            id: `li_${Date.now()}`,
            productId: product.id,
            description: product.name,
            quantity: 1,
            unitPrice: product.sellingPrice,
            total: product.sellingPrice,
        };
        setFormData(p => ({ ...p, lineItems: [...(p.lineItems || []), newLineItem] }));
    };
    
    const removeLineItem = (id: string) => {
        setFormData(p => ({ ...p, lineItems: (p.lineItems || []).filter(item => item.id !== id) }));
    };

    const validationError = useMemo(() => validateQuote(formData), [formData]);

    const handleSave = () => {
        if (validationError) {
            push({ title: "Validation Error", description: validationError, variant: 'error' });
            return;
        }
        const finalQuote: Quote = {
            id: isEditing ? quote.id : `QT-${Date.now().toString().slice(-6)}`,
            customerName: mockCustomers.find(c => c.id === formData.customerId)?.name || 'N/A',
            quoteDate: isEditing ? quote.quoteDate : new Date().toISOString().split('T')[0],
            status: isEditing ? quote.status : 'Draft',
            ...formData,
            subtotal, tax, total
        } as Quote;
        onSave(finalQuote);
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900">
                    <DrawerTitle>{isEditing ? 'Edit Quote' : 'Create New Quote'}</DrawerTitle>
                    <DrawerDescription>Fill in the details to create or update a quote.</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left: Form Data */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Customer</Label>
                                    <Select value={formData.customerId} onValueChange={v => setFormData(p => ({...p, customerId: v}))}>
                                        <SelectTrigger><SelectValue placeholder="Select Customer"/></SelectTrigger>
                                        <SelectContent>{mockCustomers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Valid Till</Label>
                                    <DatePicker 
                                        value={formData.validTill ? new Date(formData.validTill) : null} 
                                        onChange={(d) => setFormData(p => ({...p, validTill: d ? d.toISOString().split('T')[0] : ''}))}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Line Items</Label>
                                    <Button variant="ghost" size="sm" onClick={addLineItem} className="text-blue-600">
                                        <Icon name="plus" className="w-4 h-4 mr-1" /> Add Item
                                    </Button>
                                </div>
                                <div className="border rounded-lg overflow-hidden dark:border-zinc-800">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
                                                <TableHead>Product</TableHead>
                                                <TableHead className="w-20">Qty</TableHead>
                                                <TableHead className="w-28">Price</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead className="w-10"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(formData.lineItems || []).map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell><Input value={item.description} onChange={e => updateLineItem(item.id, 'description', e.target.value)} /></TableCell>
                                                    <TableCell><Input type="number" value={item.quantity} onChange={e => updateLineItem(item.id, 'quantity', parseInt(e.target.value))} /></TableCell>
                                                    <TableCell><Input type="number" value={item.unitPrice} onChange={e => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value))} /></TableCell>
                                                    <TableCell>{formatCurrency(item.total)}</TableCell>
                                                    <TableCell><Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}><Icon name="close" className="h-4 w-4"/></Button></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Right: Summary */}
                        <div className="space-y-6">
                             <div className="p-5 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border dark:border-zinc-800 space-y-3">
                                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between text-sm items-center"><span>Discount (%)</span><Input type="number" value={formData.discount} onChange={e => setFormData(p => ({...p, discount: parseFloat(e.target.value) || 0}))} className="h-8 w-24 text-right bg-white dark:bg-zinc-900"/></div>
                                <div className="flex justify-between text-sm"><span>Tax (18%)</span><span>{formatCurrency(tax)}</span></div>
                                <div className="border-t my-2 dark:border-zinc-700"></div>
                                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(total)}</span></div>
                            </div>
                            <div className="space-y-2">
                                <Label>Terms & Conditions</Label>
                                <Textarea value={formData.terms} onChange={e => setFormData(p => ({...p, terms: e.target.value}))} className="min-h-[80px]"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Internal Notes</Label>
                                <Textarea value={formData.notes} onChange={e => setFormData(p => ({...p, notes: e.target.value}))} className="min-h-[80px]"/>
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4 bg-white dark:bg-zinc-900">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!!validationError}>Save Quote</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateEditQuoteModal;
