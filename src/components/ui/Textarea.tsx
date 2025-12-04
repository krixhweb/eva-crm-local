import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;      // UX: grow based on content
  showCount?: boolean;       // UX: show character counter
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = true, showCount = false, maxLength, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
    const mergedRef = (node: HTMLTextAreaElement) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    };

    // --- Auto Resize UX ---
    const resize = React.useCallback(() => {
      if (!autoResize || !internalRef.current) return;
      const el = internalRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight + 2}px`;
    }, [autoResize]);

    React.useEffect(() => {
      resize();
    }, [resize, props.value]);

    return (
      <div className="relative w-full">
        <textarea
          ref={mergedRef}
          onInput={(e) => {
            props.onInput?.(e);
            resize(); // auto grow
          }}
          aria-invalid={props["aria-invalid"]} // better form compatibility
          inputMode="text"
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:focus:ring-green-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-[height] duration-150 ease-in-out',  // smooth resize
            className
          )}
          {...props}
        />

        {/* Optional Character Counter UX */}
        {showCount && maxLength !== undefined && (
          <span className="absolute bottom-1 right-2 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
            {(props.value as string)?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
