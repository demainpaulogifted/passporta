"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Onboarding() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [mode, setMode] = useState("learn");
  const [error, setError] = useState("");
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
      setName(String(user.user_metadata?.full_name || ""));
      setLoading(false);
    })();
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const s = createClient();
    const {
      data: { user },
    } = await s.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const { error } = await s.from("profiles").upsert(
      {
        id: user.id,
        full_name: name.trim(),
        preferred_mode: mode,
        onboarding_completed: true,
      },
      { onConflict: "id" }
    );
    if (error) {
      setError(
        "Could not save onboarding. Apply the Supabase SQL setup in supabase/schema.sql, then try again."
      );
      return;
    }
    router.push("/dashboard");
  }

  if (loading)
    return (
      <main className="form-wrap">
        <div className="form-card">Loading your account…</div>
      </main>
    );

  return (
    <main className="form-wrap">
      <section className="form-card">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>
          Welcome to PassPorta{name ? `, ${name.split(" ")[0]}` : ""}!
        </h1>
        <p className="muted">
          Choose how you’d like to begin. You can change direction later.
        </p>
        {error && <div className="message error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <label
            className="card"
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 12,
              cursor: "pointer",
              borderColor: mode === "learn" ? "var(--blue)" : undefined,
            }}
          >
            <input
              type="radio"
              name="mode"
              checked={mode === "learn"}
              onChange={() => setMode("learn")}
            />
            <span>
              <strong>Learn the process</strong>
              <div className="muted">
                Explore structured passport guidance and course resources.
              </div>
            </span>
          </label>
          <label
            className="card"
            style={{
              display: "flex",
              gap: 12,
              cursor: "pointer",
              borderColor: mode === "assist" ? "var(--green)" : undefined,
            }}
          >
            <input
              type="radio"
              name="mode"
              checked={mode === "assist"}
              onChange={() => setMode("assist")}
            />
            <span>
              <strong>Request assistance</strong>
              <div className="muted">
                Tell us what help you need and request a follow-up.
              </div>
            </span>
          </label>
          <button className="btn btn-primary full" style={{ marginTop: 20 }}>
            Continue →
          </button>
        </form>
      </section>
    </main>
  );
}