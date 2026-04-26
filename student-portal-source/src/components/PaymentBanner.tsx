import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import type { StudentData } from "../types";
import { daysUntil, formatDate } from "../lib/scoring";

interface Props {
  student: StudentData;
}

export function PaymentBanner({ student }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const status = (student.TuitionStatus || "").toLowerCase();
  const days = daysUntil(student.NextDueDate);

  const showOverdue = status === "unpaid";
  const showSoon = !showOverdue && days !== null && days >= 0 && days <= 7;

  if (dismissed || (!showOverdue && !showSoon)) return null;

  const overdue = showOverdue;
  const config = overdue
    ? {
        from: "from-rose-600",
        via: "via-pink-600",
        to: "to-rose-700",
        title: "Tuition Overdue",
        titleKh: "ថ្លៃសិក្សាហួសកាលកំណត់",
        message: `Please contact your administrator to resolve your overdue payment${
          student.PaymentAmount ? ` of $${Number(student.PaymentAmount).toFixed(2)}` : ""
        }.`,
      }
    : {
        from: "from-amber-500",
        via: "via-orange-500",
        to: "to-amber-600",
        title: "Payment Due Soon",
        titleKh: "ថ្ងៃផុតកំណត់ខិតមកដល់",
        message: `Your next tuition payment is due ${formatDate(student.NextDueDate)} (${days} day${days === 1 ? "" : "s"} away)${
          student.PaymentAmount ? ` — $${Number(student.PaymentAmount).toFixed(2)}` : ""
        }.`,
      };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative rounded-2xl bg-gradient-to-r ${config.from} ${config.via} ${config.to} text-white p-4 sm:p-5 shadow-xl overflow-hidden`}
      >
        <div className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold">
              {config.title}{" "}
              <span className="khmer font-semibold opacity-90 text-sm">
                · {config.titleKh}
              </span>
            </div>
            <p className="text-sm text-white/95 mt-0.5">{config.message}</p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
