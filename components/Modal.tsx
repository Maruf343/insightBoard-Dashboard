import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({ title, open, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-panel bg-base text-base shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel px-6 py-5">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-panel bg-surface px-3 py-2 text-sm font-medium text-muted transition hover:bg-panel hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="space-y-6 px-6 py-6">{children}</div>
        {footer ? <div className="border-t border-panel px-6 py-4">{footer}</div> : null}
      </motion.div>
    </div>
  );
}
