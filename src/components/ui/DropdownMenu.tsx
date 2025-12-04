
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

/* -----------------------------
      Context
----------------------------- */

interface DropdownMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextProps | null>(
  null
);

const useDropdownMenu = () => {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("useDropdownMenu must be used within DropdownMenu");
  return ctx;
};

/* -----------------------------
      Root Component
----------------------------- */

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block text-left w-full">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

/* -----------------------------
      Trigger
----------------------------- */

interface DropdownMenuTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
  className?: string;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild,
  className,
}) => {
  const { open, setOpen, triggerRef } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setOpen(!open);
    
    if (React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      if (child.props.onClick) {
        child.props.onClick(e);
      }
    }
  };

  // Merge refs safely
  const refCallback = React.useCallback(
    (node: HTMLElement | null) => {
      if (triggerRef) {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }

      if (React.isValidElement(children)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const childRef = (children as any).ref;
        if (typeof childRef === "function") {
          childRef(node);
        } else if (childRef) {
          childRef.current = node;
        }
      }
    },
    [children, triggerRef]
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ref: refCallback,
      onClick: handleClick,
      "aria-expanded": open,
      className: cn(child.props.className, className),
    });
  }

  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      onClick={handleClick}
      className={cn("inline-block cursor-pointer", className)}
      aria-expanded={open}
    >
      {children}
    </div>
  );
};

/* -----------------------------
      Content (Portal)
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
  sideOffset = 4,
}) => {
  const { open, setOpen, triggerRef } = useDropdownMenu();
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    origin: string;
  } | null>(null);

  /* ---------- CLOSE EVENTS ---------- */
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

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const handleResize = () => setOpen(false);

    const handleScroll = (e: Event) => {
      const target = e.target as Node;
      // Keep open if scrolling inside the dropdown content
      if (contentRef.current && contentRef.current.contains(target)) {
        return;
      }
      // Close if scrolling outside
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

  /* ---------- POSITIONING LOGIC ---------- */
  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentEl = contentRef.current;
    
    const contentWidth = contentEl?.offsetWidth ?? 200;
    const contentHeight = contentEl?.offsetHeight ?? 300;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal Positioning
    let left = triggerRect.left;
    if (align === "end") {
      left = triggerRect.right - contentWidth;
    } else if (align === "center") {
      left = triggerRect.left + (triggerRect.width / 2) - (contentWidth / 2);
    }

    // Horizontal Boundaries
    const padding = 8;
    if (left + contentWidth > viewportWidth - padding) {
      left = viewportWidth - contentWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    // Vertical Positioning (Flip Logic)
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    
    let top = triggerRect.bottom + sideOffset;
    let origin = "top";

    // Flip if space below is insufficient AND space above is larger
    if (spaceBelow < contentHeight && spaceAbove > spaceBelow) {
      top = triggerRect.top - contentHeight - sideOffset;
      origin = "bottom";
    }

    // Adjust for scroll offset to get absolute position on page
    setPosition({
      top: top + window.scrollY,
      left: left + window.scrollX,
      origin,
    });

  }, [open, align, sideOffset]);

  if (!open) return null;

  const portalRoot = document.getElementById("portal-root") || document.body;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        transformOrigin: position?.origin === 'bottom' ? 'bottom' : 'top',
        position: "absolute",
        zIndex: 9999,
      }}
      className={cn(
        "rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl",
        "animate-dropdown min-w-[8rem]",
        "max-w-[90vw] overflow-hidden",
        className
      )}
    >
       <div className="py-1 max-h-[300px] overflow-y-auto p-1">
          {children}
       </div>
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

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  className,
  onClick,
  inset,
  ...props
}) => {
  const { setOpen } = useDropdownMenu();

  return (
    <button
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-gray-100 dark:hover:bg-zinc-800 focus:bg-gray-100 dark:focus:bg-zinc-800",
        "text-gray-900 dark:text-gray-100",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
    >
      {children}
    </button>
  );
};
