import Link from "next/link";
import { course } from "@/lib/course-data";

export default function CoursePage() {
  return (
    <main className="dashboard">
      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p className="dashboard-eyebrow">PASSPORT AGENT TRAINING</p>
          <h1 style={{ fontSize: 26, marginBottom: 8, lineHeight: 1.25 }}>
            {course.title}
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: 520, lineHeight: 1.6, margin: 0 }}>
            {course.subtitle}
          </p>
        </div>

        {/* Access Card */}
        <div
          className="card"
          style={{
            marginBottom: 28,
            background: "linear-gradient(135deg, #f0fdf6 0%, #eef6ff 100%)",
            border: "1px solid #c6e9d8",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--green)",
                  marginBottom: 4,
                  letterSpacing: "0.3px",
                }}
              >
                FULL ACCESS
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 20 }}>
                ₦{course.price.toLocaleString()} — One-time
              </h3>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
                Lifetime access to all 6 lessons + complete toolkit
              </p>
            </div>
            <Link href="/dashboard" className="btn btn-primary">
              Unlock Full Course →
            </Link>
          </div>
        </div>

        {/* Curriculum */}
        <h2 style={{ fontSize: 18, marginBottom: 14, color: "var(--navy)" }}>
          Course Curriculum
        </h2>

        <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
          {course.lessons.map((lesson) => (
            <article
              key={lesson.id}
              className="card"
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "var(--navy)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {String(lesson.id).padStart(2, "0")}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 3,
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                    {lesson.title}
                  </h3>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lesson.duration}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: 13.5,
                    lineHeight: 1.45,
                  }}
                >
                  {lesson.goal}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* What is included */}
        <div className="card" style={{ marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>What is included</h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: "var(--muted)",
              lineHeight: 1.75,
              fontSize: 14,
            }}
          >
            <li>6 practical lessons with full scripts</li>
            <li>Quizzes and action tasks for every lesson</li>
            <li>Complete document checklists (Fresh, Minor, Renewal, Replacement…)</li>
            <li>Client intake form</li>
            <li>Service agreement template</li>
            <li>WhatsApp message templates</li>
            <li>Pricing worksheet</li>
            <li>Final assessment + completion certificate</li>
          </ul>
        </div>

        {/* Important notice */}
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          PassPorta is an independent training platform and is not affiliated with the
          Nigeria Immigration Service. This course teaches professional guidance skills
          only. Official fees, requirements and final decisions remain under the control
          of the relevant authorities.
        </p>
      </div>
    </main>
  );
}