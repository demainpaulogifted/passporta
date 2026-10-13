import Link from "next/link";

const lessons = [
  {
    number: "01",
    title: "Understanding the Passport System",
    goal: "Correctly identify the right application type for any client.",
    duration: "8 min",
  },
  {
    number: "02",
    title: "Documents & Requirements",
    goal: "Collect a complete, matching document set before starting.",
    duration: "9 min",
  },
  {
    number: "03",
    title: "Using the Official Portal",
    goal: "Complete an accurate application form on the official portal.",
    duration: "10 min",
  },
  {
    number: "04",
    title: "Payments, Booking & Biometrics",
    goal: "Guide the client through payment and the office visit.",
    duration: "9 min",
  },
  {
    number: "05",
    title: "Handling Problems",
    goal: "Fix common issues calmly and professionally.",
    duration: "8 min",
  },
  {
    number: "06",
    title: "Running a Professional Service",
    goal: "Price your service, protect data, and grow ethically.",
    duration: "10 min",
  },
];

export default function CoursePage() {
  return (
    <main className="dashboard">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p className="dashboard-eyebrow">PASSPORT AGENT TRAINING</p>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>
            Become a Professional Passport Agent
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: 560, lineHeight: 1.6 }}>
            A complete practical system to guide Nigerian international passport
            applications accurately, ethically and profitably.
          </p>
        </div>

        {/* Access Card */}
        <div
          className="card"
          style={{
            marginBottom: 28,
            background: "linear-gradient(135deg, #f0fdf6, #eef7ff)",
            border: "1px solid #c8e9d9",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 6 }}>
                FULL ACCESS
              </div>
              <h3 style={{ margin: "0 0 6px" }}>₦5,000 — One-time payment</h3>
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
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Course Curriculum</h2>

        <div style={{ display: "grid", gap: 12 }}>
          {lessons.map((lesson) => (
            <article
              key={lesson.number}
              className="card"
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "var(--navy)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {lesson.number}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>{lesson.title}</h3>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{lesson.duration}</span>
                </div>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
                  {lesson.goal}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* What you get */}
        <div className="card" style={{ marginTop: 28 }}>
          <h3 style={{ marginTop: 0 }}>What is included</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.8 }}>
            <li>6 practical video lessons</li>
            <li>Document checklists for every application type</li>
            <li>Client intake form & service agreement template</li>
            <li>WhatsApp message templates</li>
            <li>Pricing worksheet</li>
            <li>Final assessment + completion certificate</li>
          </ul>
        </div>

        {/* Important notice */}
        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          PassPorta is an independent training platform and is not affiliated with the
          Nigeria Immigration Service. This course teaches guidance skills only. Official
          fees, requirements and decisions remain under the control of the relevant
          authorities.
        </p>
      </div>
    </main>
  );
}