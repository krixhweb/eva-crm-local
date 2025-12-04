// Progress — simple percentage-based progress bar (0–100)

import * as React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // percentage value (0–100)
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    >
      {/* Inner bar moves from left to right using translateX */}
      <div
        className="h-full bg-green-500 transition-all"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </div>
  )
);

Progress.displayName = "Progress";
export { Progress };
