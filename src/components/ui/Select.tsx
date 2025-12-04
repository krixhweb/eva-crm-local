// Select — custom dropdown using our DropdownMenu as the base system.

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { Icon } from "../shared/icon";
import { cn } from "../../lib/utils";

// Context for passing value + handlers to child components
interface SelectContextProps {
  value: string;
  onValueChange: (v: string) => void;
  options: Map<string, React.ReactNode>;
  disabled?: boolean;
}
const SelectContext = React.createContext<SelectContextProps | null>(null);

const useSelect = () => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("useSelect must be used within a Select");
  return ctx;
};

interface SelectProps {
  value?: string;            // controlled value
  onValueChange?: (v: string) => void;
  defaultValue?: string;     // uncontrolled initial value
  children: React.ReactNode;
  disabled?: boolean;
}

// Main Select wrapper
export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange = () => {},
  defaultValue,
  children,
  disabled,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Sync controlled/uncontrolled value updates
  const handleValueChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange(next);
  };

  // Collect all <SelectItem> labels into a map for display
  const options = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    const topChildren = React.Children.toArray(children);
    topChildren.forEach((child) => {
      if (!React.isValidElement(child) || child.type !== SelectContent) return;
      const inner = React.Children.toArray(child.props.children);
      inner.forEach((item) => {
        if (!React.isValidElement(item) || item.type !== SelectItem) return;
        const props = item.props as { value?: string; children?: React.ReactNode };
        if (props.value !== undefined) map.set(props.value, props.children);
      });
    });
    return map;
  }, [children]);

  return (
    <SelectContext.Provider
      value={{ value: currentValue, onValueChange: handleValueChange, options, disabled }}
    >
      <DropdownMenu>{children}</DropdownMenu>
    </SelectContext.Provider>
  );
};

// Trigger — button that opens the dropdown
export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { disabled } = useSelect();

  return (
    <DropdownMenuTrigger asChild>
      <button
        ref={ref}
        disabled={disabled || props.disabled}
        {...props}
        className={cn(
          "flex items-center justify-between border rounded-md bg-white dark:bg-black/20 dark:border-dark-border",
          "text-sm px-3 h-9 w-full text-left text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500",
          (disabled || props.disabled) && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className="truncate w-full">{children}</span>
        <Icon name="chevronDown" className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
      </button>
    </DropdownMenuTrigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";

// SelectValue — shows the active option label
export const SelectValue = ({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const { value, options } = useSelect();

  if (children) return <>{children}</>;
  if (options.get(value)) return <>{options.get(value)}</>;
  if (placeholder) return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
  return <>{value}</>;
};
SelectValue.displayName = "SelectValue";

// Content — dropdown body container
export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DropdownMenuContent>{children}</DropdownMenuContent>;
};
SelectContent.displayName = "SelectContent";

// SelectItem — individual option
export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => {
  const { onValueChange } = useSelect();

  return (
    <DropdownMenuItem onClick={() => onValueChange(value)}>
      {children}
    </DropdownMenuItem>
  );
};
SelectItem.displayName = "SelectItem";
