
import type { LineItem, Quote, Invoice, Payment } from '../types';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const formatCurrency = (value: number | undefined | null) => {
  const val = (typeof value === 'number' && !isNaN(value)) ? value : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const calculateMargin = (cost: number, selling: number): number => {
  if (selling === 0) return 0;
  return Math.round(((selling - cost) / selling) * 100);
};

type StockStatus = {
  text: 'Healthy' | 'Low Stock' | 'Out of Stock' | 'Critical';
  color: 'green' | 'yellow' | 'red';
  variant: 'green' | 'yellow' | 'red' | 'gray';
};

export const getStockStatus = (stock: number, threshold?: number): StockStatus => {
  if (stock === 0) {
    return { text: 'Out of Stock', color: 'red', variant: 'red' };
  }
  if (threshold && stock < threshold / 2) {
    return { text: 'Critical', color: 'red', variant: 'red' };
  }
  if (threshold && stock <= threshold) {
    return { text: 'Low Stock', color: 'yellow', variant: 'yellow' };
  }
  return { text: 'Healthy', color: 'green', variant: 'green' };
};

export const suggestReorderQuantity = (currentStock: number, threshold: number): number => {
  // Simple logic: reorder to get back to 2x the threshold
  const targetStock = threshold * 2;
  return Math.max(0, targetStock - currentStock);
};

// --- Financial Hub Utils ---

export const calculateTotals = (lineItems: LineItem[], discount: number = 0, taxRate: number = 0.18) => {
  const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;
  return { subtotal, tax, total };
};

export const validateQuote = (quote: Partial<Quote>): string | null => {
  if (!quote.customerId) return "Customer is required.";
  if (!quote.lineItems || quote.lineItems.length === 0) return "At least one product line item is required.";
  if (!quote.validTill) return "Valid Till date is required.";
  if (new Date(quote.validTill) < new Date(new Date().setHours(0, 0, 0, 0))) return "Valid Till date cannot be in the past.";
  for (const item of quote.lineItems) {
    if (item.quantity < 1) return `Quantity for ${item.description} must be at least 1.`;
    if (item.unitPrice <= 0) return `Price for ${item.description} must be greater than 0.`;
  }
  return null;
};

export const validateInvoice = (invoice: Partial<Invoice>): string | null => {
    if (!invoice.customerId) return "Customer is required.";
    if (!invoice.lineItems || invoice.lineItems.length === 0) return "At least one line item is required.";
    if (!invoice.issueDate || !invoice.dueDate) return "Issue Date and Due Date are required.";
    if (new Date(invoice.dueDate) < new Date(invoice.issueDate)) return "Due Date cannot be before Issue Date.";
    if ((invoice.total || 0) <= 0) return "Total amount must be greater than 0.";
    return null;
};

export const validatePayment = (payment: Partial<Payment>, invoiceBalance: number): string | null => {
    if (!payment.amount || payment.amount <= 0) return "Payment amount must be greater than 0.";
    if (payment.amount > invoiceBalance) return `Payment amount cannot exceed the invoice balance of ${formatCurrency(invoiceBalance)}.`;
    if (!payment.paymentDate) return "Payment date is required.";
    if (!payment.method) return "Payment method is required.";
    return null;
};

export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};
