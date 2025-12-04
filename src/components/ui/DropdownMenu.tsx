// DropdownMenu — fully custom dropdown with portal, positioning, outside-click, ESC close

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

/* -----------------------------
      Context for state sharing
----------------------------- */

interface DropdownMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextProps | null>(null);

const useDropdownMenu = () => {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("useDropdownMenu must be used within DropdownMenu");
  return ctx;
};

/* -----------------------------
      Root wrapper
----------------------------- */

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block w-full">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

/* -----------------------------
      Trigger Element
----------------------------- */

interface DropdownMenuTriggerProps {
  children: React.ReactElement<any>;
  asChild?: boolean;
  className?: string;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild,
  className
}) => {
  const { open, setOpen, triggerRef } = useDropdownMenu();

  // Open/close toggle
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
    const child = children as any;
    child.props?.onClick?.(e);
  };

  // Forward ref into cloned child
  const attachRef = React.useCallback(
    (node: HTMLElement | null) => {
      (triggerRef as any).current = node;

      const childRef = (children as any).ref;
      if (typeof childRef === "function") childRef(node);
      else if (childRef) (childRef as any).current = node;
    },
    [children, triggerRef]
  );

  // If asChild = true → clone provided child
  if (asChild && React.isValidElement(children)) {
    const child = children as any;
    return React.cloneElement(child, {
      ref: attachRef as any,
      onClick: handleClick,
      "aria-expanded": open,
      className: cn(child.props?.className, className)
    } as any);
  }

  // Default wrapper
  return (
    <div
      ref={triggerRef as any}
      onClick={handleClick}
      className={cn("cursor-pointer inline-block", className)}
      aria-expanded={open}
    >
      {children}
    </div>
  );
};

/* -----------------------------
      Content (Positioned + Portal)
----------------------------- */

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  align = "end",
  sideOffset = 4
}) => {
  const { open, setOpen, triggerRef } = useDropdownMenu();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{ top: number; left: number; origin: string } | null>(null);

  /* Outside click, ESC close */
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

    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const handleResize = () => setOpen(false);

    const handleScroll = (e: Event) => {
      const t = e.target as Node;
      if (contentRef.current?.contains(t)) return; // scrolling inside dropdown → keep open
      setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, setOpen, triggerRef]);

  /* Positioning logic */
  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current;

    const contentWidth = content?.offsetWidth ?? 180;
    const contentHeight = content?.offsetHeight ?? 250;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = triggerRect.left;

    // Alignment handling
    if (align === "end") left = triggerRect.right - contentWidth;
    if (align === "center") left = triggerRect.left + triggerRect.width / 2 - contentWidth / 2;

    // Clamp horizontally
    left = Math.max(8, Math.min(left, vw - contentWidth - 8));

    // Vertical flip logic
    const belowSpace = vh - triggerRect.bottom;
    const aboveSpace = triggerRect.top;

    let top = triggerRect.bottom + sideOffset;
    let origin = "top";

    if (belowSpace < contentHeight && aboveSpace > belowSpace) {
      top = triggerRect.top - contentHeight - sideOffset;
      origin = "bottom";
    }

    setPosition({
      top: top + window.scrollY,
      left: left + window.scrollX,
      origin
    });
  }, [open, align, sideOffset]);

  if (!open) return null;

  const portalRoot = document.getElementById("portal-root") || document.body;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        top: position?.top,
        left: position?.left,
        transformOrigin: position?.origin,
        position: "absolute",
        zIndex: 9999
      }}
      className={cn(
        "rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl",
        "animate-dropdown max-w-[90vw] min-w-[8rem] overflow-hidden",
        className
      )}
    >
      <div className="py-1 max-h-[300px] overflow-y-auto p-1">{children}</div>
    </div>,
    portalRoot
  );
};

/* -----------------------------
      Item
----------------------------- */

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export const DropdownMenuItem = ({
  children,
  className,
  onClick,
  inset,
  ...props
}: DropdownMenuItemProps) => {
  const { setOpen } = useDropdownMenu();

  return (
    <button
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOpen(false); // auto close if item not prevented
      }}
      className={cn(
        "flex w-full items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer select-none",
        "text-gray-900 dark:text-gray-100",
        "hover:bg-gray-100 dark:hover:bg-zinc-800 transition",
        inset && "pl-8",
        className
      )}
    >
      {children}
    </button>
  );
};
