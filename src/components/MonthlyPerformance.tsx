import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import type { Scores } from "../types";
import { overallScore, getTier } from "../lib/scoring";

interface Props {
  scores: Scores;
}

export function MonthlyPerformance({ scores }: Props) {
  const overall = overallScore(scores);
  const tier = getTier(overall);
  const pct = Math.min(100, (overall / 10) * 100);

  const month = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-3xl p-6 sm:p-7"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Monthly Performance
            </h2>
            <p className="khmer text-xs text-slate-500 dark:text-slate-400">
              លទ្ធផលប្រចាំខែ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <Calendar className="h-4 w-4" /> {month}
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-4xl font-extrabold gradient-text">
            {overall.toFixed(1)}
            <span className="text-xl text-slate-400 font-semibold"> / 10</span>
          </div>
          <div
            className="text-sm font-semibold mt-1"
            style={{ color: tier.hex }}
          >
            {tier.label} · <span className="khmer">{tier.labelKh}</span>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
          Overall avg of 6 criteria
        </div>
      </div>

      <div className="relative h-4 bg-slate-200/80 dark:bg-slate-700/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background:
              tier.color === "emerald"
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : tier.color === "amber"
                  ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                  : "linear-gradient(90deg, #ef4444, #f87171)",
          }}
        >
          <div className="absolute inset-0 shimmer opacity-60" />
        </motion.div>
      </div>
      <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </motion.section>
  );
}
