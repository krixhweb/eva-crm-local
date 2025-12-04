
import React, { useState, useEffect } from "react";
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
import { Icon } from "../../../../components/shared/Icon";
import { Badge } from "../../../../components/ui/Badge";
import { DatePicker } from "../../../../components/ui/DatePicker";
import type { DateRange } from "../../../../components/ui/Calendar";

export interface OrderFiltersState {
  search: string;
  dateFrom: string;
  dateTo: string;
  status: string[];
  minAmount: string;
  maxAmount: string;
}

interface SalesOrderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: OrderFiltersState;
  onApply: (filters: OrderFiltersState) => void;
  onClear: () => void;
}

const STATUS_OPTIONS = ["Pending", "Confirmed", "Delivered", "Cancelled", "Shipped", "Draft"];

export const SalesOrderFilterDrawer: React.FC<SalesOrderFilterDrawerProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApply,
  onClear,
}) => {
  const [filters, setFilters] = useState<OrderFiltersState>(currentFilters);

  // Sync local state when drawer opens with current active filters
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  const toggleStatus = (status: string) => {
    setFilters((prev) => {
      const isActive = prev.status.includes(status);
      if (isActive) {
        return { ...prev, status: prev.status.filter((s) => s !== status) };
      } else {
        return { ...prev, status: [...prev.status, status] };
      }
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClearLocal = () => {
    const emptyFilters = {
      search: "",
      dateFrom: "",
      dateTo: "",
      status: [],
      minAmount: "",
      maxAmount: "",
    };
    setFilters(emptyFilters);
    onClear(); 
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setFilters({
        ...filters,
        dateFrom: range?.from ? range.from.toISOString().split('T')[0] : "",
        dateTo: range?.to ? range.to.toISOString().split('T')[0] : ""
    });
  };

  const activeCount = 
    (filters.search ? 1 : 0) + 
    (filters.dateFrom ? 1 : 0) + 
    (filters.dateTo ? 1 : 0) + 
    filters.status.length + 
    (filters.minAmount ? 1 : 0) + 
    (filters.maxAmount ? 1 : 0);

  const dateValue: DateRange = {
      from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      to: filters.dateTo ? new Date(filters.dateTo) : undefined
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="w-full md:w-[420px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
        <DrawerHeader className="border-b dark:border-gray-800 pb-4 px-6 py-5 bg-white dark:bg-zinc-900 z-10">
          <div className="flex items-center justify-between">
            <DrawerTitle>Filter Orders</DrawerTitle>
            {activeCount > 0 && (
                <Badge variant="green" className="ml-2">
                    {activeCount} Active
                </Badge>
            )}
          </div>
          <DrawerDescription>
            Refine your sales orders list using the criteria below.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 dark:bg-zinc-950/50">
          
          {/* 1. SEARCH FILTER */}
          <div className="space-y-3">
            <Label htmlFor="search-orders" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Search
            </Label>
            <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    id="search-orders"
                    placeholder="Search by Order ID or Customer..."
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    autoFocus
                />
            </div>
          </div>

          {/* 2. DATE RANGE FILTER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date Range</Label>
                {(filters.dateFrom || filters.dateTo) && (
                    <button 
                        onClick={() => setFilters({ ...filters, dateFrom: "", dateTo: "" })}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Clear Dates
                    </button>
                )}
            </div>
            
            <DatePicker 
                mode="range" 
                value={dateValue} 
                onChange={handleDateChange} 
                placeholder="Pick a date range"
                className="w-full"
            />
          </div>

          {/* 3. STATUS FILTER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</Label>
                {filters.status.length > 0 && (
                     <button 
                        onClick={() => setFilters({ ...filters, status: [] })}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Clear Status
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => {
                    const isSelected = filters.status.includes(status);
                    return (
                        <button
                            key={status}
                            onClick={() => toggleStatus(status)}
                            className={`
                                px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                                ${isSelected 
                                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800" 
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-zinc-900 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
                                }
                            `}
                        >
                            {status}
                        </button>
                    );
                })}
            </div>
          </div>

          {/* 4. AMOUNT FILTER */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Amount (₹)</Label>
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Min</span>
                    <Input
                        type="number"
                        placeholder="0"
                        className="pl-10"
                        value={filters.minAmount}
                        onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Max</span>
                    <Input
                        type="number"
                        placeholder="Any"
                        className="pl-10"
                        value={filters.maxAmount}
                        onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    />
                </div>
            </div>
          </div>

        </div>

        <DrawerFooter className="border-t dark:border-gray-800 bg-white dark:bg-zinc-900 p-4">
          <Button 
            variant="ghost" 
            onClick={handleClearLocal}
            disabled={activeCount === 0}
            className="flex-1"
          >
            Clear Filters
          </Button>
          <Button 
            onClick={handleApply} 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            Apply Filters
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
