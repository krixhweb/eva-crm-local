
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Calendar, DateRange } from "./Calendar";
import { Button } from "./Button";
import { Icon } from "../shared/Icon";
import { cn } from "../../lib/utils";

interface DatePickerProps {
  mode?: "single" | "range";
  value: Date | DateRange | null;
  onChange: (date: any) => void;
  className?: string;
  placeholder?: string;
}

const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = "single",
  value,
  onChange,
  className,
  placeholder = "Pick a date",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- Presets Logic ---
  const applyPreset = (type: string) => {
    const today = new Date();
    const from = new Date();
    const to = new Date();

    // Normalize "Today" to ensure consistent time (00:00:00)
    today.setHours(0,0,0,0);
    from.setHours(0,0,0,0);
    to.setHours(0,0,0,0);

    switch (type) {
      case "today":
        // from/to are already today
        break;
      case "yesterday":
        from.setDate(today.getDate() - 1);
        to.setDate(today.getDate() - 1);
        break;
      case "last7":
        from.setDate(today.getDate() - 6);
        break;
      case "last30":
        from.setDate(today.getDate() - 29);
        break;
      case "thisMonth":
        from.setDate(1); // 1st of current month
        // to is today
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1); // 1st of last month
        to.setDate(0); // last day of last month (0th day of current month)
        break;
    }

    if (mode === "range") {
      onChange({ from, to });
    } else {
      onChange(from);
    }
    
    // Automatically close popover when a preset is clicked
    setIsOpen(false);
  };

  // Handle Calendar Selection
  const handleCalendarSelect = (selected: any) => {
    onChange(selected);
    
    // Auto-close logic:
    // 1. Single mode: Close immediately on select
    // 2. Range mode: Close only when both 'from' and 'to' are present
    if (mode === "single") {
      setIsOpen(false);
    } else if (mode === "range" && selected?.from && selected?.to) {
      setIsOpen(false);
    }
  };

  // --- Display Text Calculation ---
  let displayText = placeholder;
  if (value) {
    if (mode === "single" && value instanceof Date) {
      displayText = formatDate(value);
    } else if (mode === "range") {
      const range = value as DateRange;
      if (range?.from) {
        displayText = formatDate(range.from);
        if (range.to) {
          displayText += ` - ${formatDate(range.to)}`;
        }
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
      
      {/* 
        Popover Content Layout:
        - Flexible width to accommodate calendar size.
      */}
      <PopoverContent 
        className="w-auto p-0 overflow-hidden max-w-[90vw]" 
        align="start" 
        sideOffset={8}
      >
        <div className="flex flex-col sm:flex-row">
          
          {/* Left Column: Presets */}
          <div className="w-full sm:w-[140px] shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-2 flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible hide-scrollbar">
            <div className="hidden sm:block mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Presets</p>
            </div>
            
            {[
              { label: "Today", id: "today" },
              { label: "Yesterday", id: "yesterday" },
              { label: "Last 7 days", id: "last7" },
              { label: "Last 30 days", id: "last30" },
              { label: "This Month", id: "thisMonth" },
              { label: "Last Month", id: "lastMonth" },
            ].map(preset => (
              <Button
                key={preset.id}
                variant="ghost"
                size="sm"
                onClick={() => applyPreset(preset.id)}
                className="justify-center sm:justify-start h-7 px-2 text-xs font-normal text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Right Column: Calendar */}
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
