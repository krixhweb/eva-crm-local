/* Button.tsx — Reusable button component with variants (default, outline, ghost, etc)
   Purpose: Provides consistent button styling + optional motion animation across the app.
*/

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

/* --- Button style variants for color + size --- */
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-green-500 text-white hover:bg-green-600 shadow-sm',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200',
        link: 'text-green-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

/* --- Props: supports variant, size, and motion toggle --- */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asMotion?: boolean; // enables framer-motion animation
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
}

/* --- Button Component --- */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asMotion = true, ...props }, ref) => {

    // motion.button for animated press effect
    if (asMotion) {
      // Cast props/ref to any to avoid framer-motion type incompatibilities
      // between MotionProps and standard HTML button props in some TS setups.
      return (
        <motion.button
          ref={ref as any}
          className={cn(buttonVariants({ variant, size, className }))}
          whileTap={{ scale: 0.97 }} // press animation
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          {...(props as any)}
        />
      );
    }

    // normal button (no animation)
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
