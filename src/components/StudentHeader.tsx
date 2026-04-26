import { motion } from "framer-motion";
import { Award, LogOut, Send, Tag, Wallet, CheckCircle2, Clock, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import type { StudentData } from "../types";
import { avatarUrl, daysUntil, formatDate, isTopPerformer, overallScore, extractScores } from "../lib/scoring";
import { ThemeToggle } from "./ThemeToggle";
import { api } from "../lib/api";

interface Props {
  student: StudentData;
  points: number;
  onSendPoints: () => void;
  onLogout: () => void;
  onCouponApplied: (newAmount: number, percent: number) => void;
}

function statusBadge(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "paid")
    return {
      label: "Paid",
      labelKh: "បានបង់",
      icon: CheckCircle2,
      classes: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    };
  if (s === "pending")
    return {
      label: "Pending",
      labelKh: "កំពុងរង់ចាំ",
      icon: Clock,
      classes: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    };
  return {
    label: "Unpaid",
    labelKh: "មិនទាន់បង់",
    icon: AlertCircle,
    classes: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  };
}

export function StudentHeader({ student, points, onSendPoints, onLogout, onCouponApplied }: Props) {
  const overall = overallScore(extractScores(student));
  const top = isTopPerformer(overall);
  const days = daysUntil(student.NextDueDate);
  const status = statusBadge(student.TuitionStatus);
  const StatusIcon = status.icon;

  const [coupon, setCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);
    try {
      const res = await api.validateCoupon(coupon.trim(), student.StudentID);
      if (res.success && res.newAmount !== undefined && res.discountPercent !== undefined) {
        setCouponMsg({
          ok: true,
          text: `${res.discountPercent}% off applied · New amount $${res.newAmount.toFixed(2)}`,
        });
        onCouponApplied(res.newAmount, res.discountPercent);
        setCoupon("");
      } else {
        setCouponMsg({ ok: false, text: res.message || "Invalid coupon code." });
      }
    } catch {
      setCouponMsg({ ok: false, text: "Could not validate coupon. Try again." });
    } finally {
      setCouponLoading(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-end gap-2 mb-4 sm:absolute sm:top-6 sm:right-6 sm:mb-0">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="h-10 px-4 rounded-full glass text-white font-semibold text-sm flex items-center gap-1.5 hover:scale-105 transition-transform"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", damping: 12 }}
          className="relative"
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 blur-md opacity-70" />
          <img
            src={avatarUrl(student.Name)}
            alt={student.Name}
            className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-white dark:ring-slate-900 object-cover"
          />
          {top && (
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg glow-amber">
              <Award className="h-5 w-5 text-white" />
            </div>
          )}
        </motion.div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white truncate">
            {student.Name}
            {top && (
              <span className="ml-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white align-middle shadow">
                <Sparkles className="h-3 w-3" /> Top
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            ID: <span className="font-semibold">{student.StudentID}</span>
          </p>
          <p className="khmer text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            សូមស្វាគមន៍មកកាន់ផ្ទាំងគ្រប់គ្រងសិស្ស
          </p>
        </div>

        {/* Points + status */}
        <div className="flex flex-col gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-4 shadow-lg glow-indigo text-white">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider opacity-80">Points Balance</div>
              <div className="text-2xl font-bold leading-tight">{points.toLocaleString()}</div>
            </div>
            <button
              onClick={onSendPoints}
              className="ml-3 h-10 px-3.5 rounded-full bg-white/95 text-indigo-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-white transition shadow"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </div>

          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${status.classes}`}
          >
            <StatusIcon className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-bold flex items-center gap-2">
                Tuition: {status.label}
                <span className="khmer font-medium opacity-80 text-xs">
                  {status.labelKh}
                </span>
              </div>
              <div className="text-xs opacity-90 mt-0.5">
                Last paid: {formatDate(student.LastPaymentDate)} · Next due:{" "}
                {formatDate(student.NextDueDate)}
                {student.PaymentAmount !== undefined && (
                  <> · ${Number(student.PaymentAmount).toFixed(2)}</>
                )}
                {days !== null && days >= 0 && (
                  <> · {days} day{days === 1 ? "" : "s"} left</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon row */}
      <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
            <Tag className="h-4 w-4" /> Have a coupon?
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider text-sm font-semibold"
            />
            <button
              onClick={applyCoupon}
              disabled={couponLoading || !coupon.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {couponLoading ? "Checking…" : "Apply"}
            </button>
          </div>
        </div>
        {couponMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-sm font-medium px-3 py-2 rounded-lg ${
              couponMsg.ok
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {couponMsg.text}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
