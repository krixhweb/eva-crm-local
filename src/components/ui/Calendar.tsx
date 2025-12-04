
import React, { useState, useEffect } from "react";
import { Icon } from "../shared/Icon";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface CalendarProps {
  mode?: "single" | "range";
  selected?: Date | DateRange | null;
  onSelect?: (date: any) => void;
  className?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper to strip time components for accurate date comparison
const stripTime = (d: Date) => {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
};

export const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  onSelect,
  className,
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Sync internal view if selected date changes externally
  useEffect(() => {
    if (selected) {
      if (selected instanceof Date) {
        setViewDate(new Date(selected));
      } else if ((selected as DateRange).from) {
        setViewDate(new Date((selected as DateRange).from!));
      }
    }
  }, [selected]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const handleDateClick = (date: Date) => {
    if (mode === "single") {
      onSelect?.(date);
    } else {
      const currentRange = (selected as DateRange) || { from: undefined, to: undefined };
      
      // Logic for Range Selection
      if (!currentRange.from || (currentRange.from && currentRange.to)) {
        // Start new range
        onSelect?.({ from: date, to: undefined });
      } else {
        // Complete the range
        const from = currentRange.from;
        if (date < from) {
          // If clicked date is before start, swap them
          onSelect?.({ from: date, to: from });
        } else {
          onSelect?.({ from: from, to: date });
        }
      }
    }
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const todayTime = stripTime(new Date()).getTime();
    
    // Determine active range timestamps
    let rangeStart: number | null = null;
    let rangeEnd: number | null = null;
    
    if (mode === "range" && selected) {
      const s = selected as DateRange;
      if (s.from) rangeStart = stripTime(s.from).getTime();
      if (s.to) rangeEnd = stripTime(s.to).getTime();
    } else if (mode === "single" && selected instanceof Date) {
      rangeStart = stripTime(selected).getTime();
      rangeEnd = rangeStart;
    }

    const days = [];

    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const time = stripTime(date).getTime();
      
      let isSelected = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      let isRangeMiddle = false;
      let isHoverRange = false;

      if (mode === "single") {
        isSelected = rangeStart === time;
      } else {
        isRangeStart = rangeStart === time;
        isRangeEnd = rangeEnd === time;
        isSelected = isRangeStart || isRangeEnd;

        // Solid highlighted range
        if (rangeStart && rangeEnd) {
          isRangeMiddle = time > rangeStart && time < rangeEnd;
        }
        // Hover preview range (only if start exists but no end)
        else if (rangeStart && hoverDate && !rangeEnd) {
          const hoverTime = stripTime(hoverDate).getTime();
          const start = Math.min(rangeStart, hoverTime);
          const end = Math.max(rangeStart, hoverTime);
          isHoverRange = time >= start && time <= end;
          
          // Style the temporary start/end during hover
          if (time === start) isRangeStart = true;
          if (time === end) isRangeEnd = true;
        }
      }

      const isToday = time === todayTime;

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoverDate(date)}
          className={cn(
            "relative h-8 w-8 p-0 text-xs font-normal flex items-center justify-center transition-all z-10",
            // Strict square aspect ratio
            "aspect-square", 
            
            // --- Shape & Borders ---
            isSelected && "rounded-md",
            
            // --- Middle Range Style (Light Green) ---
            isRangeMiddle && "bg-green-100 dark:bg-green-900/40 text-gray-900 dark:text-gray-100 rounded-none",
            
            // --- Hover Range Preview (Light Dashed/Faded) ---
            isHoverRange && !isRangeMiddle && !isSelected && "bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100",
            
            // --- Range Caps (Connectors) ---
            // If it's start, round left. If it has a range to the right, square right.
            isRangeStart && (rangeEnd || isHoverRange) && "rounded-r-none rounded-l-md",
            // If it's end, round right. If it has a range to the left, square left.
            isRangeEnd && (rangeStart || isHoverRange) && "rounded-l-none rounded-r-md",

            // --- Selected State (Solid Green) ---
            isSelected && "bg-green-600 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white z-20",
            
            // --- Default / Hover State ---
            !isSelected && !isRangeMiddle && !isHoverRange && "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-md",
            
            // --- Today Marker ---
            isToday && !isSelected && !isRangeMiddle && "text-green-600 font-bold border border-green-200 dark:border-green-800",
            
            "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={cn("p-2 w-full max-w-[280px] mx-auto", className)} onMouseLeave={() => setHoverDate(null)}>
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between space-x-4 pb-2 pt-1 px-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 pl-1">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={handlePrevMonth}>
            <Icon name="chevronLeft" className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={handleNextMonth}>
            <Icon name="chevronRight" className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 w-full text-center mb-1">
        {DAYS.map((day) => (
          <div key={day} className="h-8 w-8 flex items-center justify-center text-[0.65rem] text-gray-500 font-medium uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 w-full text-center">
        {renderDays()}
      </div>
    </div>
  );
};
