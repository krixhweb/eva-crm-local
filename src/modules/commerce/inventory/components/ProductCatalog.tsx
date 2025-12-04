
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Icon } from "../../../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../../../components/ui/DropdownMenu";
import type { Product } from "../../../../types";
import { ProductFilterDrawer } from "./ProductFilterDrawer";
import { formatCurrency } from "../../../../lib/utils";

interface ProductCatalogProps {
    products: Product[];
    onAddProduct: () => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
    products, 
    onAddProduct, 
    onEditProduct, 
    onDeleteProduct 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigate = useNavigate();

    const [activeFilters, setActiveFilters] = useState({
        categories: [] as string[],
        status: 'All',
        warehouse: 'All',
        dateFrom: '',
        dateTo: ''
    });

    const uniqueCategories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

    const parseFilterDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        return new Date(y, m, d);
    };

    const filteredProducts = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return products.filter(p => {
            // Search
            const matchesSearch = p.name.toLowerCase().includes(lowerSearch) ||
                                  p.sku.toLowerCase().includes(lowerSearch) ||
                                  p.category.toLowerCase().includes(lowerSearch);
            
            // Category Filter
            const matchesCategory = activeFilters.categories.length === 0 || activeFilters.categories.includes(p.category);
            
            // Status Filter
            const matchesStatus = activeFilters.status === 'All' || p.status === activeFilters.status;

            // Warehouse Filter - Updated to use inventoryByLocation
            const matchesWarehouse = activeFilters.warehouse === 'All' || p.inventoryByLocation.some(l => l.locationId === activeFilters.warehouse && l.stock > 0);

            // Date Filter
            let matchesDate = true;
            if (activeFilters.dateFrom || activeFilters.dateTo) {
                const pDate = new Date(p.lastUpdated || p.createdAt || '1970-01-01');
                pDate.setHours(0, 0, 0, 0); 

                if (activeFilters.dateFrom) {
                    const fromDate = parseFilterDate(activeFilters.dateFrom);
                    if (fromDate) {
                        fromDate.setHours(0, 0, 0, 0);
                        if (pDate < fromDate) matchesDate = false;
                    }
                }
                
                if (activeFilters.dateTo && matchesDate) {
                    const toDate = parseFilterDate(activeFilters.dateTo);
                    if (toDate) {
                        toDate.setHours(23, 59, 59, 999); 
                        const pDateCheck = new Date(p.lastUpdated || p.createdAt || '1970-01-01');
                        pDateCheck.setHours(0,0,0,0);
                        
                        if (pDateCheck > toDate) matchesDate = false;
                    }
                }
            }

            return matchesSearch && matchesCategory && matchesStatus && matchesWarehouse && matchesDate;
        });
    }, [products, searchTerm, activeFilters]);

    const activeFilterCount = 
        activeFilters.categories.length + 
        (activeFilters.status !== 'All' ? 1 : 0) + 
        (activeFilters.warehouse !== 'All' ? 1 : 0) +
        (activeFilters.dateFrom || activeFilters.dateTo ? 1 : 0);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                        <CardTitle>Product Catalog</CardTitle>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder="Search products..." 
                                    className="pl-10 h-9" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="gap-2 relative" onClick={() => setIsFilterOpen(true)}>
                                <Icon name="list" className="h-4 w-4" />
                                Filter
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                            <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={onAddProduct}>
                                <Icon name="plus" className="h-4 w-4" />
                                Create Product
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                    <TableHead className="w-[60px]">Image</TableHead>
                                    <TableHead>Product Name & SKU</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total Stock</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map(p => (
                                    <TableRow 
                                        key={p.id} 
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        onClick={() => navigate(`/commerce/products/${p.id}`)}
                                    >
                                        <TableCell>
                                            <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border dark:border-gray-700">
                                                {p.images && p.images[0] ? (
                                                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Icon name="image" className="h-5 w-5 text-gray-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-100">{p.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">{p.sku}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">{p.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(p.pricing.sellingPrice)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-gray-700 dark:text-gray-300">
                                            {p.totalStock} units
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={p.status === 'Active' ? 'green' : p.status === 'Draft' ? 'yellow' : 'gray'}>
                                                {p.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Icon name="moreVertical" className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate(`/commerce/products/${p.id}`)}>
                                                            <Icon name="fileText" className="w-4 h-4 mr-2" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onEditProduct(p)}>
                                                            <Icon name="edit" className="w-4 h-4 mr-2" /> Edit Product
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => onDeleteProduct(p)}>
                                                            <Icon name="close" className="w-4 h-4 mr-2" /> Delete Product
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Icon name="search" className="h-8 w-8 opacity-20" />
                                                <p>No products found matching your filters.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ProductFilterDrawer 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={setActiveFilters}
                categories={uniqueCategories}
            />
        </>
    );
};
