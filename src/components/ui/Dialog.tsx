// Dialog.tsx — Custom modal system (Portal, Overlay, Trigger, Content)

import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../shared/icon';
import { cn } from '../../lib/utils';

/* Context to control dialog open/close */
const DialogContext = React.createContext<{ open: boolean; setOpen: (o: boolean) => void } | null>(null);

const useDialogContext = () => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("useDialogContext must be used inside <Dialog>");
  return ctx;
};

/* Root wrapper — provides open state */
const Dialog = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (o: boolean) => void; children?: React.ReactNode }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  return (
    <DialogContext.Provider value={{ open: open ?? internalOpen, setOpen: onOpenChange ?? setInternalOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

/* Trigger — turns any element into a dialog opener */
const DialogTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { setOpen } = useDialogContext();
  if (!React.isValidElement(children)) return null;

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      setOpen(true);
    },
    className: cn(children.props.className, className)
  });
};

/* Portal — ensures modal renders outside layout */
const DialogPortal = ({ children }: { children?: React.ReactNode }) => {
  const { open } = useDialogContext();
  const [node, setNode] = React.useState<Element | null>(null);

  React.useEffect(() => setNode(document.getElementById('portal-root')), []);
  if (!node || !open) return null;
  return createPortal(children, node);
};

/* Overlay — backdrop behind modal */
const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useDialogContext();
    return (
      <div
        ref={ref}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity",
          className
        )}
        {...props}
      />
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

/* Content — actual modal box */
const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    return (
      <DialogPortal>
        <DialogOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "pointer-events-auto relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xl",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              "max-h-[85vh] overflow-hidden",
              className
            )}
            {...props}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>

            {children}
          </div>
        </div>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";

/* Structural helpers */
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 border-b border-gray-200 dark:border-zinc-800", className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 border-t flex justify-end gap-2", className)} {...props} />
);

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)} {...props} />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
  )
);
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
};
