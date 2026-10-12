import Link from "next/link";

const services = [
  {
    icon: "◎",
    title: "Learn with confidence",
    text: "Follow a structured, practical guide to understanding the Nigerian passport application process.",
  },
  {
    icon: "↗",
    title: "Request assistance",
    text: "Send a request to our team and get contacted about the support you need.",
  },
  {
    icon: "✓",
    title: "Know the next steps",
    text: "Explore requirements, application stages and useful official resources in one place.",
  },
];

const steps = [
  ["01", "Create your account", "Sign up with your name, email and password."],
  ["02", "Verify your email", "Enter the one-time code sent to your inbox."],
  ["03", "Choose your path", "Explore the guide or request personal assistance."],
  ["04", "Track your progress", "Return to your dashboard whenever you need."],
];

export default function Home() {
  return (
    <>
      <header className="container nav">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <nav className="navlinks">
          <a href="#services">Services</a>
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQs</a>
        </nav>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn btn-outline" href="/login">
            Log in
          </Link>
          <Link className="btn btn-primary" href="/signup">
            Get started ↗
          </Link>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">✦ PASSPORT GUIDANCE & SUPPORT</div>
              <h1>
                Your passport journey,{" "}
                <span className="gradient">made easier.</span>
              </h1>
              <p>
                Understand the Nigerian passport application process with clear
                guidance, practical learning resources, and optional assistance
                when you need it.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" href="/signup">
                  Start your journey <span>→</span>
                </Link>
                <a
                  className="btn"
                  style={{ border: "1px solid #ffffff55", color: "white" }}
                  href="#services"
                >
                  Explore services
                </a>
              </div>
              <div className="trustline">
                <span>✓ Clear step-by-step guidance</span>
                <span>✓ Secure personal account</span>
                <span>✓ Learn at your own pace</span>
              </div>
            </div>
            <div className="visual" aria-label="PassPorta passport illustration">
              <div className="glow"></div>
              <div className="passport-card">
                <div className="small">FEDERAL REPUBLIC OF NIGERIA</div>
                <div className="crest">✧</div>
                <h3>PASSPORT</h3>
                <div className="sub">GUIDANCE & SUPPORT</div>
              </div>
              <div className="float-note note-one">
                ✓ Guidance in one place
                <span>Understand each step</span>
              </div>
              <div className="float-note note-two">
                ✦ Your journey
                <span>Learn or request assistance</span>
              </div>
            </div>
          </div>
        </section>
        <section className="section" id="services">
          <div className="container">
            <div className="section-heading">
              <h2>Support for every step of the journey</h2>
              <p>
                Whether you want to understand the process yourself or need
                someone to guide you, start with the option that fits you.
              </p>
            </div>
            <div className="cards">
              {services.map((s) => (
                <article className="card" key={s.title}>
                  <div className="card-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section section-soft">
          <div className="container split">
            <div>
              <div
                className="eyebrow"
                style={{
                  background: "#e1fff3",
                  borderColor: "#c3f1df",
                  color: "#087854",
                }}
              >
                BUILT AROUND YOUR NEEDS
              </div>
              <h2
                style={{
                  fontSize: 38,
                  letterSpacing: "-1.4px",
                  color: "var(--navy)",
                }}
              >
                A clearer path starts with the right information.
              </h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
                Passporta helps you organize your next steps with learning
                resources and a simple way to request guidance. Keep your
                progress together in your own account.
              </p>
              <div className="checklist">
                <div className="check">
                  <b>✓</b>
                  <span>
                    <strong>Practical learning</strong>
                    <br />
                    Understand application steps and prepare more confidently.
                  </span>
                </div>
                <div className="check">
                  <b>✓</b>
                  <span>
                    <strong>Personal assistance requests</strong>
                    <br />
                    Tell us what help you need so our team can follow up.
                  </span>
                </div>
                <div className="check">
                  <b>✓</b>
                  <span>
                    <strong>Progress saved to your account</strong>
                    <br />
                    Return when convenient and continue where you stopped.
                  </span>
                </div>
              </div>
              <Link className="btn btn-blue" href="/signup">
                Create your account →
              </Link>
            </div>
            <div className="info-panel">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--green)",
                  marginBottom: 12,
                }}
              >
                IMPORTANT TO KNOW
              </div>
              <h3>
                Guidance you can understand. Official decisions stay with the
                authorities.
              </h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
                PassPorta is an independent guidance and assistance platform, not
                the Nigerian Immigration Service. Applications, official fees,
                appointments, biometric capture and approval remain subject to
                official government procedures.
              </p>
              <a
                className="small-link"
                href="https://passport.immigration.gov.ng/"
                target="_blank"
                rel="noreferrer"
              >
                Visit the official passport portal ↗
              </a>
            </div>
          </div>
        </section>
        <section className="section" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <h2>Get started in four simple steps</h2>
              <p>
                A straightforward process that helps you move from questions to a
                clear next step.
              </p>
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
        <section className="section section-soft" id="faq">
          <div className="container">
            <div className="section-heading">
              <h2>Frequently asked questions</h2>
              <p>Know what to expect before you begin.</p>
            </div>
            <div className="faq">
              **Summary:**
Is PassPorta a government website?
                <p>
                  No. PassPorta is an independent guidance and assistance platform
                  and is not affiliated with or endorsed by the Nigerian
                  Immigration Service.
                </p>
              **Summary:**
Can PassPorta guarantee passport approval?
                <p>
                  No. Only the relevant authorities can decide an application. We
                  provide information and assistance, not guaranteed approvals or
                  shortcuts.
                </p>
              **Summary:**

                  Do I have to buy the course to request assistance?
                
                <p>
                  These are separate options. The assistance request form is
                  intended to let you describe the support you need; course access
                  may have a separate fee shown before payment.
                </p>
              **Summary:**
Where do I pay official passport fees?
                <p>
                  Always confirm official requirements and fees through the
                  Nigerian Immigration Service and its official passport portal.
                </p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="cta">
              <div>
                <h2>Ready to take the next step?</h2>
                <p>
                  Create your account and choose the support that works for you.
                </p>
              </div>
              <Link className="btn btn-primary" href="/signup">
                Get started with PassPorta →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container footer-row">
          <div>
            <strong style={{ color: "white" }}>PassPorta</strong>
            <div style={{ marginTop: 8 }}>
              Your passport journey, made easier.
            </div>
          </div>
          <div>Independent guidance platform · Not a government agency</div>
          <div>© {new Date().getFullYear()} PassPorta</div>
        </div>
      </footer>
    </>
  );
}