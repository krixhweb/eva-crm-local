
import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../shared/Icon';
import { cn } from '../../lib/utils';

const DialogContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

const useDialogContext = () => {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error('useDialogContext must be used within a Dialog');
    }
    return context;
};

const Dialog = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    
    const contextValue = {
        open: open ?? internalOpen,
        setOpen: onOpenChange ?? setInternalOpen
    };

    return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

const DialogTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const { setOpen } = useDialogContext();
    if (!React.isValidElement(children)) return null;

    return React.cloneElement(children as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
            const child = children as React.ReactElement<any>;
            child.props.onClick?.(e);
            setOpen(true);
        },
        className: cn((children as React.ReactElement<any>).props.className, className)
    });
};

const DialogPortal = ({ children }: { children?: React.ReactNode }) => {
    const { open } = useDialogContext();
    const [portalNode, setPortalNode] = React.useState<Element | null>(null);

    React.useEffect(() => {
        const node = document.getElementById('portal-root');
        if (node) setPortalNode(node);
    }, []);

    if (!portalNode || !open) return null;
    
    return createPortal(children, portalNode);
};

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    const { setOpen } = useDialogContext();
    return (
        <div
            ref={ref}
            onClick={() => setOpen(false)}
            className={cn(
                'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out fade-in-0 fade-out-0 transition-all duration-200',
                className
            )}
            data-state="open"
            {...props}
        />
    );
});
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const { setOpen } = useDialogContext();
    return (
        <DialogPortal>
            <DialogOverlay />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <div
                    ref={ref}
                    className={cn(
                        'pointer-events-auto relative w-full flex flex-col bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xl',
                        'max-h-[85vh] duration-200 ease-out',
                        'data-[state=open]:animate-in data-[state=closed]:animate-out zoom-in-95 zoom-out-95 fade-in-0 fade-out-0',
                        className
                    )}
                    data-state="open"
                    onClick={(e) => e.stopPropagation()}
                    {...props}
                >
                    {children}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <Icon name="close" className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
            </div>
        </DialogPortal>
    );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5 p-6 border-b border-gray-100 dark:border-zinc-800 flex-shrink-0', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 border-t border-gray-100 dark:border-zinc-800 flex-shrink-0 bg-gray-50/50 dark:bg-zinc-900/50 rounded-b-lg', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100', className)} {...props} />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props} />
));
DialogDescription.displayName = 'DialogDescription';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
