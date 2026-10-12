"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("there");
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
        String(user.user_metadata?.full_name || user.email?.split("@")[0] || "there")
      );
      const { data: profile } = await s
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();
      if (!profile?.onboarding_completed) {
        router.replace("/onboarding");
        return;
      }
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
          <strong style={{ padding: "8px 12px" }}>Agent Workspace</strong>
          <a className="active" href="/dashboard">
            Dashboard
          </a>
          <a href="/course">Training</a>
          <a href="/assistance">Support</a>
          {isAdmin && <a href="/admin">Admin</a>}
        </aside>

        <section className="dash-main">
          <h1>Welcome back, {name.split(" ")[0]}</h1>
          <p>Your journey to becoming a high-earning passport agent continues.</p>

          <div className="dash-grid">
            <article className="card">
              <div className="card-icon">📚</div>
              <h3>Continue Training</h3>
              <p>
                Master the complete passport processing system and start taking clients.
              </p>
              <div style={{ marginTop: 20 }}>
                <Link className="btn btn-blue" href="/course">
                  Go to Training →
                </Link>
              </div>
            </article>

            <article className="card">
              <div className="card-icon" style={{ background: "#e7fff4", color: "var(--green)" }}>
                💬
              </div>
              <h3>Need Help?</h3>
              <p>
                Stuck on a client case? Send a request and get support from the team.
              </p>
              <div style={{ marginTop: 20 }}>
                <Link className="btn btn-primary" href="/assistance">
                  Request Support →
                </Link>
              </div>
            </article>
          </div>

          <article className="card" style={{ marginTop: 18 }}>
            <h3>Your Agent Goal</h3>
            <p>
              Learn the full process → Start processing passports → Charge ₦100k–150k per job.
            </p>
            <Link className="small-link" href="/course">
              View full training roadmap →
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}