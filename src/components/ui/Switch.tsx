import { forwardRef, useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked = false, onCheckedChange, className, disabled, ...props }, ref) => {
    const [internal, setInternal] = useState<boolean>(defaultChecked);
    const isControlled = checked !== undefined;
    const current = isControlled ? !!checked : internal;

    const toggle = () => {
      if (disabled) return;
      const next = !current;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={current}
        ref={ref}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
          current ? 'bg-green-600' : 'bg-gray-300',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
            current ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;

