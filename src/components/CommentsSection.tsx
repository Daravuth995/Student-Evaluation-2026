import { motion } from "framer-motion";
import { MessageSquare, Quote, Loader2 } from "lucide-react";
import type { CommentItem } from "../types";

interface Props {
  comments: CommentItem[] | null;
  loading: boolean;
}

function typeStyle(type?: string) {
  if (type === "positive")
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
      label: "Positive",
    };
  if (type === "improvement")
    return {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
      label: "Improvement",
    };
  return {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    pill: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    label: "Note",
  };
}

export function CommentsSection({ comments, loading }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-3xl p-6 sm:p-7"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
          <MessageSquare className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Teacher Comments
          </h2>
          <p className="khmer text-xs text-slate-500 dark:text-slate-400">
            មតិយោបល់ពីគ្រូ
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading comments…
        </div>
      ) : !comments || comments.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          <Quote className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>No comments yet — your teacher will add some soon.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {comments.map((c, i) => {
            const s = typeStyle(c.type);
            const text = c.comment || c.text || "";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`relative rounded-xl border p-4 ${s.bg} ${s.border}`}
              >
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                    {c.teacherName || "Teacher"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${s.pill}`}>
                      {s.label}
                    </span>
                    {c.date && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {c.date}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {text}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
