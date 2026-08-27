"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenCheck,
  BrainCircuit,
  FileText,
  ListChecks,
  PanelsTopLeft,
  Sparkles,
  UploadCloud,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Logo from "@/components/logo";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import UploadPanel from "@/components/upload-panel";
import {
  ExamModeView,
  FlashcardsView,
  OverviewView,
  ProgressView,
  QuestionsView,
  QuizView,
  StudyPlanView,
  SummaryView,
  TopicsView
} from "@/components/study-views";
import { StudyPack } from "@/lib/types";

const mobileNav = [
  ["overview", "Overview"],
  ["summary", "Summary"],
  ["topics", "Important topics"],
  ["flashcards", "Flashcards"],
  ["quiz", "MCQ quiz"],
  ["questions", "Short questions"],
  ["plan", "Study plan"],
  ["exam", "Exam mode"],
  ["progress", "Progress"]
];

export default function LearnFlowApp() {
  const [active, setActive] = useState("overview");
  const [pack, setPack] = useState<StudyPack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [flashcardsLearned, setFlashcardsLearned] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [examDone, setExamDone] = useState(0);

  useEffect(() => {
    const cached = localStorage.getItem("learnflow-last-pack");
    if (!cached) return;
    try {
      setPack(JSON.parse(cached));
    } catch {
      localStorage.removeItem("learnflow-last-pack");
    }
  }, []);

  const navigate = useCallback((id: string) => {
    setActive(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function generate(payload: { file: File | null; text: string }) {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (payload.file) formData.append("file", payload.file);
      if (payload.text.trim()) formData.append("text", payload.text.trim());

      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not create the study pack.");

      setPack(data.pack);
      setFlashcardsLearned(0);
      setQuizScore(0);
      setExamDone(0);
      setActive("overview");
      localStorage.setItem("learnflow-last-pack", JSON.stringify(data.pack));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the study pack.");
    } finally {
      setLoading(false);
    }
  }

  function startFresh() {
    setPack(null);
    setActive("overview");
    setFlashcardsLearned(0);
    setQuizScore(0);
    setExamDone(0);
    localStorage.removeItem("learnflow-last-pack");
  }

  function renderView() {
    if (!pack) return null;
    switch (active) {
      case "summary":
        return <SummaryView pack={pack} />;
      case "topics":
        return <TopicsView pack={pack} />;
      case "flashcards":
        return <FlashcardsView pack={pack} onProgress={setFlashcardsLearned} />;
      case "quiz":
        return <QuizView pack={pack} onScore={setQuizScore} />;
      case "questions":
        return <QuestionsView pack={pack} />;
      case "plan":
        return <StudyPlanView pack={pack} />;
      case "exam":
        return <ExamModeView pack={pack} onComplete={setExamDone} />;
      case "progress":
        return <ProgressView pack={pack} flashcardsLearned={flashcardsLearned} quizScore={quizScore} examDone={examDone} />;
      default:
        return <OverviewView pack={pack} onNavigate={navigate} />;
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} onSelect={navigate} />

      <div className="min-w-0 flex-1">
        <Topbar onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto w-full max-w-[1220px] px-4 pb-12 pt-5 md:px-7 lg:pt-2">
          {!pack ? (
            <Landing loading={loading} error={error} onGenerate={generate} />
          ) : (
            <>
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--panel),0.8)] px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Current material</div>
                  <div className="mt-1 truncate text-sm font-extrabold">{pack.sourceName}</div>
                </div>
                <button onClick={startFresh} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--panel-2))] px-3 py-2 text-xs font-extrabold transition hover:-translate-y-0.5">
                  <UploadCloud size={15} /> Use different notes
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-black/45" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute inset-y-0 left-0 w-[280px] border-r border-[rgb(var(--border))] bg-[rgb(var(--panel))] p-4"
            >
              <div className="mb-6 flex items-center justify-between px-1">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[rgb(var(--panel-2))]" aria-label="Close navigation"><X size={17} /></button>
              </div>
              <nav className="space-y-1">
                {mobileNav.map(([id, label]) => (
                  <button key={id} onClick={() => navigate(id)} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold ${active === id ? "bg-[rgba(var(--brand),0.12)] text-[rgb(var(--brand))]" : "text-[rgb(var(--muted))]"}`}>{label}</button>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Landing({ loading, error, onGenerate }: { loading: boolean; error: string; onGenerate: (payload: { file: File | null; text: string }) => void }) {
  const benefits = [
    { icon: FileText, title: "Understand faster", text: "Turn long notes into a short, useful summary." },
    { icon: PanelsTopLeft, title: "Practice recall", text: "Use flashcards and questions instead of passive rereading." },
    { icon: ListChecks, title: "Test yourself", text: "Check understanding with an instant MCQ quiz." },
    { icon: BookOpenCheck, title: "Prepare for exams", text: "Follow a focused revision checklist when time is tight." }
  ];

  return (
    <div className="pb-6">
      <section className="subtle-grid relative mb-6 overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[rgba(var(--panel),0.78)] px-5 py-9 shadow-soft backdrop-blur md:px-9 md:py-12">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[rgba(var(--brand),0.13)] blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(var(--brand),0.22)] bg-[rgba(var(--brand),0.07)] px-3 py-1.5 text-xs font-extrabold text-[rgb(var(--brand))]">
            <Sparkles size={14} />
            One workspace for serious study
          </div>
          <h1 className="m-0 max-w-2xl text-4xl font-black leading-[1.06] tracking-[-0.04em] md:text-6xl">
            Turn your lecture notes into a study system.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[rgb(var(--muted))] md:text-lg">
            LearnFlow AI organizes your material into summaries, important topics, flashcards, quizzes, short questions, and a practical exam plan.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <UploadPanel loading={loading} onGenerate={onGenerate} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={benefit.title} whileHover={{ y: -3 }} className="card flex items-start gap-4 p-4 md:p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[rgba(var(--brand),0.1)] text-[rgb(var(--brand))]"><Icon size={20} /></div>
                <div>
                  <h3 className="m-0 text-sm font-extrabold">{benefit.title}</h3>
                  <p className="mb-0 mt-1 text-sm leading-6 text-[rgb(var(--muted))]">{benefit.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">{error}</div>
      )}
    </div>
  );
}
