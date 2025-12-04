
import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from "../../../../components/ui/Drawer";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle as CardTitleUI } from "../../../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Icon } from "../../../../components/shared/Icon";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { formatCurrency } from "../../../../lib/utils";
import type { SalesOrder } from "../../../../types";

interface SalesOrderDetailsDrawerProps {
    order: SalesOrder | null;
    open: boolean;
    onClose: () => void;
}

// Mock data generator for display purposes since the SalesOrder type is lightweight
const getMockOrderDetails = (order: SalesOrder | null) => {
    if (!order) return null;
    
    // If real items exist, use them
    if (order.items && order.items.length > 0) {
        return {
            ...order,
            items: order.items
        };
    }

    const safeAmount = order.totalAmount || 0;
    const safeCount = order.itemCount || 1;

    return {
        ...order,
        items: [
            { id: 1, name: "Ergonomic Office Chair", sku: "FURN-001", quantity: Math.ceil(safeCount * 0.3) || 1, price: safeAmount * 0.3, total: safeAmount * 0.3 },
            { id: 2, name: "Wooden Conference Table", sku: "FURN-002", quantity: Math.ceil(safeCount * 0.7) || 1, price: safeAmount * 0.7, total: safeAmount * 0.7 },
        ]
    };
};

// Helper for static address if missing
const getAddress = (addr: any, fallback: any) => {
    if (addr && addr.street) return addr;
    return fallback;
};

export const SalesOrderDetailsDrawer: React.FC<SalesOrderDetailsDrawerProps> = ({ order, open, onClose }) => {
    if (!order) return null;

    const details = getMockOrderDetails(order);
    const billing = getAddress(order.billingAddress, {
        street: "45 Corporate Heights",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400051",
        country: "India"
    });
    const shipping = getAddress(order.shippingAddress, {
         street: "123 Business Park, Sector 62",
         city: "Noida",
         state: "Uttar Pradesh",
         zip: "201301",
         country: "India"
    });

    return (
        <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <DrawerTitle className="text-xl">Order {order.id}</DrawerTitle>
                                <StatusBadge status={order.status} />
                            </div>
                            <DrawerDescription className="mt-1">
                                Placed on {new Date(order.orderDate).toLocaleDateString()} by <span className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</span>
                            </DrawerDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Icon name="download" className="h-4 w-4 mr-2" /> Invoice
                            </Button>
                            <Button variant="outline" size="sm">
                                <Icon name="edit" className="h-4 w-4 mr-2" /> Edit
                            </Button>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    
                    {/* Timeline / Status Bar */}
                    <div className="flex items-center justify-between px-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full">
                                <Icon name="check" className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Payment Verified</p>
                                <p className="text-xs text-gray-500">Visa ending in 4242</p>
                            </div>
                        </div>
                        <div className="h-px w-12 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                <Icon name="package" className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Processing</p>
                                <p className="text-xs text-gray-500">Estimated ship: Tomorrow</p>
                            </div>
                        </div>
                         <div className="h-px w-12 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
                         <div className="flex items-center gap-3 opacity-50">
                            <div className="p-2 bg-gray-200 text-gray-500 rounded-full">
                                <Icon name="send" className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Delivery</p>
                                <p className="text-xs text-gray-500">Pending</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <Card className="shadow-none border border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-2">
                            <CardTitleUI className="text-base">Order Items ({order.itemCount})</CardTitleUI>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-transparent hover:bg-transparent">
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {details?.items.map((item: any) => (
                                        <TableRow key={item.id} className="border-b last:border-0 hover:bg-transparent">
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.sku}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-gray-700 dark:text-gray-300">{formatCurrency(item.price)}</TableCell>
                                            <TableCell className="text-center text-gray-700 dark:text-gray-300">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(item.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-none border border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitleUI className="text-sm text-gray-500 uppercase tracking-wider">Billing Address</CardTitleUI>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {billing.street}<br />
                                    {billing.city}, {billing.state} {billing.zip || billing.postalCode}<br />
                                    {billing.country}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none border border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitleUI className="text-sm text-gray-500 uppercase tracking-wider">Shipping Address</CardTitleUI>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {shipping.street}<br />
                                    {shipping.city}, {shipping.state} {shipping.zip || shipping.postalCode}<br />
                                    {shipping.country}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Financial Summary */}
                    <div className="flex justify-end">
                        <div className="w-full md:w-1/2 space-y-3">
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                <span className="text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Tax (GST 18%)</span>
                                <span className="text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(order.taxes)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                <span className="text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(0)}</span>
                            </div>
                            <div className="border-t dark:border-gray-700 my-2"></div>
                            <div className="flex justify-between text-base font-bold">
                                <span className="text-gray-900 dark:text-gray-100">Total</span>
                                <span className="text-gray-900 dark:text-gray-100">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <DrawerFooter className="border-t px-6 py-4 bg-white dark:bg-zinc-900">
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <Icon name="mail" className="h-4 w-4 mr-2" /> Email Invoice
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
