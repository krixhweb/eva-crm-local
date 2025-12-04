
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../../../../components/ui/Drawer';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { Icon } from '../../../../components/shared/Icon';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import { cn } from '../../../../lib/utils';
import { Switch } from '../../../../components/ui/Switch';
import { DatePicker } from '../../../../components/ui/DatePicker';
import MultiSelect from '../../../../components/ui/MultiSelect';

interface Props {
    open: boolean;
    onClose: () => void;
}

const CHANNELS = ["Email", "WhatsApp", "Social Posts", "Orders / Checkout", "SMS"];
const AUDIENCES = ["All Customers", "New Customers", "Returning Customers", "VIP", "At Risk", "Specific Segments"];
const DISCOUNT_TYPES = ["Percentage", "Flat Amount", "Buy X Get Y", "Free Shipping"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const CreateCouponDrawer: React.FC<Props> = ({ open, onClose }) => {
    const { push } = useGlassyToasts();
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        channels: [] as string[],
        audience: 'All Customers',
        discountType: 'Percentage',
        value: '',
        minOrderAmount: '',
        maxDiscount: '',
        usageLimitPerUser: '',
        totalUsageLimit: '',
        isOneTime: false,
        isStackable: false,
        startDate: '',
        endDate: '',
        activateImmediately: true,
        autoExpire: true,
        validWeekdays: [] as string[],
        validTimeStart: '',
        validTimeEnd: ''
    });

    const handleGenerateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, code: result }));
    };

    const handleNext = () => {
        // Basic validation
        if (step === 1) {
            if (!formData.name || !formData.code) {
                push({ title: "Validation Error", description: "Name and Code are required.", variant: "error" });
                return;
            }
        }
        if (step === 2) {
            if (!formData.value && formData.discountType !== 'Free Shipping') {
                push({ title: "Validation Error", description: "Discount Value is required.", variant: "error" });
                return;
            }
        }
        setStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = () => {
        push({ title: "Coupon Created", description: `Coupon ${formData.code} has been created.`, variant: "success" });
        onClose();
        setStep(1);
        // Reset form...
        setFormData({
            name: '', code: '', description: '', channels: [], audience: 'All Customers',
            discountType: 'Percentage', value: '', minOrderAmount: '', maxDiscount: '',
            usageLimitPerUser: '', totalUsageLimit: '', isOneTime: false, isStackable: false,
            startDate: '', endDate: '', activateImmediately: true, autoExpire: true,
            validWeekdays: [], validTimeStart: '', validTimeEnd: ''
        });
    };

    return (
        <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
            <DrawerContent className="w-full md:w-[800px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable showCloseButton={false}>
                <DrawerHeader className="border-b px-6 py-5 flex flex-col gap-2 bg-white dark:bg-zinc-900 shrink-0 z-10">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Icon name="ticket" className="w-5 h-5 text-green-600" />
                            Create Coupon
                        </DrawerTitle>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full transition-colors", step >= 1 ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "text-gray-400 bg-gray-100 dark:bg-zinc-800")}>1. Details</span>
                        <span className="text-gray-300">→</span>
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full transition-colors", step >= 2 ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "text-gray-400 bg-gray-100 dark:bg-zinc-800")}>2. Configuration</span>
                        <span className="text-gray-300">→</span>
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full transition-colors", step >= 3 ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "text-gray-400 bg-gray-100 dark:bg-zinc-800")}>3. Validity</span>
                    </div>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 dark:bg-zinc-950/50">
                    
                    {/* STEP 1: Details */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>Coupon Name <span className="text-red-500">*</span></Label>
                                <Input 
                                    placeholder="e.g. Summer Sale 2024" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="bg-white dark:bg-zinc-900"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Coupon Code <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="e.g. SUMMER25" 
                                        value={formData.code}
                                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        className="font-mono uppercase bg-white dark:bg-zinc-900"
                                    />
                                    <Button variant="outline" onClick={handleGenerateCode}>
                                        <Icon name="refreshCw" className="w-4 h-4 mr-2" /> Auto-Generate
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input 
                                    placeholder="Internal notes or customer-facing description..." 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="bg-white dark:bg-zinc-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Applicable Channels</Label>
                                    <MultiSelect 
                                        options={CHANNELS}
                                        value={formData.channels}
                                        onChange={v => setFormData({...formData, channels: v})}
                                        placeholder="Select channels..."
                                        className="bg-white dark:bg-zinc-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Audience Restriction</Label>
                                    <Select value={formData.audience} onValueChange={v => setFormData({...formData, audience: v})}>
                                        <SelectTrigger className="bg-white dark:bg-zinc-900"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {AUDIENCES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Configuration */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Discount Type</Label>
                                    <Select value={formData.discountType} onValueChange={v => setFormData({...formData, discountType: v})}>
                                        <SelectTrigger className="bg-white dark:bg-zinc-900"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DISCOUNT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {formData.discountType !== 'Free Shipping' && (
                                    <div className="space-y-2">
                                        <Label>
                                            Discount Value {formData.discountType === 'Percentage' ? '(%)' : '(₹)'} 
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input 
                                            type="number" 
                                            placeholder="0" 
                                            value={formData.value}
                                            onChange={e => setFormData({...formData, value: e.target.value})}
                                            className="bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Min Order Amount (₹)</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="0" 
                                        value={formData.minOrderAmount}
                                        onChange={e => setFormData({...formData, minOrderAmount: e.target.value})}
                                        className="bg-white dark:bg-zinc-900"
                                    />
                                </div>
                                {formData.discountType === 'Percentage' && (
                                    <div className="space-y-2">
                                        <Label>Max Discount Cap (₹)</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="Unlimited" 
                                            value={formData.maxDiscount}
                                            onChange={e => setFormData({...formData, maxDiscount: e.target.value})}
                                            className="bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-4">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Usage Rules</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Total Usage Limit</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="Unlimited" 
                                            value={formData.totalUsageLimit}
                                            onChange={e => setFormData({...formData, totalUsageLimit: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Limit Per User</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="Unlimited" 
                                            value={formData.usageLimitPerUser}
                                            onChange={e => setFormData({...formData, usageLimitPerUser: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="cursor-pointer" htmlFor="onetime">One-time use only?</Label>
                                        <Switch id="onetime" checked={formData.isOneTime} onClick={() => setFormData({...formData, isOneTime: !formData.isOneTime})} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="cursor-pointer" htmlFor="stackable">Stackable with other coupons?</Label>
                                        <Switch id="stackable" checked={formData.isStackable} onClick={() => setFormData({...formData, isStackable: !formData.isStackable})} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Validity */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <DatePicker 
                                        value={formData.startDate ? new Date(formData.startDate) : null}
                                        onChange={d => setFormData({...formData, startDate: d ? d.toISOString() : ''})}
                                        className="bg-white dark:bg-zinc-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <DatePicker 
                                        value={formData.endDate ? new Date(formData.endDate) : null}
                                        onChange={d => setFormData({...formData, endDate: d ? d.toISOString() : ''})}
                                        className="bg-white dark:bg-zinc-900"
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-4">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Time-Based Restrictions</h4>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label>Valid on Weekdays</Label>
                                        <MultiSelect 
                                            options={WEEKDAYS} 
                                            value={formData.validWeekdays} 
                                            onChange={(v) => setFormData({...formData, validWeekdays: v})}
                                            placeholder="Select Days"
                                            className="bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-normal text-gray-500">Start Time</Label>
                                            <Input type="time" value={formData.validTimeStart} onChange={(e) => setFormData({...formData, validTimeStart: e.target.value})} className="bg-white dark:bg-zinc-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-normal text-gray-500">End Time</Label>
                                            <Input type="time" value={formData.validTimeEnd} onChange={(e) => setFormData({...formData, validTimeEnd: e.target.value})} className="bg-white dark:bg-zinc-900" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base font-semibold">Activate Immediately</Label>
                                        <p className="text-xs text-gray-500">Coupon will be live as soon as you create it.</p>
                                    </div>
                                    <Switch checked={formData.activateImmediately} onClick={() => setFormData({...formData, activateImmediately: !formData.activateImmediately})} />
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4">
                                    <div>
                                        <Label className="text-base font-semibold">Auto-Expire</Label>
                                        <p className="text-xs text-gray-500">Automatically disable after End Date.</p>
                                    </div>
                                    <Switch checked={formData.autoExpire} onClick={() => setFormData({...formData, autoExpire: !formData.autoExpire})} />
                                </div>
                            </div>

                            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 p-4">
                                <h4 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                    <Icon name="checkCircle" className="w-4 h-4" /> Summary
                                </h4>
                                <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
                                    <p><strong>Code:</strong> {formData.code || 'PENDING'}</p>
                                    <p><strong>Discount:</strong> {formData.discountType === 'Flat Amount' ? '₹' : ''}{formData.value}{formData.discountType === 'Percentage' ? '%' : ''} {formData.discountType}</p>
                                    <p><strong>Validity:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Now'} - {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Forever'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <DrawerFooter className="border-t px-6 py-4 bg-white dark:bg-zinc-900 flex flex-row justify-end gap-3 shrink-0 z-10">
                     <Button variant="outline" onClick={step === 1 ? onClose : handleBack}>
                        {step === 1 ? "Cancel" : "Back"}
                    </Button>
                    <Button onClick={step === 3 ? handleSubmit : handleNext} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                        {step === 3 ? "Create Coupon" : "Next Step"}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
