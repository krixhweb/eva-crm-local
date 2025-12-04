/* Badge.tsx — Small label UI used to show status tags (success, warning, info, etc).
   Purpose: Provides consistent text-only badges across the app using Tailwind + cva variants.
*/

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/* --- Badge style variants (color presets) --- */
const badgeVariants = cva(
  'text-xs font-semibold', // base badge style
  {
    variants: {
      variant: {
        default: 'text-gray-700 dark:text-gray-300',
        secondary: 'text-gray-600 dark:text-gray-400',
        destructive: 'text-red-700 dark:text-red-300',
        outline: 'text-foreground',
        green: 'text-green-700 dark:text-green-300',
        blue: 'text-blue-700 dark:text-blue-300',
        yellow: 'text-yellow-700 dark:text-yellow-300',
        purple: 'text-purple-700 dark:text-purple-300',
        red: 'text-red-700 dark:text-red-300',
        gray: 'text-gray-700 dark:text-gray-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

/* --- Props: Accepts a variant + normal <span> props --- */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: VariantProps<typeof badgeVariants>['variant'];
}

/* --- Badge Component --- */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)} // merge variant + custom classes
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
