// Select — custom dropdown built on top of DropdownMenu with support for controlled & uncontrolled state.

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { Icon } from "../shared/icon";
import { cn } from "../../lib/utils";

/* -------- Context (stores current value + setter + option list) -------- */
interface SelectContextProps {
  value: string;
  onValueChange: (v: string) => void;
  options: Map<string, React.ReactNode>;
  disabled?: boolean;
}
const SelectContext = React.createContext<SelectContextProps | null>(null);
const useSelect = () => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("useSelect must be used within Select");
  return ctx;
};

/* -------- Main Select container -------- */
interface SelectProps {
  value?: string;                 // controlled
  defaultValue?: string;          // uncontrolled
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

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

  const handleValueChange = (v: string) => {
    if (!isControlled) setInternalValue(v);
    onValueChange(v);
  };

  // Build a map of {value -> label} from SelectItem components
  const options = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    const topChildren = React.Children.toArray(children);
    topChildren.forEach((c) => {
      if (!React.isValidElement(c) || c.type !== SelectContent) return;
      const inner = React.Children.toArray(c.props.children);
      inner.forEach((item) => {
        if (!React.isValidElement(item) || item.type !== SelectItem) return;
        const props = item.props as { value?: string; children?: React.ReactNode };
        if (props.value) map.set(props.value, props.children);
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

/* -------- Trigger (button that opens dropdown) -------- */
export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  const { disabled } = useSelect();
  const isDisabled = disabled || props.disabled;

  return (
    <DropdownMenuTrigger asChild>
      <button
        ref={ref}
        disabled={isDisabled}
        {...props}
        className={cn(
          "flex items-center justify-between border rounded-md bg-white dark:bg-black/20 dark:border-dark-border",
          "text-sm px-3 h-9 w-full text-left text-gray-900 dark:text-gray-100",
          "focus:ring-2 focus:ring-green-500",
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className="truncate w-full">{children}</span>
        <Icon name="chevronDown" className="h-4 w-4 ml-2 text-gray-500" />
      </button>
    </DropdownMenuTrigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";

/* -------- Value renderer (shows selected label or placeholder) -------- */
export const SelectValue = ({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const { value, options } = useSelect();
  const selected = options.get(value);

  if (children) return <>{children}</>;
  if (selected) return <>{selected}</>;
  if (placeholder)
    return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;

  return <>{value}</>;
};
SelectValue.displayName = "SelectValue";

/* -------- Dropdown menu wrapper -------- */
export const SelectContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <DropdownMenuContent>{children}</DropdownMenuContent>;
SelectContent.displayName = "SelectContent";

/* -------- Item inside dropdown -------- */
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
