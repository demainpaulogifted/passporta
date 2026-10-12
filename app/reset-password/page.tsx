"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    if (pw.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (pw !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const s = createClient();
    const { error } = await s.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMsg("Password updated. You can now sign in with your new password.");
    setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <main className="form-wrap">
      <section className="form-card">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>Choose a new password</h1>
        <p className="muted">
          Open this page from the password-reset email first.
        </p>
        {error && <div className="message error">{error}</div>}
        {msg && <div className="message success">{msg}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>New password</label>
            <input
              type="password"
              minLength={8}
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input
              type="password"
              minLength={8}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary full" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}