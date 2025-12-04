// Input — basic text field with Tailwind styles + focus ring + dark mode

import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      // Base styling + variant-ready
      className={cn(
        "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
        "dark:bg-dark-surface dark:border-dark-border dark:text-gray-100 dark:placeholder:text-gray-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
