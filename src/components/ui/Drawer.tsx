// Drawer.tsx — Slide-in panel from the right (with Portal, Overlay, Trigger, Resizing)

import React, { useEffect, createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../shared/icon";
import { cn } from "../../lib/utils";

/* Context to control drawer open/close */
const DrawerContext = createContext<{ open: boolean; setOpen: (o: boolean) => void } | null>(null);

export const useDrawerContext = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawerContext must be used inside <Drawer>");
  return ctx;
};

/* Root wrapper — provides state internally or via props */
export const Drawer = ({
  open,
  onOpenChange,
  children
}: {
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  children?: React.ReactNode;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, setOpen]);

  return (
    <DrawerContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

/* Portal — render drawer outside layout */
const DrawerPortal = ({ children }: { children?: React.ReactNode }) => {
  const { open } = useDrawerContext();
  if (!open) return null;
  const node = document.getElementById("portal-root") || document.body;
  return createPortal(children, node);
};

/* Backdrop overlay */
export const DrawerOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useDrawerContext();
    return (
      <div
        ref={ref}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0",
          className
        )}
        {...props}
      />
    );
  }
);
DrawerOverlay.displayName = "DrawerOverlay";

/* Trigger — turns any element into drawer opener */
export const DrawerTrigger = ({
  children,
  className
}: {
  children: React.ReactElement<any>;
  className?: string;
}) => {
  const { setOpen } = useDrawerContext();
  if (!React.isValidElement(children)) return null;

  const child = children as any;

  return React.cloneElement(child, {
    onClick: (e: any) => {
      child.props?.onClick?.(e);
      setOpen(true);
    },
    className: cn(child.props?.className, className)
  } as any);
};

/* Drawer Content (panel itself) */
export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { resizable?: boolean; showCloseButton?: boolean }
>(({ className, children, resizable, showCloseButton = true, ...props }, ref) => {
  const { setOpen } = useDrawerContext();
  const [width, setWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  /* Start resizing */
  const start = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  /* Stop resizing */
  const stop = useCallback(() => setIsResizing(false), []);

  /* Handle resize drag */
  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 280 && newWidth < window.innerWidth * 0.95) setWidth(newWidth);
    },
    [isResizing]
  );

  /* Attach mouse move listeners */
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stop);
      document.body.style.cursor = "ew-resize";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stop);
      document.body.style.cursor = "";
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stop);
      document.body.style.cursor = "";
    };
  }, [isResizing, resize, stop]);

  return (
    <DrawerPortal>
      <DrawerOverlay />

      <div
        ref={ref}
        style={{ width: width ? `${width}px` : undefined }}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col bg-white dark:bg-zinc-900 shadow-xl",
          "w-full md:w-[600px] max-w-[95vw]",
          "animate-in slide-in-from-right duration-300",
          className
        )}
        {...props}
      >
        {/* Resizable handler */}
        {resizable && (
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/20 z-50"
            onMouseDown={start}
          />
        )}

        {children}

        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        )}
      </div>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

/* Structural helpers */
export const DrawerHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 border-b dark:border-zinc-800", className)} {...p} />
);

export const DrawerFooter = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 border-t flex justify-end gap-2", className)} {...p} />
);

export const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...p }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)} {...p} />
  )
);
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...p }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...p} />
  )
);
DrawerDescription.displayName = "DrawerDescription";
