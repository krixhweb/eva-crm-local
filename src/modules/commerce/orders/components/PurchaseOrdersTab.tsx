
import React from 'react';
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Icon } from "../../../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { formatCurrency } from '../../../../lib/utils';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/Tabs";
import type { PurchaseOrder } from '../../../../types';

interface PurchaseOrdersTabProps {
    orders: PurchaseOrder[];
    onCreate: () => void;
    onCreateReplenishment: () => void;
}

// Mock Data for Replenishment Orders UI
const mockReplenishmentOrders = [
    { id: "RO-5001", supplier: "Furniture Co.", reason: "Low Stock", quantity: 50, delivery: "2024-08-15", status: "Pending" },
    { id: "RO-5002", supplier: "Decor Direct", reason: "Forecast", quantity: 120, delivery: "2024-08-20", status: "Approved" },
    { id: "RO-5003", supplier: "Office Essentials", reason: "Rule (Safety Stock)", quantity: 25, delivery: "2024-08-12", status: "Received" },
    { id: "RO-5004", supplier: "Furniture Co.", reason: "Backorder", quantity: 10, delivery: "2024-08-10", status: "Approved" },
];

const PurchaseOrdersTab: React.FC<PurchaseOrdersTabProps> = ({ orders, onCreate, onCreateReplenishment }) => {
    return (
        <div className="space-y-4">
            <Tabs defaultValue="purchase_orders" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="purchase_orders">Purchase Orders</TabsTrigger>
                    <TabsTrigger value="replenishment_orders">Replenishment Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="purchase_orders" className="mt-0">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative w-full md:w-1/3">
                                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Search by PO ID or supplier..." className="pl-10" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">
                                        <Icon name="list" className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                    <Button onClick={onCreate} className="bg-green-600 hover:bg-green-700 text-white">
                                        <Icon name="plus" className="h-4 w-4 mr-2" />
                                        Create Purchase Order
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>PO ID</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Created Date</TableHead>
                                        <TableHead>Expected Delivery</TableHead>
                                        <TableHead className="text-right">Total Cost</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((po) => (
                                        <TableRow key={po.id}>
                                            <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">{po.id}</TableCell>
                                            <TableCell>{po.supplierName}</TableCell>
                                            <TableCell>{po.createdDate}</TableCell>
                                            <TableCell>{po.expectedDelivery}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatCurrency(po.totalCost)}</TableCell>
                                            <TableCell><StatusBadge status={po.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="replenishment_orders" className="mt-0">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative w-full md:w-1/3">
                                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Search by RO ID or supplier..." className="pl-10" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">
                                        <Icon name="list" className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                    <Button onClick={onCreateReplenishment} className="bg-green-600 hover:bg-green-700 text-white">
                                        <Icon name="plus" className="h-4 w-4 mr-2" />
                                        Create Replenishment Order
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>RO ID</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Trigger Reason</TableHead>
                                        <TableHead className="text-center">Required Quantity</TableHead>
                                        <TableHead>Suggested Delivery</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockReplenishmentOrders.map((ro) => (
                                        <TableRow key={ro.id}>
                                            <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">{ro.id}</TableCell>
                                            <TableCell>{ro.supplier}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                                                    {ro.reason}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">{ro.quantity}</TableCell>
                                            <TableCell>{ro.delivery}</TableCell>
                                            <TableCell><StatusBadge status={ro.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PurchaseOrdersTab;
