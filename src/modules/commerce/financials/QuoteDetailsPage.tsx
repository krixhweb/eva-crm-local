
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/shared/Icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { formatCurrency } from '../../../lib/utils';
import { mockQuotes } from '../../../data/financialsMockData';
import { mockCustomers } from '../../../data/mockData';

const QuoteDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const quote = mockQuotes.find(q => q.id === id);
    const customer = mockCustomers.find(c => c.id === quote?.customerId);

    if (!quote || !customer) {
        return <div className="text-center p-8">Quote not found.</div>;
    }

    const getStatusBadge = (status: typeof quote.status) => {
        const map = { 'Draft': 'gray', 'Sent': 'blue', 'Accepted': 'green', 'Expired': 'red' };
        return map[status] as "gray" | "blue" | "green" | "red";
    };

    return (
        <div className="space-y-6">
            <Link to="/commerce/financials" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600">
                <Icon name="arrowLeft" className="w-4 h-4" /> Back to Financial Hub
            </Link>

            {/* Header */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Quote {quote.id}</h1>
                        <Badge variant={getStatusBadge(quote.status)}>{quote.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><Icon name="edit" className="mr-2 h-4 w-4" />Edit</Button>
                        <Button variant="outline"><Icon name="send" className="mr-2 h-4 w-4" />Send</Button>
                        <Button><Icon name="fileText" className="mr-2 h-4 w-4" />Convert to Invoice</Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Line Items */}
                    <Card>
                        <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quote.lineItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.description}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatCurrency(item.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Terms & Notes */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card><CardHeader><CardTitle>Terms & Conditions</CardTitle></CardHeader><CardContent><p className="text-sm">{quote.terms}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader><CardContent><p className="text-sm">{quote.notes}</p></CardContent></Card>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-semibold text-lg">{customer.name}</p>
                            <p className="text-gray-500">{customer.email}</p>
                            <p className="text-gray-500">{customer.phone}</p>
                        </CardContent>
                    </Card>

                    {/* Financial Summary */}
                    <Card>
                        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(quote.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>- {formatCurrency(quote.discount)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>+ {formatCurrency(quote.tax)}</span></div>
                            <div className="border-t my-2 dark:border-gray-700"></div>
                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(quote.total)}</span></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetailsPage;
