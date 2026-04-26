import { motion } from "framer-motion";
import { ThumbsUp, AlertTriangle, Lightbulb } from "lucide-react";
import type { StudentData } from "../types";

interface Props {
  student: StudentData;
}

const cards = [
  {
    key: "Strength",
    title: "Strengths",
    titleKh: "ចំណុចខ្លាំង",
    icon: ThumbsUp,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-800 dark:text-emerald-200",
  },
  {
    key: "Weakness",
    title: "Weaknesses",
    titleKh: "ចំណុចខ្សោយ",
    icon: AlertTriangle,
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800",
    text: "text-rose-800 dark:text-rose-200",
  },
  {
    key: "Improvement",
    title: "How to Improve",
    titleKh: "របៀបកែលម្អ",
    icon: Lightbulb,
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    text: "text-indigo-800 dark:text-indigo-200",
  },
] as const;

export function FeedbackCards({ student }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {cards.map((c, i) => {
        const Icon = c.icon;
        const value = (student[c.key as keyof StudentData] as string) || "—";
        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
            className={`relative rounded-2xl border p-5 ${c.bg} ${c.border} overflow-hidden`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`h-9 w-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shadow`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${c.text}`}>{c.title}</h3>
                <p className="khmer text-[11px] text-slate-500 dark:text-slate-400">
                  {c.titleKh}
                </p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${c.text}`}>{value}</p>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
