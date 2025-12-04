
import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useEffect, 
  ReactNode 
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

// --- Types ---

export type ToastVariant = 'default' | 'success' | 'error' | 'info';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface Toast extends ToastOptions {
  id: string;
}

interface GlassyToastContextType {
  push: (options: ToastOptions) => void;
  remove: (id: string) => void;
}

// --- Context ---

const ToastContext = createContext<GlassyToastContextType | undefined>(undefined);

// --- Icons ---

const Icons = {
  success: (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  close: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// --- Components ---

const ProgressBar: React.FC<{ 
  duration: number; 
  isPaused: boolean; 
  onComplete: () => void;
  variant: ToastVariant;
}> = ({ 
  duration, 
  isPaused, 
  onComplete,
  variant 
}) => {
  const [start, setStart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStart(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getGradient = () => {
    switch (variant) {
      case 'success': return 'bg-gradient-to-r from-emerald-400 to-emerald-600';
      case 'error': return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'info': return 'bg-gradient-to-r from-blue-400 to-blue-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100/20 dark:bg-gray-800/20 rounded-b-lg overflow-hidden">
      <div
        className={cn("h-full", getGradient())}
        style={{
          width: '100%',
          animationName: 'glassy-shrink',
          animationDuration: `${duration}ms`,
          animationTimingFunction: 'linear',
          animationFillMode: 'for',
          animationPlayState: isPaused || !start ? 'paused' : 'running',
        }}
        onAnimationEnd={onComplete}
      />
      <style>{`
        @keyframes glassy-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const GlassyToast: React.FC<{ 
  data: Toast; 
  onRemove: (id: string) => void;
}> = ({ 
  data, 
  onRemove 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const duration = data.duration || 4000;

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(data.id);
    }, 300);
  }, [data.id, onRemove]);

  useEffect(() => {
    // Trigger enter animation next frame
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  return (
    <div
      className={cn(
        "relative w-80 pointer-events-auto",
        "bg-white/80 dark:bg-neutral-900/80",
        "backdrop-blur-xl",
        "border border-white/40 dark:border-white/10",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
        "rounded-2xl overflow-hidden",
        "transition-all duration-300 ease-out"
      )}
      style={{
        opacity: isMounted && !isExiting ? 1 : 0,
        transform: isMounted && !isExiting 
          ? 'translate(0, 0)' 
          : 'translate(10px, -10px)'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      <div className="flex items-start p-4 gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {Icons[data.variant || 'default']}
        </div>

        <div className="flex-1 w-0">
          {data.title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-5">
              {data.title}
            </h3>
          )}
          {data.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-5">
              {data.description}
            </p>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
          aria-label="Close notification"
        >
          {Icons.close}
        </button>
      </div>

      <ProgressBar 
        duration={duration} 
        isPaused={isPaused} 
        onComplete={handleDismiss} 
        variant={data.variant || 'default'}
      />
    </div>
  );
};

const GlassyToastContainer: React.FC<{ toasts: Toast[], onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      aria-live="polite"
      className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => (
        <GlassyToast key={toast.id} data={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
};

// --- Provider ---

export const GlassyToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...options, id };
    // Add to beginning of array to stack newest on top visually
    setToasts((prev) => [newToast, ...prev]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <GlassyToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
};

// --- Hook ---

export const useGlassyToasts = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useGlassyToasts must be used within a GlassyToastProvider');
  }
  return context;
};
