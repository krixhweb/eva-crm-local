
import React from 'react';
import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";
import { Icon } from "../../../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { Badge } from '../../../../components/ui/Badge';
import { formatCurrency } from '../../../../lib/utils';
import type { Payment } from '../../../../types';

interface PaymentsTabProps {
    payments: Payment[];
    onAction: (action: string, payment: Payment) => void;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments, onAction }) => {
    const getStatusBadge = (status: Payment['status']): "green" | "yellow" | "red" => {
        switch (status) {
            case "Completed": return "green";
            case "Pending": return "yellow";
            case "Failed": return "red";
            default: return "green";
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-end p-6">
                <div className="relative w-64">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search payments..." className="pl-10" />
                </div>
            </div>
            <CardContent className="p-0">
                <div className="px-6 pb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payment ID</TableHead>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id} className="cursor-pointer" onClick={() => onAction('view-payment', payment)}>
                                    <TableCell className="font-medium text-blue-500 hover:underline">{payment.id}</TableCell>
                                    <TableCell>{payment.invoiceId}</TableCell>
                                    <TableCell>{payment.customerName}</TableCell>
                                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                    <TableCell>{payment.paymentDate}</TableCell>
                                    <TableCell><Badge variant={getStatusBadge(payment.status)}>{payment.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentsTab;
