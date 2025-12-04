/* Calendar.tsx — Custom date picker UI for selecting single dates or date ranges.
   Purpose: Used in filters, scheduling, marketing automation, orders, etc.
   Modes:
     • single → pick one date
     • range  → pick start + end with hover preview
*/

import React, { useState, useEffect } from "react";
import { Icon } from "../shared/icon";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export type DateRange = { from: Date | undefined; to?: Date | undefined };

interface CalendarProps {
  mode?: "single" | "range";
  selected?: Date | DateRange | null;
  onSelect?: (date: any) => void;
  className?: string;
}

/* --- Static labels --- */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

/* --- Strip time for accurate equality checks --- */
const stripTime = (d: Date) => {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
};

export const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  onSelect,
  className,
}) => {

  /* --- Current month in view --- */
  const [viewDate, setViewDate] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  /* --- Sync month view when "selected" changes externally --- */
  useEffect(() => {
    if (!selected) return;
    if (selected instanceof Date) setViewDate(new Date(selected));
    else if (selected.from) setViewDate(new Date(selected.from));
  }, [selected]);

  /* --- Helpers for calendar math --- */
  const getDaysInMonth = (y:number,m:number)=> new Date(y, m+1, 0).getDate();
  const getFirstDayOfMonth = (y:number,m:number)=> new Date(y, m, 1).getDay();

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  /* --- Handle click selection (single or range) --- */
  const handleDateClick = (date: Date) => {
    if (mode === "single") return onSelect?.(date);

    const range = (selected as DateRange) || { from: undefined, to: undefined };

    // Start new range
    if (!range.from || range.to) return onSelect?.({ from: date, to: undefined });

    // Complete range
    const from = range.from;
    if (date < from) onSelect?.({ from: date, to: from });
    else onSelect?.({ from, to: date });
  };

  /* --- Render calendar days with highlight logic --- */
  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = stripTime(new Date()).getTime();

    let rangeStart: number | null = null;
    let rangeEnd: number | null = null;

    /* --- Determine active range values --- */
    if (mode === "range" && selected) {
      const r = selected as DateRange;
      if (r.from) rangeStart = stripTime(r.from).getTime();
      if (r.to) rangeEnd = stripTime(r.to).getTime();
    } else if (mode === "single" && selected instanceof Date) {
      rangeStart = stripTime(selected).getTime();
      rangeEnd = rangeStart;
    }

    const days = [];

    /* --- Add empty pads before first day --- */
    for (let i = 0; i < firstDay; i++) days.push(<div key={`pad-${i}`} />);

    /* --- Actual month days --- */
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const time = stripTime(date).getTime();

      let isSelected = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      let isRangeMiddle = false;
      let isHoverRange = false;

      /* --- Range & hover logic --- */
      if (mode === "single") {
        isSelected = rangeStart === time;
      } else {
        isRangeStart = rangeStart === time;
        isRangeEnd = rangeEnd === time;
        isSelected = isRangeStart || isRangeEnd;

        if (rangeStart && rangeEnd) {
          isRangeMiddle = time > rangeStart && time < rangeEnd;
        } else if (rangeStart && hoverDate && !rangeEnd) {
          const hoverTime = stripTime(hoverDate).getTime();
          const start = Math.min(rangeStart, hoverTime);
          const end = Math.max(rangeStart, hoverTime);
          isHoverRange = time >= start && time <= end;

          if (time === start) isRangeStart = true;
          if (time === end) isRangeEnd = true;
        }
      }

      const isToday = time === today;

      /* --- Day Cell --- */
      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoverDate(date)}
          className={cn(
            "relative h-8 w-8 aspect-square flex items-center justify-center text-xs transition-all",
            isSelected && "bg-green-600 text-white rounded-md",
            isRangeMiddle && "bg-green-100 dark:bg-green-900/40 text-gray-900 dark:text-gray-100 rounded-none",
            isHoverRange && !isSelected && !isRangeMiddle && "bg-green-50 dark:bg-green-900/20",
            isRangeStart && (Boolean(rangeEnd) || isHoverRange) && "rounded-l-md rounded-r-none",
            isRangeEnd && (Boolean(rangeStart) || isHoverRange) && "rounded-r-md rounded-l-none",
            !isSelected && !isRangeMiddle && !isHoverRange && "hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md",
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

      {/* --- Month Navigation --- */}
      <div className="flex items-center justify-between pb-2 pt-1 px-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMonth}>
            <Icon name="chevronLeft" className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
            <Icon name="chevronRight" className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* --- Weekday Labels --- */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAYS.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-[0.65rem] text-gray-500 font-medium uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* --- Day Grid --- */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {renderDays()}
      </div>

    </div>
  );
};
