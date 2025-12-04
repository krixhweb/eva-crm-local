
import React from 'react';
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Icon } from "../../../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../../components/ui/DropdownMenu';
import { Badge } from '../../../../components/ui/Badge';
import { formatCurrency } from '../../../../lib/utils';
import type { Invoice } from '../../../../types';

interface InvoicesTabProps {
    invoices: Invoice[];
    onAction: (action: string, invoice: Invoice) => void;
    onViewDetails: (id: string) => void;
    onCreate: () => void;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ invoices, onAction, onViewDetails, onCreate }) => {
    const getStatusBadge = (status: Invoice['status']): "green" | "blue" | "red" | "yellow" | "gray" => {
        switch (status) {
            case "Paid": return "green";
            case "Partially Paid": return "blue";
            case "Overdue": return "red";
            case "Sent": return "yellow";
            case "Draft": return "gray";
            default: return "gray";
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-end gap-3 p-6">
                <div className="relative w-64">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search invoices..." className="pl-10" />
                </div>
                <Button onClick={onCreate}>
                    <Icon name="plus" className="h-4 w-4 mr-2" />
                    Create Invoice
                </Button>
            </div>
            <CardContent className="p-0">
                <div className="px-6 pb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium text-blue-500 cursor-pointer hover:underline" onClick={() => onViewDetails(invoice.id)}>
                                        {invoice.id}
                                    </TableCell>
                                    <TableCell>{invoice.customerName}</TableCell>
                                    <TableCell>{invoice.dueDate}</TableCell>
                                    <TableCell>{formatCurrency(invoice.total)}</TableCell>
                                    <TableCell className="font-semibold">{formatCurrency(invoice.balance)}</TableCell>
                                    <TableCell><Badge variant={getStatusBadge(invoice.status)}>{invoice.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><Icon name="moreVertical" className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewDetails(invoice.id)}>View Details</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction('edit-invoice', invoice)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction('record-payment', invoice)}>Record Payment</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction('send-invoice', invoice)}>Send</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" onClick={() => onAction('delete', invoice)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoicesTab;
