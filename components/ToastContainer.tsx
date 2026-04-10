type ToastType = 'success' | 'info' | 'error';

type ToastMessage = {
  id: string;
  title: string;
  description: string;
  type: ToastType;
};

type ToastContainerProps = {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
};

const typeStyles: Record<ToastType, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  info: 'border-slate-400/20 bg-slate-400/10 text-slate-100',
  error: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-slide pointer-events-auto overflow-hidden rounded-3xl border px-4 py-4 shadow-xl backdrop-blur-lg ${typeStyles[toast.type]} border-white/10 transition-all duration-300`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              <p className="mt-1 text-sm text-muted">{toast.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted transition hover:bg-white/10"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
