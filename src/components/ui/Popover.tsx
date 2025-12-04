
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

interface PopoverContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const PopoverContext = React.createContext<PopoverContextProps | null>(null);

export const usePopover = () => {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("usePopover must be used within Popover");
  return ctx;
};

export const Popover: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (isControlled) onOpenChange?.(v);
      else setUncontrolledOpen(v);
    },
    [isControlled, onOpenChange]
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}> = ({ children, asChild, className }) => {
  const { open, setOpen, triggerRef } = usePopover();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  // Set up ref callback to capture the trigger element
  const refCallback = React.useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      // Preserve original ref if it exists on the child
      if (React.isValidElement(children)) {
        // @ts-ignore
        const childRef = (children as any).ref;
        if (typeof childRef === "function") childRef(node);
        else if (childRef && typeof childRef === "object") childRef.current = node;
      }
    },
    [children, triggerRef]
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: refCallback,
      onClick: handleClick,
      "aria-expanded": open,
      className: cn((children as React.ReactElement<any>).props.className, className),
    });
  }

  return (
    <div
      ref={refCallback as any}
      onClick={handleClick}
      className={cn("inline-block cursor-pointer", className)}
      aria-expanded={open}
    >
      {children}
    </div>
  );
};

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  onOpenAutoFocus?: (event: Event) => void;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({ 
  children, 
  className, 
  align = "start", 
  sideOffset = 8,
  onOpenAutoFocus
}) => {
  const { open, setOpen, triggerRef } = usePopover();
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  const [coords, setCoords] = React.useState<{top: number, left: number} | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // 1. Close on Click Outside
  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, setOpen, triggerRef]);

  // 2. Calculate Position
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default: Open below
    let top = triggerRect.bottom + sideOffset;
    let left = triggerRect.left;

    // Vertical Flip Logic
    const spaceBelow = viewportHeight - top;
    const spaceAbove = triggerRect.top - sideOffset;
    
    if (contentRect.height > spaceBelow && spaceAbove > spaceBelow) {
      top = triggerRect.top - contentRect.height - sideOffset;
    }

    // Horizontal Alignment Logic
    if (align === "end") {
      left = triggerRect.right - contentRect.width;
    } else if (align === "center") {
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    }

    // Horizontal Boundary Check
    const padding = 10;
    if (left + contentRect.width > viewportWidth - padding) {
      left = viewportWidth - contentRect.width - padding;
    }
    if (left < padding) {
      left = padding;
    }

    setCoords({
      top: top + window.scrollY,
      left: left + window.scrollX,
    });
  }, [align, sideOffset, triggerRef]);

  // 3. Layout Effect to trigger positioning
  React.useLayoutEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    
    // Initial calculation
    updatePosition();

    // Trigger animation state in next frame to prevent layout jump
    requestAnimationFrame(() => {
      setMounted(true);
    });

    // Recalculate on resize/scroll
    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { capture: true });
    
    const resizeObserver = new ResizeObserver(() => updatePosition());
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      resizeObserver.disconnect();
    };
  }, [open, updatePosition]);

  if (!open) return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{ 
        position: 'absolute', 
        top: coords?.top ?? 0, 
        left: coords?.left ?? 0, 
        zIndex: 9999,
        opacity: mounted ? 1 : 0,
        pointerEvents: mounted ? 'auto' : 'none',
      }}
      data-state={open ? "open" : "closed"}
      className={cn(
        "rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl outline-none",
        mounted && "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
    >
      {children}
    </div>,
    document.body 
  );
};
