import { StudyPack, Topic } from "@/lib/types";

const stopWords = new Set([
  "about", "after", "again", "also", "among", "because", "been", "before", "being",
  "between", "both", "could", "does", "during", "each", "from", "have", "into", "more",
  "most", "other", "over", "same", "should", "some", "such", "than", "that", "their",
  "them", "then", "there", "these", "they", "this", "those", "through", "under", "used",
  "using", "very", "what", "when", "where", "which", "while", "with", "would", "your",
  "will", "were", "need", "means", "common", "help", "helps", "information", "system",
  "systems", "people", "user", "users", "main", "ways", "type", "types", "only", "should"
]);

function clean(text: string) {
  return text.replace(/\s+/g, " ").replace(/[^\S\r\n]+/g, " ").trim();
}

function splitSentences(text: string) {
  const matches = clean(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  return matches.map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 25);
}

function words(text: string) {
  return text.toLowerCase().match(/[a-zA-Z][a-zA-Z-]{2,}/g) ?? [];
}

function titleCase(value: string) {
  return value
    .split(/[-\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function keywordScores(text: string) {
  const frequency = new Map<string, number>();
  for (const word of words(text)) {
    if (stopWords.has(word)) continue;
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }
  return [...frequency.entries()].sort((a, b) => b[1] - a[1]);
}

function buildSummary(text: string) {
  const sentences = splitSentences(text);
  if (sentences.length <= 4) return sentences;

  const scores = new Map(keywordScores(text));
  const ranked = sentences.map((sentence, index) => {
    const sentenceWords = words(sentence);
    const raw = sentenceWords.reduce((sum, word) => sum + (scores.get(word) ?? 0), 0);
    const positionBonus = index < 2 ? 3 : 0;
    return { sentence, index, score: raw / Math.max(sentenceWords.length, 1) + positionBonus };
  });

  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
}

function buildTopics(text: string): Topic[] {
  const sentences = splitSentences(text);
  const keywords = keywordScores(text).slice(0, 8);
  const max = keywords[0]?.[1] ?? 1;

  return keywords.slice(0, 6).map(([keyword, count]) => {
    const related = sentences.find((sentence) =>
      sentence.toLowerCase().includes(keyword)
    );

    return {
      title: titleCase(keyword),
      explanation: related ?? `Review how ${keyword} is introduced, defined, and applied in the material.`,
      weight: Math.max(35, Math.round((count / max) * 100))
    };
  });
}

function buildFlashcards(topics: Topic[]) {
  return topics.map((topic, index) => ({
    id: `card-${index + 1}`,
    front: `What should you remember about ${topic.title}?`,
    back: topic.explanation
  }));
}

function buildQuiz(topics: Topic[]) {
  return topics.slice(0, 5).map((topic, index) => {
    const distractors = topics
      .filter((item) => item.title !== topic.title)
      .slice(0, 3)
      .map((item) => item.title);

    const options = [topic.title, ...distractors];
    while (options.length < 4) options.push(`Related concept ${options.length + 1}`);

    const shift = index % options.length;
    const rotated = [...options.slice(shift), ...options.slice(0, shift)];
    const answer = rotated.indexOf(topic.title);

    return {
      id: `quiz-${index + 1}`,
      question: `Which concept best matches this idea: “${topic.explanation.slice(0, 120)}${topic.explanation.length > 120 ? "..." : ""}”?`,
      options: rotated,
      answer,
      explanation: `The description is tied most directly to ${topic.title}.`
    };
  });
}

function buildStudyPlan(topics: Topic[]) {
  const safeTopics = topics.length ? topics : [{ title: "Core concepts", explanation: "", weight: 50 }];
  const chunk = (start: number, count: number) => safeTopics.slice(start, start + count).map((t) => t.title);

  return [
    {
      day: "Session 1",
      focus: chunk(0, 2).join(" + ") || "Core concepts",
      minutes: 35,
      tasks: ["Read the summary once", "Review the first flashcards", "Write two definitions from memory"]
    },
    {
      day: "Session 2",
      focus: chunk(2, 2).join(" + ") || safeTopics[0].title,
      minutes: 40,
      tasks: ["Study the next topics", "Answer short questions without notes", "Mark weak areas"]
    },
    {
      day: "Session 3",
      focus: chunk(4, 2).join(" + ") || "Mixed revision",
      minutes: 45,
      tasks: ["Complete the MCQ quiz", "Review every wrong answer", "Revisit weak flashcards"]
    },
    {
      day: "Final review",
      focus: "Exam preparation",
      minutes: 30,
      tasks: ["Use exam mode", "Recall key ideas out loud", "Finish with a five-minute rapid review"]
    }
  ];
}

export function generateStudyPack(input: string, sourceName = "Study material"): StudyPack {
  const text = clean(input);
  if (text.length < 80) {
    throw new Error("The material is too short. Add a little more text so LearnFlow can build a useful study pack.");
  }

  const topics = buildTopics(text);
  const summary = buildSummary(text);
  const wordCount = words(text).length;

  return {
    title: sourceName.replace(/\.[^.]+$/, "") || "Study Session",
    sourceName,
    summary,
    topics,
    flashcards: buildFlashcards(topics),
    quiz: buildQuiz(topics),
    shortQuestions: topics.slice(0, 5).map((topic, index) =>
      index % 2 === 0
        ? `Explain ${topic.title} in your own words and give one practical example.`
        : `Why is ${topic.title} important in the context of this lecture?`
    ),
    studyPlan: buildStudyPlan(topics),
    examPrep: [
      "Close the notes and explain the main topic in 60 seconds.",
      `Define ${topics[0]?.title ?? "the first key concept"} without looking at the summary.`,
      `Compare ${topics[1]?.title ?? "two important ideas"} with ${topics[2]?.title ?? "another concept"}.`,
      "Answer all short questions using only keywords first, then expand each answer.",
      "Take the MCQ quiz once without checking explanations.",
      "Review only the questions you got wrong or felt unsure about.",
      "Write a five-line final revision sheet from memory."
    ],
    stats: {
      words: wordCount,
      readingMinutes: Math.max(1, Math.ceil(wordCount / 220)),
      topicCount: topics.length
    }
  };
}
