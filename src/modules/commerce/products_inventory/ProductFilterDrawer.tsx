
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/Select";
import MultiSelect from "../../../../components/ui/MultiSelect";
import { productLocations } from "../../../../data/inventoryMockData";
import { DatePicker } from "../../../../components/ui/DatePicker";

// Format utility (dd-mm-yyyy)
const formatDate = (date: Date | null) => {
  if (!date) return "";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

// Parse dd-mm-yyyy → real Date object
const parseDMY = (str: string) => {
  if (!str) return null;
  const [d, m, y] = str.split("-").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
};

// Validate dd-mm-yyyy strictly
const isValidDMY = (str: string) => {
  const regex = /^([0-2]\d|3[0-1])-(0\d|1[0-2])-(19\d{2}|20\d{2})$/;
  if (!regex.test(str)) return false;

  const [d, m, y] = str.split("-").map(Number);
  const dt = new Date(y, m - 1, d);

  // Check actual date existence
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === m - 1 &&
    dt.getDate() === d
  );
};

interface FilterState {
  categories: string[];
  status: string;
  warehouse: string;
  dateFrom: string; // dd-mm-yyyy
  dateTo: string;   // dd-mm-yyyy
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

  const [dateError, setDateError] = useState<string | null>(null);

  // Date Validation Handler
  useEffect(() => {
    if (filters.dateFrom && !isValidDMY(filters.dateFrom)) {
      setDateError("Invalid start date format (dd-mm-yyyy).");
      return;
    }

    if (filters.dateTo && !isValidDMY(filters.dateTo)) {
      setDateError("Invalid end date format (dd-mm-yyyy).");
      return;
    }

    const fromDate = parseDMY(filters.dateFrom);
    const toDate = parseDMY(filters.dateTo);

    if (fromDate && toDate && fromDate > toDate) {
      setDateError("Start date cannot be after end date.");
      return;
    }

    setDateError(null);
  }, [filters.dateFrom, filters.dateTo]);

  const handleApply = () => {
    if (dateError) return;
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const reset = {
      categories: [],
      status: "All",
      warehouse: "All",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(reset);
    onApply(reset);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="w-full md:w-[420px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
        <DrawerHeader className="border-b dark:border-gray-800 px-6 py-5 bg-white dark:bg-zinc-900 z-10">
          <DrawerTitle>Filter Products</DrawerTitle>
          <DrawerDescription>
            Refine your product list by category, status, warehouse and updated date.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">

          {/* Category */}
          <div className="space-y-3">
            <Label>Category</Label>
            <MultiSelect
              options={categories}
              value={filters.categories}
              onChange={(v) => setFilters({ ...filters, categories: v })}
              placeholder="Select categories…"
            />
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warehouse */}
          <div className="space-y-3">
            <Label>Warehouse Availability</Label>
            <Select
              value={filters.warehouse}
              onValueChange={(val) => setFilters({ ...filters, warehouse: val })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Warehouses</SelectItem>
                {productLocations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label>Last Updated Range</Label>

            <div className="grid grid-cols-2 gap-4">
              {/* FROM DATE */}
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>From</span>
                  {filters.dateFrom && (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        setFilters((f) => ({ ...f, dateFrom: "" }))
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>

                <DatePicker
                  mode="single"
                  placeholder="Select date..."
                  value={
                    filters.dateFrom && isValidDMY(filters.dateFrom)
                      ? parseDMY(filters.dateFrom)
                      : null
                  }
                  onChange={(date) => {
                    setFilters((f) => ({
                      ...f,
                      dateFrom: date ? formatDate(date) : "",
                    }));
                  }}
                  className={dateError ? "border-red-500" : ""}
                />
              </div>

              {/* TO DATE */}
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>To</span>
                  {filters.dateTo && (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        setFilters((f) => ({ ...f, dateTo: "" }))
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>

                <DatePicker
                  mode="single"
                  placeholder="Select date..."
                  value={
                    filters.dateTo && isValidDMY(filters.dateTo)
                      ? parseDMY(filters.dateTo)
                      : null
                  }
                  onChange={(date) => {
                    setFilters((f) => ({
                      ...f,
                      dateTo: date ? formatDate(date) : "",
                    }));
                  }}
                  className={dateError ? "border-red-500" : ""}
                />
              </div>
            </div>

            {dateError && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {dateError}
              </p>
            )}
          </div>
        </div>

        <DrawerFooter className="flex-row justify-end gap-2 border-t border-gray-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-900 z-20">
          <Button variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
          <Button onClick={handleApply} disabled={!!dateError}>
            Apply Filters
          </Button>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  );
};
