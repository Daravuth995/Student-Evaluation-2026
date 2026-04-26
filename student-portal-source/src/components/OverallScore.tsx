import { motion } from "framer-motion";
import { Target } from "lucide-react";
import type { Scores } from "../types";
import { overallScore, getTier } from "../lib/scoring";

interface Props {
  scores: Scores;
}

export function OverallScore({ scores }: Props) {
  const overall = overallScore(scores);
  const tier = getTier(overall);
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(overall, 10) / 10) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
    >
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          <defs>
            <linearGradient id="overallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="14"
            fill="none"
            className="text-slate-200/70 dark:text-slate-700/60"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke="url(#overallGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dash} ${circumference}` }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-extrabold gradient-text leading-none">
            {overall.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold uppercase tracking-wider">
            of 10
          </div>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Overall Score</h2>
        </div>
        <p className="khmer text-sm text-slate-500 dark:text-slate-400 mb-3">
          ពិន្ទុសរុប
        </p>
        <div
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white shadow"
          style={{ background: tier.hex }}
        >
          {tier.label} · <span className="khmer font-semibold">{tier.labelKh}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 max-w-md">
          Your overall score is the average of your six core criteria. Aim for{" "}
          <span className="font-bold text-emerald-600 dark:text-emerald-400">8.5+</span> to
          earn Top Performer status.
        </p>
      </div>
    </motion.section>
  );
}
