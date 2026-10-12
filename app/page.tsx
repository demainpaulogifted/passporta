import Link from "next/link";

const benefits = [
  {
    icon: "💰",
    title: "Earn ₦100k – ₦150k per job",
    text: "Stop paying agents. Become the agent and charge premium rates for every passport you process.",
  },
  {
    icon: "📚",
    title: "Complete step-by-step system",
    text: "Learn the exact process, documents, portals, and scripts used by successful agents.",
  },
  {
    icon: "🛡️",
    title: "Lifetime support included",
    text: "Get help whenever you get stuck with a client case. You’re never alone.",
  },
];

const steps = [
  ["01", "Join the training", "Get instant access to the complete agent system."],
  ["02", "Learn the process", "Master every step of international passport processing."],
  ["03", "Start taking clients", "Use the scripts and templates to get your first jobs."],
  ["04", "Scale your income", "Process multiple passports and grow your agency."],
];

export default function Home() {
  return (
    <>
      <header className="container nav">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <nav className="navlinks">
          <a href="#benefits">Benefits</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn btn-outline" href="/login">
            Log in
          </Link>
          <Link className="btn btn-primary" href="/signup">
            Start Earning →
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">✦ PASSPORT AGENT TRAINING</div>
              <h1>
                Stop paying ₦100k–₦200k to agents.{" "}
                <span className="gradient">Become one.</span>
              </h1>
              <p>
                Learn the exact system to process international passports and earn{" "}
                <strong>₦100,000 – ₦150,000</strong> per job. Over 2 million Nigerians
                travel every year — they all need passports.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" href="/signup">
                  Become an Agent →
                </Link>
                <a className="btn" style={{ border: "1px solid #ffffff55", color: "white" }} href="#pricing">
                  See Pricing
                </a>
              </div>
              <div className="trustline">
                <span>✓ Complete training system</span>
                <span>✓ Lifetime access</span>
                <span>✓ Real support</span>
              </div>
            </div>

            <div className="visual">
              <div className="glow"></div>
              <div className="passport-card">
                <div className="small">FEDERAL REPUBLIC OF NIGERIA</div>
                <div className="crest">✧</div>
                <h3>PASSPORT</h3>
                <div className="sub">AGENT TRAINING</div>
              </div>
              <div className="float-note note-one">
                ₦100k – ₦150k
                <span>per passport job</span>
              </div>
              <div className="float-note note-two">
                500 slots only
                <span>Limited access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section" id="benefits">
          <div className="container">
            <div className="section-heading">
              <h2>Why become a passport agent?</h2>
              <p>Turn a high-demand service into a real income stream.</p>
            </div>
            <div className="cards">
              {benefits.map((b) => (
                <article className="card" key={b.title}>
                  <div className="card-icon">{b.icon}</div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section section-soft" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <h2>How it works</h2>
              <p>From zero knowledge to processing passports for clients.</p>
            </div>
            <div className="steps">
              {steps.map((s) => (
                <article className="step" key={s[0]}>
                  <div className="step-number">{s[0]}</div>
                  <h3>{s[1]}</h3>
                  <p>{s[2]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="section" id="pricing">
          <div className="container">
            <div className="section-heading">
              <h2>One-time payment. Lifetime access.</h2>
              <p>No monthly fees. Own the system forever.</p>
            </div>

            <div style={{ maxWidth: 480, margin: "0 auto" }}>
              <div className="card" style={{ padding: 32, textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 8 }}>
                  FULL AGENT TRAINING
                </div>
                <div style={{ fontSize: 48, fontWeight: 800, color: "var(--navy)", letterSpacing: "-2px" }}>
                  ₦5,000
                </div>
                <div style={{ color: "var(--muted)", marginBottom: 24 }}>One-time payment</div>

                <ul style={{ textAlign: "left", listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                  {[
                    "Complete step-by-step passport process",
                    "How to charge ₦100k–150k per job",
                    "Client scripts & templates",
                    "Document checklists",
                    "Lifetime access + future updates",
                    "Support when you need it",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", gap: 10, marginBottom: 12, fontSize: 15 }}>
                      <span style={{ color: "var(--green)" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link className="btn btn-primary full" href="/signup">
                  Get Instant Access →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section">
          <div className="container">
            <div className="cta">
              <div>
                <h2>Ready to start earning?</h2>
                <p>Join the limited slots and become a passport agent today.</p>
              </div>
              <Link className="btn btn-primary" href="/signup">
                Become an Agent →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <div>
            <strong style={{ color: "white" }}>PassPorta</strong>
            <div style={{ marginTop: 8 }}>Become a passport agent. Earn real income.</div>
          </div>
          <div>Independent training platform · Not affiliated with NIS</div>
          <div>© {new Date().getFullYear()} PassPorta</div>
        </div>
      </footer>
    </>
  );
}