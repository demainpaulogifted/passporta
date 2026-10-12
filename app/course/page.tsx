import Link from "next/link";

export default function CoursePage() {
  return (
    <main className="form-wrap" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div className="form-card" style={{ maxWidth: 560 }}>
        <Link className="brand" href="/" style={{ marginBottom: 24, display: "inline-flex" }}>
          <span className="logo">P</span>PassPorta
        </Link>

        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Passport Agent Training</h1>
        <p className="muted">
          A complete system to process international passports and earn as an agent.
        </p>

        <div
          style={{
            background: "#eef9f4",
            border: "1px solid #c8ecdc",
            borderRadius: 14,
            padding: 18,
            margin: "24px 0",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          <strong>Course access is ₦5,000</strong>
          <br />
          One-time payment. Lifetime access. Paystack checkout will be enabled after
          configuration.
        </div>

        <h3 style={{ margin: "28px 0 12px" }}>What you will learn</h3>
        <ul style={{ paddingLeft: 18, color: "var(--muted)", lineHeight: 1.8 }}>
          <li>Full international passport requirements</li>
          <li>How to guide clients step-by-step</li>
          <li>Document preparation & common mistakes</li>
          <li>How to charge ₦100k – ₦150k per job</li>
          <li>Client handling scripts & templates</li>
          <li>How to scale into a real agency</li>
        </ul>

        <div style={{ marginTop: 32 }}>
          <Link className="btn btn-primary full" href="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}