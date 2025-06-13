import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 p-4 max-w-[420px] right-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex w-full items-start gap-2 rounded-md border p-4 shadow-lg",
            "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
            toast.variant === "destructive" &&
              "border-red-500 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-900 dark:text-red-50"
          )}
        >
          <div className="flex-1 space-y-1">
            {toast.title && <div className="font-medium">{toast.title}</div>}
            {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      ))}
    </div>
  );
}