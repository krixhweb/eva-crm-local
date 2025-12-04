
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Input } from '../ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Icon } from '../icons/Icon';
import { cn } from '../../lib/utils';
import type { Customer } from '../../types';

interface CustomerAutocompleteProps {
  customers: Customer[];
  value: Customer | null;
  onChange: (customer: Customer | null) => void;
  placeholder?: string;
}

export const CustomerAutocomplete: React.FC<CustomerAutocompleteProps> = ({
  customers,
  value,
  onChange,
  placeholder = "Search customer...",
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? value.name : "");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync input value when external value changes
  useEffect(() => {
    if (value) {
        if (value.name !== inputValue) {
             setInputValue(value.name);
        }
    } else {
        // If value is cleared externally, allow input to be cleared
        // Only clear if we aren't the ones focusing it (avoids clearing while typing if parent re-renders)
        if (document.activeElement !== inputRef.current) {
            setInputValue("");
        }
    }
  }, [value]);

  const filteredCustomers = useMemo(() => {
    if (!inputValue) return customers;
    const lower = inputValue.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(lower) ||
      c.email.toLowerCase().includes(lower) ||
      c.phone.includes(lower)
    );
  }, [customers, inputValue]);

  const handleSelect = (customer: Customer) => {
    onChange(customer);
    setInputValue(customer.name);
    setOpen(false);
    // Keep focus logic clean
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            setOpen(true);
        }
        return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredCustomers.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredCustomers.length) % filteredCustomers.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCustomers.length > 0) {
          handleSelect(filteredCustomers[activeIndex]);
        }
        break;
      case 'Escape':
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (open && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full group">
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setOpen(true);
                setActiveIndex(0);
                if (!e.target.value) onChange(null);
              }}
              onClick={(e) => {
                  // CRITICAL: Stop propagation so PopoverTrigger doesn't toggle (close) the popover
                  e.stopPropagation();
                  setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              className={cn(
                "pr-10 transition-all duration-200", 
                open && "ring-2 ring-green-500 border-green-500"
              )}
              autoComplete="off"
            />
            <Icon 
                name="search" 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" 
            />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[350px] max-w-[90vw]" 
        align="start" 
        sideOffset={5}
        // Prevent autofocus on content to keep input focused
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div 
            ref={listRef}
            className="max-h-[300px] overflow-y-auto p-1 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-100 dark:border-zinc-800"
        >
          {filteredCustomers.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                <Icon name="users" className="h-6 w-6 opacity-20" />
                <span>No customers found.</span>
            </div>
          ) : (
            filteredCustomers.map((c, i) => (
              <div
                key={c.id}
                className={cn(
                  "flex flex-col px-3 py-2.5 rounded-md cursor-pointer text-sm transition-colors border border-transparent",
                  i === activeIndex 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30" 
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800"
                )}
                onClick={() => handleSelect(c)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{c.name}</span>
                    {c.address?.city && (
                        <span className="text-[10px] uppercase tracking-wide font-medium text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                            {c.address.city}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 truncate" title={c.email}>
                        <Icon name="mail" className="h-3 w-3 opacity-70" />
                        {c.email}
                    </span>
                    <span className="opacity-30 text-gray-400">|</span>
                    <span className="flex items-center gap-1 shrink-0" title={c.phone}>
                        <Icon name="phone" className="h-3 w-3 opacity-70" />
                        {c.phone}
                    </span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
