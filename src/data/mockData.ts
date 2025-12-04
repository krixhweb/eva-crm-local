
import type { 
    Activity,
    Campaign,
    Customer,
    Deal,
    LowStockProduct,
    MarketingAutomation,
    Order,
    SalesActivity,
    SalesTask,
    ServiceAutomation,
    TeamMember,
    Workflow,
    Coupon,
} from '../types';

// 1. Marketing Automations
export const mockMarketingAutomations: MarketingAutomation[] = [
    { id: 1, name: "Abandoned Cart Recovery", iconName: 'shoppingCart', description: "3-email sequence to recover abandoned carts", status: "Active", trigger: "Cart abandoned for 1 hour", sent: 567, recovered: 184, revenue: 1845000, rate: 32.5 },
    { id: 2, name: "Welcome Series", iconName: 'users', description: "3 emails over 14 days for new customers", status: "Active", trigger: "New customer signup", sent: 1245, recovered: 623, revenue: 4520000, rate: 50.0 },
    { id: 3, name: "Post-Purchase Follow-Up", iconName: 'gift', description: "Review request + product recommendations", status: "Active", trigger: "7 days after purchase", sent: 892, recovered: 267, revenue: 1234000, rate: 29.9 },
    { id: 4, name: "Win-Back Campaign", iconName: 'trendingUp', description: "Re-engage customers inactive for 90 days", status: "Paused", trigger: "90 days no activity", sent: 234, recovered: 42, revenue: 568000, rate: 17.9 },
];

// 2. Workflows
export const mockWorkflows: Workflow[] = [
    { id: 1, name: "Welcome Email Series", type: "Marketing", status: "Active", trigger: "Customer Signup", actions: 3, runs: 1245, saved: "42h", success: 98.5 },
    { id: 2, name: "Cart Abandonment", type: "Sales", status: "Active", trigger: "Cart Abandoned", actions: 4, runs: 567, saved: "18h", success: 92.3 },
    { id: 3, name: "Support Ticket Auto-Response", type: "Support", status: "Active", trigger: "New Ticket", actions: 2, runs: 2341, saved: "86h", success: 100 },
    { id: 4, name: "VIP Customer Alerts", type: "CRM", status: "Active", trigger: "High Value Purchase", actions: 5, runs: 89, saved: "12h", success: 95.5 },
];

// 3. Service Automations
export const mockServiceAutomations: ServiceAutomation[] = [
    { id: 1, name: "Auto-Response", iconName: 'messageSquare', description: "Instant reply to new tickets", status: "Active", trigger: "New ticket created", runs: 2341, saved: 86, success: 100 },
    { id: 2, name: "SLA Escalation", iconName: 'alertCircle', description: "Alert managers when SLA at risk", status: "Active", trigger: "SLA breach imminent", runs: 145, saved: 24, success: 97.2 },
    { id: 3, name: "Follow-Up After Resolution", iconName: 'checkCircle', description: "Send CSAT survey after ticket closure", status: "Active", trigger: "Ticket resolved", runs: 892, saved: 45, success: 94.5 },
    { id: 4, name: "Auto-Close Inactive", iconName: 'clock', description: "Close tickets with no response for 5 days", status: "Active", trigger: "5 days no customer response", runs: 234, saved: 18, success: 100 },
    { id: 5, name: "VIP White-Glove", iconName: 'trendingUp', description: "Priority handling for VIP customers", status: "Active", trigger: "VIP customer creates ticket", runs: 67, saved: 12, success: 100 },
];

// 4. Low Stock Products
export const mockLowStockProducts: LowStockProduct[] = [
  { id: 'P001', name: 'Wireless Headphones', stock: 8, icon: 'headphones' },
  { id: 'P002', name: 'Smart Watch Pro', stock: 5, icon: 'watch' },
  { id: 'P003', name: 'USB-C Hub Adapter', stock: 12, icon: 'usb' },
];

// 5. Orders
export const mockOrders: Order[] = [
    { id: 'ORD-789', date: '2024-07-18', items: [ {id: 'p1', name: 'Product A', quantity: 2, price: 5000}, {id: 'p2', name: 'Product B', quantity: 1, price: 14999}], amount: 24999, status: 'Processing' },
    { id: 'ORD-654', date: '2024-06-25', items: [], amount: 18500, status: 'Delivered' },
    { id: 'ORD-555', date: '2024-06-10', items: [], amount: 32000, status: 'Delivered' },
];

// 6. Order Management
export const mockOrderManagement = {
  orders: [
    { id: "#ORD-1001", date: "2024-01-15", customer: "John Doe", items: 3, total: 45997, payment: "Paid", fulfillment: "Shipped" },
    { id: "#ORD-1002", date: "2024-01-15", customer: "Jane Smith", items: 1, total: 29999, payment: "Paid", fulfillment: "Delivered" },
    { id: "#ORD-1003", date: "2024-01-14", customer: "Bob Johnson", items: 5, total: 72495, payment: "Pending", fulfillment: "Processing" },
    { id: "#ORD-1004", date: "2024-01-14", customer: "Alice Williams", items: 2, total: 17998, payment: "Paid", fulfillment: "Shipped" },
  ]
};

// 7. Customers
export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    phone: '+91 98765 43210',
    status: 'Active',
    orders: 12,
    totalSpent: 196000,
    customerSince: '2022-01-15',
    tags: ['VIP', 'Tech Enthusiast'],
    leadOwner: { name: 'Priya Patel', avatar: 'PP' },
    leadStatus: 'Won',
    lastContacted: '2024-07-15',
    address: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India' },
    company: { name: 'Sharma Enterprises', industry: 'Retail' },
    tickets: [
        { id: 'TKT-101', subject: 'Issue with wireless headphones', status: 'Solved', lastUpdate: '2024-07-10' },
        { id: 'TKT-105', subject: 'Delivery delay for order #ORD-555', status: 'Open', lastUpdate: '2024-07-20' },
    ],
    notes: [
        { id: 'NOTE-01', content: 'Customer called to inquire about bulk discounts. Interested in corporate gifting.', author: 'Priya Patel', date: '2024-06-25' }
    ],
    segment: 'Champions'
  },
  {
    id: 'CUST-002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 91234 56789',
    status: 'Active',
    orders: 8,
    totalSpent: 142500,
    customerSince: '2022-03-20',
    tags: ['Loyal Customer'],
    leadOwner: { name: 'Rohan Kumar', avatar: 'RK' },
    leadStatus: 'Contacted',
    lastContacted: '2024-07-18',
    address: { street: '456 CG Road', city: 'Ahmedabad', state: 'Gujarat', postalCode: '380009', country: 'India' },
    tickets: [],
    notes: [],
    segment: 'Loyal Customers'
  },
  {
    id: 'CUST-003',
    name: 'Rohan Kumar',
    email: 'rohan.kumar@example.com',
    phone: '+91 87654 32109',
    status: 'Inactive',
    orders: 3,
    totalSpent: 45000,
    customerSince: '2023-05-10',
    tags: ['At Risk'],
    leadOwner: { name: 'Ananya Singh', avatar: 'AS' },
    leadStatus: 'New Lead',
    lastContacted: '2024-02-01',
    address: { street: '789 Indiranagar', city: 'Bengaluru', state: 'Karnataka', postalCode: '560038', country: 'India' },
    tickets: [{ id: 'TKT-102', subject: 'Refund request', status: 'Closed', lastUpdate: '2024-01-15' }],
    notes: [],
    segment: 'At Risk'
  },
  {
    id: 'CUST-004',
    name: 'Ananya Singh',
    email: 'ananya.singh@example.com',
    phone: '+91 76543 21098',
    status: 'Active',
    orders: 25,
    totalSpent: 315000,
    customerSince: '2021-11-05',
    tags: ['VIP', 'Early Adopter'],
    leadOwner: { name: 'Priya Patel', avatar: 'PP' },
    leadStatus: 'Won',
    lastContacted: '2024-07-21',
    address: { street: '101 DLF CyberCity', city: 'Gurugram', state: 'Haryana', postalCode: '122002', country: 'India' },
    tickets: [],
    notes: [],
    segment: 'Champions'
  },
  {
    id: 'CUST-005',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    phone: '+91 99887 76655',
    status: 'Active',
    orders: 5,
    totalSpent: 89000,
    customerSince: '2023-08-12',
    tags: ['Potential Loyalist'],
    leadOwner: { name: 'Rohan Kumar', avatar: 'RK' },
    leadStatus: 'Qualified',
    lastContacted: '2024-07-12',
    address: { street: '21 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', postalCode: '500033', country: 'India' },
    tickets: [{ id: 'TKT-103', subject: 'Product query', status: 'Pending', lastUpdate: '2024-07-19' }],
    notes: [],
    segment: 'Potential Loyalists'
  }
];

// 8. Dashboard Data
export const mockDashboardRevenueData = [
    { name: 'Jan', revenue: 4000, goal: 2400 },
    { name: 'Feb', revenue: 3000, goal: 1398 },
    { name: 'Mar', revenue: 2000, goal: 9800 },
    { name: 'Apr', revenue: 2780, goal: 3908 },
    { name: 'May', revenue: 1890, goal: 4800 },
    { name: 'Jun', revenue: 2390, goal: 3800 },
    { name: 'Jul', revenue: 3490, goal: 4300 },
];

export const mockDashboardAcquisitionData = [
    { name: 'Social Media', value: 35, color: '#8884d8' },
    { name: 'Direct', value: 25, color: '#82ca9d' },
    { name: 'Referral', value: 20, color: '#ffc658' },
    { name: 'Organic Search', value: 20, color: '#ff8042' },
];

export const mockDashboardFunnelData = [
    { name: 'Visitors', value: 15000 },
    { name: 'Leads', value: 4000 },
    { name: 'Qualified', value: 2000 },
    { name: 'Deals', value: 1000 },
    { name: 'Customers', value: 500 },
];

export const mockDashboardTopProducts = [
    { name: "Ergonomic Chair", sales: 1234, revenue: 450000 },
    { name: "Standing Desk", sales: 987, revenue: 320000 },
    { name: "Monitor Arm", sales: 654, revenue: 150000 },
];

export const mockDashboardRecentOrders = [
    { id: "ORD-789", customer: "Arjun Sharma", amount: 24999, status: "Processing" },
    { id: "ORD-654", customer: "Priya Patel", amount: 18500, status: "Delivered" },
    { id: "ORD-555", customer: "Rohan Kumar", amount: 32000, status: "Delivered" },
    { id: "ORD-432", customer: "Ananya Singh", amount: 8500, status: "Cancelled" },
];

// 9. RFM Segments
export const rfmSegments = [
    { name: "Champions", description: "Bought recently, buy often and spend the most", count: 450, percentage: 18, avgSpend: 125000, avgFrequency: 15, lastPurchaseAvg: 5, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50 dark:bg-green-900/10", textColor: "text-green-600 dark:text-green-400" },
    { name: "Loyal Customers", description: "Buy on a regular basis. Responsive to promotions.", count: 890, percentage: 35, avgSpend: 65000, avgFrequency: 8, lastPurchaseAvg: 25, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50 dark:bg-blue-900/10", textColor: "text-blue-600 dark:text-blue-400" },
    { name: "Potential Loyalists", description: "Recent customers with average frequency.", count: 650, percentage: 26, avgSpend: 25000, avgFrequency: 3, lastPurchaseAvg: 45, color: "from-yellow-500 to-amber-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/10", textColor: "text-yellow-600 dark:text-yellow-400" },
    { name: "At Risk", description: "Purchased often but a long time ago.", count: 510, percentage: 21, avgSpend: 55000, avgFrequency: 6, lastPurchaseAvg: 120, color: "from-red-500 to-rose-600", bgColor: "bg-red-50 dark:bg-red-900/10", textColor: "text-red-600 dark:text-red-400" }
];

// 10. Abandoned Carts
export const mockAbandonedCarts = [
    { id: 1, customer: "Rahul Gupta", email: "rahul@example.com", value: 45000, items: 3, abandoned: "2 hours ago", status: "New" },
    { id: 2, customer: "Sneha Reddy", email: "sneha@example.com", value: 12500, items: 1, abandoned: "5 hours ago", status: "Email Sent" },
    { id: 3, customer: "Vikram Singh", email: "vikram@example.com", value: 89000, items: 5, abandoned: "1 day ago", status: "Recovered" },
    { id: 4, customer: "Pooja Mehta", email: "pooja@example.com", value: 22000, items: 2, abandoned: "2 days ago", status: "Lost" }
];

export const mockCartRecoveryCampaigns = [
    { id: 1, name: "High Value Cart Recovery", status: "active", trigger: "Cart value > ₹10,000", emails: [{ subject: "You left something behind!", delay: "1 hour", openRate: 45, clickRate: 12 }, { subject: "Complete your purchase - 5% off", delay: "24 hours", openRate: 38, clickRate: 15 }], recovered: 85, revenue: 1250000, rate: 28 },
    { id: 2, name: "Standard Recovery", status: "active", trigger: "All other carts", emails: [{ subject: "Forgot something?", delay: "2 hours", openRate: 32, clickRate: 8 }], recovered: 120, revenue: 450000, rate: 18 }
];

// 11. Campaigns
export const mockCampaigns: Campaign[] = [
    { id: "CMP-001", name: "Summer Sale 2024", type: "Advertisement", status: "Active", startDate: "2024-06-01", endDate: "2024-06-30", image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400&q=80", platforms: ["Facebook", "Instagram"], owner: { name: "Priya Patel", avatar: "PP" }, metrics: { impressions: 150000, clicks: 4500, conversions: 120, spend: 25000, revenue: 180000, roi: 620 } },
    { id: "CMP-002", name: "New Product Launch", type: "Email Campaign", status: "Scheduled", startDate: "2024-07-15", endDate: "2024-07-20", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", platforms: ["Email"], owner: { name: "Rohan Kumar", avatar: "RK" }, metrics: { impressions: 0, clicks: 0, conversions: 0, spend: 5000, revenue: 0, roi: 0 } },
    { id: "CMP-003", name: "Influencer Collab", type: "Social Media", status: "Active", startDate: "2024-05-20", endDate: "2024-07-20", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80", platforms: ["Instagram", "TikTok"], owner: { name: "Ananya Singh", avatar: "AS" }, metrics: { impressions: 280000, clicks: 8900, conversions: 340, spend: 50000, revenue: 420000, roi: 740 } },
    { id: "CMP-004", name: "Loyalty Program", type: "Referral Program", status: "Active", startDate: "2024-01-01", endDate: "2024-12-31", image: "https://images.unsplash.com/photo-1556741533-974f8e62a92d?w=400&q=80", platforms: ["Email", "App"], owner: { name: "Priya Patel", avatar: "PP" }, metrics: { impressions: 50000, clicks: 1200, conversions: 850, spend: 10000, revenue: 850000, roi: 8400 } },
];

// 12. Activities
export const mockActivities: Activity[] = [
    { id: 'act-1', title: 'Order Placed', timestamp: '2 hours ago', type: 'Order', details: { orderId: 'ORD-789', value: '₹24,999', items: 3, status: 'Processing' } },
    { id: 'act-2', title: 'Ticket Created', timestamp: '5 hours ago', type: 'Ticket', details: { ticketId: 'TKT-105', subject: 'Delivery delay', status: 'Open' } },
    { id: 'act-3', title: 'Profile Updated', timestamp: '1 day ago', type: 'Profile', details: { from: 'old@email.com', to: 'new@email.com' } },
    { id: 'act-4', title: 'Cart Abandoned', timestamp: '2 days ago', type: 'Cart', details: { value: '₹12,500', items: 1 } },
    { id: 'act-5', title: 'Email Opened', timestamp: '3 days ago', type: 'Email', details: { subject: 'Your cart is waiting', campaign: 'Cart Recovery' } },
];

// 13. Communications
export const mockCommunications = [
    { id: 'com-1', channel: 'Email', subject: 'Re: Delivery Inquiry', preview: 'Your order is scheduled for delivery tomorrow.', timestamp: '2 hours ago', direction: 'Sent' },
    { id: 'com-2', channel: 'Phone', subject: 'Incoming Call', preview: 'Duration: 4m 32s', timestamp: '5 hours ago', direction: 'Received' },
    { id: 'com-3', channel: 'SMS', subject: 'Order Confirmation', preview: 'Your order #ORD-789 has been confirmed.', timestamp: '1 day ago', direction: 'Sent' },
    { id: 'com-4', channel: 'Chat', subject: 'Product Question', preview: 'Does this come in blue?', timestamp: '2 days ago', direction: 'Received' },
];

// 14. Deals
export const mockDeals: Deal[] = [
    { id: 'deal-1', company: 'TechStart Inc.', contactPerson: 'Rahul Verma', description: 'Office furniture upgrade', value: 450000, dueDate: '2024-08-15', assignees: [{ name: 'Priya Patel', avatar: 'PP' }], comments: 5, attachments: 2, stage: 'Negotiation', priority: 'high', probability: 75, daysInStage: 5 },
    { id: 'deal-2', company: 'GreenLeaf Co.', contactPerson: 'Sneha Gupta', description: 'New branch setup', value: 280000, dueDate: '2024-08-20', assignees: [{ name: 'Rohan Kumar', avatar: 'RK' }], comments: 2, attachments: 1, stage: 'Proposal', priority: 'medium', probability: 40, daysInStage: 3 },
    { id: 'deal-3', company: 'BlueSky Ltd.', contactPerson: 'Vikram Singh', description: 'Conference room chairs', value: 120000, dueDate: '2024-08-10', assignees: [{ name: 'Ananya Singh', avatar: 'AS' }], comments: 0, attachments: 0, stage: 'Qualification', priority: 'low', probability: 20, daysInStage: 1 },
    { id: 'deal-4', company: 'RedRock LLC', contactPerson: 'Amit Shah', description: 'Bulk order for workstations', value: 850000, dueDate: '2024-09-01', assignees: [{ name: 'Priya Patel', avatar: 'PP' }], comments: 8, attachments: 4, stage: 'Closed Won', priority: 'high', probability: 100, daysInStage: 0 },
];

// 15. Sales Activities
export const mockSalesActivities: SalesActivity[] = [
    { id: 'sa-1', type: 'CALL', title: 'Call with TechStart', user: { name: 'Priya Patel', avatar: 'PP' }, details: 'Discussed pricing and delivery timeline.', timestamp: '2 hours ago', relatedCustomer: { id: 'CUST-001', name: 'Arjun Sharma' } },
    { id: 'sa-2', type: 'EMAIL', title: 'Proposal Sent to GreenLeaf', user: { name: 'Rohan Kumar', avatar: 'RK' }, details: 'Sent updated proposal v2.', timestamp: '5 hours ago', relatedCustomer: { id: 'CUST-002', name: 'Priya Patel' } },
    { id: 'sa-3', type: 'MEETING', title: 'Demo with BlueSky', user: { name: 'Ananya Singh', avatar: 'AS' }, details: 'Product demo via Zoom.', timestamp: '1 day ago' },
    { id: 'sa-4', type: 'TASK', title: 'Follow up on contract', user: { name: 'Priya Patel', avatar: 'PP' }, details: 'Contract pending signature.', timestamp: '2 days ago' },
    { id: 'sa-5', type: 'DEAL_WON', title: 'Closed RedRock Deal', user: { name: 'Priya Patel', avatar: 'PP' }, details: 'Deal value: ₹8,50,000', timestamp: '3 days ago' },
];

// 16. Sales Tasks
export const mockSalesTasks: SalesTask[] = [
    { id: 'st-1', title: 'Call TechStart', description: 'Follow up on pricing negotiation', dueDate: '2024-07-26', priority: 'High', status: 'Open', assignee: 'Priya Patel', relatedLead: 'TechStart Inc.' },
    { id: 'st-2', title: 'Prepare GreenLeaf Proposal', description: 'Draft proposal v3 based on feedback', dueDate: '2024-07-27', priority: 'Medium', status: 'Open', assignee: 'Rohan Kumar', relatedLead: 'GreenLeaf Co.' },
    { id: 'st-3', title: 'Email BlueSky', description: 'Send product catalog', dueDate: '2024-07-25', priority: 'Low', status: 'Overdue', assignee: 'Ananya Singh', relatedLead: 'BlueSky Ltd.' },
    { id: 'st-4', title: 'Sign RedRock Contract', description: 'Get final signature', dueDate: '2024-07-24', priority: 'High', status: 'Completed', assignee: 'Priya Patel', relatedLead: 'RedRock LLC', completedBy: 'u_001', completedByName: 'Priya Patel', completedAt: '2024-07-24T10:00:00Z' },
];

// 17. Team Members
export const mockTeamMembers: TeamMember[] = [
    { id: 'TM-001', name: 'Priya Patel', avatar: 'PP', dealsClosed: 15, revenue: 1850000, role: 'Sales Manager', email: 'priya@company.com' },
    { id: 'TM-002', name: 'Rohan Kumar', avatar: 'RK', dealsClosed: 8, revenue: 750000, role: 'Sales Executive', email: 'rohan@company.com' },
    { id: 'TM-003', name: 'Ananya Singh', avatar: 'AS', dealsClosed: 5, revenue: 420000, role: 'Sales Executive', email: 'ananya@company.com' },
];

// 18. Coupons
export const mockCoupons: Coupon[] = [
    { 
        id: 'C-001', 
        code: "SUMMER25", 
        name: "Summer Sale", 
        discountType: "Percentage", 
        value: 25, 
        usageCount: 345, 
        usageLimit: 1000, 
        validFrom: "2024-06-01", 
        validUntil: "2024-08-31", 
        status: "Active", 
        revenueGenerated: 845000, 
        channels: ["Email", "Social"], 
        audience: "All Customers",
        createdAt: "2024-05-20",
        createdBy: "Priya Patel"
    },
    { 
        id: 'C-002', 
        code: "FREESHIP", 
        name: "Free Shipping", 
        discountType: "Free Shipping", 
        value: 0, 
        usageCount: 892, 
        usageLimit: 999999, 
        validFrom: "2024-01-01", 
        validUntil: "2024-12-31", 
        status: "Active", 
        revenueGenerated: 1523000, 
        channels: ["All"], 
        audience: "All Customers",
        createdAt: "2024-01-01",
        createdBy: "Admin"
    },
    { 
        id: 'C-003', 
        code: "WELCOME10", 
        name: "New User Offer", 
        discountType: "Percentage", 
        value: 10, 
        usageCount: 1567, 
        usageLimit: 999999, 
        validFrom: "2024-01-01", 
        validUntil: "2024-12-31", 
        status: "Active", 
        revenueGenerated: 1289000, 
        channels: ["Email", "Website"], 
        audience: "New Customers",
        createdAt: "2024-01-01",
        createdBy: "Admin"
    },
    { 
        id: 'C-004', 
        code: "BOGO50", 
        name: "BOGO Deal", 
        discountType: "Buy X Get Y", 
        value: 50, 
        usageCount: 234, 
        usageLimit: 500, 
        validFrom: "2024-10-01", 
        validUntil: "2024-10-31", 
        status: "Scheduled", 
        revenueGenerated: 567000, 
        channels: ["Social"], 
        audience: "All Customers",
        createdAt: "2024-09-15",
        createdBy: "Ananya Singh"
    },
    { 
        id: 'C-005', 
        code: "FLASH50", 
        name: "Flash Sale", 
        discountType: "Percentage", 
        value: 50, 
        usageCount: 150, 
        usageLimit: 150, 
        validFrom: "2024-10-15", 
        validUntil: "2024-10-15", 
        status: "Expired", 
        revenueGenerated: 345000, 
        channels: ["Email", "SMS"], 
        audience: "VIP",
        createdAt: "2024-10-01",
        createdBy: "Rohan Kumar"
    },
    { 
        id: 'C-006', 
        code: "VIP20", 
        name: "VIP Exclusive", 
        discountType: "Percentage", 
        value: 20, 
        usageCount: 89, 
        usageLimit: 500, 
        validFrom: "2024-01-01", 
        validUntil: "2024-12-31", 
        status: "Active", 
        revenueGenerated: 423000, 
        channels: ["Email", "WhatsApp"], 
        audience: "VIP",
        createdAt: "2024-01-01",
        createdBy: "Priya Patel"
    },
    { 
        id: 'C-007', 
        code: "NEWCUST15", 
        name: "Acquisition", 
        discountType: "Flat Amount", 
        value: 1500, 
        usageCount: 445, 
        usageLimit: 1000, 
        validFrom: "2024-07-01", 
        validUntil: "2024-12-31", 
        status: "Active", 
        revenueGenerated: 667500, 
        channels: ["Social"], 
        audience: "New Customers",
        createdAt: "2024-06-25",
        createdBy: "Ananya Singh"
    },
];