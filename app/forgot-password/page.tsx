"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    const s = createClient();
    const { error } = await s.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      }
    );
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMsg(
      "If this email belongs to an account, a password-reset message will be sent. Check your inbox and spam folder."
    );
  }

  return (
    <main className="form-wrap">
      <section className="form-card">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>Reset your password</h1>
        <p className="muted">
          Enter your account email and we’ll send a secure recovery link.
        </p>
        {error && <div className="message error">{error}</div>}
        {msg && <div className="message success">{msg}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button className="btn btn-primary full" disabled={busy}>
            {busy ? "Sending…" : "Send reset email"}
          </button>
        </form>
        <p style={{ marginTop: 20 }}>
          <Link className="small-link" href="/login">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}