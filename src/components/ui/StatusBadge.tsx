// StatusBadge — small colored label for order/shipping/payment statuses.

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../shared/icon';

// Variant generator for text colors
const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 text-sm font-medium",
  {
    variants: {
      variant: {
        green: "text-green-600 dark:text-green-400",
        blue: "text-blue-600 dark:text-blue-400",
        yellow: "text-yellow-600 dark:text-yellow-400",
        red: "text-red-600 dark:text-red-400",
        gray: "text-gray-500 dark:text-gray-400",
        purple: "text-purple-600 dark:text-purple-400",
      },
    },
    defaultVariants: { variant: "gray" },
  }
);

type StatusVariant = VariantProps<typeof statusBadgeVariants>["variant"];

// Status → variant + icon map (single source of truth)
const statusMap: Record<
  string,
  { variant: StatusVariant; icon?: string }
> = {
  // Sales order
  Pending: { variant: "yellow", icon: "clock" },
  Shipped: { variant: "blue", icon: "package" },
  Completed: { variant: "green", icon: "checkCircle" },
  Cancelled: { variant: "red", icon: "xCircle" },
  Draft: { variant: "gray", icon: "edit" },

  // Purchase order
  Approved: { variant: "blue", icon: "check" },
  Received: { variant: "green", icon: "checkCircle" },

  // Returns
  Requested: { variant: "yellow", icon: "refreshCw" },
  Refunded: { variant: "green", icon: "checkCircle" },
  Rejected: { variant: "red", icon: "xCircle" },

  // Shipping
  "In Transit": { variant: "blue", icon: "package" },
  Delivered: { variant: "green", icon: "checkCircle" },
  Packed: { variant: "purple", icon: "package" },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
}

// Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ className, status, ...props }) => {
  const { variant, icon } =
    statusMap[status] || { variant: "gray" as StatusVariant, icon: undefined }; // fallback

  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {icon && <Icon name={icon} className="h-3.5 w-3.5" />} {/* status icon */}
      <span>{status}</span> {/* status label */}
    </div>
  );
};

export { StatusBadge };
