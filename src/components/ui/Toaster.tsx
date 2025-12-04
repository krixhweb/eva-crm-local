import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from './Toast';
import { useToast } from '../../hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast(); // holds all active toasts

  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    >
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          
          {/* text block */}
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>

          {/* optional action button */}
          {action}

          {/* close X button */}
          <ToastClose onClick={() => props.onOpenChange?.(false)} />

        </Toast>
      ))}
    </div>
  );
}
