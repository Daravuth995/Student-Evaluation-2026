import { motion } from "framer-motion";
import { LineChart as LineChartIcon, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import type { PerformanceHistoryItem } from "../types";

interface Props {
  history: PerformanceHistoryItem[] | null;
  loading: boolean;
}

const SERIES = [
  { key: "overallScore", name: "Overall", color: "#6366f1" },
  { key: "pronunciation", name: "Pronunciation", color: "#10b981" },
  { key: "intonation", name: "Intonation", color: "#f59e0b" },
  { key: "communication", name: "Communication", color: "#ec4899" },
  { key: "participation", name: "Participation", color: "#8b5cf6" },
  { key: "risingFalling", name: "Rising & Falling", color: "#14b8a6" },
  { key: "linkingSounds", name: "Linking", color: "#ef4444" },
] as const;

export function PerformanceChart({ history, loading }: Props) {
  const [active, setActive] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SERIES.map((s) => [s.key, true])),
  );

  const data = (history || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card rounded-3xl p-6 sm:p-7"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
          <LineChartIcon className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Performance History
          </h2>
          <p className="khmer text-xs text-slate-500 dark:text-slate-400">
            ប្រវត្តិលទ្ធផលរយៈពេលវែង
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        {SERIES.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive((a) => ({ ...a, [s.key]: !a[s.key] }))}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
              active[s.key]
                ? "border-transparent text-white shadow"
                : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-transparent"
            }`}
            style={active[s.key] ? { background: s.color } : undefined}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: active[s.key] ? "#fff" : s.color }}
            />
            {s.name}
          </button>
        ))}
      </div>

      <div className="h-72 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading history…
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            No history available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis dataKey="label" stroke="rgba(100,116,139,0.7)" fontSize={11} />
              <YAxis domain={[0, 10]} stroke="rgba(100,116,139,0.7)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.92)",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#a5b4fc", fontWeight: 700 }}
              />
              <Legend wrapperStyle={{ display: "none" }} />
              {SERIES.map(
                (s) =>
                  active[s.key] && (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.name}
                      stroke={s.color}
                      strokeWidth={s.key === "overallScore" ? 3 : 2}
                      dot={{ r: 3, strokeWidth: 0, fill: s.color }}
                      activeDot={{ r: 5 }}
                      animationDuration={900}
                    />
                  ),
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.section>
  );
}
