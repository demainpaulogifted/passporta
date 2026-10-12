"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    const verified = !!data.user.email_confirmed_at;
    if (!verified) {
      await supabase.auth.signOut();
      setError(
        "Please verify your email before signing in. Check your inbox for the confirmation message."
      );
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <main className="form-wrap">
      <section className="form-card">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to continue your journey.</p>
        {error && <div className="message error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Link className="small-link" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <button
            className="btn btn-primary full"
            style={{ marginTop: 20 }}
            disabled={busy}
          >
            {busy ? "Signing in…" : "Log in →"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 22 }}>
          New to PassPorta?{" "}
          <Link className="small-link" href="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}