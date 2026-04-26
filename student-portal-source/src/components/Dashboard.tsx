import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, BookOpen } from "lucide-react";
import type { StudentData, CommentItem, PerformanceHistoryItem } from "../types";
import { extractScores } from "../lib/scoring";
import { api } from "../lib/api";
import { StudentHeader } from "./StudentHeader";
import { PaymentBanner } from "./PaymentBanner";
import { MonthlyPerformance } from "./MonthlyPerformance";
import { CriteriaGrid } from "./CriteriaGrid";
import { OverallScore } from "./OverallScore";
import { FeedbackCards } from "./FeedbackCards";
import { CommentsSection } from "./CommentsSection";
import { PerformanceChart } from "./PerformanceChart";
import { ScoreGuideModal } from "./ScoreGuideModal";
import { SendPointsModal } from "./SendPointsModal";
import { RestrictionModal } from "./RestrictionModal";

interface Props {
  student: StudentData;
  password: string;
  initialPoints: number;
  onLogout: () => void;
}

export function Dashboard({ student: initial, password, initialPoints, onLogout }: Props) {
  const [student, setStudent] = useState(initial);
  const [points, setPoints] = useState(initialPoints);
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [history, setHistory] = useState<PerformanceHistoryItem[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [scoreGuideOpen, setScoreGuideOpen] = useState(true);
  const [sendOpen, setSendOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const restrictionMsg = student.Restriction || student.restriction || "";
  const [restrictionOpen, setRestrictionOpen] = useState(Boolean(restrictionMsg));

  const scores = extractScores(student);

  useEffect(() => {
    api
      .comments(student.StudentID)
      .then((c) => setComments(Array.isArray(c) ? c : []))
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));

    api
      .history(student.StudentID)
      .then((h) => setHistory(Array.isArray(h) ? h : []))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));

    // Always refetch points on mount so the balance is fresh from the backend.
    api
      .pointsLogin(student.StudentID, password)
      .then((p) => {
        if (p && p.success && typeof p.points === "number") {
          setPoints(p.points);
        }
      })
      .catch(() => {
        /* keep last known balance */
      });
  }, [student.StudentID, password]);

  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCoupon = useCallback((newAmount: number, _percent: number) => {
    setStudent((s) => ({ ...s, PaymentAmount: newAmount }));
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Aurora background */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl aurora-blob pointer-events-none" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-indigo-400/30 blur-3xl aurora-blob pointer-events-none"
        style={{ animationDelay: "-7s" }} />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl aurora-blob pointer-events-none"
        style={{ animationDelay: "-14s" }} />

      {/* Sticky header strip with help button on the right */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-indigo-900/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-400 to-fuchsia-400 flex items-center justify-center shadow">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="font-bold tracking-tight">Student Portal</div>
          </div>
          <button
            onClick={() => setScoreGuideOpen(true)}
            className="h-9 px-4 rounded-full glass text-white text-sm font-semibold hover:scale-105 transition-transform flex items-center gap-1.5"
          >
            <BookOpen className="h-4 w-4" /> Score Guide
          </button>
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <PaymentBanner student={student} />
        <StudentHeader
          student={student}
          points={points}
          onSendPoints={() => setSendOpen(true)}
          onLogout={onLogout}
          onCouponApplied={handleCoupon}
        />
        <MonthlyPerformance scores={scores} />
        <CriteriaGrid scores={scores} />
        <OverallScore scores={scores} />
        <FeedbackCards student={student} />
        <CommentsSection comments={comments} loading={commentsLoading} />
        <PerformanceChart history={history} loading={historyLoading} />
        <footer className="text-center text-xs text-white/70 py-6 text-shadow-lg">
          © {new Date().getFullYear()} Indigo Education · Student Evaluation Portal
        </footer>
      </main>

      <AnimatePresence>
        {showFab && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 30 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl glow-indigo flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <ScoreGuideModal open={scoreGuideOpen} onClose={() => setScoreGuideOpen(false)} />
      <SendPointsModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        studentId={student.StudentID}
        password={password}
        currentPoints={points}
        onPointsChanged={setPoints}
      />
      <RestrictionModal
        open={restrictionOpen}
        message={restrictionMsg}
        onClose={() => setRestrictionOpen(false)}
      />
    </div>
  );
}
