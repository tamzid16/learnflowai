"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  ListChecks,
  MessageSquareText,
  PanelsTopLeft,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy
} from "lucide-react";
import SectionTitle from "@/components/section-title";
import StatCard from "@/components/stat-card";
import { StudyPack } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OverviewView({ pack, onNavigate }: { pack: StudyPack; onNavigate: (id: string) => void }) {
  const cards = [
    { id: "summary", label: "Summary", detail: `${pack.summary.length} key points`, icon: FileText },
    { id: "topics", label: "Important topics", detail: `${pack.topics.length} concepts`, icon: BrainCircuit },
    { id: "flashcards", label: "Flashcards", detail: `${pack.flashcards.length} cards`, icon: PanelsTopLeft },
    { id: "quiz", label: "MCQ quiz", detail: `${pack.quiz.length} questions`, icon: ListChecks },
    { id: "questions", label: "Short questions", detail: `${pack.shortQuestions.length} prompts`, icon: MessageSquareText },
    { id: "plan", label: "Study plan", detail: `${pack.studyPlan.length} sessions`, icon: CalendarDays }
  ];

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,rgb(var(--brand)),rgb(var(--brand-2)))] p-6 text-white shadow-soft md:p-8">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 text-xs font-bold backdrop-blur">
            <Sparkles size={14} />
            Study pack ready
          </div>
          <h1 className="m-0 text-3xl font-black tracking-tight md:text-4xl">{pack.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/78 md:text-base">
            Your notes are now organized into a focused revision workflow. Start with the summary, then test recall before moving into exam mode.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Source" value={pack.stats.words.toLocaleString()} note="words processed" />
        <StatCard icon={Timer} label="Reading" value={`${pack.stats.readingMinutes} min`} note="estimated source reading time" />
        <StatCard icon={BrainCircuit} label="Coverage" value={`${pack.stats.topicCount}`} note="important topics detected" />
      </div>

      <div className="card p-5 md:p-6">
        <SectionTitle icon={BookOpenCheck} title="Your study tools" description="Use the same material in different ways instead of rereading it repeatedly." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-4 text-left transition hover:-translate-y-0.5 hover:border-[rgba(var(--brand),0.4)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgb(var(--panel))] text-[rgb(var(--brand))]">
                    <Icon size={18} />
                  </div>
                  <ChevronRight size={17} className="text-[rgb(var(--muted))] transition group-hover:translate-x-1" />
                </div>
                <div className="font-extrabold">{item.label}</div>
                <div className="mt-1 text-xs text-[rgb(var(--muted))]">{item.detail}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SummaryView({ pack }: { pack: StudyPack }) {
  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={FileText} title="AI summary" description="A compact version of the material, keeping the ideas that are most useful for revision." />
      <div className="space-y-3">
        {pack.summary.map((point, index) => (
          <div key={index} className="flex gap-3 rounded-2xl bg-[rgb(var(--panel-2))] p-4">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgba(var(--brand),0.12)] text-xs font-black text-[rgb(var(--brand))]">{index + 1}</div>
            <p className="m-0 text-sm leading-6">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopicsView({ pack }: { pack: StudyPack }) {
  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={BrainCircuit} title="Important topics" description="Higher bars indicate concepts that appear more strongly across the uploaded material." />
      <div className="space-y-4">
        {pack.topics.map((topic) => (
          <div key={topic.title} className="rounded-2xl border border-[rgb(var(--border))] p-4">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h3 className="m-0 text-sm font-extrabold">{topic.title}</h3>
              <span className="text-xs font-bold text-[rgb(var(--brand))]">{topic.weight}%</span>
            </div>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-[rgb(var(--panel-2))]">
              <div className="h-full rounded-full bg-[rgb(var(--brand))]" style={{ width: `${topic.weight}%` }} />
            </div>
            <p className="m-0 text-sm leading-6 text-[rgb(var(--muted))]">{topic.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlashcardsView({ pack, onProgress }: { pack: StudyPack; onProgress: (value: number) => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const card = pack.flashcards[index];

  useEffect(() => {
    onProgress(Object.values(known).filter(Boolean).length);
  }, [known, onProgress]);

  if (!card) return null;

  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={PanelsTopLeft} title="Flashcards" description="Try to answer before flipping the card. Mark a card as learned only when recall feels easy." />

      <button
        onClick={() => setFlipped((value) => !value)}
        className="relative min-h-[290px] w-full overflow-hidden rounded-[26px] border border-[rgba(var(--brand),0.22)] bg-[linear-gradient(145deg,rgba(var(--brand),0.11),rgba(var(--brand-2),0.06))] p-7 text-left transition hover:-translate-y-0.5"
      >
        <div className="mb-8 flex items-center justify-between text-xs font-bold text-[rgb(var(--muted))]">
          <span>Card {index + 1} of {pack.flashcards.length}</span>
          <span>{flipped ? "Answer" : "Question"}</span>
        </div>
        <div className="grid min-h-[155px] place-items-center text-center">
          <p className={cn("m-0 max-w-2xl leading-relaxed", flipped ? "text-base text-[rgb(var(--muted))]" : "text-2xl font-black tracking-tight")}>{flipped ? card.back : card.front}</p>
        </div>
        <div className="mt-6 text-center text-xs font-bold text-[rgb(var(--brand))]">Click card to {flipped ? "see question" : "reveal answer"}</div>
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIndex((value) => Math.max(0, value - 1));
              setFlipped(false);
            }}
            disabled={index === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm font-bold disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            onClick={() => {
              setIndex((value) => Math.min(pack.flashcards.length - 1, value + 1));
              setFlipped(false);
            }}
            disabled={index === pack.flashcards.length - 1}
            className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm font-bold disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
        <button
          onClick={() => setKnown((current) => ({ ...current, [card.id]: !current[card.id] }))}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition",
            known[card.id]
              ? "bg-[rgba(var(--success),0.12)] text-[rgb(var(--success))]"
              : "bg-[rgb(var(--brand))] text-white"
          )}
        >
          <Check size={16} /> {known[card.id] ? "Learned" : "Mark as learned"}
        </button>
      </div>
    </div>
  );
}

export function QuizView({ pack, onScore }: { pack: StudyPack; onScore: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return pack.quiz.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);
  }, [answers, pack.quiz]);

  function submit() {
    setSubmitted(true);
    onScore(score);
  }

  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={ListChecks} title="MCQ quiz" description="Choose one answer for each question. Explanations appear after you submit." />
      <div className="space-y-6">
        {pack.quiz.map((question, qIndex) => (
          <div key={question.id} className="rounded-2xl border border-[rgb(var(--border))] p-4 md:p-5">
            <div className="mb-3 text-sm font-extrabold leading-6">{qIndex + 1}. {question.question}</div>
            <div className="grid gap-2">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                const correct = submitted && optionIndex === question.answer;
                const wrong = submitted && selected && optionIndex !== question.answer;
                return (
                  <button
                    key={option}
                    disabled={submitted}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition",
                      correct
                        ? "border-[rgba(var(--success),0.45)] bg-[rgba(var(--success),0.08)] text-[rgb(var(--success))]"
                        : wrong
                          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/20 dark:text-red-300"
                          : selected
                            ? "border-[rgb(var(--brand))] bg-[rgba(var(--brand),0.08)]"
                            : "border-[rgb(var(--border))] hover:bg-[rgb(var(--panel-2))]"
                    )}
                  >
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </button>
                );
              })}
            </div>
            {submitted && <p className="mb-0 mt-3 text-xs leading-5 text-[rgb(var(--muted))]">{question.explanation}</p>}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={Object.keys(answers).length !== pack.quiz.length}
          className="mt-5 w-full rounded-2xl bg-[rgb(var(--brand))] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-45"
        >
          Submit quiz
        </button>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl bg-[rgb(var(--panel-2))] p-4 sm:flex-row">
          <div>
            <div className="text-sm font-extrabold">Score: {score}/{pack.quiz.length}</div>
            <div className="mt-1 text-xs text-[rgb(var(--muted))]">Review the explanations before trying again.</div>
          </div>
          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              onScore(0);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm font-bold"
          >
            <RotateCcw size={15} /> Try again
          </button>
        </div>
      )}
    </div>
  );
}

export function QuestionsView({ pack }: { pack: StudyPack }) {
  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={MessageSquareText} title="Short questions" description="Good for written practice, viva preparation, and checking whether you can explain the topic clearly." />
      <div className="space-y-3">
        {pack.shortQuestions.map((question, index) => (
          <div key={question} className="flex gap-3 rounded-2xl border border-[rgb(var(--border))] p-4">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[rgba(var(--brand),0.1)] text-sm font-black text-[rgb(var(--brand))]">{index + 1}</div>
            <div>
              <p className="m-0 text-sm font-bold leading-6">{question}</p>
              <p className="mb-0 mt-2 text-xs text-[rgb(var(--muted))]">Try answering in 3–5 sentences without opening the notes.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudyPlanView({ pack }: { pack: StudyPack }) {
  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={CalendarDays} title="Study plan" description="A short revision sequence that mixes understanding, active recall, and testing." />
      <div className="space-y-3">
        {pack.studyPlan.map((session, index) => (
          <div key={session.day} className="grid gap-4 rounded-2xl border border-[rgb(var(--border))] p-4 md:grid-cols-[100px_1fr_auto] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">{session.day}</div>
              <div className="mt-1 text-lg font-black">{session.minutes}m</div>
            </div>
            <div>
              <div className="text-sm font-extrabold">{session.focus}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {session.tasks.map((task) => (
                  <span key={task} className="rounded-lg bg-[rgb(var(--panel-2))] px-2.5 py-1.5 text-xs text-[rgb(var(--muted))]">{task}</span>
                ))}
              </div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(var(--brand),0.1)] text-sm font-black text-[rgb(var(--brand))]">{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamModeView({ pack, onComplete }: { pack: StudyPack; onComplete: (value: number) => void }) {
  const [done, setDone] = useState<Record<number, boolean>>({});

  useEffect(() => {
    onComplete(Object.values(done).filter(Boolean).length);
  }, [done, onComplete]);

  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={BookOpenCheck} title="Exam preparation mode" description="A no-notes checklist designed to expose gaps before the real exam does." />
      <div className="space-y-2.5">
        {pack.examPrep.map((task, index) => (
          <button
            key={task}
            onClick={() => setDone((current) => ({ ...current, [index]: !current[index] }))}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
              done[index]
                ? "border-[rgba(var(--success),0.35)] bg-[rgba(var(--success),0.07)]"
                : "border-[rgb(var(--border))] hover:bg-[rgb(var(--panel-2))]"
            )}
          >
            <div className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border", done[index] ? "border-[rgb(var(--success))] bg-[rgb(var(--success))] text-white" : "border-[rgb(var(--border))]")}>{done[index] && <Check size={14} />}</div>
            <span className={cn("text-sm font-semibold leading-6", done[index] && "text-[rgb(var(--muted))] line-through")}>{task}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProgressView({ pack, flashcardsLearned, quizScore, examDone }: { pack: StudyPack; flashcardsLearned: number; quizScore: number; examDone: number }) {
  const flashPct = pack.flashcards.length ? Math.round((flashcardsLearned / pack.flashcards.length) * 100) : 0;
  const quizPct = pack.quiz.length ? Math.round((quizScore / pack.quiz.length) * 100) : 0;
  const examPct = pack.examPrep.length ? Math.round((examDone / pack.examPrep.length) * 100) : 0;
  const overall = Math.round((flashPct + quizPct + examPct) / 3);

  const rows = [
    { label: "Flashcard mastery", value: flashPct },
    { label: "Quiz score", value: quizPct },
    { label: "Exam checklist", value: examPct }
  ];

  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={BarChart3} title="Progress dashboard" description="Progress is stored for the current session and updates as you practice." />
      <div className="grid gap-5 md:grid-cols-[240px_1fr]">
        <div className="grid place-items-center rounded-[26px] bg-[rgb(var(--panel-2))] p-6 text-center">
          <div
            className="relative grid h-36 w-36 place-items-center rounded-full"
            style={{ background: `conic-gradient(rgb(var(--brand)) ${overall * 3.6}deg, rgba(var(--brand), 0.1) 0deg)` }}
          >
            <div className="grid h-28 w-28 place-items-center rounded-full bg-[rgb(var(--panel))]">
              <div>
                <div className="text-3xl font-black">{overall}%</div>
                <div className="text-xs font-semibold text-[rgb(var(--muted))]">overall</div>
              </div>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold"><Trophy size={16} /> Keep improving</div>
        </div>

        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.label} className="rounded-2xl border border-[rgb(var(--border))] p-4">
              <div className="mb-2 flex justify-between text-sm font-bold"><span>{row.label}</span><span>{row.value}%</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[rgb(var(--panel-2))]"><div className="h-full rounded-full bg-[rgb(var(--brand))]" style={{ width: `${row.value}%` }} /></div>
            </div>
          ))}
          <div className="flex items-start gap-3 rounded-2xl bg-[rgba(var(--brand),0.07)] p-4 text-sm leading-6 text-[rgb(var(--muted))]">
            <CircleHelp className="mt-0.5 shrink-0 text-[rgb(var(--brand))]" size={17} />
            A low score is useful information. Revisit only the weak areas instead of restarting the whole lecture.
          </div>
        </div>
      </div>
    </div>
  );
}
