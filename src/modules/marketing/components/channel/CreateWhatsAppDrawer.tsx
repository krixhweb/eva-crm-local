
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../../../../components/ui/Drawer';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { Icon } from '../../../../components/shared/Icon';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import { Card } from '../../../../components/ui/Card';

interface CreateWhatsAppDrawerProps {
    open: boolean;
    onClose: () => void;
}

export const CreateWhatsAppDrawer: React.FC<CreateWhatsAppDrawerProps> = ({ open, onClose }) => {
    const { push } = useGlassyToasts();
    const [template, setTemplate] = useState('');
    const [params, setParams] = useState<{ [key: string]: string }>({});

    const handleSend = () => {
        push({ title: "Broadcast Sent", description: "WhatsApp message queued for delivery.", variant: "success" });
        onClose();
    };

    return (
        <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
            <DrawerContent className="w-full md:w-[600px] p-0 rounded-l-3xl border-l" showCloseButton={true}>
                <DrawerHeader className="border-b px-6 py-4">
                    <DrawerTitle className="flex items-center gap-2">
                        <Icon name="messageCircle" className="w-6 h-6 text-green-600" />
                        New WhatsApp Broadcast
                    </DrawerTitle>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    <div className="space-y-2">
                        <Label>Campaign Name</Label>
                        <Input placeholder="Internal name (e.g. Diwali Sale)" />
                    </div>

                    <div className="space-y-2">
                        <Label>Target Audience</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select Segment" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Contacts</SelectItem>
                                <SelectItem value="vip">VIP Customers</SelectItem>
                                <SelectItem value="optin">WhatsApp Opt-ins</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Message Template (Pre-approved)</Label>
                        <Select value={template} onValueChange={setTemplate}>
                            <SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="welcome">welcome_message_v1</SelectItem>
                                <SelectItem value="order_update">order_status_update</SelectItem>
                                <SelectItem value="promo">seasonal_promo_offer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {template && (
                        <Card className="bg-white dark:bg-zinc-900 border-green-200 dark:border-green-900">
                            <div className="p-4 space-y-4">
                                <h4 className="text-xs font-bold uppercase text-green-600">Preview</h4>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm text-gray-800 dark:text-gray-200 relative">
                                    <p>Hi {"{{1}}"},</p>
                                    <p className="mt-2">We have a special offer just for you! Get {"{{2}}"}% off on your next purchase.</p>
                                    <p className="mt-2">Use code: <strong>{"{{3}}"}</strong></p>
                                    <p className="mt-2 text-xs text-gray-500">Reply STOP to unsubscribe.</p>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label>Variable Values</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Input placeholder="{{1}} (e.g. Name or 'Customer')" onChange={(e) => setParams({...params, 1: e.target.value})} />
                                        <Input placeholder="{{2}} (e.g. 20)" onChange={(e) => setParams({...params, 2: e.target.value})} />
                                        <Input placeholder="{{3}} (e.g. SAVE20)" onChange={(e) => setParams({...params, 3: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    <div className="space-y-2">
                        <Label>Media (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:bg-white dark:hover:bg-zinc-900">
                            <Icon name="image" className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">Upload Image or PDF</p>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t px-6 py-4 bg-white dark:bg-zinc-900 flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSend}>Send Broadcast</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
