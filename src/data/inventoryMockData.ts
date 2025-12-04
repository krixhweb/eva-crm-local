
import type { Product, Supplier } from '../types';

export const productLocations = [
    { id: 'loc_1', name: 'Warehouse A' },
    { id: 'loc_2', name: 'Warehouse B' },
    { id: 'loc_3', name: 'Storefront' },
];

export const mockSuppliers: Supplier[] = [
    { id: 'sup_1', name: 'Furniture Co.' },
    { id: 'sup_2', name: 'Decor Direct' },
    { id: 'sup_3', name: 'Office Essentials Ltd.' },
];

// Enhanced Mock Data matching the new schema
export const mockProducts: Product[] = [
    {
        id: "prod_1",
        name: "Velvet Chesterfield Sofa",
        sku: "FURN-SOFA-001",
        category: "Sofa",
        brand: "LuxeHome",
        modelNumber: "CH-2024-X",
        type: 'Simple',
        tags: ["living room", "velvet", "classic", "luxury"],
        description: "A luxurious 3-seater sofa with deep button tufting and plush velvet upholstery. Perfect for adding a touch of elegance to any living space.",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80"],
        status: 'Active',
        barcode: '123456789012',
        hsn: '9401',
        
        // Inventory
        trackQuantity: true,
        continueSellingWhenOutOfStock: false,
        stock: 14, // Legacy mapping
        totalStock: 14,
        unitOfMeasurement: 'Piece',
        moq: 1,
        backorderAllowed: true,
        outOfStockBehavior: 'Notify',
        locations: [], // Legacy
        inventoryByLocation: [
            { locationId: 'loc_1', locationName: 'Warehouse A', stock: 8, type: 'Warehouse' },
            { locationId: 'loc_2', locationName: 'Warehouse B', stock: 4, type: 'Warehouse' },
            { locationId: 'loc_3', locationName: 'Storefront', stock: 2, type: 'Storefront' },
        ],
        stockRules: {
            outOfStockThreshold: 0,
            lowStockThreshold: 10,
            criticalThreshold: 5,
            safetyStock: 5,
            reorderPoint: 20
        },

        // Pricing
        costPrice: 28000, // Legacy
        sellingPrice: 49999, // Legacy
        pricing: {
            cost: 28000,
            sellingPrice: 49999,
            retailPrice: 54999,
            b2bPrice: 42000,
            mrp: 59999,
            offerPrice: 0,
            taxRate: 18,
            margin: 44,
            profit: 21999
        },

        // Supplier
        supplier: {
            id: 'sup_1',
            name: 'Furniture Co.',
            supplierSKU: 'SUP-SOFA-001',
            purchaseCost: 28000,
            leadTime: 14,
            supplierMOQ: 5
        },

        // Logistics
        logistics: {
            weight: 45,
            length: 220,
            width: 90,
            height: 85,
            packageType: 'Crate',
            fragile: false,
            requiresInstallation: true
        },

        // SEO
        slug: 'velvet-chesterfield-sofa',
        seo: {
            metaTitle: 'Velvet Chesterfield Sofa - LuxeHome',
            metaDescription: 'Buy the luxurious Velvet Chesterfield Sofa. 3-seater, deep button tufting, premium velvet.',
            slug: 'velvet-chesterfield-sofa'
        },

        lastUpdated: '2024-07-25',
        createdAt: '2024-01-10',
        history: [
            { id: 'h1', action: 'Product Created', actor: 'System', date: '2024-01-10' },
            { id: 'h2', action: 'Stock Added', actor: 'Admin', date: '2024-01-11', details: 'Initial stock: 14 units' }
        ]
    },
    {
        id: "prod_2",
        name: "Ergonomic Office Chair",
        sku: "FURN-CHAIR-001",
        category: "Chair",
        brand: "ErgoWork",
        modelNumber: "EW-PRO-100",
        type: 'Simple',
        tags: ["office", "ergonomic", "wfh", "adjustable"],
        description: "High-back ergonomic chair with adjustable lumbar support and breathable mesh. Designed for 24/7 use.",
        images: ["https://images.unsplash.com/photo-1580480055273-228ff53825b3?w=800&q=80"],
        status: 'Active',
        barcode: '987654321098',
        hsn: '9403',

        // Inventory
        trackQuantity: true,
        continueSellingWhenOutOfStock: true,
        stock: 40,
        totalStock: 40,
        unitOfMeasurement: 'Piece',
        moq: 1,
        backorderAllowed: true,
        outOfStockBehavior: 'Allow',
        locations: [],
        inventoryByLocation: [
            { locationId: 'loc_1', locationName: 'Warehouse A', stock: 25, type: 'Warehouse' },
            { locationId: 'loc_2', locationName: 'Warehouse B', stock: 10, type: 'Warehouse' },
            { locationId: 'loc_3', locationName: 'Storefront', stock: 5, type: 'Storefront' },
        ],
        stockRules: {
            outOfStockThreshold: 0,
            lowStockThreshold: 15,
            criticalThreshold: 5,
            safetyStock: 10,
            reorderPoint: 25
        },

        // Pricing
        costPrice: 8500,
        sellingPrice: 14999,
        pricing: {
            cost: 8500,
            sellingPrice: 14999,
            retailPrice: 14999,
            b2bPrice: 11000,
            mrp: 18999,
            offerPrice: 12999,
            taxRate: 18,
            margin: 43.3,
            profit: 6499
        },

        // Supplier
        supplier: {
            id: 'sup_3',
            name: 'Office Essentials Ltd.',
            supplierSKU: 'OE-CHAIR-001',
            purchaseCost: 8500,
            leadTime: 7,
            supplierMOQ: 20
        },

        // Logistics
        logistics: {
            weight: 12.5,
            length: 60,
            width: 60,
            height: 110,
            packageType: 'Box',
            fragile: false,
            requiresInstallation: true
        },

        // SEO
        slug: 'ergonomic-office-chair',
        seo: {
            metaTitle: 'Ergonomic Office Chair | Best for Back Pain',
            metaDescription: 'Work comfortably with our ErgoWork Pro chair. Adjustable, breathable, and durable.',
            slug: 'ergonomic-office-chair'
        },

        lastUpdated: '2024-07-20',
        createdAt: '2024-02-15',
        history: [
            { id: 'h1', action: 'Price Update', actor: 'Manager', date: '2024-06-01' }
        ]
    },
    {
        id: "prod_3",
        name: "Solid Oak Dining Table",
        sku: "FURN-TABLE-001",
        category: "Table",
        brand: "LuxeHome",
        modelNumber: "TBL-OAK-001",
        type: 'Simple',
        tags: ["dining", "wood", "minimalist", "family"],
        description: "A minimalist 6-seater dining table crafted from solid oak wood for durability. The perfect centerpiece for family gatherings.",
        images: ["https://images.unsplash.com/photo-1604147341147-3d361141c2a4?w=800&q=80"],
        status: 'Active',
        barcode: '123123123123',
        hsn: '9403',

        // Inventory
        trackQuantity: true,
        continueSellingWhenOutOfStock: false,
        stock: 8,
        totalStock: 8,
        unitOfMeasurement: 'Piece',
        moq: 1,
        backorderAllowed: false,
        outOfStockBehavior: 'Hide',
        locations: [],
        inventoryByLocation: [
            { locationId: 'loc_1', locationName: 'Warehouse A', stock: 5, type: 'Warehouse' },
            { locationId: 'loc_2', locationName: 'Warehouse B', stock: 3, type: 'Warehouse' }
        ],
        stockRules: {
            outOfStockThreshold: 0,
            lowStockThreshold: 3,
            criticalThreshold: 1,
            safetyStock: 2,
            reorderPoint: 5
        },

        // Pricing
        costPrice: 18000,
        sellingPrice: 29999,
        pricing: {
            cost: 18000,
            sellingPrice: 29999,
            retailPrice: 32999,
            b2bPrice: 25000,
            mrp: 39999,
            offerPrice: 0,
            taxRate: 18,
            margin: 40,
            profit: 11999
        },

        // Supplier
        supplier: {
            id: 'sup_1',
            name: 'Furniture Co.',
            supplierSKU: 'SUP-TBL-001',
            purchaseCost: 18000,
            leadTime: 21,
            supplierMOQ: 2
        },

        // Logistics
        logistics: {
            weight: 55,
            length: 180,
            width: 90,
            height: 76,
            packageType: 'Crate',
            fragile: true,
            requiresInstallation: true
        },

        // SEO
        slug: 'solid-oak-dining-table',
        seo: {
            metaTitle: 'Solid Oak Dining Table | Minimalist Design',
            metaDescription: 'Handcrafted solid oak dining table. Seats 6 comfortably. Durable and stylish for any dining room.',
            slug: 'solid-oak-dining-table'
        },

        lastUpdated: '2024-06-15',
        createdAt: '2024-03-10',
        history: [
            { id: 'h1', action: 'Product Created', actor: 'System', date: '2024-03-10' }
        ]
    },
    {
        id: "prod_4",
        name: "Upholstered Queen Bed",
        sku: "FURN-BED-001",
        category: "Bed",
        brand: "SleepWell",
        modelNumber: "BED-QN-GRY",
        type: 'Simple',
        tags: ["bedroom", "upholstered", "modern", "sleep"],
        description: "Modern queen-sized bed frame with a stylish grey upholstered headboard. Sturdy slat system included.",
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16433d?w=800&q=80"],
        status: 'Active',
        barcode: '456456456456',
        hsn: '9403',

        // Inventory
        trackQuantity: true,
        continueSellingWhenOutOfStock: true,
        stock: 18,
        totalStock: 18,
        unitOfMeasurement: 'Piece',
        moq: 1,
        backorderAllowed: true,
        outOfStockBehavior: 'Notify',
        locations: [],
        inventoryByLocation: [
            { locationId: 'loc_1', locationName: 'Warehouse A', stock: 15, type: 'Warehouse' },
            { locationId: 'loc_3', locationName: 'Storefront', stock: 3, type: 'Storefront' }
        ],
        stockRules: {
            outOfStockThreshold: 0,
            lowStockThreshold: 5,
            criticalThreshold: 2,
            safetyStock: 3,
            reorderPoint: 8
        },

        // Pricing
        costPrice: 12000,
        sellingPrice: 22500,
        pricing: {
            cost: 12000,
            sellingPrice: 22500,
            retailPrice: 24999,
            b2bPrice: 19000,
            mrp: 29999,
            offerPrice: 0,
            taxRate: 18,
            margin: 46.6,
            profit: 10500
        },

        // Supplier
        supplier: {
            id: 'sup_2',
            name: 'Decor Direct',
            supplierSKU: 'DD-BED-001',
            purchaseCost: 12000,
            leadTime: 10,
            supplierMOQ: 5
        },

        // Logistics
        logistics: {
            weight: 65,
            length: 210,
            width: 160,
            height: 110,
            packageType: 'Box',
            fragile: false,
            requiresInstallation: true
        },

        // SEO
        slug: 'upholstered-queen-bed',
        seo: {
            metaTitle: 'Upholstered Queen Bed Frame | Grey Headboard',
            metaDescription: 'Upgrade your bedroom with our modern upholstered queen bed. Comfortable headboard and sturdy frame.',
            slug: 'upholstered-queen-bed'
        },

        lastUpdated: '2024-05-20',
        createdAt: '2024-04-05',
        history: [
            { id: 'h1', action: 'Product Created', actor: 'System', date: '2024-04-05' }
        ]
    }
];
