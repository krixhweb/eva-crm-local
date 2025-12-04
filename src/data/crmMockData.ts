// data/crmMockData.ts

// IMPORTANT: This file contains small, clean, and interconnected mock data
// for a furniture e-commerce CRM system, generated for UI testing.
// Each dataset contains exactly 5 records.

// ---------------------------------------------------
// 8. TEAM MEMBERS
// ---------------------------------------------------
export const teamMembers = [
  {
    id: "TM-801",
    name: "Priya Sharma",
    role: "Sales Manager",
    email: "priya.sharma@example.com",
    avatar: "PS",
  },
  {
    id: "TM-802",
    name: "John Smith",
    role: "Sales Executive",
    email: "john.smith@example.com",
    avatar: "JS",
  },
  {
    id: "TM-803",
    name: "Amit Singh",
    role: "Sales Executive",
    email: "amit.singh@example.com",
    avatar: "AS",
  },
  {
    id: "TM-804",
    name: "Emily White",
    role: "Marketing",
    email: "emily.white@example.com",
    avatar: "EW",
  },
  {
    id: "TM-805",
    name: "Ravi Kumar",
    role: "Sales Executive",
    email: "ravi.kumar@example.com",
    avatar: "RK",
  },
];

// ---------------------------------------------------
// 1. CUSTOMERS
// ---------------------------------------------------
export const customers = [
  {
    id: "CUST-101",
    firstName: "Aarav",
    lastName: "Patel",
    email: "aarav.patel@example.com",
    phone: "+91 9876543210",
    city: "Mumbai",
    state: "Maharashtra",
    segment: "High Value",
    totalSpent: 85000,
    ordersCount: 3,
    lastOrderDate: "2024-07-15",
    createdAt: "2023-01-20",
  },
  {
    id: "CUST-102",
    firstName: "Sophia",
    lastName: "Chen",
    email: "sophia.chen@example.com",
    phone: "+1 212-555-0182",
    city: "New York",
    state: "NY",
    segment: "Medium Value",
    totalSpent: 42000,
    ordersCount: 2,
    lastOrderDate: "2024-06-28",
    createdAt: "2023-05-11",
  },
  {
    id: "CUST-103",
    firstName: "Ishaan",
    lastName: "Gupta",
    email: "ishaan.gupta@example.com",
    phone: "+91 9123456789",
    city: "Bengaluru",
    state: "Karnataka",
    segment: "High Value",
    totalSpent: 125000,
    ordersCount: 5,
    lastOrderDate: "2024-07-22",
    createdAt: "2022-11-05",
  },
  {
    id: "CUST-104",
    firstName: "Olivia",
    lastName: "Williams",
    email: "olivia.w@example.com",
    phone: "+1 310-555-0134",
    city: "Los Angeles",
    state: "CA",
    segment: "Low Value",
    totalSpent: 15000,
    ordersCount: 1,
    lastOrderDate: "2024-03-10",
    createdAt: "2024-03-10",
  },
  {
    id: "CUST-105",
    firstName: "Rohan",
    lastName: "Desai",
    email: "rohan.desai@example.com",
    phone: "+91 8888877777",
    city: "Pune",
    state: "Maharashtra",
    segment: "Medium Value",
    totalSpent: 68000,
    ordersCount: 4,
    lastOrderDate: "2024-07-01",
    createdAt: "2023-02-18",
  },
];

// ---------------------------------------------------
// 2. PRODUCTS
// ---------------------------------------------------
export const products = [
  {
    id: "PROD-201",
    name: "Velvet Chesterfield Sofa",
    category: "Sofa",
    description: "A luxurious 3-seater sofa with deep button tufting and plush velvet upholstery.",
    price: 49999,
    tags: ["living room", "velvet", "classic", "luxury"],
    stock: 12,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "PROD-202",
    name: "Ergonomic Office Chair",
    category: "Chair",
    description: "High-back ergonomic chair with adjustable lumbar support and breathable mesh.",
    price: 14999,
    tags: ["office", "ergonomic", "work from home", "comfort"],
    stock: 35,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1580480055273-228ff53825b3?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "PROD-203",
    name: "Solid Oak Dining Table",
    category: "Table",
    description: "A minimalist 6-seater dining table crafted from solid oak wood for durability.",
    price: 29999,
    tags: ["dining", "wood", "minimalist", "family"],
    stock: 8,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1604147341147-3d361141c2a4?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "PROD-204",
    name: "Upholstered Queen Bed",
    category: "Bed",
    description: "Modern queen-sized bed frame with a stylish grey upholstered headboard.",
    price: 22500,
    tags: ["bedroom", "upholstered", "modern", "sleep"],
    stock: 18,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16433d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "PROD-205",
    name: "Abstract Wall Art Set",
    category: "Decor",
    description: "A set of three modern abstract canvas prints to elevate your wall decor.",
    price: 4500,
    tags: ["wall art", "decor", "abstract", "modern"],
    stock: 50,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1541956073-207271a3f414?auto=format&fit=crop&q=80&w=400",
  },
];

// ---------------------------------------------------
// 3. LEADS
// ---------------------------------------------------
export const leads = [
  {
    id: "LEAD-301",
    name: "Anika Sharma",
    email: "anika.s@webmail.com",
    phone: "+91 9999988888",
    leadSource: "Instagram",
    interestCategory: "Sofa",
    budget: 50000,
    stage: "Qualified",
    leadOwner: "John Smith",
    createdAt: "2024-07-20T10:30:00Z",
  },
  {
    id: "LEAD-302",
    name: "Michael Brown",
    email: "mbrown@company.com",
    phone: "+1 415-555-0199",
    leadSource: "Google Search",
    interestCategory: "Chair",
    budget: 20000,
    stage: "Contacted",
    leadOwner: "Amit Singh",
    createdAt: "2024-07-18T14:00:00Z",
  },
  {
    id: "LEAD-303",
    name: "Karan Verma",
    email: "karan.v@email.com",
    phone: "+91 7777766666",
    leadSource: "Referral",
    interestCategory: "Table",
    budget: 35000,
    stage: "Proposal Sent",
    leadOwner: "John Smith",
    createdAt: "2024-07-15T09:00:00Z",
  },
  {
    id: "LEAD-304",
    name: "Jessica Miller",
    email: "jess.miller@inbox.com",
    phone: "+1 650-555-0111",
    leadSource: "Facebook Ads",
    interestCategory: "Bed",
    budget: 25000,
    stage: "New",
    leadOwner: "Ravi Kumar",
    createdAt: "2024-07-22T11:45:00Z",
  },
  {
    id: "LEAD-305",
    name: "Sunita Reddy",
    email: "sunita.r@mail.com",
    phone: "+91 8881122333",
    leadSource: "Direct",
    interestCategory: "Decor",
    budget: 10000,
    stage: "Closed Won",
    leadOwner: "Priya Sharma",
    createdAt: "2024-06-30T18:20:00Z",
  },
];

// ---------------------------------------------------
// 4. SALES PIPELINE DEALS
// ---------------------------------------------------
export const salesPipelineDeals = [
  {
    id: "DEAL-401",
    company: "Design Horizons Inc.",
    contactPerson: "Anika Sharma",
    value: 49999,
    probability: 70,
    stage: "Proposal",
    productInterested: "Velvet Chesterfield Sofa",
    assignees: [{ name: "John Smith", avatar: "JS" }],
    dueDate: "2024-08-15",
    priority: "high",
    comments: 2,
    attachments: 1,
  },
  {
    id: "DEAL-402",
    company: "Innovate Workspace",
    contactPerson: "Michael Brown",
    value: 150000, // For 10 chairs
    probability: 40,
    stage: "Qualification",
    productInterested: "Ergonomic Office Chair",
    assignees: [{ name: "Amit Singh", avatar: "AS" }],
    dueDate: "2024-08-20",
    priority: "medium",
    comments: 1,
    attachments: 0,
  },
  {
    id: "DEAL-403",
    company: "The Grand Eatery",
    contactPerson: "Karan Verma",
    value: 29999,
    probability: 90,
    stage: "Negotiation",
    productInterested: "Solid Oak Dining Table",
    assignees: [{ name: "Priya Sharma", avatar: "PS" }],
    dueDate: "2024-07-30",
    priority: "high",
    comments: 5,
    attachments: 2,
  },
  {
    id: "DEAL-404",
    company: "Self-Employed (Jessica Miller)",
    contactPerson: "Jessica Miller",
    value: 22500,
    probability: 10,
    stage: "Lead Gen",
    productInterested: "Upholstered Queen Bed",
    assignees: [{ name: "Ravi Kumar", avatar: "RK" }],
    dueDate: "2024-09-01",
    priority: "low",
    comments: 0,
    attachments: 0,
  },
  {
    id: "DEAL-405",
    company: "Artful Living Gallery",
    contactPerson: "Sunita Reddy",
    value: 4500,
    probability: 100,
    stage: "Closed Won",
    productInterested: "Abstract Wall Art Set",
    assignees: [{ name: "Priya Sharma", avatar: "PS" }],
    dueDate: "2024-07-10",
    priority: "medium",
    comments: 1,
    attachments: 1,
  },
];

// ---------------------------------------------------
// 5. ORDERS
// ---------------------------------------------------
export const orders = [
  {
    orderId: "ORD-501",
    customerId: "CUST-103",
    productId: "PROD-201",
    quantity: 1,
    totalPrice: 49999,
    orderStatus: "Delivered",
    orderDate: "2024-07-22",
    paymentMethod: "Credit Card",
  },
  {
    orderId: "ORD-502",
    customerId: "CUST-101",
    productId: "PROD-202",
    quantity: 1,
    totalPrice: 14999,
    orderStatus: "Shipped",
    orderDate: "2024-07-15",
    paymentMethod: "UPI",
  },
  {
    orderId: "ORD-503",
    customerId: "CUST-102",
    productId: "PROD-204",
    quantity: 1,
    totalPrice: 22500,
    orderStatus: "Processing",
    orderDate: "2024-06-28",
    paymentMethod: "Debit Card",
  },
  {
    orderId: "ORD-504",
    customerId: "CUST-104",
    productId: "PROD-205",
    quantity: 1,
    totalPrice: 4500,
    orderStatus: "Cancelled",
    orderDate: "2024-03-10",
    paymentMethod: "Cash on Delivery",
  },
  {
    orderId: "ORD-505",
    customerId: "CUST-105",
    productId: "PROD-203",
    quantity: 1,
    totalPrice: 29999,
    orderStatus: "Delivered",
    orderDate: "2024-07-01",
    paymentMethod: "Credit Card",
  },
];

// ---------------------------------------------------
// 6. ABANDONED CARTS
// ---------------------------------------------------
export const abandonedCarts = [
  {
    id: "CART-601",
    customerId: "CUST-102",
    products: [{ productId: "PROD-201", qty: 1 }],
    totalValue: 49999,
    lastActive: "2024-07-25T18:00:00Z",
  },
  {
    id: "CART-602",
    customerId: "CUST-101",
    products: [{ productId: "PROD-205", qty: 2 }],
    totalValue: 9000,
    lastActive: "2024-07-24T12:30:00Z",
  },
  {
    id: "CART-603",
    customerId: "CUST-105",
    products: [{ productId: "PROD-202", qty: 1 }],
    totalValue: 14999,
    lastActive: "2024-07-23T20:15:00Z",
  },
  {
    id: "CART-604",
    customerId: "CUST-104",
    products: [
      { productId: "PROD-203", qty: 1 },
      { productId: "PROD-204", qty: 1 },
    ],
    totalValue: 52499,
    lastActive: "2024-07-22T10:00:00Z",
  },
  {
    id: "CART-605",
    customerId: "CUST-103",
    products: [{ productId: "PROD-202", qty: 2 }],
    totalValue: 29998,
    lastActive: "2024-07-25T09:05:00Z",
  },
];

// ---------------------------------------------------
// 7. CAMPAIGNS
// ---------------------------------------------------
export const campaigns = [
  {
    id: "CAMP-701",
    campaignName: "Win-Back Lapsed Customers",
    channel: "Email",
    status: "Completed",
    targetSegment: "Low Value",
    sent: 500,
    opened: 150,
    clicked: 30,
    revenueGenerated: 45000,
  },
  {
    id: "CAMP-702",
    campaignName: "Exclusive VIP Early Access",
    channel: "SMS",
    status: "Running",
    targetSegment: "High Value",
    sent: 250,
    opened: 200,
    clicked: 120,
    revenueGenerated: 180000,
  },
  {
    id: "CAMP-703",
    campaignName: "Mid-Year Furniture Sale",
    channel: "Push",
    status: "Scheduled",
    targetSegment: "Medium Value",
    sent: 0,
    opened: 0,
    clicked: 0,
    revenueGenerated: 0,
  },
  {
    id: "CAMP-704",
    campaignName: "New Customer Welcome Offer",
    channel: "Email",
    status: "Running",
    targetSegment: "Low Value",
    sent: 1200,
    opened: 600,
    clicked: 200,
    revenueGenerated: 95000,
  },
  {
    id: "CAMP-705",
    campaignName: "End of Season Clearance",
    channel: "SMS",
    status: "Completed",
    targetSegment: "Medium Value",
    sent: 1500,
    opened: 800,
    clicked: 250,
    revenueGenerated: 120000,
  },
];

// ---------------------------------------------------
// 9. ACTIVITIES
// ---------------------------------------------------
export const activities = [
  {
    id: "ACT-901",
    customerId: "CUST-101",
    type: "Call",
    description: "Followed up on recent order and discussed warranty options.",
    createdAt: "2024-07-16T15:00:00Z",
    createdBy: "Priya Sharma",
  },
  {
    id: "ACT-902",
    customerId: "CUST-103",
    type: "Note",
    description: "Customer is an interior designer, interested in bulk pricing.",
    createdAt: "2024-07-23T11:00:00Z",
    createdBy: "John Smith",
  },
  {
    id: "ACT-903",
    customerId: "CUST-102",
    type: "Email",
    description: "Sent email with tracking information for order ORD-503.",
    createdAt: "2024-06-29T09:30:00Z",
    createdBy: "Amit Singh",
  },
  {
    id: "ACT-904",
    customerId: "CUST-105",
    type: "Follow-Up",
    description: "Scheduled a follow-up call for next week to discuss dining set options.",
    createdAt: "2024-07-24T16:00:00Z",
    createdBy: "Ravi Kumar",
  },
  {
    id: "ACT-905",
    customerId: "CUST-104",
    type: "Note",
    description: "Customer cancelled order ORD-504. Reason: Found a different item.",
    createdAt: "2024-03-11T10:00:00Z",
    createdBy: "Priya Sharma",
  },
];
