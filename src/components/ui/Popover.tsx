// Popover — small floating panel used for selects, datepickers, dropdowns.

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

/* -------- Context (stores open state + trigger element) -------- */
interface PopoverContextProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const PopoverContext = React.createContext<PopoverContextProps | null>(null);

export const usePopover = () => {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("usePopover must be used within Popover");
  return ctx;
};

/* -------- Root wrapper (controlled or uncontrolled mode) -------- */
export const Popover: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (v: boolean) => (isControlled ? onOpenChange?.(v) : setInternalOpen(v)),
    [isControlled, onOpenChange]
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

/* -------- Trigger (button or any element that toggles popover) -------- */
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

  // Inject ref into the child
  const attachRef = React.useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      if (React.isValidElement(children)) {
        // @ts-ignore
        const childRef = children.ref;
        if (typeof childRef === "function") childRef(node);
        else if (childRef && typeof childRef === "object") childRef.current = node;
      }
    },
    [children]
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: attachRef,
      onClick: handleClick,
      "aria-expanded": open,
      className: cn(children.props.className, className)
    });
  }

  return (
    <div
      ref={attachRef}
      onClick={handleClick}
      aria-expanded={open}
      className={cn("inline-block cursor-pointer", className)}
    >
      {children}
    </div>
  );
};

/* -------- Content (positioned floating panel) -------- */
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
}) => {
  const { open, setOpen, triggerRef } = usePopover();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  /* -------- Close on outside click -------- */
  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(t) &&
        triggerRef.current &&
        !triggerRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, setOpen]);

  /* -------- Position calculation -------- */
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default: below trigger
    let top = trigger.bottom + sideOffset;
    let left = trigger.left;

    const spaceBelow = vh - trigger.bottom;
    const spaceAbove = trigger.top;

    // Flip vertically
    if (content.height > spaceBelow && spaceAbove > spaceBelow) {
      top = trigger.top - content.height - sideOffset;
    }

    // Horizontal alignment
    if (align === "end") left = trigger.right - content.width;
    if (align === "center") left = trigger.left + trigger.width / 2 - content.width / 2;

    // Clamp within viewport
    const padding = 10;
    left = Math.max(padding, Math.min(left, vw - content.width - padding));

    setCoords({ top: top + window.scrollY, left: left + window.scrollX });
  }, [align, sideOffset, triggerRef]);

  /* -------- Run positioning when opened -------- */
  React.useLayoutEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    updatePosition();
    requestAnimationFrame(() => setMounted(true));

    const resize = () => updatePosition();
    const scroll = () => updatePosition();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", scroll, { capture: true });

    const observer = new ResizeObserver(updatePosition);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scroll, { capture: true });
      observer.disconnect();
    };
  }, [open, updatePosition]);

  if (!open) return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "absolute",
        top: coords?.top ?? 0,
        left: coords?.left ?? 0,
        zIndex: 9999,
        opacity: mounted ? 1 : 0,
        pointerEvents: mounted ? "auto" : "none",
      }}
      data-state={mounted ? "open" : "closed"}
      className={cn(
        "rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl outline-none",
        mounted && "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
        className
      )}
    >
      {children}
    </div>,
    document.body
  );
};
