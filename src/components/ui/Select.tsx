
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { Icon } from "../shared/Icon";
import { cn } from "../../lib/utils";

interface SelectContextProps {
  value: string;
  onValueChange: (v: string) => void;
  options: Map<string, React.ReactNode>;
  disabled?: boolean;
}

const SelectContext = React.createContext<SelectContextProps | null>(null);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within a Select component");
  }
  return context;
};

interface SelectProps {
  value?: string;
  onValueChange?: (v: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

// Main Select component
export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange = (_v) => {},
  defaultValue,
  children,
  disabled,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange(newValue);
  };

  const options = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === SelectContent) {
        const contentChild = child as React.ReactElement<any>;
        React.Children.forEach(contentChild.props.children, (item) => {
          if (React.isValidElement(item) && (item.type === SelectItem)) {
            const itemElement = item as React.ReactElement<any>;
            if (itemElement.props.value !== undefined) {
              map.set(itemElement.props.value, itemElement.props.children);
            }
          }
        });
      }
    });
    return map;
  }, [children]);

  const contextValue = {
    value: currentValue,
    onValueChange: handleValueChange,
    options,
    disabled,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <DropdownMenu>
        {children}
      </DropdownMenu>
    </SelectContext.Provider>
  );
};


// SelectTrigger component
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
          "flex items-center justify-between border rounded-md bg-white dark:bg-black/20 dark:border-dark-border text-sm px-3 h-9 w-full text-left text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500",
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className="truncate w-full text-left">{children}</span>
        <Icon name="chevronDown" className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
      </button>
    </DropdownMenuTrigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";


// SelectValue component
export const SelectValue = ({ placeholder, children }: { placeholder?: string; children?: React.ReactNode }) => {
  const { value, options } = useSelect();
  const selectedContent = options.get(value);
  
  if (children) {
    return <>{children}</>;
  }

  if (selectedContent) {
    return <>{selectedContent}</>;
  }
  
  if (placeholder) {
    return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
  }
  
  return <>{value}</>;
};
SelectValue.displayName = "SelectValue";


// SelectContent component
export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DropdownMenuContent>{children}</DropdownMenuContent>;
};
SelectContent.displayName = 'SelectContent';


// SelectItem component
export const SelectItem: React.FC<{
  value: string;
  children: React.ReactNode;
}> = ({
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
SelectItem.displayName = 'SelectItem';
