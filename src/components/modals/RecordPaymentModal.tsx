
import React, { useState, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { formatCurrency, validatePayment } from '../../lib/utils';
import { useGlassyToasts } from '../ui/GlassyToastProvider';
import type { Invoice, Payment } from '../../types';

interface RecordPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payment: Payment) => void;
    invoice: Invoice;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, onSave, invoice }) => {
    const { push } = useGlassyToasts();
    const [formData, setFormData] = useState<Partial<Payment>>({
        amount: invoice.balance,
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'Bank Transfer',
        notes: '',
    });
    
    const validationError = useMemo(() => validatePayment(formData, invoice.balance), [formData, invoice.balance]);

    const handleSave = () => {
        if (validationError) {
            push({ title: "Validation Error", description: validationError, variant: 'error' });
            return;
        }
        const newPayment: Payment = {
            id: `PAY-${Date.now().toString().slice(-6)}`,
            invoiceId: invoice.id,
            customerId: invoice.customerId,
            customerName: invoice.customerName,
            status: 'Completed',
            ...formData,
        } as Payment;
        onSave(newPayment);
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="w-full md:w-[500px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900">
                    <DrawerTitle>Record Payment for Invoice {invoice.id}</DrawerTitle>
                    <DrawerDescription>Balance due: {formatCurrency(invoice.balance)}</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input type="number" value={formData.amount} onChange={e => setFormData(p => ({...p, amount: parseFloat(e.target.value)}))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select value={formData.method} onValueChange={v => setFormData(p => ({...p, method: v as any}))}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <Input type="date" value={formData.paymentDate} onChange={e => setFormData(p => ({...p, paymentDate: e.target.value}))}/>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={formData.notes} onChange={e => setFormData(p => ({...p, notes: e.target.value}))} className="min-h-[100px]" />
                    </div>
                </div>

                <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4 bg-white dark:bg-zinc-900">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!!validationError}>Record Payment</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default RecordPaymentModal;
