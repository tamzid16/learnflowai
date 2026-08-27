"use client";

import { FileUp, Sparkles, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { demoLecture } from "@/lib/demo-content";

export default function UploadPanel({
  loading,
  onGenerate
}: {
  loading: boolean;
  onGenerate: (payload: { file: File | null; text: string }) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(next?: File) {
    if (!next) return;
    setFile(next);
  }

  return (
    <section className="card overflow-hidden p-5 md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="m-0 text-lg font-extrabold tracking-tight">Add your study material</h2>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">Upload a PDF, TXT, Markdown file, or paste notes below.</p>
        </div>
        <button
          onClick={() => {
            setFile(null);
            setText(demoLecture.trim());
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--panel-2))] px-3 py-2 text-xs font-bold text-[rgb(var(--text))] transition hover:-translate-y-0.5"
        >
          <Sparkles size={15} />
          Load demo lecture
        </button>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          pickFile(event.dataTransfer.files?.[0]);
        }}
        className="group rounded-2xl border border-dashed border-[rgba(var(--brand),0.35)] bg-[rgba(var(--brand),0.045)] p-5 text-center transition hover:bg-[rgba(var(--brand),0.075)]"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,text/plain,text/markdown,application/pdf"
          className="hidden"
          onChange={(event) => pickFile(event.target.files?.[0])}
        />

        {file ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-[rgb(var(--panel))] p-3 text-left">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgba(var(--brand),0.12)] text-[rgb(var(--brand))]">
                <FileUp size={18} />
              </div>
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-bold">{file.name}</p>
                <p className="m-0 mt-0.5 text-xs text-[rgb(var(--muted))]">{Math.max(1, Math.round(file.size / 1024))} KB</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="grid h-9 w-9 place-items-center rounded-lg text-[rgb(var(--muted))] hover:bg-[rgb(var(--panel-2))]"
              aria-label="Remove file"
            >
              <X size={17} />
            </button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="w-full py-2">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--panel))] text-[rgb(var(--brand))] shadow-sm">
              <UploadCloud size={23} />
            </div>
            <div className="text-sm font-bold">Drop a file here or click to browse</div>
            <div className="mt-1 text-xs text-[rgb(var(--muted))]">PDF, TXT, or Markdown · up to 8 MB</div>
          </button>
        )}
      </div>

      <div className="my-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
        <div className="h-px flex-1 bg-[rgb(var(--border))]" />
        or paste notes
        <div className="h-px flex-1 bg-[rgb(var(--border))]" />
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        placeholder="Paste lecture notes, textbook content, or revision material here..."
        className="w-full resize-y rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] px-4 py-3 text-sm leading-6 text-[rgb(var(--text))] outline-none transition placeholder:text-[rgb(var(--muted))] focus:border-[rgba(var(--brand),0.55)] focus:ring-4 focus:ring-[rgba(var(--brand),0.08)]"
      />

      <button
        disabled={loading || (!file && !text.trim())}
        onClick={() => onGenerate({ file, text })}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--brand))] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
      >
        <Sparkles size={18} />
        {loading ? "Building your study pack..." : "Generate study pack"}
      </button>
    </section>
  );
}
