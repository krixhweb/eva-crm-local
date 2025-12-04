
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Icon } from "../../../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../../components/ui/DropdownMenu';
import { formatCurrency } from '../../../../lib/utils';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { SalesOrderFilterDrawer, OrderFiltersState } from './SalesOrderFilterDrawer';
import { SalesOrderDetailsDrawer } from './SalesOrderDetailsDrawer';
import type { SalesOrder } from '../../../../types';

interface SalesOrdersTabProps {
    orders: SalesOrder[];
    onCreate: () => void;
}

const SalesOrdersTab: React.FC<SalesOrdersTabProps> = ({ orders, onCreate }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
    
    // Filter State
    const [filters, setFilters] = useState<OrderFiltersState>({
        search: "",
        dateFrom: "",
        dateTo: "",
        status: [],
        minAmount: "",
        maxAmount: "",
    });

    // Calculate number of active filters for the badge
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.dateFrom) count++;
        if (filters.dateTo) count++;
        if (filters.status.length > 0) count += filters.status.length;
        if (filters.minAmount) count++;
        if (filters.maxAmount) count++;
        return count;
    }, [filters]);

    // Filtering Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // 1. Search (ID or Customer)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesId = order.id.toLowerCase().includes(searchLower);
                const matchesCustomer = order.customerName.toLowerCase().includes(searchLower);
                if (!matchesId && !matchesCustomer) return false;
            }

            // 2. Date Range
            if (filters.dateFrom) {
                const orderDate = new Date(order.orderDate);
                const fromDate = new Date(filters.dateFrom);
                if (orderDate < fromDate) return false;
            }
            if (filters.dateTo) {
                const orderDate = new Date(order.orderDate);
                const toDate = new Date(filters.dateTo);
                // Set to end of day
                toDate.setHours(23, 59, 59, 999);
                if (orderDate > toDate) return false;
            }

            // 3. Status
            if (filters.status.length > 0) {
                if (!filters.status.includes(order.status)) return false;
            }

            // 4. Amount Range
            if (filters.minAmount) {
                if (order.totalAmount < parseFloat(filters.minAmount)) return false;
            }
            if (filters.maxAmount) {
                if (order.totalAmount > parseFloat(filters.maxAmount)) return false;
            }

            return true;
        });
    }, [orders, filters]);

    const handleApplyFilters = (newFilters: OrderFiltersState) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            dateFrom: "",
            dateTo: "",
            status: [],
            minAmount: "",
            maxAmount: "",
        });
    };

    const handleRowClick = (order: SalesOrder) => {
        setSelectedOrder(order);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-1/3 hidden md:block">
                             <div className="flex items-center text-sm text-gray-500">
                                <Icon name="list" className="mr-2 h-4 w-4" />
                                {filteredOrders.length} orders found
                             </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto justify-end">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsFilterOpen(true)}
                                className="relative"
                            >
                                <Icon name="list" className="h-4 w-4 mr-2" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white dark:border-zinc-900">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                            <Button onClick={onCreate} className="bg-green-600 hover:bg-green-700 text-white">
                                <Icon name="plus" className="h-4 w-4 mr-2" />
                                Create Sales Order
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border dark:border-zinc-800 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-center">Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                            No orders found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow 
                                            key={order.id} 
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                                            onClick={() => handleRowClick(order)}
                                        >
                                            <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                                                {order.id}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900 dark:text-gray-200">{order.customerName}</TableCell>
                                            <TableCell className="text-gray-500">{order.orderDate}</TableCell>
                                            <TableCell className="text-center text-gray-500">{order.itemCount}</TableCell>
                                            <TableCell className="text-right font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(order.totalAmount)}</TableCell>
                                            <TableCell><StatusBadge status={order.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                                                                <Icon name="moreVertical" className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleRowClick(order)}>View Details</DropdownMenuItem>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Convert to Invoice</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <SalesOrderFilterDrawer 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentFilters={filters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

            <SalesOrderDetailsDrawer 
                order={selectedOrder}
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </>
    );
};

export default SalesOrdersTab;
