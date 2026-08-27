import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { generateStudyPack } from "@/lib/study-engine";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const pastedText = String(formData.get("text") ?? "").trim();

    let sourceName = "Pasted lecture notes";
    let text = pastedText;

    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Please use a file smaller than 8 MB." }, { status: 400 });
      }

      sourceName = file.name;
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (extension === "pdf" || file.type === "application/pdf") {
        const parsed = await pdfParse(buffer);
        text = parsed.text.trim();
      } else if (["txt", "md"].includes(extension ?? "") || file.type.startsWith("text/")) {
        text = buffer.toString("utf8").trim();
      } else {
        return NextResponse.json(
          { error: "LearnFlow currently accepts PDF, TXT, and Markdown files." },
          { status: 400 }
        );
      }
    }

    if (!text) {
      return NextResponse.json({ error: "Upload a study file or paste some notes first." }, { status: 400 });
    }

    return NextResponse.json({ pack: generateStudyPack(text, sourceName) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong while reading the material.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
