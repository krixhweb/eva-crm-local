
import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { Icon } from "../../../components/shared/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { useGlassyToasts } from "../../../components/ui/GlassyToastProvider";

import SalesOrdersTab from './components/SalesOrdersTab';
import PurchaseOrdersTab from './components/PurchaseOrdersTab';
import ReturnsRefundsTab from './components/ReturnsRefundsTab';
import ShippingFulfillmentTab from './components/ShippingFulfillmentTab';

import CreateSalesOrderModal from "../../../components/modals/CreateSalesOrderModal";
import CreatePurchaseOrderModal from "../../../components/modals/CreatePurchaseOrderModal";
import CreateReplenishmentOrderDrawer, { ReplenishmentOrderPayload } from "../../../components/modals/CreateReplenishmentOrderDrawer";

import { mockSalesOrders, mockPurchaseOrders, mockSupplierReturns, mockShipping } from "../../../data/ordersMockData";
import type { SalesOrder, PurchaseOrder, SupplierReturn, ShippingInfo } from "../../../types";

const OrdersManagementPage = () => {
    const { push } = useGlassyToasts();
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
    const [supplierReturns, setSupplierReturns] = useState<SupplierReturn[]>(mockSupplierReturns);
    const [shipping, setShipping] = useState<ShippingInfo[]>(mockShipping);
    
    const [isCreateSalesOrderOpen, setCreateSalesOrderOpen] = useState(false);
    const [isCreatePurchaseOrderOpen, setCreatePurchaseOrderOpen] = useState(false);
    const [isCreateReplenishmentOpen, setCreateReplenishmentOpen] = useState(false);
    
    const stats = [
        { label: "Pending Orders", value: salesOrders.filter(o => o.status === 'Pending').length, icon: 'clock' as const, color: "text-yellow-500" },
        { label: "To Ship", value: shipping.filter(s => s.status === 'Packed').length, icon: 'package' as const, color: "text-blue-500" },
        { label: "Completed Orders", value: salesOrders.filter(o => o.status === 'Completed').length, icon: 'checkCircle' as const, color: "text-green-500" },
        { label: "Supplier Returns", value: supplierReturns.filter(r => r.status === 'Pending').length, icon: 'refreshCw' as const, color: "text-red-500" },
    ];

    const handleCreateSalesOrder = (newOrder: SalesOrder) => {
        setSalesOrders(prev => [newOrder, ...prev]);
        setCreateSalesOrderOpen(false);
    };

    const handleCreatePurchaseOrder = (newPO: PurchaseOrder) => {
        setPurchaseOrders(prev => [newPO, ...prev]);
        setCreatePurchaseOrderOpen(false);
    };

    const handleCreateReplenishmentOrder = (order: ReplenishmentOrderPayload) => {
        push({ 
            title: "Replenishment Order Created", 
            description: `Order ${order.id} for ${order.productName} has been created. ${order.approvalRequired ? '(Pending Approval)' : ''}`,
            variant: "success" 
        });
        setCreateReplenishmentOpen(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Orders Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Track and manage all your sales, purchases, returns, and fulfillment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 ${stat.color}`}>
                                    <Icon name={stat.icon} className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="sales">
                <TabsList>
                    <TabsTrigger value="sales">Sales Orders</TabsTrigger>
                    <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
                    <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping & Fulfillment</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="mt-6">
                    <SalesOrdersTab orders={salesOrders} onCreate={() => setCreateSalesOrderOpen(true)} />
                </TabsContent>
                <TabsContent value="purchase" className="mt-6">
                    <PurchaseOrdersTab 
                        orders={purchaseOrders} 
                        onCreate={() => setCreatePurchaseOrderOpen(true)} 
                        onCreateReplenishment={() => setCreateReplenishmentOpen(true)}
                    />
                </TabsContent>
                <TabsContent value="returns" className="mt-6">
                    <ReturnsRefundsTab returns={supplierReturns} />
                </TabsContent>
                <TabsContent value="shipping" className="mt-6">
                    <ShippingFulfillmentTab shippingInfo={shipping} />
                </TabsContent>
            </Tabs>

            {isCreateSalesOrderOpen && (
                <CreateSalesOrderModal 
                    isOpen={isCreateSalesOrderOpen}
                    onClose={() => setCreateSalesOrderOpen(false)}
                    onSave={handleCreateSalesOrder}
                />
            )}
            {isCreatePurchaseOrderOpen && (
                <CreatePurchaseOrderModal
                    isOpen={isCreatePurchaseOrderOpen}
                    onClose={() => setCreatePurchaseOrderOpen(false)}
                    onSave={handleCreatePurchaseOrder}
                />
            )}
            {isCreateReplenishmentOpen && (
                <CreateReplenishmentOrderDrawer
                    open={isCreateReplenishmentOpen}
                    onOpenChange={setCreateReplenishmentOpen}
                    onSave={handleCreateReplenishmentOrder}
                />
            )}
        </div>
    );
};

export default OrdersManagementPage;
