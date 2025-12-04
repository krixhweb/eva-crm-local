
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "../../../../components/ui/Drawer";
import { Button } from "../../../../components/ui/Button";
import { Label } from "../../../../components/ui/Label";
import { Input } from "../../../../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/Select";
import MultiSelect from "../../../../components/ui/MultiSelect";
import { productLocations } from "../../../../data/inventoryMockData";

interface FilterState {
  categories: string[];
  status: string;
  warehouse: string;
  dateFrom: string;
  dateTo: string;
}

interface ProductFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  categories: string[];
}

export const ProductFilterDrawer: React.FC<ProductFilterDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  categories,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    status: "All",
    warehouse: "All",
    dateFrom: "",
    dateTo: "",
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const resetFilters = {
      categories: [],
      status: "All",
      warehouse: "All",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-md" resizable>
        <DrawerHeader>
          <DrawerTitle>Filter Products</DrawerTitle>
          <DrawerDescription>
            Refine your product list by category, status, and stock location.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <MultiSelect
              options={categories}
              value={filters.categories}
              onChange={(val) => setFilters({ ...filters, categories: val })}
              placeholder="Select categories..."
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warehouse */}
          <div className="space-y-2">
            <Label>Warehouse Availability</Label>
            <Select
              value={filters.warehouse}
              onValueChange={(val) => setFilters({ ...filters, warehouse: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Warehouses</SelectItem>
                {productLocations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Last Updated Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">From</span>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">To</span>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-row justify-end gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
