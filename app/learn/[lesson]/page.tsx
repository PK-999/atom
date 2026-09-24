import { getLearningPath } from "@/lib/education/paths";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  getPublishedLesson,
  getTopic,
  getCheckpointsForLesson,
  listPublishedLessons,
} from "@/lib/education/catalog";
import { LessonViewer } from "@/features/education/LessonViewer";

interface LessonPageProps {
  params: Promise<{ lesson: string }>;
  searchParams: Promise<{ path?: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return listPublishedLessons().map((lesson) => ({
    lesson: lesson.slug,
  }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = getPublishedLesson(slug);

  if (!lesson) {
    return {
      title: "Lesson Not Found",
    };
  }

  return {
    title: `${lesson.title} — Nuclear Energy Curriculum`,
    description: lesson.objective,
  };
}

export default async function LessonPage({
  params,
  searchParams,
}: LessonPageProps) {
  const { lesson: slug } = await params;
  const lesson = getPublishedLesson(slug);

  if (!lesson) {
    notFound();
  }

  const topic = getTopic(lesson.topicId);
  const checkpoints = getCheckpointsForLesson(lesson.id);
  const checkpoint = checkpoints[0] ?? null;

  const path = getLearningPath((await searchParams).path);
  const published = path.lessons.flatMap((id) => {
    const item = getPublishedLesson(id);
    return item ? [item] : [];
  });
  const currentIndex = published.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? published[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < published.length - 1 ? published[currentIndex + 1] : null;

  return (
    <AppShell>
      <LessonViewer
        pathId={path.id}
        lesson={lesson}
        topic={topic}
        checkpoint={checkpoint}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    </AppShell>
  );
}
