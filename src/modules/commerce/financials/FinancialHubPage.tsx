
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Icon } from "../../../components/shared/Icon";
import { formatCurrency } from "../../../lib/utils";
import { useGlassyToasts } from "../../../components/ui/GlassyToastProvider";

import QuotesTab from './components/QuotesTab';
import InvoicesTab from './components/InvoicesTab';
import PaymentsTab from './components/PaymentsTab';

import CreateEditQuoteModal from '../../../components/modals/CreateEditQuoteModal';
import CreateEditInvoiceModal from '../../../components/modals/CreateEditInvoiceModal';
import RecordPaymentModal from '../../../components/modals/RecordPaymentModal';
import SendEmailModal from '../../../components/modals/SendEmailModal';
import ConfirmationDialog from '../../../components/modals/ConfirmationDialog';

import { mockQuotes, mockInvoices, mockPayments } from '../../../data/financialsMockData';
import type { Quote, Invoice, Payment } from '../../../types';

const FinancialHubPage = () => {
    const { push } = useGlassyToasts();
    const navigate = useNavigate();

    // State Management
    const [activeTab, setActiveTab] = useState("quotes");
    const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [payments, setPayments] = useState<Payment[]>(mockPayments);
    
    // Modal States
    const [modal, setModal] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Quote | Invoice | Payment | null>(null);

    // CRUD Handlers
    const handleSaveQuote = (quote: Quote) => {
        const isEditing = quotes.some(q => q.id === quote.id);
        setQuotes(prev => isEditing ? prev.map(q => q.id === quote.id ? quote : q) : [quote, ...prev]);
        push({ title: `Quote ${isEditing ? 'Updated' : 'Created'}`, description: `Quote ${quote.id} has been saved.`, variant: "success" });
        setModal(null);
    };

    const handleSaveInvoice = (invoice: Invoice) => {
        const isEditing = invoices.some(i => i.id === invoice.id);
        setInvoices(prev => isEditing ? prev.map(i => i.id === invoice.id ? invoice : i) : [invoice, ...prev]);
        push({ title: `Invoice ${isEditing ? 'Updated' : 'Created'}`, description: `Invoice ${invoice.id} has been saved.`, variant: "success" });
        setModal(null);
    };

    const handleRecordPayment = (payment: Payment) => {
        setPayments(prev => [payment, ...prev]);
        // Update invoice balance
        setInvoices(prev => prev.map(inv => {
            if (inv.id === payment.invoiceId) {
                const newPaid = inv.amountPaid + payment.amount;
                const newBalance = inv.balance - payment.amount;
                return {
                    ...inv,
                    amountPaid: newPaid,
                    balance: newBalance,
                    status: newBalance <= 0 ? 'Paid' : 'Partially Paid',
                };
            }
            return inv;
        }));
        push({ title: 'Payment Recorded', description: `Payment of ${formatCurrency(payment.amount)} for Invoice ${payment.invoiceId} recorded.`, variant: "success" });
        setModal(null);
    };

    const handleDelete = () => {
        if (!selectedItem) return;
        if ('validTill' in selectedItem) { // It's a Quote
            setQuotes(prev => prev.filter(q => q.id !== selectedItem.id));
            push({ title: 'Quote Deleted', variant: 'error' });
        } else if ('dueDate' in selectedItem) { // It's an Invoice
            setInvoices(prev => prev.filter(i => i.id !== selectedItem.id));
            push({ title: 'Invoice Deleted', variant: 'error' });
        }
        setModal(null);
        setSelectedItem(null);
    };

    // UI Action Triggers
    const openModal = (name: string, item: Quote | Invoice | Payment | null = null) => {
        setSelectedItem(item);
        setModal(name);
    };

    const stats = useMemo(() => {
        const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
        const outstanding = invoices.reduce((sum, i) => sum + i.balance, 0);
        const overdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.balance, 0);
        return [
            { label: "Total Revenue (YTD)", value: formatCurrency(totalRevenue), icon: 'dollarSign' as const },
            { label: "Total Outstanding", value: formatCurrency(outstanding), icon: 'fileText' as const },
            { label: "Total Overdue", value: formatCurrency(overdue), icon: 'alertCircle' as const },
            { label: "Quotes Accepted", value: quotes.filter(q => q.status === 'Accepted').length, icon: 'checkCircle' as const },
        ];
    }, [payments, invoices, quotes]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Financial Hub</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage quotes, invoices, and payments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                                <Icon name={stat.icon} className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>
                <TabsContent value="quotes" className="mt-6">
                    <QuotesTab
                        quotes={quotes}
                        onCreate={() => openModal('create-quote', {} as Quote)}
                        onAction={(action, item) => openModal(action, item)}
                        onViewDetails={(id) => navigate(`/commerce/financials/quotes/${id}`)}
                    />
                </TabsContent>
                <TabsContent value="invoices" className="mt-6">
                    <InvoicesTab
                        invoices={invoices}
                        onCreate={() => openModal('create-invoice', {} as Invoice)}
                        onAction={(action, item) => openModal(action, item)}
                        onViewDetails={(id) => navigate(`/commerce/financials/invoices/${id}`)}
                    />
                </TabsContent>
                <TabsContent value="payments" className="mt-6">
                    <PaymentsTab payments={payments} onAction={(action, item) => openModal(action, item)} />
                </TabsContent>
            </Tabs>

            {/* Modals */}
            {(modal === 'create-quote' || modal === 'edit-quote') && (
                <CreateEditQuoteModal
                    isOpen={true}
                    onClose={() => setModal(null)}
                    onSave={handleSaveQuote}
                    quote={selectedItem as Quote | null}
                />
            )}
            {(modal === 'create-invoice' || modal === 'edit-invoice') && (
                <CreateEditInvoiceModal
                    isOpen={true}
                    onClose={() => setModal(null)}
                    onSave={handleSaveInvoice}
                    invoice={selectedItem as Invoice | null}
                />
            )}
            {modal === 'record-payment' && selectedItem && (
                <RecordPaymentModal
                    isOpen={true}
                    onClose={() => setModal(null)}
                    onSave={handleRecordPayment}
                    invoice={selectedItem as Invoice}
                />
            )}
            {(modal === 'send-quote' || modal === 'send-invoice') && selectedItem && (
                <SendEmailModal
                    isOpen={true}
                    onClose={() => setModal(null)}
                    onSend={() => {
                        push({ title: "Email Sent", description: `The ${modal === 'send-quote' ? 'quote' : 'invoice'} has been sent.`, variant: "info" });
                        setModal(null);
                    }}
                    documentId={selectedItem.id}
                    customerName={'customerName' in selectedItem ? selectedItem.customerName : ''}
                />
            )}
            {modal === 'delete' && selectedItem && (
                <ConfirmationDialog
                    isOpen={true}
                    onClose={() => setModal(null)}
                    onConfirm={handleDelete}
                    title="Confirm Deletion"
                    description={`Are you sure you want to delete ${selectedItem.id}? This action cannot be undone.`}
                />
            )}
        </div>
    );
};

export default FinancialHubPage;
