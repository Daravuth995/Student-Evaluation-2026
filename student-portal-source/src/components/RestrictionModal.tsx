import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function RestrictionModal({ open, message, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Access Restricted</h3>
                <p className="khmer text-sm text-white/85">ការចូលប្រើត្រូវបានរឹតបន្តឹង</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {message}
              </p>
              <button
                onClick={onClose}
                className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-rose-500/40 transition"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
