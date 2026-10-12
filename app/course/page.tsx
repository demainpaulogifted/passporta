import Link from "next/link";

export default function Course() {
  return (
    <main className="form-wrap">
      <section className="form-card" style={{ width: "min(620px,100%)" }}>
        <Link className="brand" href="/dashboard">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>Passport application guide</h1>
        <p className="muted">
          A structured learning path is planned for this course. This starter
          page does not claim that lessons or payments are live yet.
        </p>
        <div className="message">
          Course access is planned at ₦5,000. Paystack checkout must be
          configured and verified server-side before paid access is enabled.
        </div>
        <div className="card">
          <h3>What the guide will cover</h3>
          <p>
            Understanding official requirements, preparing documents, navigating
            the official portal, appointment and biometric steps, and recognizing
            common mistakes.
          </p>
        </div>
        <p className="muted" style={{ marginTop: 20 }}>
          Always verify current requirements on the{" "}
          <a
            className="small-link"
            href="https://passport.immigration.gov.ng/"
            target="_blank"
            rel="noreferrer"
          >
            official passport portal
          </a>
          .
        </p>
        <Link className="btn btn-outline full" href="/dashboard">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}