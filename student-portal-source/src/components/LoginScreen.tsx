import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Lock, User, HelpCircle, ArrowRight, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import type { StudentData } from "../types";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  onSuccess: (student: StudentData, points: number) => void;
}

export function LoginScreen({ onSuccess }: Props) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getHint() {
    if (!studentId.trim()) {
      setError("Please enter your Student ID first to get a hint.");
      return;
    }
    setError(null);
    setHintLoading(true);
    try {
      const res = await api.passwordHint(studentId.trim());
      setHint(res.hint || res.error || "No hint available.");
    } catch {
      setHint("Could not fetch hint. Check your connection.");
    } finally {
      setHintLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const id = studentId.trim();
    const pw = password.trim();
    if (!id || !pw) {
      setError("Please enter both Student ID and Password.");
      return;
    }
    setLoading(true);
    try {
      // Fetch by ID only — backend returns the full record (including the real Password).
      const data = await api.studentData(id);
      if (!data || data.error) {
        setError(data?.error || "Student not found. Check your ID and try again.");
        setLoading(false);
        return;
      }

      // Verify the entered password against the backend value (same as the original).
      const realPassword = (data.Password ?? "").toString();
      if (pw !== realPassword) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      let points = 0;
      try {
        const p = await api.pointsLogin(data.StudentID, realPassword);
        if (p && p.success && typeof p.points === "number") points = p.points;
      } catch {
        /* points service is optional — never block login */
      }

      onSuccess({ ...data, Password: realPassword }, points);
    } catch {
      setError("Login failed. Please verify your credentials and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora blobs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-500/40 blur-3xl aurora-blob" />
      <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-indigo-400/40 blur-3xl aurora-blob"
        style={{ animationDelay: "-7s" }} />
      <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl aurora-blob"
        style={{ animationDelay: "-14s" }} />

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
            className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl glow-indigo relative"
          >
            <GraduationCap className="h-10 w-10 text-white" />
          </motion.div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">Student Portal</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Sign in to view your evaluation
            </p>
            <p className="khmer text-xs text-slate-500 dark:text-slate-400 mt-1">
              ចូលគណនីដើម្បីមើលលទ្ធផលរបស់អ្នក
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Student ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g., stu001"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={getHint}
                  disabled={hintLoading}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition"
                >
                  {hintLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <HelpCircle className="h-3.5 w-3.5" />
                  )}
                  Hint
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {hint && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200"
              >
                <span className="font-semibold">Hint:</span> {hint}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-200"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Powered by Indigo Education · Need help? Ask your teacher.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
