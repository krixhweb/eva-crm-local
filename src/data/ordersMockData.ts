


import type { SalesOrder, PurchaseOrder, ReturnRequest, SupplierReturn, ShippingInfo } from '../types';

export const mockSalesOrders: SalesOrder[] = [
    { id: "SO-1001", customerName: "Aarav Patel", orderDate: "2024-07-25", itemCount: 2, subtotal: 64998, taxes: 11699.64, totalAmount: 76697.64, status: 'Pending' },
    { id: "SO-1002", customerName: "Sophia Chen", orderDate: "2024-07-24", itemCount: 1, subtotal: 22500, taxes: 4050, totalAmount: 26550, status: 'Shipped' },
    { id: "SO-1003", customerName: "Ishaan Gupta", orderDate: "2024-07-23", itemCount: 3, subtotal: 94997, taxes: 17099.46, totalAmount: 112096.46, status: 'Completed' },
    { id: "SO-1004", customerName: "Olivia Williams", orderDate: "2024-07-22", itemCount: 1, subtotal: 4500, taxes: 810, totalAmount: 5310, status: 'Draft' },
    { id: "SO-1005", customerName: "Rohan Desai", orderDate: "2024-07-21", itemCount: 2, subtotal: 44998, taxes: 8099.64, totalAmount: 53097.64, status: 'Cancelled' },
    { id: "SO-1006", customerName: "Aarav Patel", orderDate: "2024-07-20", itemCount: 1, subtotal: 14999, taxes: 2699.82, totalAmount: 17698.82, status: 'Completed' },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
    { id: "PO-2001", supplierName: "Furniture Co.", createdDate: "2024-07-20", expectedDelivery: "2024-08-10", totalCost: 280000, status: 'Approved' },
    { id: "PO-2002", supplierName: "Decor Direct", createdDate: "2024-07-18", expectedDelivery: "2024-08-05", totalCost: 45000, status: 'Received' }, // Changed Delivered to Received per enterprise std
    { id: "PO-2003", supplierName: "Office Essentials Ltd.", createdDate: "2024-07-25", expectedDelivery: "2024-08-15", totalCost: 170000, status: 'Draft' },
    { id: "PO-2004", supplierName: "Furniture Co.", createdDate: "2024-07-15", expectedDelivery: "2024-08-01", totalCost: 135000, status: 'Cancelled' },
    { id: "PO-2005", supplierName: "Decor Direct", createdDate: "2024-07-22", expectedDelivery: "2024-08-08", totalCost: 60000, status: 'Approved' },
];

export const mockReturns: ReturnRequest[] = [
    { id: "RET-301", orderId: "SO-1002", customerName: "Sophia Chen", reason: "Wrong Color", type: "Exchange", status: 'Requested' },
    { id: "RET-302", orderId: "SO-1003", customerName: "Ishaan Gupta", reason: "Item Damaged", type: "Refund", status: 'Approved' },
    { id: "RET-303", orderId: "SO-1001", customerName: "Aarav Patel", reason: "Changed Mind", type: "Refund", status: 'Completed' },
    { id: "RET-304", orderId: "SO-1006", customerName: "Aarav Patel", reason: "Not as Described", type: "Refund", status: 'Rejected' },
    { id: "RET-305", orderId: "SO-0998", customerName: "Vikram Mehta", reason: "Defective Item", type: "Exchange", status: 'Requested' },
];

export const mockSupplierReturns: SupplierReturn[] = [
    { id: "SR-501", purchaseOrderId: "PO-2002", supplierName: "Decor Direct", date: "2024-07-28", itemCount: 5, amount: 12000, reason: "Damaged Goods", status: "Pending" },
    { id: "SR-502", purchaseOrderId: "PO-2001", supplierName: "Furniture Co.", date: "2024-07-25", itemCount: 2, amount: 45000, reason: "Wrong Item Sent", status: "Approved" },
    { id: "SR-503", purchaseOrderId: "PO-1998", supplierName: "Office Essentials Ltd.", date: "2024-07-15", itemCount: 10, amount: 25000, reason: "Defective Batch", status: "Refunded" },
    { id: "SR-504", purchaseOrderId: "PO-2000", supplierName: "Furniture Co.", date: "2024-07-12", itemCount: 3, amount: 21000, reason: "Quality Issue", status: "Shipped" },
];

export const mockShipping: ShippingInfo[] = [
    { 
        orderId: "SO-1001", 
        customerName: "Aarav Patel", 
        carrier: null, 
        trackingNumber: null, 
        status: 'Pending',
        history: [{ status: "Order Received", date: "2024-07-25", location: "Mumbai, MH" }]
    },
    { 
        orderId: "SO-1002", 
        customerName: "Sophia Chen", 
        carrier: 'FedEx', 
        trackingNumber: '784512369852', 
        status: 'Shipped',
        history: [
            { status: "Shipped", date: "2024-07-25", location: "New York, NY" },
            { status: "Packed", date: "2024-07-24", location: "New York, NY" },
            { status: "Order Received", date: "2024-07-24", location: "New York, NY" }
        ]
    },
    { 
        orderId: "SO-0999", 
        customerName: "Rohan Desai", 
        carrier: 'DHL', 
        trackingNumber: '1234567890', 
        status: 'Delivered',
        history: [
            { status: "Delivered", date: "2024-07-22", location: "Pune, MH" },
            { status: "Out for Delivery", date: "2024-07-22", location: "Pune, MH" },
            { status: "In Transit", date: "2024-07-21", location: "Mumbai, MH" },
            { status: "Shipped", date: "2024-07-20", location: "Mumbai, MH" },
            { status: "Packed", date: "2024-07-20", location: "Mumbai, MH" },
            { status: "Order Received", date: "2024-07-19", location: "Mumbai, MH" }
        ]
    },
    { 
        orderId: "SO-1007", 
        customerName: "New Customer", 
        carrier: null, 
        trackingNumber: null, 
        status: 'Packed',
        history: [
            { status: "Packed", date: "2024-07-26", location: "Bengaluru, KA" },
            { status: "Order Received", date: "2024-07-25", location: "Bengaluru, KA" }
        ]
    }
];