
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Company {
  name: string;
  industry: string;
}

export interface Attachment {
  name: string;
  url: string;
}

// Common Audit Interface
export interface AuditMetadata {
  createdBy?: string;
  createdByName?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedByName?: string;
  updatedAt?: string;
}

export interface Note extends AuditMetadata {
  id: string;
  content: string;
  author: string;
  date: string;
  attachments?: Attachment[];
}

export interface Ticket {
  id:string;
  subject: string;
  status: 'Open' | 'Pending' | 'Solved' | 'Closed';
  lastUpdate: string;
}

export interface Customer extends AuditMetadata {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  orders: number;
  totalSpent: number;
  customerSince: string;
  tags: string[];
  leadOwner: {
    name: string;
    avatar: string;
  };
  leadStatus: string;
  lastContacted: string;
  address: Address;
  company?: Company;
  tickets: Ticket[];
  notes: Note[];
  segment: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  amount: number;
  status: 'Delivered' | 'Processing' | 'Pending' | 'Cancelled';
}

export interface ActivityDetailsOrder {
    orderId: string;
    items: number;
    value: string;
    status: string;
}

export interface ActivityDetailsTicket {
    ticketId: string;
    subject: string;
    status: string;
}

export interface ActivityDetailsProfile {
    from: string;
    to: string;
}

export interface ActivityDetailsCart {
    items: number;
    value: string;
}

export interface ActivityDetailsEmail {
    subject: string;
    campaign: string;
}

export interface ActivityDetailsLogin {
    ipAddress: string;
    device: string;
    location: string;
}

export interface ActivityDetailsPageView {
    productName: string;
    productId: string;
    url: string;
}

export interface Activity {
    id: string;
    title: string;
    timestamp: string;
    type: 'Order' | 'Ticket' | 'Profile' | 'Cart' | 'Email' | 'Login' | 'PageView';
    details: string | ActivityDetailsOrder | ActivityDetailsTicket | ActivityDetailsProfile | ActivityDetailsCart | ActivityDetailsEmail | ActivityDetailsLogin | ActivityDetailsPageView;
}

export interface Campaign {
  id: string;
  name: string;
  type: string; 
  status: 'Active' | 'Scheduled' | 'Completed' | 'Paused' | 'Planned' | 'Cancelled' | 'On Hold';
  startDate: string;
  endDate: string;
  owner: {
    name: string;
    avatar: string;
  };
  image: string;
  platforms: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    roi: number;
  };
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Failed';
  audience: string;
  audienceCount: number;
  contentHtml: string;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  stats: {
    delivered: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    revenue: number;
  };
  tags: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  contentHtml: string;
  designJson: string; // JSON string representing the builder state
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

export interface Coupon extends AuditMetadata {
    id: string;
    code: string;
    name: string;
    description?: string;
    discountType: 'Percentage' | 'Flat Amount' | 'Buy X Get Y' | 'Free Shipping';
    value: number; // Represents % or Amount
    status: 'Active' | 'Expired' | 'Scheduled' | 'Disabled';
    validFrom: string;
    validUntil: string;
    usageLimit: number;
    usageCount: number;
    minOrderAmount?: number;
    channels: string[]; // Email, WhatsApp, etc.
    audience: string; // All, New, etc.
    revenueGenerated: number;
    validWeekdays?: string[];
    validTimeStart?: string;
    validTimeEnd?: string;
}

export interface SalesActivity extends AuditMetadata {
  id: string;
  type: 'DEAL_WON' | 'MEETING' | 'CALL' | 'TASK' | 'EMAIL';
  title: string;
  user: {
    name: string;
    avatar: string;
  };
  relatedCustomer?: {
    id: string;
    name: string;
  };
  details: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  dealsClosed: number;
  revenue: number;
  role?: string;
  email?: string;
}

export interface SalesTask extends AuditMetadata {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // YYYY-MM-DD
    priority: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'Completed' | 'Overdue';
    assignee?: string;
    relatedLead?: string;
    tags?: string[];
    isOverdue?: boolean;
    completedBy?: string;
    completedByName?: string;
    completedAt?: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  icon: string;
}

export interface SalesLead {
    id: string;
    name: string;
    company: string;
    value: number;
    owner: {
        name: string;
        avatar: string;
    };
    lastContacted: string;
}

export interface Deal extends AuditMetadata {
  id: string;
  company: string;
  contactPerson?: string;
  description: string;
  value: number;
  dueDate: string;
  assignees: { name: string; avatar: string }[];
  comments: number;
  attachments: number;
  stage: string;
  priority: 'high' | 'medium' | 'low';
  probability: number;
  daysInStage: number;
  tags?: string[];
}

export interface MarketingAutomation {
  id: number;
  name: string;
  iconName: string;
  description: string;
  status: 'Active' | 'Paused';
  trigger: string;
  sent: number;
  recovered: number;
  revenue: number;
  rate: number;
}

export interface Workflow {
  id: number;
  name: string;
  type: 'Marketing' | 'Sales' | 'Support' | 'CRM';
  status: 'Active' | 'Paused';
  trigger: string;
  actions: number;
  runs: number;
  saved: string;
  success: number;
}

export interface ServiceAutomation {
  id: number;
  name: string;
  iconName: string;
  description: string;
  status: 'Active' | 'Paused';
  trigger: string;
  runs: number;
  saved: number;
  success: number;
}

export interface LeadFormData {
  templateType: "company" | "individual";
  companyName: string;
  firstName: string;
  lastName: string;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tags: string[];
  leadOwner: string;
  budget: string;
  stage: string;
  rating: "Hot" | "Warm" | "Cold";
  leadSource: string;
  description: string;
  preferredContact: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Draft';
  tags: string[];
  type: 'Simple' | 'Variant' | 'Bundle';
  category: string;
  brand: string;
  modelNumber: string;
  sku: string;
  barcode: string;
  slug: string;
  hsn: string;
  images: string[];
  
  // Inventory
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  inventoryByLocation: InventoryItem[]; // Replaces 'locations'
  totalStock: number; // Replaces 'stock'
  unitOfMeasurement: string;
  moq: number;
  backorderAllowed: boolean;
  outOfStockBehavior: 'Hide' | 'Allow' | 'Notify';

  // Automation
  stockRules: {
    outOfStockThreshold: number;
    lowStockThreshold: number;
    criticalThreshold: number;
    safetyStock: number;
    reorderPoint: number;
  };

  // Supplier
  supplier: {
    id: string;
    name?: string;
    supplierSKU: string;
    purchaseCost: number;
    leadTime: number;
    supplierMOQ: number;
  };

  // Pricing
  pricing: {
    cost: number;
    sellingPrice: number;
    retailPrice: number; 
    b2bPrice: number;    
    mrp: number;
    offerPrice: number;
    taxRate: number;
    margin: number;
    profit: number;
  };

  // Logistics
  logistics: {
    weight: number;
    length: number;
    width: number;
    height: number;
    packageType: string;
    fragile: boolean;
    requiresInstallation: boolean;
  };

  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
  };

  // Audit
  createdAt?: string;
  lastUpdated?: string;
  history?: ProductHistory[];

  // Computed/Legacy for backward compatibility in lists if needed
  stock?: number; 
  locations?: any[];
  costPrice?: number;
  sellingPrice?: number;
}

export interface InventoryItem {
  locationId: string;
  locationName: string;
  stock: number;
  type?: string;
}

export interface ProductHistory {
  id: string;
  action: string;
  actor: string;
  date: string;
  details?: any;
}

export interface ProductLocationStock {
  locationId: string;
  locationName: string;
  stock: number;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface SalesOrder {
  id: string;
  customerName: string;
  orderDate: string;
  itemCount: number;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  status: 'Draft' | 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Completed';
  shippingAddress?: Address;
  billingAddress?: Address;
  carrier?: string;
  trackingNumber?: string;
  items?: {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  vendorSku?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountPercent: number;
  warehouseId?: string;
  total: number;
  image?: string;
  category?: string;
  stock?: number;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  supplierId?: string;
  referenceNumber?: string;
  createdDate: string;
  expectedDelivery: string;
  totalCost: number;
  status: 'Draft' | 'Created' | 'Approved' | 'Ordered' | 'Delivered' | 'Received' | 'Closed' | 'Cancelled';
  
  // Expanded fields
  paymentTerms?: string;
  priority?: 'Low' | 'Medium' | 'High';
  billingAddress?: Address;
  shippingAddress?: Address;
  items?: PurchaseOrderItem[];
  subtotal?: number;
  taxTotal?: number;
  discountTotal?: number;
  shippingCharges?: number;
  adjustments?: number;
  notes?: string;
  terms?: string;
  carrier?: string;
  trackingNumber?: string;
  documents?: Attachment[];
}

export interface ReturnRequest {
    id: string;
    orderId: string;
    customerName: string;
    reason: string;
    type: 'Refund' | 'Exchange';
    status: 'Requested' | 'Approved' | 'Completed' | 'Rejected';
    date?: string;
    amount?: number;
    items?: number;
    daysOpen?: number;
}

export interface SupplierReturn {
    id: string;
    purchaseOrderId: string;
    supplierName: string;
    date: string;
    itemCount: number;
    amount: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Shipped' | 'Refunded';
    notes?: string;
}

export interface ShippingInfo {
    orderId: string;
    customerName: string;
    carrier: string | null;
    trackingNumber: string | null;
    status: 'Pending' | 'Packed' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled';
    history: {
        status: string;
        date: string;
        location: string;
    }[];
}

// Financial Hub Types
export interface LineItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  quoteDate: string;
  validTill: string;
  lineItems: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired';
  terms: string;
  notes: string;
}

export interface Invoice {
  id: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue';
  terms: string;
  notes: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  method: 'Credit Card' | 'Bank Transfer' | 'UPI' | 'Cash';
  status: 'Completed' | 'Pending' | 'Failed';
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}



// ... existing code ...
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Failed';
  audience: string;
  audienceCount: number;
  contentHtml: string;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  stats: {
    delivered: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    revenue: number;
  };
  tags: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  contentHtml: string;
  designJson: string; // JSON string representing the builder state
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
  campaignReferences?: string[];
  analytics?: {
    lastSentAt?: string;
    avgOpenRate?: number;
    avgClickRate?: number;
    timesUsed?: number;
  };
}

export interface Coupon extends AuditMetadata {
// ... existing code ...