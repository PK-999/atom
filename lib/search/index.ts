import {
  listPublishedLessons,
  listTopics,
  listGlossaryTerms,
} from "@/lib/education/catalog";
import { METRICS } from "@/lib/evidence/metrics";

export type SearchDocumentType = "lesson" | "topic" | "glossary" | "metric";

export interface SearchDocument {
  id: string;
  type: SearchDocumentType;
  title: string;
  summary: string;
  href: string;
  topicIds: string[];
  keywords: string[];
}

export function buildSearchIndex(): SearchDocument[] {
  const publishedLessons: SearchDocument[] = listPublishedLessons().map(
    (l) => ({
      id: `lesson-${l.id}`,
      type: "lesson" as const,
      title: l.title,
      summary: l.objective,
      href: `/learn/${l.slug}`,
      topicIds: [l.topicId],
      keywords: [l.id, l.slug, ...l.conceptIds, ...l.claimIds],
    }),
  );

  const publishedTopics: SearchDocument[] = listTopics()
    .filter((t) => t.status === "published")
    .map((t) => ({
      id: `topic-${t.id}`,
      type: "topic" as const,
      title: t.title,
      summary: t.description,
      href: `/topics/${t.slug}`,
      topicIds: [t.id],
      keywords: [t.id, t.slug, ...t.subtopics.map((s) => s.title)],
    }));

  const glossaryTerms: SearchDocument[] = listGlossaryTerms().map((g) => ({
    id: `glossary-${g.id}`,
    type: "glossary" as const,
    title: g.term,
    summary: g.definition,
    href: `/glossary/${g.id}`,
    topicIds: [g.category],
    keywords: [g.id, g.term.toLowerCase(), g.category],
  }));

  const metrics: SearchDocument[] = METRICS.map((m) => {
    const title = m.id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      id: `metric-${m.id}`,
      type: "metric" as const,
      title,
      summary: m.definition,
      href: `/compare?metric=${m.id}`,
      topicIds: [m.category],
      keywords: [
        m.id,
        m.category,
        m.canonicalUnit,
        ...((m.supportedUnits as readonly string[]) || []),
      ].filter((k): k is string => Boolean(k)),
    };
  });

  const tools: SearchDocument[] = [
    {
      id: "tool-radiation-explorer",
      type: "topic",
      title: "Radiation Dose Explorer",
      summary:
        "Compare everyday, medical, and acute radiation doses on a logarithmic scale.",
      href: "/radiation",
      topicIds: ["safety-and-environment", "physics"],
      keywords: [
        "radiation",
        "dose",
        "sievert",
        "millisievert",
        "xray",
        "banana",
        "ct-scan",
        "background",
      ],
    },
  ];

  return [
    ...publishedLessons,
    ...publishedTopics,
    ...glossaryTerms,
    ...metrics,
    ...tools,
  ];
}

function normalize(text?: string | null): string {
  if (!text || typeof text !== "string") {
    return "";
  }
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchCatalog(
  rawQuery: string,
  index?: SearchDocument[],
): SearchDocument[] {
  if (!rawQuery || typeof rawQuery !== "string") {
    return [];
  }

  // Enforce 200 character cap and normalize
  const query = normalize(rawQuery.slice(0, 200));
  if (query.length === 0) {
    return [];
  }

  const searchIndex = index ?? buildSearchIndex();
  const tokens = query.split(/\s+/).filter(Boolean);

  const scored: Array<{ doc: SearchDocument; score: number }> = [];

  for (const doc of searchIndex) {
    let score = 0;
    const docTitle = normalize(doc.title);
    const docSummary = normalize(doc.summary);
    const docKeywords = (doc.keywords || []).map((k) => normalize(k));

    // Exact title match
    if (docTitle === query) {
      score += 100;
    } else if (docTitle.startsWith(query)) {
      score += 60;
    } else if (docTitle.includes(query)) {
      score += 40;
    }

    // Exact keyword match
    if (docKeywords.includes(query)) {
      score += 50;
    }

    // Token matches
    let tokenMatches = 0;
    for (const token of tokens) {
      if (docTitle.includes(token)) {
        score += 20;
        tokenMatches++;
      }
      if (docKeywords.some((k) => k.includes(token))) {
        score += 15;
        tokenMatches++;
      }
      if (docSummary.includes(token)) {
        score += 5;
        tokenMatches++;
      }
    }

    if (score > 0) {
      scored.push({ doc, score });
    }
  }

  // Sort deterministically: score DESC, then title ASC, then id ASC
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const titleCompare = a.doc.title.localeCompare(b.doc.title);
    if (titleCompare !== 0) {
      return titleCompare;
    }
    return a.doc.id.localeCompare(b.doc.id);
  });

  return scored.map((s) => s.doc);
}
