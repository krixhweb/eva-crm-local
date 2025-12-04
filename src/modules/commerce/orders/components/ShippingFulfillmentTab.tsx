
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Icon } from "../../../../components/shared/Icon";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/ui/Select";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import { Badge } from "../../../../components/ui/Badge";
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { formatCurrency, cn } from '../../../../lib/utils';
import type { ShippingInfo } from '../../../../types';
import Timeline from '../../../../components/ui/Timeline';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "../../../../components/ui/Drawer";

interface ShippingFulfillmentTabProps {
    shippingInfo: ShippingInfo[];
}

const CARRIERS = ["DHL", "FedEx", "BlueDart", "Delhivery", "India Post", "DTDC", "XpressBees"];
const SHIPPING_METHODS = ["Standard Ground", "Express", "Same Day", "Next Day Air"];

// Mock data extension for demo purposes
const getMockAddress = (name: string) => ({
    street: "123 Innovation Drive, Tech Park",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560103",
    country: "India",
    phone: "+91 98765 43210"
});

const getMockItems = (orderId: string) => [
    { name: "Ergonomic Office Chair", qty: 1, weight: 12.5 },
    { name: "Wireless Keyboard", qty: 1, weight: 0.8 },
];

// --- LABEL PREVIEW MODAL ---
const LabelPreviewModal = ({ isOpen, onClose, orderId, carrier, tracking, customerName }: any) => (
    <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
            <DrawerHeader className="border-b px-6 py-4">
                <DrawerTitle>Shipping Label Preview</DrawerTitle>
                <DrawerDescription>Standard 4x6 Thermal Label</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-gray-100 dark:bg-zinc-900">
                <div className="w-[300px] h-[450px] bg-white text-black p-4 border-2 border-black flex flex-col justify-between shadow-lg">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-4">
                        <div className="font-bold text-2xl uppercase">{carrier}</div>
                        <div className="text-xs font-bold">
                            <p>PRIORITY</p>
                            <p>1-DAY</p>
                        </div>
                    </div>
                    
                    {/* Addresses */}
                    <div className="py-2 text-xs">
                        <p className="font-bold text-gray-500 mb-1">FROM:</p>
                        <p>Eva Store Warehouse A</p>
                        <p>123 Logistics Way</p>
                        <p>Mumbai, MH 400001</p>
                    </div>
                    <div className="py-2 text-sm border-t-2 border-black">
                        <p className="font-bold text-gray-500 mb-1 text-xs">SHIP TO:</p>
                        <p className="font-bold text-lg">{customerName}</p>
                        <p>123 Innovation Drive</p>
                        <p>Tech Park</p>
                        <p className="font-bold">BENGALURU, KA 560103</p>
                    </div>

                    {/* Tracking Barcode Placeholder */}
                    <div className="flex-1 flex flex-col items-center justify-center border-t-4 border-black py-4">
                        <div className="h-16 w-full bg-black mb-2" style={{ clipPath: 'polygon(0 0, 5% 0, 5% 100%, 10% 100%, 10% 0, 15% 0, 15% 100%, 20% 100%, 20% 0, 25% 0, 25% 100%, 30% 100%, 30% 0, 35% 0, 35% 100%, 40% 100%, 40% 0, 45% 0, 45% 100%, 50% 100%, 50% 0, 55% 0, 55% 100%, 60% 100%, 60% 0, 65% 0, 65% 100%, 70% 100%, 70% 0, 75% 0, 75% 100%, 80% 100%, 80% 0, 85% 0, 85% 100%, 90% 100%, 90% 0, 95% 0, 95% 100%, 100% 100%, 100% 0)' }}></div>
                        <p className="font-mono font-bold text-sm tracking-widest">{tracking}</p>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 border-black pt-2 flex justify-between items-end">
                        <div>
                            <p className="text-xs font-bold">REF: {orderId}</p>
                            <p className="text-xs">WGT: 13.3 KG</p>
                        </div>
                        <div className="text-2xl font-bold">A1</div>
                    </div>
                </div>
            </div>
            <DrawerFooter className="border-t px-6 py-4 flex-row justify-end gap-2 bg-white dark:bg-zinc-900">
                <Button variant="outline" onClick={onClose}><Icon name="download" className="w-4 h-4 mr-2"/> Download PDF</Button>
                <Button onClick={onClose} className="bg-blue-600 text-white">Print Label</Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
);

const ShippingFulfillmentTab: React.FC<ShippingFulfillmentTabProps> = ({ shippingInfo: initialShippingInfo }) => {
    // --- Local State ---
    const [shipments, setShipments] = useState(initialShippingInfo);
    const [selectedId, setSelectedId] = useState<string | null>(initialShippingInfo[0]?.orderId || null);
    const [filterStatus, setFilterStatus] = useState('Pending'); // 'Pending', 'Packed', 'Shipped', 'All'
    const [search, setSearch] = useState('');
    
    // Form State for selected order
    const [form, setForm] = useState({
        carrier: '',
        trackingNumber: '',
        method: 'Standard Ground',
        weight: '',
        length: '30',
        width: '20',
        height: '15',
    });

    const [labelState, setLabelState] = useState<'idle' | 'generating' | 'generated'>('idle');
    const [showLabelModal, setShowLabelModal] = useState(false);

    const selectedOrder = useMemo(() => shipments.find(s => s.orderId === selectedId), [shipments, selectedId]);

    // Reset form when order changes
    useEffect(() => {
        if (selectedOrder) {
            setForm({
                carrier: selectedOrder.carrier || '',
                trackingNumber: selectedOrder.trackingNumber || '',
                method: 'Standard Ground',
                weight: '2.5', // Mock default
                length: '30',
                width: '20',
                height: '15',
            });
            // If order already has tracking, assume label is generated
            setLabelState(selectedOrder.trackingNumber ? 'generated' : 'idle');
        }
    }, [selectedId, selectedOrder]);

    // --- HANDLERS ---

    const handleGenerateLabel = () => {
        if (!form.carrier) {
            alert("Please select a carrier.");
            return;
        }
        
        setLabelState('generating');
        
        // Simulate API call
        setTimeout(() => {
            const mockTracking = `TRK-${Math.floor(Math.random() * 1000000000)}`;
            setForm(prev => ({ ...prev, trackingNumber: mockTracking }));
            setLabelState('generated');
            
            // Update order in list
            setShipments(prev => prev.map(s => s.orderId === selectedId ? { ...s, trackingNumber: mockTracking, carrier: form.carrier, status: 'Packed' } : s));
        }, 1500);
    };

    const handleUpdateStatus = (newStatus: string) => {
        setShipments(prev => prev.map(s => {
            if (s.orderId === selectedId) {
                const newHistory = [
                    { status: newStatus, date: new Date().toISOString(), location: 'Warehouse A' },
                    ...s.history
                ];
                return { ...s, status: newStatus as any, history: newHistory };
            }
            return s;
        }));
    };

    // --- FILTERING ---
    const filteredShipments = useMemo(() => {
        return shipments.filter(s => {
            const matchesSearch = s.orderId.toLowerCase().includes(search.toLowerCase()) || s.customerName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filterStatus === 'All' 
                ? true 
                : filterStatus === 'Pending' ? (s.status === 'Pending')
                : s.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [shipments, search, filterStatus]);

    const address = selectedOrder ? getMockAddress(selectedOrder.customerName) : null;
    const items = selectedOrder ? getMockItems(selectedOrder.orderId) : [];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            
            {/* --- LEFT PANEL: ORDER LIST --- */}
            <Card className="w-full lg:w-1/3 flex flex-col h-full border-r dark:border-gray-800 rounded-r-none">
                <div className="p-4 border-b dark:border-gray-800 space-y-4">
                    <div className="relative">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search orders..." 
                            className="pl-9" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-md">
                        {['Pending', 'Packed', 'Shipped', 'All'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors",
                                    filterStatus === status 
                                        ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100" 
                                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50 dark:bg-zinc-900/50">
                    {filteredShipments.map(s => (
                        <div 
                            key={s.orderId}
                            onClick={() => setSelectedId(s.orderId)}
                            className={cn(
                                "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                                selectedId === s.orderId 
                                    ? "bg-white dark:bg-zinc-800 border-green-500 ring-1 ring-green-500" 
                                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-gray-800 hover:border-gray-300"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-900 dark:text-gray-100">{s.orderId}</span>
                                <StatusBadge status={s.status} />
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{s.customerName}</div>
                            <div className="flex justify-between items-end text-xs text-gray-500">
                                <span>{getMockItems(s.orderId).length} Items</span>
                                <span>{s.history[0]?.date.split('T')[0] || 'N/A'}</span>
                            </div>
                        </div>
                    ))}
                    {filteredShipments.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No orders found.</div>
                    )}
                </div>
            </Card>

            {/* --- CENTER/RIGHT PANEL: WORKSPACE --- */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                
                {/* Main Details Area */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {selectedOrder ? (
                        <>
                            {/* 1. Shipment Configuration */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Icon name="package" className="w-5 h-5 text-blue-500" />
                                        Shipment Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Carrier <span className="text-red-500">*</span></Label>
                                            <Select 
                                                value={form.carrier} 
                                                onValueChange={(v) => setForm({...form, carrier: v})}
                                                disabled={labelState === 'generated'}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Carrier" /></SelectTrigger>
                                                <SelectContent>
                                                    {CARRIERS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Shipping Method</Label>
                                            <Select 
                                                value={form.method} 
                                                onValueChange={(v) => setForm({...form, method: v})}
                                                disabled={labelState === 'generated'}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {SHIPPING_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Package Details</Label>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Weight (kg)</span>
                                                <Input 
                                                    type="number" 
                                                    value={form.weight} 
                                                    onChange={e => setForm({...form, weight: e.target.value})} 
                                                    disabled={labelState === 'generated'}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Length (cm)</span>
                                                <Input 
                                                    type="number" 
                                                    value={form.length} 
                                                    onChange={e => setForm({...form, length: e.target.value})}
                                                    disabled={labelState === 'generated'}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Width (cm)</span>
                                                <Input 
                                                    type="number" 
                                                    value={form.width} 
                                                    onChange={e => setForm({...form, width: e.target.value})}
                                                    disabled={labelState === 'generated'}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Height (cm)</span>
                                                <Input 
                                                    type="number" 
                                                    value={form.height} 
                                                    onChange={e => setForm({...form, height: e.target.value})}
                                                    disabled={labelState === 'generated'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        {labelState === 'generated' ? (
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between animate-in fade-in zoom-in-95">
                                                <div>
                                                    <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                                        <Icon name="checkCircle" className="w-5 h-5" /> Label Generated
                                                    </p>
                                                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">Tracking: {form.trackingNumber}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-zinc-800" onClick={() => setShowLabelModal(true)}>Preview</Button>
                                                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white">Print</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button 
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base shadow-sm"
                                                onClick={handleGenerateLabel}
                                                disabled={labelState === 'generating' || !form.carrier || !form.weight}
                                            >
                                                {labelState === 'generating' ? (
                                                    <><Icon name="refreshCw" className="w-4 h-4 mr-2 animate-spin" /> Generating Label...</>
                                                ) : (
                                                    <><Icon name="ticket" className="w-4 h-4 mr-2" /> Generate Shipping Label</>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 2. Order Summary & Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500 uppercase">Shipping Address</CardTitle></CardHeader>
                                    <CardContent>
                                        {address && (
                                            <div className="text-sm space-y-1">
                                                <p className="font-bold text-lg">{selectedOrder.customerName}</p>
                                                <p>{address.street}</p>
                                                <p>{address.city}, {address.state} {address.zip}</p>
                                                <p>{address.country}</p>
                                                <p className="text-gray-500 mt-2 flex items-center gap-2"><Icon name="phone" className="w-3 h-3"/> {address.phone}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500 uppercase">Order Items</CardTitle></CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between items-center text-sm border-b border-dashed dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                                                    <div>
                                                        <span className="font-medium">{item.name}</span>
                                                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{item.weight}kg</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Select an order to manage fulfillment
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Tracking & Actions */}
                {selectedOrder && (
                    <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                        
                        {/* Fulfillment Actions */}
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm">Fulfillment Actions</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {selectedOrder.status === 'Pending' && (
                                    <Button variant="outline" className="w-full justify-start" onClick={() => handleUpdateStatus('Packed')}>
                                        <Icon name="package" className="w-4 h-4 mr-2 text-purple-500" /> Mark as Packed
                                    </Button>
                                )}
                                {selectedOrder.status === 'Packed' && (
                                    <Button variant="outline" className="w-full justify-start" onClick={() => handleUpdateStatus('Shipped')} disabled={!selectedOrder.trackingNumber}>
                                        <Icon name="send" className="w-4 h-4 mr-2 text-blue-500" /> Mark as Shipped
                                    </Button>
                                )}
                                {selectedOrder.status === 'Shipped' && (
                                    <Button variant="outline" className="w-full justify-start" onClick={() => handleUpdateStatus('Delivered')}>
                                        <Icon name="checkCircle" className="w-4 h-4 mr-2 text-green-500" /> Mark as Delivered
                                    </Button>
                                )}
                                <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <Icon name="xCircle" className="w-4 h-4 mr-2" /> Cancel Shipment
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Tracking Timeline */}
                        <Card className="flex-1">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm">Tracking History</CardTitle>
                                {selectedOrder.trackingNumber && <Badge variant="outline" className="text-[10px]">{selectedOrder.carrier}</Badge>}
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-6 pl-2">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700"></div>

                                    {selectedOrder.history.map((event, index) => {
                                        const isLatest = index === 0;
                                        return (
                                            <div key={index} className="relative pl-8">
                                                <div className={cn(
                                                    "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-zinc-900 z-10",
                                                    isLatest ? "border-green-500 text-green-500" : "border-gray-300 text-gray-300"
                                                )}>
                                                    <div className={cn("w-2 h-2 rounded-full", isLatest ? "bg-green-500" : "bg-gray-300")} />
                                                </div>
                                                <div>
                                                    <p className={cn("text-sm font-medium", isLatest ? "text-gray-900 dark:text-white" : "text-gray-500")}>
                                                        {event.status}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Button variant="ghost" size="sm" className="w-full mt-6 text-xs text-gray-500">
                                    + Add Manual Update
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                )}
            </div>

            {/* Label Preview Modal */}
            {showLabelModal && selectedOrder && (
                <LabelPreviewModal 
                    isOpen={showLabelModal} 
                    onClose={() => setShowLabelModal(false)}
                    orderId={selectedOrder.orderId}
                    carrier={form.carrier}
                    tracking={form.trackingNumber}
                    customerName={selectedOrder.customerName}
                />
            )}
        </div>
    );
};

export default ShippingFulfillmentTab;
