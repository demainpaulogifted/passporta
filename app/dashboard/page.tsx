"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("there");
  const [mode, setMode] = useState("learn");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const s = createClient();
      const {
        data: { user },
      } = await s.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (!user.email_confirmed_at) {
        await s.auth.signOut();
        router.replace("/login");
        return;
      }
      setName(
        String(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "there"
        )
      );
      const { data: profile } = await s
        .from("profiles")
        .select("preferred_mode,onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();
      if (!profile?.onboarding_completed) {
        router.replace("/onboarding");
        return;
      }
      setMode(profile.preferred_mode || "learn");
      const { data: role } = await s
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!role);
      setLoading(false);
    })();
  }, [router]);

  async function logout() {
    const s = createClient();
    await s.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading)
    return (
      <main className="form-wrap">
        <div className="form-card">Loading your dashboard…</div>
      </main>
    );

  return (
    <main className="dashboard">
      <header className="dash-head">
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="logo">P</span>PassPorta
          </Link>
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="btn btn-outline" href="/">
              Home
            </Link>
            <button className="btn btn-outline" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      </header>
      <div className="container dash-layout">
        <aside className="sidebar">
          <strong style={{ padding: "8px 12px" }}>Your workspace</strong>
          <a className="active" href="/dashboard">
            Dashboard
          </a>
          <a href="/assistance">Assistance</a>
          <a href="/course">Course</a>
          {isAdmin && <a href="/admin">Admin dashboard</a>}
        </aside>
        <section className="dash-main">
          <h1>Welcome back, {name.split(" ")[0]}</h1>
          <p>Your passport journey starts with one clear next step.</p>
          <div className="dash-grid">
            <article className="card">
              <div className="card-icon">▤</div>
              <h3>Learn the process</h3>
              <p>
                Explore the course and practical resources at your own pace.
                Course checkout will be enabled after payment configuration.
              </p>
              <div style={{ marginTop: 20 }}>
                <Link className="btn btn-blue" href="/course">
                  Explore learning →
                </Link>
              </div>
            </article>
            <article className="card">
              <div
                className="card-icon"
                style={{ background: "#e7fff4", color: "var(--green)" }}
              >
                ↗
              </div>
              <h3>Need help with your application?</h3>
              <p>
                Send a request and provide a way for our team to contact you.
              </p>
              <div style={{ marginTop: 20 }}>
                <Link className="btn btn-primary" href="/assistance">
                  Request assistance →
                </Link>
              </div>
            </article>
          </div>
          <article className="card" style={{ marginTop: 18 }}>
            <h3>Your chosen path</h3>
            <p>
              {mode === "assist"
                ? "You selected assistance. You can submit a request or explore learning any time."
                : "You selected learning. You can still request assistance whenever you need it."}
            </p>
            <Link className="small-link" href="/onboarding">
              Change preferences
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}