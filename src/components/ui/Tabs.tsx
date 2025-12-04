import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

// Context to share selected tab + handler across components
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  groupId: string;
}>({
  value: '',
  onValueChange: () => {},
  groupId: '',
});

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, value, onValueChange, children, className }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const groupId = React.useId(); // used for shared framer-motion id

  const handleValueChange = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onValueChange?.(newValue); // notify parent
  };

  return (
    <TabsContext.Provider value={{ value: currentValue || '', onValueChange: handleValueChange, groupId }}>
      <div className={cn('transition-shadow hover:shadow-md shadow-sm', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // tabs container surface
        'inline-flex items-center h-11 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl px-2 py-1 gap-2 border border-white/40 overflow-hidden select-none',
        'transition-shadow shadow-sm hover:shadow-md',
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value: triggerValue, children, ...props }, ref) => {
  const { value, onValueChange, groupId } = React.useContext(TabsContext);
  const isActive = value === triggerValue; // active tab check

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onValueChange(triggerValue)} // select tab
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all font-medium text-sm px-4 py-1.5',
        isActive
          ? 'text-green-600 dark:text-green-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200',
        'disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId={`${groupId}-activeTab`} // shared motion id for sliding background
          className="absolute inset-0 bg-white rounded-full border border-green-500/60 shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
          transition={{ type: 'spring', bounce: 0.35, duration: 0.48 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1">{children}</span>
    </button>
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ value: tabValue, className, children, ...props }, ref) => {
  const { value: contextValue } = React.useContext(TabsContext);
  if (contextValue !== tabValue) return null; // only show active tab panel

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 6 }} // fade+slide on mount
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.27, ease: 'easeOut' }}
      className={cn('mt-4', className)}
      {...(props as unknown as HTMLMotionProps<'div'>)}
    >
      {children}
    </motion.div>
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
