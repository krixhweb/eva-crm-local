// Glassy Toast — macOS/iOS-style blur notifications with timer + animations

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

/* -----------------------------------
      Types
----------------------------------- */

export type ToastVariant = "default" | "success" | "error" | "info";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface Toast extends ToastOptions {
  id: string;
}

/* -----------------------------------
      Context
----------------------------------- */

interface ToastCtx {
  push: (t: ToastOptions) => void; // add toast
  remove: (id: string) => void;    // remove toast
}

const ToastContext = createContext<ToastCtx | undefined>(undefined);

/* -----------------------------------
      Icons
----------------------------------- */

const Icons = {
  success: (
    <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none">
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none">
      <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
      <path d="M13 16h-1v-4h-1m1-4h.01" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5 text-gray-500 dark:text-gray-300" viewBox="0 0 24 24" fill="none">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14v-3a6 6 0 00-4-6V5a2 2 0 10-4 0v.3A6 6 0 006 11v3c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1"
        stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  close: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
};

/* -----------------------------------
      Progress Bar (auto-dismiss)
----------------------------------- */

const ProgressBar: React.FC<{
  duration: number;
  isPaused: boolean;
  onComplete: () => void;
  variant: ToastVariant;
}> = ({ duration, isPaused, onComplete, variant }) => {
  const [start, setStart] = useState(false);

  // Slight delay so animation triggers properly
  useEffect(() => {
    const t = setTimeout(() => setStart(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Color theme for variant
  const getGradient = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-r from-emerald-400 to-emerald-600";
      case "error":
        return "bg-gradient-to-r from-red-400 to-red-600";
      case "info":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100/20 dark:bg-gray-800/20 overflow-hidden">
      <div
        className={cn("h-full", getGradient())}
        style={{
          width: "100%",
          animationName: "glassy-shrink",
          animationDuration: `${duration}ms`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
          animationPlayState: isPaused || !start ? "paused" : "running"
        }}
        onAnimationEnd={onComplete}
      />

      {/* Keyframes for shrink animation */}
      <style>{`
        @keyframes glassy-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

/* -----------------------------------
      Single Toast UI
----------------------------------- */

const GlassyToast: React.FC<{ data: Toast; onRemove: (id: string) => void }> = ({
  data,
  onRemove
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const duration = data.duration || 4000;

  // Remove toast with exit animation
  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(data.id), 300);
  }, [data.id, onRemove]);

  // Small delay to play entry animation
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      className={cn(
        "relative w-80 pointer-events-auto",
        "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl",
        "border border-white/40 dark:border-white/10",
        "shadow-[0_8px_32px_rgba(31,38,135,0.15)]",
        "rounded-2xl overflow-hidden transition-all duration-300"
      )}
      style={{
        opacity: mounted && !isExiting ? 1 : 0,
        transform: mounted && !isExiting ? "translate(0,0)" : "translate(10px,-10px)"
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      <div className="flex items-start p-4 gap-3">
        <div className="flex-shrink-0 mt-0.5">{Icons[data.variant || "default"]}</div>

        <div className="flex-1">
          {data.title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{data.title}</h3>
          )}
          {data.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{data.description}</p>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          {Icons.close}
        </button>
      </div>

      <ProgressBar
        duration={duration}
        isPaused={isPaused}
        onComplete={handleDismiss}
        variant={data.variant || "default"}
      />
    </div>
  );
};

/* -----------------------------------
      Toast Container (portal)
----------------------------------- */

const GlassyToastContainer: React.FC<{
  toasts: Toast[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <GlassyToast key={t.id} data={t} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
};

/* -----------------------------------
      Provider
----------------------------------- */

export const GlassyToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((opts: ToastOptions) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [{ ...opts, id }, ...prev]); // newest at top
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

/* -----------------------------------
      Hook
----------------------------------- */

export const useGlassyToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useGlassyToasts must be used within GlassyToastProvider");
  return ctx;
};
