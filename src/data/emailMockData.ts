
import type { EmailCampaign, EmailTemplate } from '../types';

// Helper to generate dates
const subDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
};

export const mockEmailCampaigns: EmailCampaign[] = [
    { 
        id: "EC-1001", 
        name: "Summer Sale Newsletter", 
        subject: "☀️ 50% Off Everything - Summer Sale!", 
        previewText: "Don't miss out on our biggest sale of the season.",
        fromName: "Eva Store",
        fromEmail: "marketing@evastore.com",
        status: "Sent", 
        audience: "All Customers", 
        audienceCount: 12450,
        contentHtml: "<h1>Summer Sale</h1>",
        createdAt: subDays(2),
        sentAt: subDays(1),
        stats: { delivered: 12380, opens: 3520, clicks: 420, bounces: 70, unsubscribes: 25, revenue: 685000 },
        tags: ["newsletter", "promotion", "summer"]
    },
    { 
        id: "EC-1002", 
        name: "Cart Recovery - Gentle Nudge", 
        subject: "You left something behind...", 
        previewText: "Your cart misses you.",
        fromName: "Eva Support",
        fromEmail: "support@evastore.com",
        status: "Sent", 
        audience: "Abandoned Carts", 
        audienceCount: 560,
        contentHtml: "<h1>Did you forget this?</h1>",
        createdAt: subDays(5),
        sentAt: subDays(4),
        stats: { delivered: 550, opens: 248, clicks: 68, bounces: 10, unsubscribes: 2, revenue: 125000 },
        tags: ["automation", "recovery"]
    },
    { 
        id: "EC-1003", 
        name: "VIP Exclusive Access", 
        subject: "Early access starts NOW", 
        previewText: "Shop the new collection before anyone else.",
        fromName: "Eva VIP Team",
        fromEmail: "vip@evastore.com",
        status: "Sent", 
        audience: "VIP", 
        audienceCount: 450,
        contentHtml: "<h1>VIP Access</h1>",
        createdAt: subDays(10),
        sentAt: subDays(9),
        stats: { delivered: 448, opens: 233, clicks: 82, bounces: 2, unsubscribes: 0, revenue: 320000 },
        tags: ["vip", "exclusive"]
    },
    { 
        id: "EC-1004", 
        name: "Product Launch: ErgoChair", 
        subject: "Meet the future of sitting", 
        previewText: "The ErgoChair Pro is finally here.",
        fromName: "Eva Product Team",
        fromEmail: "products@evastore.com",
        status: "Scheduled", 
        audience: "Office Segment", 
        audienceCount: 3200,
        contentHtml: "<h1>New Arrival</h1>",
        createdAt: subDays(1),
        scheduledFor: new Date(Date.now() + 86400000 * 2).toISOString(),
        stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 },
        tags: ["product_launch", "office"]
    },
    { 
        id: "EC-1005", 
        name: "Welcome Series - Email 1", 
        subject: "Welcome to Eva! Here's a gift 🎁", 
        previewText: "Thanks for joining. Enjoy 10% off your first order.",
        fromName: "Eva Store",
        fromEmail: "hello@evastore.com",
        status: "Draft", 
        audience: "New Signups", 
        audienceCount: 150,
        contentHtml: "<h1>Welcome!</h1>",
        createdAt: subDays(0),
        stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 },
        tags: ["onboarding", "welcome"]
    },
    { 
        id: "EC-1006", 
        name: "Weekly Digest: Top Trends", 
        subject: "What's trending this week", 
        previewText: "Curated picks just for you.",
        fromName: "Eva Editorial",
        fromEmail: "content@evastore.com",
        status: "Sent", 
        audience: "Newsletter Subs", 
        audienceCount: 8500,
        contentHtml: "<h1>Trends</h1>",
        createdAt: subDays(8),
        sentAt: subDays(7),
        stats: { delivered: 8400, opens: 2100, clicks: 350, bounces: 100, unsubscribes: 40, revenue: 45000 },
        tags: ["newsletter", "content"]
    },
    { 
        id: "EC-1007", 
        name: "Flash Sale Alert", 
        subject: "⚡ 24 Hours Only!", 
        previewText: "Quick! These deals won't last.",
        fromName: "Eva Store",
        fromEmail: "marketing@evastore.com",
        status: "Sent", 
        audience: "All Customers", 
        audienceCount: 12500,
        contentHtml: "<h1>Flash Sale</h1>",
        createdAt: subDays(15),
        sentAt: subDays(15),
        stats: { delivered: 12400, opens: 4200, clicks: 800, bounces: 100, unsubscribes: 150, revenue: 950000 },
        tags: ["promotion", "urgent"]
    },
    { 
        id: "EC-1008", 
        name: "Feedback Request", 
        subject: "How did we do?", 
        previewText: "Rate your recent purchase.",
        fromName: "Eva Support",
        fromEmail: "support@evastore.com",
        status: "Active", 
        audience: "Recent Buyers", 
        audienceCount: 200,
        contentHtml: "<h1>Survey</h1>",
        createdAt: subDays(20),
        sentAt: "Automated",
        stats: { delivered: 190, opens: 90, clicks: 45, bounces: 10, unsubscribes: 5, revenue: 0 },
        tags: ["automation", "survey"]
    },
    { 
        id: "EC-1009", 
        name: "Holiday Gift Guide", 
        subject: "The Perfect Gift is Here", 
        previewText: "Curated selection for your loved ones.",
        fromName: "Eva Store",
        fromEmail: "marketing@evastore.com",
        status: "Draft", 
        audience: "All Customers", 
        audienceCount: 13000,
        contentHtml: "<h1>Gift Guide</h1>",
        createdAt: subDays(3),
        stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 },
        tags: ["holiday", "seasonal"]
    },
    { 
        id: "EC-1010", 
        name: "Loyalty Program Update", 
        subject: "You've earned new points!", 
        previewText: "Check your balance now.",
        fromName: "Eva Rewards",
        fromEmail: "rewards@evastore.com",
        status: "Sent", 
        audience: "Loyalty Members", 
        audienceCount: 2500,
        contentHtml: "<h1>Rewards</h1>",
        createdAt: subDays(12),
        sentAt: subDays(12),
        stats: { delivered: 2480, opens: 1200, clicks: 300, bounces: 20, unsubscribes: 10, revenue: 120000 },
        tags: ["loyalty", "retention"]
    },
    { 
        id: "EC-1011", 
        name: "Re-engagement Campaign", 
        subject: "We miss you!", 
        previewText: "Come back for 15% off.",
        fromName: "Eva Store",
        fromEmail: "marketing@evastore.com",
        status: "Sent", 
        audience: "At Risk", 
        audienceCount: 1800,
        contentHtml: "<h1>Come back</h1>",
        createdAt: subDays(30),
        sentAt: subDays(29),
        stats: { delivered: 1750, opens: 300, clicks: 50, bounces: 50, unsubscribes: 200, revenue: 15000 },
        tags: ["retention", "win-back"]
    },
    { 
        id: "EC-1012", 
        name: "Black Friday Teaser", 
        subject: "Sneak Peek 👀", 
        previewText: "Get ready for the big day.",
        fromName: "Eva Store",
        fromEmail: "marketing@evastore.com",
        status: "Scheduled", 
        audience: "All Customers", 
        audienceCount: 14000,
        contentHtml: "<h1>Teaser</h1>",
        createdAt: subDays(2),
        scheduledFor: new Date(Date.now() + 86400000 * 5).toISOString(),
        stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 },
        tags: ["seasonal", "black_friday"]
    },
    {
        id: "EC-1013",
        name: "October Newsletter",
        subject: "Fall favorites are here",
        previewText: "Cozy up with new arrivals.",
        fromName: "Eva Editorial",
        fromEmail: "content@evastore.com",
        status: "Sent",
        audience: "Newsletter Subs",
        audienceCount: 8200,
        contentHtml: "<h1>Fall</h1>",
        createdAt: subDays(45),
        sentAt: subDays(44),
        stats: { delivered: 8100, opens: 2500, clicks: 400, bounces: 100, unsubscribes: 30, revenue: 55000 },
        tags: ["newsletter", "seasonal"]
    },
    {
        id: "EC-1014",
        name: "Q3 Business Review",
        subject: "Your quarterly report",
        previewText: "See how you performed.",
        fromName: "Eva B2B",
        fromEmail: "b2b@evastore.com",
        status: "Draft",
        audience: "B2B Clients",
        audienceCount: 120,
        contentHtml: "<h1>Report</h1>",
        createdAt: subDays(1),
        stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 },
        tags: ["b2b", "report"]
    },
    {
        id: "EC-1015",
        name: "App Download Promo",
        subject: "Shop easier with our App",
        previewText: "Download now for exclusive app-only deals.",
        fromName: "Eva Mobile",
        fromEmail: "app@evastore.com",
        status: "Sent",
        audience: "Mobile Web Users",
        audienceCount: 5000,
        contentHtml: "<h1>Download App</h1>",
        createdAt: subDays(60),
        sentAt: subDays(59),
        stats: { delivered: 4900, opens: 1100, clicks: 600, bounces: 100, unsubscribes: 50, revenue: 20000 },
        tags: ["mobile", "promo"]
    },
    // ... adding more to reach ~25 items for pagination tests
    {
        id: "EC-1016", name: "Cyber Monday Blast", subject: "Last chance for deals", previewText: "Sale ends at midnight.", fromName: "Eva Store", fromEmail: "marketing@evastore.com", status: "Sent", audience: "All Customers", audienceCount: 14500, contentHtml: "", createdAt: subDays(100), sentAt: subDays(99), stats: { delivered: 14400, opens: 5000, clicks: 1200, bounces: 100, unsubscribes: 300, revenue: 1200000 }, tags: ["seasonal", "urgent"]
    },
    {
        id: "EC-1017", name: "Spring Cleaning Sale", subject: "Clearance: Up to 70% Off", previewText: "Make room for new.", fromName: "Eva Store", fromEmail: "marketing@evastore.com", status: "Sent", audience: "Bargain Hunters", audienceCount: 3000, contentHtml: "", createdAt: subDays(200), sentAt: subDays(199), stats: { delivered: 2950, opens: 1500, clicks: 400, bounces: 50, unsubscribes: 20, revenue: 180000 }, tags: ["clearance"]
    },
    {
        id: "EC-1018", name: "Customer Appreciation", subject: "Thank you for being with us", previewText: "A special note from our CEO.", fromName: "Eva CEO", fromEmail: "ceo@evastore.com", status: "Sent", audience: "All Customers", audienceCount: 10000, contentHtml: "", createdAt: subDays(180), sentAt: subDays(179), stats: { delivered: 9900, opens: 4500, clicks: 100, bounces: 100, unsubscribes: 50, revenue: 0 }, tags: ["relationship"]
    },
    {
        id: "EC-1019", name: "Back to School", subject: "Essentials checklist", previewText: "Get ready for the new term.", fromName: "Eva Store", fromEmail: "marketing@evastore.com", status: "Sent", audience: "Parents", audienceCount: 4000, contentHtml: "", createdAt: subDays(150), sentAt: subDays(149), stats: { delivered: 3900, opens: 1200, clicks: 300, bounces: 100, unsubscribes: 40, revenue: 250000 }, tags: ["seasonal"]
    },
    {
        id: "EC-1020", name: "Webinar Invite", subject: "Join us live!", previewText: "Learn about interior design trends.", fromName: "Eva Events", fromEmail: "events@evastore.com", status: "Sent", audience: "Design Enthusiasts", audienceCount: 1500, contentHtml: "", createdAt: subDays(40), sentAt: subDays(38), stats: { delivered: 1480, opens: 600, clicks: 200, bounces: 20, unsubscribes: 10, revenue: 0 }, tags: ["event"]
    },
    {
        id: "EC-1021", name: "Webinar Reminder", subject: "Starting in 1 hour", previewText: "Don't be late.", fromName: "Eva Events", fromEmail: "events@evastore.com", status: "Sent", audience: "Registered Users", audienceCount: 200, contentHtml: "", createdAt: subDays(38), sentAt: subDays(38), stats: { delivered: 198, opens: 150, clicks: 120, bounces: 2, unsubscribes: 0, revenue: 0 }, tags: ["event", "urgent"]
    },
    {
        id: "EC-1022", name: "New Feature Announcement", subject: "Try our new 3D Room Planner", previewText: "Visualize before you buy.", fromName: "Eva Product", fromEmail: "product@evastore.com", status: "Sent", audience: "All Customers", audienceCount: 11000, contentHtml: "", createdAt: subDays(60), sentAt: subDays(59), stats: { delivered: 10800, opens: 3000, clicks: 900, bounces: 200, unsubscribes: 80, revenue: 45000 }, tags: ["update"]
    },
    {
        id: "EC-1023", name: "Account Security Update", subject: "Important: Privacy Policy", previewText: "We've updated our terms.", fromName: "Eva Legal", fromEmail: "legal@evastore.com", status: "Sent", audience: "All Customers", audienceCount: 12000, contentHtml: "", createdAt: subDays(90), sentAt: subDays(89), stats: { delivered: 11900, opens: 5000, clicks: 200, bounces: 100, unsubscribes: 10, revenue: 0 }, tags: ["admin"]
    },
    {
        id: "EC-1024", name: "Survey: Help us improve", subject: "2 minute survey", previewText: "Win a $50 gift card.", fromName: "Eva Research", fromEmail: "research@evastore.com", status: "Draft", audience: "Recent Buyers", audienceCount: 500, contentHtml: "", createdAt: subDays(5), stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 }, tags: ["survey"]
    },
    {
        id: "EC-1025", name: "Partnership Announcement", subject: "Eva x Designer Brand", previewText: "A collaboration you'll love.", fromName: "Eva Store", fromEmail: "marketing@evastore.com", status: "Scheduled", audience: "VIP", audienceCount: 600, contentHtml: "", createdAt: subDays(2), scheduledFor: new Date(Date.now() + 86400000 * 10).toISOString(), stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 }, tags: ["partnership", "vip"]
    }
];

const SAMPLE_DESIGN_JSON = JSON.stringify([
    { id: '1', type: 'header', content: { text: 'Welcome to Eva Store' }, styles: { align: 'center', color: '#1F2937', fontSize: '24px', fontWeight: 'bold', padding: '20px' } },
    { id: '2', type: 'text', content: { text: 'We are glad to have you on board. Check out our latest products.' }, styles: { align: 'left', color: '#4B5563', fontSize: '16px', lineHeight: '1.5', padding: '10px' } },
    { id: '3', type: 'button', content: { text: 'Shop Now', link: '#' }, styles: { align: 'center', backgroundColor: '#16A34A', color: '#FFFFFF', borderRadius: '4px', padding: '12px 24px' } }
]);

let templatesStore: EmailTemplate[] = [
    { 
        id: "TMP-001", 
        name: "Simple Newsletter", 
        category: "Newsletter", 
        thumbnail: "https://placehold.co/400x300/f3f4f6/a3a3a3?text=Newsletter", 
        contentHtml: "<div>...</div>", 
        designJson: SAMPLE_DESIGN_JSON,
        createdAt: "2023-12-10T10:00:00Z",
        updatedAt: "2024-01-20T15:30:00Z",
        createdBy: "Admin",
        usageCount: 12,
        campaignReferences: ["EC-001"],
        analytics: { avgOpenRate: 24.5, avgClickRate: 3.2, lastSentAt: "2024-01-20" }
    },
    { 
        id: "TMP-002", 
        name: "Product Showcase", 
        category: "Promotional", 
        thumbnail: "https://placehold.co/400x300/ecfdf5/059669?text=Product", 
        contentHtml: "<div>...</div>", 
        designJson: SAMPLE_DESIGN_JSON,
        createdAt: "2024-01-05T09:15:00Z",
        updatedAt: "2024-01-18T11:20:00Z",
        createdBy: "Marketing Team",
        usageCount: 8,
        campaignReferences: [],
        analytics: { avgOpenRate: 28.1, avgClickRate: 4.5, lastSentAt: "2024-01-15" }
    },
    { 
        id: "TMP-003", 
        name: "Welcome Email", 
        category: "Automated", 
        thumbnail: "https://placehold.co/400x300/eff6ff/2563eb?text=Welcome", 
        contentHtml: "<div>...</div>", 
        designJson: SAMPLE_DESIGN_JSON,
        createdAt: "2023-11-20T14:00:00Z",
        updatedAt: "2024-01-10T08:45:00Z",
        createdBy: "Admin",
        usageCount: 45,
        campaignReferences: ["EC-003"],
        analytics: { avgOpenRate: 45.0, avgClickRate: 12.2, lastSentAt: "2024-01-25" }
    },
    { 
        id: "TMP-004", 
        name: "Cart Recovery", 
        category: "Automated", 
        thumbnail: "https://placehold.co/400x300/fff7ed/ea580c?text=Cart", 
        contentHtml: "<div>...</div>", 
        designJson: SAMPLE_DESIGN_JSON,
        createdAt: "2023-12-01T16:20:00Z",
        updatedAt: "2024-01-05T13:10:00Z",
        createdBy: "System",
        usageCount: 156,
        campaignReferences: ["EC-004"],
        analytics: { avgOpenRate: 38.5, avgClickRate: 8.9, lastSentAt: "2024-01-24" }
    },
    { 
        id: "TMP-005", 
        name: "Feedback Request", 
        category: "Survey", 
        thumbnail: "https://placehold.co/400x300/fdf4ff/c026d3?text=Survey", 
        contentHtml: "<div>...</div>", 
        designJson: SAMPLE_DESIGN_JSON,
        createdAt: "2024-01-12T10:30:00Z",
        updatedAt: "2024-01-12T10:30:00Z",
        createdBy: "Support Team",
        usageCount: 2,
        campaignReferences: [],
        analytics: { avgOpenRate: 15.0, avgClickRate: 2.1, lastSentAt: "2024-01-14" }
    },
    { 
        id: "TMP-006", 
        name: "Blank Canvas", 
        category: "Basic", 
        thumbnail: "https://placehold.co/400x300/ffffff/000000?text=Blank", 
        contentHtml: "<div>...</div>", 
        designJson: "[]",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        createdBy: "System",
        usageCount: 0,
        campaignReferences: [],
        analytics: { avgOpenRate: 0, avgClickRate: 0 }
    },
];

export const mockEmailTemplates = templatesStore;

// Store Management Functions
export const TemplateStore = {
    getAll: () => [...templatesStore],
    getById: (id: string) => templatesStore.find(t => t.id === id),
    add: (template: EmailTemplate) => {
        templatesStore = [template, ...templatesStore];
        return template;
    },
    update: (template: EmailTemplate) => {
        templatesStore = templatesStore.map(t => t.id === template.id ? template : t);
        return template;
    },
    delete: (id: string) => {
        templatesStore = templatesStore.filter(t => t.id !== id);
    }
};
