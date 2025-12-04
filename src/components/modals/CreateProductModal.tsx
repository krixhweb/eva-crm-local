
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Icon } from '../shared/Icon';
import { Badge } from '../ui/Badge';
import { useGlassyToasts } from '../ui/GlassyToastProvider';

// --- Payload Types ---
interface InventoryItem {
  locationId: string;
  locationName: string;
  stock: number;
  type?: string; // 'Warehouse' | 'Storefront'
}

interface ProductPayload {
  id?: string;
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
  inventoryByLocation: InventoryItem[];
  totalStock: number; 
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
}

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: any) => void;
    product?: any | null;
}

const furnitureCategories = ["Sofa", "Chair", "Table", "Bed", "Wardrobe", "Dining Set", "Shelf", "Decor", "Lighting"];

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
    const { push } = useGlassyToasts();
    
    // --- Form State ---
    const [formData, setFormData] = useState<ProductPayload>({
        name: '',
        description: '',
        status: 'Active',
        tags: [],
        type: 'Simple',
        category: furnitureCategories[0],
        brand: '',
        modelNumber: '',
        sku: '',
        barcode: '',
        slug: '',
        hsn: '',
        images: [],
        
        trackQuantity: true,
        continueSellingWhenOutOfStock: false,
        inventoryByLocation: [],
        totalStock: 0,
        unitOfMeasurement: 'piece',
        moq: 1,
        backorderAllowed: false,
        outOfStockBehavior: 'Hide',

        stockRules: {
            outOfStockThreshold: 0,
            lowStockThreshold: 10,
            criticalThreshold: 5,
            safetyStock: 5,
            reorderPoint: 20
        },
        supplier: {
            id: '',
            supplierSKU: '',
            purchaseCost: 0,
            leadTime: 0,
            supplierMOQ: 1
        },
        pricing: {
            cost: 0,
            sellingPrice: 0,
            retailPrice: 0,
            b2bPrice: 0,
            mrp: 0,
            offerPrice: 0,
            taxRate: 18, 
            margin: 0,
            profit: 0
        },
        logistics: {
            weight: 0,
            length: 0,
            width: 0,
            height: 0,
            packageType: 'Box',
            fragile: false,
            requiresInstallation: false
        },
        seo: {
            metaTitle: '',
            metaDescription: '',
            slug: ''
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- Initialization Effect ---
    useEffect(() => {
        if (isOpen) {
            if (product) {
                const existingLocations: InventoryItem[] = (product.inventoryByLocation || product.locations || []).map((l: any) => ({
                    locationId: l.locationId,
                    locationName: l.locationName,
                    stock: Number(l.stock) || 0,
                    type: l.type || 'Warehouse'
                }));

                setFormData({
                    ...product,
                    stockRules: { ...formData.stockRules, ...product.stockRules },
                    supplier: { ...formData.supplier, ...product.supplier },
                    pricing: { ...formData.pricing, ...product.pricing },
                    logistics: { ...formData.logistics, ...product.logistics },
                    seo: { ...formData.seo, ...product.seo },
                    trackQuantity: product.trackQuantity ?? true,
                    continueSellingWhenOutOfStock: product.continueSellingWhenOutOfStock ?? false,
                    inventoryByLocation: existingLocations,
                    tags: product.tags || [],
                    images: product.images || []
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    status: 'Active',
                    tags: [],
                    type: 'Simple',
                    category: furnitureCategories[0],
                    brand: '',
                    modelNumber: '',
                    sku: `SKU-${Date.now().toString().slice(-6)}`,
                    barcode: '',
                    slug: '',
                    hsn: '',
                    images: [],
                    trackQuantity: true,
                    continueSellingWhenOutOfStock: false,
                    inventoryByLocation: [],
                    totalStock: 0,
                    unitOfMeasurement: 'piece',
                    moq: 1,
                    backorderAllowed: false,
                    outOfStockBehavior: 'Hide',
                    stockRules: { outOfStockThreshold: 0, lowStockThreshold: 10, criticalThreshold: 5, safetyStock: 5, reorderPoint: 20 },
                    supplier: { id: '', supplierSKU: '', purchaseCost: 0, leadTime: 0, supplierMOQ: 1 },
                    pricing: { cost: 0, sellingPrice: 0, retailPrice: 0, b2bPrice: 0, mrp: 0, offerPrice: 0, taxRate: 18, margin: 0, profit: 0 },
                    logistics: { weight: 0, length: 0, width: 0, height: 0, packageType: 'Box', fragile: false, requiresInstallation: false },
                    seo: { metaTitle: '', metaDescription: '', slug: '' }
                });
            }
            setErrors({});
        }
    }, [isOpen, product]);

    // --- Validation ---
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Product Name is required";
        if (!formData.sku) newErrors.sku = "SKU is required";
        if (formData.pricing.sellingPrice <= 0) newErrors.sellingPrice = "Selling Price must be > 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) {
            push({ title: "Validation Error", description: "Please fix errors.", variant: "error" });
            return;
        }
        onSave(formData);
    };

    const updateField = (field: keyof ProductPayload, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="w-full md:w-[95vw] max-w-[1400px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl h-[95vh] md:h-screen" resizable showCloseButton={false}>
                
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900 z-10 flex justify-between items-center">
                    <div>
                        <DrawerTitle>{product ? 'Edit Product' : 'Create Product'}</DrawerTitle>
                        <DrawerDescription>Configure product details, pricing, and inventory.</DrawerDescription>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={onClose}>Cancel</Button>
                         <Button onClick={handleSave}>Save Product</Button>
                    </div>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-zinc-950/50">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         {/* Left Column */}
                         <div className="lg:col-span-2 space-y-6">
                             
                             {/* Basic Info */}
                             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                 <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
                                 <div className="space-y-2">
                                     <Label>Product Name *</Label>
                                     <Input value={formData.name} onChange={e => updateField('name', e.target.value)} className={errors.name ? "border-red-500" : ""} />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                         <Label>SKU *</Label>
                                         <Input value={formData.sku} onChange={e => updateField('sku', e.target.value)} className={errors.sku ? "border-red-500" : ""} />
                                     </div>
                                     <div className="space-y-2">
                                         <Label>Category</Label>
                                         <Select value={formData.category} onValueChange={v => updateField('category', v)}>
                                             <SelectTrigger><SelectValue /></SelectTrigger>
                                             <SelectContent>{furnitureCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                         </Select>
                                     </div>
                                 </div>
                                 <div className="space-y-2">
                                     <Label>Description</Label>
                                     <Textarea value={formData.description} onChange={e => updateField('description', e.target.value)} rows={4} />
                                 </div>
                             </div>

                             {/* Pricing */}
                             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                 <h3 className="font-semibold text-lg mb-4">Pricing</h3>
                                 <div className="grid grid-cols-3 gap-4">
                                     <div className="space-y-2">
                                         <Label>Selling Price *</Label>
                                         <Input type="number" value={formData.pricing.sellingPrice} onChange={e => setFormData(p => ({...p, pricing: {...p.pricing, sellingPrice: Number(e.target.value)}}))} className={errors.sellingPrice ? "border-red-500" : ""} />
                                     </div>
                                     <div className="space-y-2">
                                         <Label>Cost Price</Label>
                                         <Input type="number" value={formData.pricing.cost} onChange={e => setFormData(p => ({...p, pricing: {...p.pricing, cost: Number(e.target.value)}}))} />
                                     </div>
                                     <div className="space-y-2">
                                         <Label>MRP</Label>
                                         <Input type="number" value={formData.pricing.mrp} onChange={e => setFormData(p => ({...p, pricing: {...p.pricing, mrp: Number(e.target.value)}}))} />
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Right Column */}
                         <div className="space-y-6">
                             {/* Status */}
                             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                 <h3 className="font-semibold text-lg mb-4">Organization</h3>
                                 <div className="space-y-2">
                                     <Label>Status</Label>
                                     <Select value={formData.status} onValueChange={v => updateField('status', v as any)}>
                                         <SelectTrigger><SelectValue /></SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="Active">Active</SelectItem>
                                             <SelectItem value="Draft">Draft</SelectItem>
                                             <SelectItem value="Inactive">Inactive</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>
                                 <div className="space-y-2">
                                     <Label>Brand</Label>
                                     <Input value={formData.brand} onChange={e => updateField('brand', e.target.value)} />
                                 </div>
                             </div>

                             {/* Inventory Toggle */}
                             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                                 <div className="flex items-center justify-between">
                                     <Label>Track Quantity</Label>
                                     <Switch checked={formData.trackQuantity} onClick={() => updateField('trackQuantity', !formData.trackQuantity)} />
                                 </div>
                                 <div className="flex items-center justify-between">
                                     <Label>Continue Selling When OOS</Label>
                                     <Switch checked={formData.continueSellingWhenOutOfStock} onClick={() => updateField('continueSellingWhenOutOfStock', !formData.continueSellingWhenOutOfStock)} />
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateProductModal;
