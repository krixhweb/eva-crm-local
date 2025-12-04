
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from '../shared/Icon';
import { cn } from '../../lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4',
  {
    variants: {
      variant: {
        default: 'border bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700',
        destructive:
          'destructive group border-red-500 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Fix: Explicitly define variant prop as VariantProps was not being resolved correctly.
interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: VariantProps<typeof toastVariants>['variant'];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, open, onOpenChange, ...props }, ref) => {
    if (!open) return null;
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Toast.displayName = 'Toast';

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-500/40 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-white dark:hover:bg-gray-700',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { onClick } = props;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'absolute right-2 top-2 rounded-md p-1 text-gray-900/50 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 dark:text-gray-50/50 dark:hover:text-gray-50',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <Icon name="close" className="h-4 w-4" />
      </button>
    )
});
ToastClose.displayName = 'ToastClose';

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
};
