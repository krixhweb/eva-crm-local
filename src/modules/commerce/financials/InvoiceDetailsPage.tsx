
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/shared/Icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { formatCurrency } from '../../../lib/utils';
import { mockInvoices, mockPayments } from '../../../data/financialsMockData';
import { mockCustomers } from '../../../data/mockData';

const InvoiceDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const invoice = mockInvoices.find(i => i.id === id);
    const customer = mockCustomers.find(c => c.id === invoice?.customerId);
    const payments = mockPayments.filter(p => p.invoiceId === id);

    if (!invoice || !customer) {
        return <div className="text-center p-8">Invoice not found.</div>;
    }

    const getStatusBadge = (status: typeof invoice.status) => {
        const map = { 'Draft': 'gray', 'Sent': 'yellow', 'Paid': 'green', 'Partially Paid': 'blue', 'Overdue': 'red' };
        return map[status] as "gray" | "yellow" | "green" | "blue" | "red";
    };

    return (
        <div className="space-y-6">
            <Link to="/commerce/financials" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600">
                <Icon name="arrowLeft" className="w-4 h-4" /> Back to Financial Hub
            </Link>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Invoice {invoice.id}</h1>
                        <Badge variant={getStatusBadge(invoice.status)}>{invoice.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><Icon name="edit" className="mr-2 h-4 w-4" />Edit</Button>
                        <Button variant="outline"><Icon name="download" className="mr-2 h-4 w-4" />Download</Button>
                        <Button><Icon name="creditCard" className="mr-2 h-4 w-4" />Record Payment</Button>
                    </div>
                </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoice.lineItems.map(item => (
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

                    <Card>
                        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
                        <CardContent>
                            {payments.length > 0 ? (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Payment ID</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {payments.map(p => (
                                            <TableRow key={p.id}>
                                                <TableCell>{p.paymentDate}</TableCell>
                                                <TableCell className="font-medium">{p.id}</TableCell>
                                                <TableCell>{p.method}</TableCell>
                                                <TableCell className="text-right font-semibold">{formatCurrency(p.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-sm text-gray-500">No payments recorded for this invoice.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-semibold text-lg">{customer.name}</p>
                            <p className="text-gray-500">{customer.email}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(invoice.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>- {formatCurrency(invoice.discount)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>+ {formatCurrency(invoice.tax)}</span></div>
                            <div className="border-t my-2 dark:border-gray-700"></div>
                            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatCurrency(invoice.total)}</span></div>
                            <div className="flex justify-between text-green-600"><span className="text-gray-500">Paid</span><span>- {formatCurrency(invoice.amountPaid)}</span></div>
                            <div className="border-t my-2 dark:border-gray-700"></div>
                            <div className="flex justify-between font-bold text-lg bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-md"><span>Balance Due</span><span>{formatCurrency(invoice.balance)}</span></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsPage;
