
import React from 'react';
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { formatCurrency } from '../../../../lib/utils';
import type { SupplierReturn } from '../../../../types';

interface ReturnsRefundsTabProps {
    returns: SupplierReturn[];
}

const ReturnsRefundsTab: React.FC<ReturnsRefundsTabProps> = ({ returns }) => {
    return (
        <Card>
            <CardHeader>
                <p className="text-gray-500 dark:text-gray-400">Manage returns and refunds to suppliers.</p>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Return ID</TableHead>
                            <TableHead>PO #</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {returns.map((ret) => (
                            <TableRow key={ret.id}>
                                <TableCell className="font-medium">{ret.id}</TableCell>
                                <TableCell className="text-blue-500 hover:underline cursor-pointer">{ret.purchaseOrderId}</TableCell>
                                <TableCell>{ret.supplierName}</TableCell>
                                <TableCell className="text-sm text-gray-500">{ret.date}</TableCell>
                                <TableCell>{ret.itemCount}</TableCell>
                                <TableCell className="font-medium">{formatCurrency(ret.amount)}</TableCell>
                                <TableCell className="text-sm">{ret.reason}</TableCell>
                                <TableCell>
                                    <StatusBadge status={ret.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {returns.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                    No supplier returns found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ReturnsRefundsTab;
