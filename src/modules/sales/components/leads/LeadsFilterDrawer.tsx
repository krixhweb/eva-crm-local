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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/Select";
import { DatePicker } from "../../../../components/ui/DatePicker";
import type { DateRange } from "../../../../components/ui/Calendar";

interface LeadsFilterState {
  assignedValue: string;
  stageValue: string;
  priorityValue: string;
  dateFrom: string;
  dateTo: string;
}

interface LeadsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: LeadsFilterState;
  assignees: string[];
  stages: string[];
  priorities: string[];
  onApply: (filters: LeadsFilterState) => void;
  onClear: () => void;
}

export const LeadsFilterDrawer: React.FC<LeadsFilterDrawerProps> = ({
  isOpen,
  onClose,
  currentFilters,
  assignees,
  stages,
  priorities,
  onApply,
  onClear,
}) => {
  const [filters, setFilters] = useState<LeadsFilterState>(currentFilters);

  // Sync local state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClearLocal = () => {
    onClear();
    onClose();
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setFilters({
      ...filters,
      dateFrom: range?.from ? range.from.toISOString().split("T")[0] : "",
      dateTo: range?.to ? range.to.toISOString().split("T")[0] : "",
    });
  };

  // Convert strings to DateRange object for DatePicker
  const dateValue: DateRange | undefined =
    filters.dateFrom || filters.dateTo
      ? {
          from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
          to: filters.dateTo ? new Date(filters.dateTo) : undefined,
        }
      : undefined;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        className="w-full md:w-[420px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl"
        resizable
        showCloseButton
      >
        <DrawerHeader className="border-b border-gray-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-900 z-10">
          <DrawerTitle>Filter Leads</DrawerTitle>
          <DrawerDescription>
            Narrow down your leads by assignee, stage, priority, or date.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Assignee
            </Label>
            <Select
              value={filters.assignedValue}
              onValueChange={(v) =>
                setFilters({ ...filters, assignedValue: v })
              }
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assignees</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Stage
            </Label>
            <Select
              value={filters.stageValue}
              onValueChange={(v) => setFilters({ ...filters, stageValue: v })}
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stages</SelectItem>
                {stages
                  .filter((s) => s !== "All")
                  .map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Priority
            </Label>
            <Select
              value={filters.priorityValue}
              onValueChange={(v) =>
                setFilters({ ...filters, priorityValue: v })
              }
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                {priorities
                  .filter((p) => p !== "All")
                  .map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Due Date Range
            </Label>
            <DatePicker
              mode="range"
              value={dateValue}
              onChange={handleDateChange}
              placeholder="Filter by Due Date"
              className="w-full h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
            />
          </div>
        </div>

        <DrawerFooter className="border-t border-gray-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-900 z-20">
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              variant="outline"
              onClick={handleClearLocal}
              className="h-12 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300"
            >
              Clear Filters
            </Button>
            <Button
              onClick={handleApply}
              className="h-12 bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold"
            >
              Apply Filters
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
