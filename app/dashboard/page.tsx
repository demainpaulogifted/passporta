"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("there");
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      if (!user.email_confirmed_at) {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      if (!active) return;

      setName(
        String(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "there"
        )
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.onboarding_completed) {
        router.replace("/onboarding");
        return;
      }

      if (!active) return;
      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="form-wrap">
        <div className="form-card">Loading your dashboard…</div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="container dash-layout" style={{ gridTemplateColumns: "1fr" }}>
        <section className="dash-main">
          <div className="dashboard-welcome">
            <p className="dashboard-eyebrow">YOUR AGENT JOURNEY</p>
            <h1>Welcome back, {name.split(" ")[0]}</h1>
            <p>
              Learn the process, prepare to help applicants, and organize your
              work responsibly.
            </p>
          </div>

          <div className="dash-grid">
            <article className="card">
              <div className="card-icon">📚</div>
              <h3>Passport Agent Training</h3>
              <p>
                Explore the training programme, practical checklists and
                resources planned for your learning journey.
              </p>
              <div className="dashboard-card-action">
                <Link className="btn btn-blue" href="/course">
                  View Training →
                </Link>
              </div>
            </article>

            <article className="card">
              <div className="card-icon">💬</div>
              <h3>Help & Support</h3>
              <p>
                Need help with PassPorta? Send a request to the support team.
              </p>
              <div className="dashboard-card-action">
                <Link className="btn btn-primary" href="/assistance">
                  Get Support →
                </Link>
              </div>
            </article>
          </div>

          <article className="card dashboard-roadmap">
            <h3>Your Agent Roadmap</h3>
            <p>
              Learn official procedures → Prepare applicants responsibly →
              Organize enquiries and follow-ups → Build your service.
            </p>
            <p className="dashboard-disclaimer">
              PassPorta is an independent guidance platform, not the Nigerian
              Immigration Service. Training does not guarantee employment,
              income or passport approval.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}