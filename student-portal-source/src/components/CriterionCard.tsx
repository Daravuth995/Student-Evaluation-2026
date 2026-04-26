import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { getTier } from "../lib/scoring";

interface Props {
  icon: LucideIcon;
  label: string;
  labelKh: string;
  score: number;
  delay?: number;
}

export function CriterionCard({ icon: Icon, label, labelKh, score, delay = 0 }: Props) {
  const tier = getTier(score);
  const pct = Math.min(100, (score / 10) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl bg-white/95 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all overflow-hidden"
    >
      <div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: `radial-gradient(circle, ${tier.hex}, transparent 70%)` }}
      />
      <div className="flex items-start justify-between mb-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-md"
          style={{
            background: `linear-gradient(135deg, ${tier.hex}, ${tier.hex}dd)`,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
            {score.toFixed(1)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
            / 10
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{label}</h3>
      <p className="khmer text-xs text-slate-500 dark:text-slate-400 mb-3">{labelKh}</p>

      <div className="relative h-2 bg-slate-200/80 dark:bg-slate-700/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: delay + 0.2 }}
          className="h-full rounded-full"
          style={{ background: tier.hex }}
        />
      </div>
      <div
        className="text-[11px] font-bold mt-2 uppercase tracking-wider"
        style={{ color: tier.hex }}
      >
        {tier.label}
      </div>
    </motion.div>
  );
}
