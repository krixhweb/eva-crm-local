/* Checkbox.tsx — Custom checkbox component with icon checkmark.
   Purpose: Provides consistent checkbox behavior + styling across forms, filters, tables.
*/

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Icon } from '../shared/icon';

/* --- Props: same as <input type="checkbox"> but with onCheckedChange --- */
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onCheckedChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/* --- Checkbox Component --- */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const internalId = React.useId();        // fallback id for inputs
    const id = props.id || internalId;

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={props.disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border transition-colors cursor-pointer',
          'border-gray-400 dark:border-gray-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          checked
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
          className
        )}
      >
        {/* Hidden input so checkbox works with real forms */}
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          {...props}
        />

        {checked && <Icon name="check" className="h-3 w-3" />}
      </button>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
