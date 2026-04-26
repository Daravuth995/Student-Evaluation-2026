import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { PointsTransfer } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  studentId: string;
  password: string;
  currentPoints: number;
  onPointsChanged: (newBalance: number) => void;
}

export function SendPointsModal({
  open,
  onClose,
  studentId,
  password,
  currentPoints,
  onPointsChanged,
}: Props) {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [transfers, setTransfers] = useState<PointsTransfer[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  async function loadHistory() {
    setLoadingTx(true);
    try {
      const res = await api.recentTransfers(studentId);
      setTransfers(res?.success && res.history ? res.history : []);
    } catch {
      setTransfers([]);
    } finally {
      setLoadingTx(false);
    }
  }

  async function refetchPoints() {
    try {
      const p = await api.pointsLogin(studentId, password);
      if (p && p.success && typeof p.points === "number") {
        onPointsChanged(p.points);
      }
    } catch {
      /* keep current */
    }
  }

  useEffect(() => {
    if (!open) return;
    setMsg(null);
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, studentId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const amt = parseInt(amount, 10);
    if (!receiverId.trim() || receiverId.trim() === studentId) {
      setMsg({ ok: false, text: "Enter a valid receiver Student ID." });
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      setMsg({ ok: false, text: "Amount must be a positive number." });
      return;
    }
    if (amt > currentPoints) {
      setMsg({ ok: false, text: "You don't have enough points." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.sendPoints({
        id: studentId,
        password,
        receiverId: receiverId.trim(),
        amount: amt,
      });
      if (res.success) {
        setMsg({ ok: true, text: res.msg || `Successfully sent ${amt} points to ${receiverId.trim()}.` });
        setReceiverId("");
        setAmount("");
        await Promise.all([refetchPoints(), loadHistory()]);
      } else {
        setMsg({ ok: false, text: res.msg || "Transfer failed." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

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
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                <Send className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Send Points</h3>
                <p className="khmer text-sm text-white/85">ផ្ទេរពិន្ទុ</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 border border-indigo-200 dark:border-indigo-800 p-4 mb-5 text-center">
                <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Balance
                </div>
                <div className="text-3xl font-extrabold gradient-text">
                  {currentPoints.toLocaleString()}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Receiver Student ID
                  </label>
                  <input
                    type="text"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    placeholder="e.g., stu002"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Amount
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={currentPoints}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {msg && (
                  <div
                    className={`text-sm font-medium px-3 py-2 rounded-lg ${
                      msg.ok
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold flex items-center justify-center gap-2 shadow hover:shadow-lg hover:shadow-indigo-500/40 transition disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Points
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                  Recent Transfers
                </h4>
                {loadingTx ? (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    Loading…
                  </div>
                ) : transfers.length === 0 ? (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
                    No recent transfers.
                  </div>
                ) : (
                  <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {transfers.map((t, i) => {
                      const sent = t.direction === "sent";
                      return (
                        <li
                          key={i}
                          className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2"
                        >
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              sent
                                ? "bg-rose-500/15 text-rose-600 dark:text-rose-300"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                            }`}
                          >
                            {sent ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 text-sm">
                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                              {sent ? `To ${t.to}` : `From ${t.from}`}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {t.date ? new Date(t.date).toLocaleString() : ""}
                            </div>
                          </div>
                          <div
                            className={`font-bold text-sm ${
                              sent
                                ? "text-rose-600 dark:text-rose-300"
                                : "text-emerald-600 dark:text-emerald-300"
                            }`}
                          >
                            {sent ? "−" : "+"}
                            {t.amount}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
