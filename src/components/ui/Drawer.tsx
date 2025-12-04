
import React, { useEffect, createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../shared/Icon';
import { cn } from '../../lib/utils';

interface DrawerContextProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextProps | null>(null);

export const useDrawerContext = () => {
    const context = useContext(DrawerContext);
    if (!context) throw new Error('useDrawerContext must be used within a Drawer');
    return context;
};

export const Drawer = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    
    const isOpen = open ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, setOpen]);

    return <DrawerContext.Provider value={{ open: isOpen, setOpen }}>{children}</DrawerContext.Provider>;
};

const DrawerPortal = ({ children }: { children?: React.ReactNode }) => {
    const { open } = useDrawerContext();
    if (!open) return null;

    const portalNode = document.getElementById('portal-root') || document.body;
    return createPortal(children, portalNode);
};

export const DrawerOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(({ className, ...props }, ref) => {
    const { setOpen } = useDrawerContext();
    return (
        <div 
            ref={ref}
            onClick={() => setOpen(false)} 
            className={cn(
                'fixed inset-0 z-50 bg-black/60 backdrop-blur-none transition-opacity animate-in fade-in-0',
                className
            )} 
            {...props} 
        />
    );
});
DrawerOverlay.displayName = "DrawerOverlay";

export const DrawerTrigger: React.FC<{ children: React.ReactElement; className?: string; asChild?: boolean }> = ({ children, className, asChild }) => {
    const { setOpen } = useDrawerContext();
    
    if (React.isValidElement(children)) {
        const child = children as React.ReactElement<any>;
        return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
                child.props.onClick?.(e);
                setOpen(true);
            },
            className: cn(child.props.className, className)
        });
    }
    
    return null;
};

export const DrawerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { resizable?: boolean, showCloseButton?: boolean }>(({ className, children, resizable, showCloseButton = true, ...props }, ref) => {
    const { setOpen } = useDrawerContext();
    const [width, setWidth] = useState<number | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    
    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing) {
                const newWidth = window.innerWidth - mouseMoveEvent.clientX;
                // Min width 300px, Max width 95vw
                if (newWidth > 300 && newWidth < window.innerWidth * 0.95) {
                    setWidth(newWidth);
                }
            }
        },
        [isResizing]
    );

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResizing);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, resize, stopResizing]);

    return (
        <DrawerPortal>
            <DrawerOverlay />
            <div
                ref={ref}
                style={{ width: width ? `${width}px` : undefined }}
                className={cn(
                  "fixed inset-y-0 right-0 z-50 h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col",
                  "w-full md:w-[600px]", // Default width
                  !isResizing && "transition-transform ease-in-out duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out slide-in-from-right",
                  className
                )}
                {...props}
            >
                {resizable && (
                    <div
                        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/20 transition-colors z-50 touch-none"
                        onMouseDown={startResizing}
                        title="Drag to resize"
                    >
                        <div className="absolute top-1/2 left-0 -translate-x-1/2 w-1 h-12 bg-gray-300 dark:bg-gray-600 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                )}
                {children}
                {showCloseButton && (
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <Icon name="close" className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                )}
            </div>
        </DrawerPortal>
    );
});
DrawerContent.displayName = "DrawerContent";

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 border-b dark:border-zinc-800 shrink-0", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 border-t dark:border-zinc-800 shrink-0", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

export const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
DrawerTitle.displayName = "DrawerTitle"

export const DrawerDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
))
DrawerDescription.displayName = "DrawerDescription"
