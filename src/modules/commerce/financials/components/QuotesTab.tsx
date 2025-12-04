
import React from 'react';
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Icon } from "../../../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../../components/ui/DropdownMenu';
import { Badge } from '../../../../components/ui/Badge';
import { formatCurrency } from '../../../../lib/utils';
import type { Quote } from '../../../../types';

interface QuotesTabProps {
    quotes: Quote[];
    onAction: (action: string, quote: Quote) => void;
    onViewDetails: (id: string) => void;
    onCreate: () => void;
}

const QuotesTab: React.FC<QuotesTabProps> = ({ quotes, onAction, onViewDetails, onCreate }) => {
    const getStatusBadge = (status: Quote['status']): "green" | "blue" | "red" | "gray" => {
        switch (status) {
            case "Accepted": return "green";
            case "Sent": return "blue";
            case "Expired": return "red";
            case "Draft": return "gray";
            default: return "gray";
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-end gap-3 p-6">
                <div className="relative w-64">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search quotes..." className="pl-10" />
                </div>
                <Button onClick={onCreate}>
                    <Icon name="plus" className="h-4 w-4 mr-2" />
                    Create Quote
                </Button>
            </div>
            <CardContent className="p-0">
                <div className="px-6 pb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quote #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Valid Till</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotes.map((quote) => (
                                <TableRow key={quote.id}>
                                    <TableCell className="font-medium text-blue-500 cursor-pointer hover:underline" onClick={() => onViewDetails(quote.id)}>
                                        {quote.id}
                                    </TableCell>
                                    <TableCell>{quote.customerName}</TableCell>
                                    <TableCell>{quote.validTill}</TableCell>
                                    <TableCell>{formatCurrency(quote.total)}</TableCell>
                                    <TableCell><Badge variant={getStatusBadge(quote.status)}>{quote.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><Icon name="moreVertical" className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewDetails(quote.id)}>View Details</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction('edit-quote', quote)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction('send-quote', quote)}>Send</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction('convert-to-invoice', quote)}>Convert to Invoice</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" onClick={() => onAction('delete', quote)}>Delete</DropdownMenuItem>
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

export default QuotesTab;
