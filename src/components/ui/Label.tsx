// Label — standard text label for inputs (supports htmlFor)

import * as React from "react";
import { cn } from "../../lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    // Base text style + disabled state + dark mode
    className={cn(
      "text-sm font-medium leading-none text-gray-700 dark:text-gray-300",
      "peer-disabled:opacity-70 peer-disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
