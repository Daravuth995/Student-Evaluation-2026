import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROWS = [
  {
    range: "8.0 – 10",
    label: "Excellent",
    labelKh: "ល្អឥតខ្ចោះ",
    color: "#10b981",
    desc: "Outstanding performance — keep up the excellent work!",
  },
  {
    range: "6.0 – 7.9",
    label: "Good",
    labelKh: "ល្អ",
    color: "#f59e0b",
    desc: "Solid progress — push a little harder to reach excellence.",
  },
  {
    range: "0 – 5.9",
    label: "Needs Work",
    labelKh: "ត្រូវខិតខំ",
    color: "#ef4444",
    desc: "Focus and practice — your teacher will help you improve.",
  },
];

export function ScoreGuideModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 20000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Score Guide</h3>
                <p className="khmer text-sm text-white/85">មគ្គុទេសក៏ពិន្ទុ</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {ROWS.map((r) => (
                <div
                  key={r.label}
                  className="flex gap-4 items-start rounded-2xl border border-slate-200 dark:border-slate-700 p-4"
                  style={{ borderLeftWidth: 5, borderLeftColor: r.color }}
                >
                  <div className="text-center min-w-[64px]">
                    <div className="text-sm font-bold" style={{ color: r.color }}>
                      {r.range}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                      Score
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {r.label}{" "}
                      <span className="khmer font-semibold text-slate-500 dark:text-slate-400 text-sm">
                        · {r.labelKh}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                      {r.desc}
                    </p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 pt-2">
                This dialog auto-closes in 20 seconds.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
