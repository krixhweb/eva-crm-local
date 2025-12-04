
import type { Quote, Invoice, Payment, LineItem, Customer } from '../types';
import { mockCustomers as customers } from './mockData';
import { mockProducts as products } from './inventoryMockData';

const getLineItems = (productIds: string[], quantities: number[]): LineItem[] => {
    return productIds.map((id, index) => {
        const product = products.find(p => p.id === id);
        if (!product) throw new Error(`Mock product ${id} not found`);
        const quantity = quantities[index];
        return {
            id: `li_${id}_${Date.now()}_${Math.random()}`,
            productId: id,
            description: product.name,
            quantity,
            unitPrice: product.sellingPrice,
            total: product.sellingPrice * quantity,
        };
    });
};

const getCustomer = (id: string): Customer => {
    const customer = customers.find(c => c.id === id);
    if (!customer) throw new Error(`Mock customer ${id} not found`);
    return customer;
};

export const mockQuotes: Quote[] = [
    {
        id: 'QT-2024-001',
        customerId: 'CUST-001',
        customerName: getCustomer('CUST-001').name,
        quoteDate: '2024-07-10',
        validTill: '2024-08-09',
        lineItems: getLineItems(['prod_1'], [1]),
        subtotal: 49999,
        discount: 0,
        tax: 8999.82,
        total: 58998.82,
        status: 'Sent',
        terms: 'Payment due upon acceptance. Delivery within 14 business days.',
        notes: 'Customer interested in matching armchairs.'
    },
    {
        id: 'QT-2024-002',
        customerId: 'CUST-003',
        customerName: getCustomer('CUST-003').name,
        quoteDate: '2024-07-15',
        validTill: '2024-07-30',
        lineItems: getLineItems(['prod_3', 'prod_2'], [1, 4]),
        subtotal: 89995,
        discount: 5000,
        tax: 15299.1,
        total: 100294.1,
        status: 'Accepted',
        terms: '30% advance, 70% on delivery.',
        notes: 'Bulk order for a new office setup.'
    },
    {
        id: 'QT-2024-003',
        customerId: 'CUST-004',
        customerName: getCustomer('CUST-004').name,
        quoteDate: '2024-06-20',
        validTill: '2024-07-20',
        lineItems: getLineItems(['prod_4'], [1]),
        subtotal: 22500,
        discount: 0,
        tax: 4050,
        total: 26550,
        status: 'Expired',
        terms: 'Standard 30-day validity.',
        notes: ''
    },
];

export const mockInvoices: Invoice[] = [
    {
        id: 'INV-2024-001',
        quoteId: 'QT-2024-002',
        customerId: 'CUST-003',
        customerName: getCustomer('CUST-003').name,
        issueDate: '2024-07-16',
        dueDate: '2024-08-15',
        lineItems: getLineItems(['prod_3', 'prod_2'], [1, 4]),
        subtotal: 89995,
        discount: 5000,
        tax: 15299.1,
        total: 100294.1,
        amountPaid: 30088.23,
        balance: 70205.87,
        status: 'Partially Paid',
        terms: '30% advance, 70% on delivery.',
        notes: 'Advance payment received.'
    },
    {
        id: 'INV-2024-002',
        customerId: 'CUST-005',
        customerName: getCustomer('CUST-005').name,
        issueDate: '2024-06-01',
        dueDate: '2024-07-01',
        lineItems: getLineItems(['prod_4'], [2]),
        subtotal: 35998,
        discount: 0,
        tax: 6479.64,
        total: 42477.64,
        amountPaid: 0,
        balance: 42477.64,
        status: 'Overdue',
        terms: 'Net 30 payment terms.',
        notes: 'Reminder sent on July 5th.'
    },
    {
        id: 'INV-2024-003',
        customerId: 'CUST-002',
        customerName: getCustomer('CUST-002').name,
        issueDate: '2024-07-20',
        dueDate: '2024-08-19',
        lineItems: getLineItems(['prod_1'], [5]),
        subtotal: 59995,
        discount: 0,
        tax: 10799.1,
        total: 70794.1,
        amountPaid: 70794.1,
        balance: 0,
        status: 'Paid',
        terms: 'Payment due on receipt.',
        notes: ''
    },
];

export const mockPayments: Payment[] = [
    {
        id: 'PAY-001',
        invoiceId: 'INV-2024-001',
        customerId: 'CUST-003',
        customerName: getCustomer('CUST-003').name,
        paymentDate: '2024-07-16',
        amount: 30088.23,
        method: 'Bank Transfer',
        status: 'Completed',
        notes: 'Advance payment for PO #123.'
    },
    {
        id: 'PAY-002',
        invoiceId: 'INV-2024-003',
        customerId: 'CUST-002',
        customerName: getCustomer('CUST-002').name,
        paymentDate: '2024-07-22',
        amount: 70794.1,
        method: 'Credit Card',
        status: 'Completed',
        notes: 'Full payment via online portal.'
    },
    {
        id: 'PAY-003',
        invoiceId: 'INV-2024-002',
        customerId: 'CUST-005',
        customerName: getCustomer('CUST-005').name,
        paymentDate: '2024-07-25',
        amount: 20000,
        method: 'UPI',
        status: 'Pending',
        notes: 'Partial payment made.'
    },
];
