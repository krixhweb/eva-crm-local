/* DatePicker.tsx — Combined Popover + Calendar component for picking single dates or ranges.
   Purpose: Used across filters, analytics, orders, reports, marketing campaign scheduling, etc.
   Notes: Includes preset shortcuts (Today, Last 7 days, etc) + auto-close logic.
*/

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Calendar } from "./Calendar";
import type { DateRange } from "./Calendar";
import { Button } from "./Button";
import { Icon } from "../shared/icon";
import { cn } from "../../lib/utils";

/* --- Format helper (DD-MM-YYYY) --- */
const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

interface DatePickerProps {
  mode?: "single" | "range";
  value: Date | DateRange | null;
  onChange: (date: any) => void;
  className?: string;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = "single",
  value,
  onChange,
  className,
  placeholder = "Pick a date",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /* --- Date Preset Handling --- */
  const applyPreset = (type: string) => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const from = new Date(t);
    const to = new Date(t);

    switch (type) {
      case "yesterday":
        from.setDate(t.getDate() - 1);
        to.setDate(t.getDate() - 1);
        break;
      case "last7":
        from.setDate(t.getDate() - 6);
        break;
      case "last30":
        from.setDate(t.getDate() - 29);
        break;
      case "thisMonth":
        from.setDate(1);
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        to.setDate(0);
        break;
      // "today" uses default from/to (already today)
    }

    mode === "range" ? onChange({ from, to }) : onChange(from);
    setIsOpen(false);
  };

  /* --- Calendar selection logic --- */
  const handleCalendarSelect = (selected: any) => {
    onChange(selected);
    if (mode === "single") return setIsOpen(false);
    if (mode === "range" && selected?.from && selected?.to) setIsOpen(false);
  };

  /* --- Displayed text in button --- */
  let displayText = placeholder;

  if (value) {
    if (mode === "single" && value instanceof Date) {
      displayText = formatDate(value);
    } else if (mode === "range") {
      const r = value as DateRange;
      if (r.from) {
        displayText = formatDate(r.from);
        if (r.to) displayText += ` - ${formatDate(r.to)}`;
      }
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700",
            !value && "text-gray-500 dark:text-gray-400",
            className
          )}
        >
          <Icon name="calendar" className="mr-2 h-4 w-4 text-gray-500" />
          <span className="truncate">{displayText}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 overflow-hidden max-w-[90vw] rounded-lg"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col sm:flex-row">

          {/* --- Presets Column --- */}
          <div className="w-full sm:w-[150px] shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-2 flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-visible hide-scrollbar">
            
            <p className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
              Presets
            </p>

            {[
              { label: "Today", id: "today" },
              { label: "Yesterday", id: "yesterday" },
              { label: "Last 7 days", id: "last7" },
              { label: "Last 30 days", id: "last30" },
              { label: "This Month", id: "thisMonth" },
              { label: "Last Month", id: "lastMonth" },
            ].map((preset) => (
              <Button
                key={preset.id}
                variant="ghost"
                size="sm"
                onClick={() => applyPreset(preset.id)}
                className="justify-center sm:justify-start h-7 px-2 text-xs font-normal text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-400 transition"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* --- Calendar Column --- */}
          <div className="p-2">
            <Calendar
              mode={mode}
              selected={value}
              onSelect={handleCalendarSelect}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};