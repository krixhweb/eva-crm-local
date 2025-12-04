
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { InventoryDashboard } from './components/InventoryDashboard';
import { ProductCatalog } from './components/ProductCatalog';
import CreateProductModal from '../../../components/modals/CreateProductModal';
import CreateReplenishmentOrderDrawer, { ReplenishmentOrderPayload } from '../../../components/modals/CreateReplenishmentOrderDrawer';
import type { Product } from '../../../types';
import { useGlassyToasts } from '../../../components/ui/GlassyToastProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { addProduct, updateProduct, deleteProduct } from '../../../store/inventorySlice';
import type { RootState } from '../../../store/store';
import ConfirmationDialog from '../../../components/modals/ConfirmationDialog';

const ProductsInventoryPage: React.FC = () => {
    const { push } = useGlassyToasts();
    const dispatch = useDispatch();
    const location = useLocation();
    // Type assertion for state to avoid TS errors if location.state is unknown
    const state = location.state as { defaultTab?: string } | undefined;
    const defaultTab = state?.defaultTab || 'dashboard';
    
    const products = useSelector((state: RootState) => state.inventory.products);
    
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [reorderProduct, setReorderProduct] = useState<Product | null>(null);
    const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);

    const handleSaveProduct = (productData: Product) => {
        if (editingProduct) {
            dispatch(updateProduct(productData));
            push({ title: "Product Updated", description: `${productData.name} has been updated.`, variant: "success" });
        } else {
            // Ensure history is initialized
            const newProduct = {
                ...productData,
                history: [{
                    id: `h_${Date.now()}`,
                    action: 'Product Created',
                    actor: 'Current User',
                    date: new Date().toISOString(),
                    details: 'Initial creation via catalog'
                }]
            };
            dispatch(addProduct(newProduct));
            push({ title: "Product Created", description: `${productData.name} has been added to catalog.`, variant: "success" });
        }
        setCreateOpen(false);
        setIsEditOpen(false);
        setEditingProduct(null);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsEditOpen(true);
    };

    const handleDeleteProduct = (product: Product) => {
        setDeleteProductTarget(product);
    };

    const confirmDelete = () => {
        if (deleteProductTarget) {
            dispatch(deleteProduct(deleteProductTarget.id));
            push({ title: "Product Deleted", description: `${deleteProductTarget.name} removed.`, variant: "error" });
            setDeleteProductTarget(null);
        }
    };

    const handleReorderSubmit = (orderData: ReplenishmentOrderPayload) => {
        push({ 
            title: "Restock Initiated", 
            description: `Replenishment Order ${orderData.id} created for ${orderData.productName}.`,
            variant: "info"
        });
        setReorderProduct(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products & Inventory</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your product catalog and stock levels across locations.</p>
            </div>

            <Tabs key={defaultTab} defaultValue={defaultTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="dashboard">Inventory Dashboard</TabsTrigger>
                    <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                    <InventoryDashboard 
                        products={products} 
                        onReorder={setReorderProduct} 
                    />
                </TabsContent>

                <TabsContent value="catalog" className="space-y-6">
                    <ProductCatalog 
                        products={products} 
                        onAddProduct={() => { setEditingProduct(null); setCreateOpen(true); }}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                </TabsContent>
            </Tabs>

            {/* Create Modal */}
            {isCreateOpen && (
                <CreateProductModal 
                    isOpen={isCreateOpen} 
                    onClose={() => setCreateOpen(false)} 
                    onSave={handleSaveProduct}
                    product={null} 
                />
            )}

            {/* Edit Modal */}
            {isEditOpen && editingProduct && (
                <CreateProductModal 
                    isOpen={isEditOpen} 
                    onClose={() => { setIsEditOpen(false); setEditingProduct(null); }} 
                    onSave={handleSaveProduct}
                    product={editingProduct} 
                />
            )}

            {/* Replenishment Drawer (Replaces ReorderModal) */}
            <CreateReplenishmentOrderDrawer
                open={!!reorderProduct}
                onOpenChange={(open) => !open && setReorderProduct(null)}
                product={reorderProduct}
                onSave={handleReorderSubmit}
            />

            {/* Delete Dialog */}
            <ConfirmationDialog 
                isOpen={!!deleteProductTarget}
                onClose={() => setDeleteProductTarget(null)}
                onConfirm={confirmDelete}
                title="Delete Product"
                description={`Are you sure you want to delete ${deleteProductTarget?.name}? This action cannot be undone.`}
            />
        </div>
    );
};

export default ProductsInventoryPage;
