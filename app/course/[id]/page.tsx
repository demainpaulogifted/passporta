import Link from "next/link";
import { notFound } from "next/navigation";
import { course } from "@/lib/course-data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const lessonId = Number(id);
  const lesson = course.lessons.find((l) => l.id === lessonId);

  if (!lesson) notFound();

  const prev = course.lessons.find((l) => l.id === lessonId - 1);
  const next = course.lessons.find((l) => l.id === lessonId + 1);

  return (
    <main className="dashboard">
      <div className="container" style={{ paddingTop: 24, paddingBottom: 60, maxWidth: 680 }}>
        {/* Back */}
        <Link
          href="/course"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: "var(--muted)",
            marginBottom: 20,
          }}
        >
          ← Back to Course
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <p className="dashboard-eyebrow">
            LESSON {String(lesson.id).padStart(2, "0")} · {lesson.duration}
          </p>
          <h1 style={{ fontSize: 24, margin: "6px 0 10px", lineHeight: 1.3 }}>
            {lesson.title}
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
            <strong>Goal:</strong> {lesson.goal}
          </p>
        </div>

        {/* Script */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>Lesson Script</h3>
          <div
            style={{
              whiteSpace: "pre-line",
              lineHeight: 1.7,
              fontSize: 15,
              color: "var(--ink)",
            }}
          >
            {lesson.script}
          </div>
        </div>

        {/* Quiz */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>Quick Quiz</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {lesson.quiz.map((item, i) => (
              <div key={i}>
                <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>
                  {i + 1}. {item.q}
                </p>
                <p style={{ margin: 0, color: "var(--green)", fontSize: 14 }}>
                  Answer: {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Task */}
        <div
          className="card"
          style={{
            marginBottom: 28,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>Action Task</h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{lesson.task}</p>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {prev ? (
            <Link href={`/course/${prev.id}`} className="btn btn-outline">
              ← Previous
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link href={`/course/${next.id}`} className="btn btn-primary">
              Next Lesson →
            </Link>
          ) : (
            <Link href="/course" className="btn btn-primary">
              Finish Course
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}