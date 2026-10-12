"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setEmail(new URLSearchParams(window.location.search).get("email") || "");
  }, []);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const s = createClient();
    const { error } = await s.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "signup",
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice("Email verified successfully.");
    router.push("/onboarding");
    router.refresh();
  }

  async function resend() {
    setError("");
    setNotice("");
    const s = createClient();
    const { error } = await s.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
    if (error) setError(error.message);
    else setNotice("A new verification email has been requested.");
  }

  return (
    <main className="form-wrap">
      <section className="form-card">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>Verify your email</h1>
        <p className="muted">
          Enter the one-time code sent to <strong>{email || "your email"}</strong>.
          Configure the Supabase Confirm signup email template to display the
          token code.
        </p>
        {error && <div className="message error">{error}</div>}
        {notice && <div className="message success">{notice}</div>}
        <form onSubmit={verify}>
          <div className="field">
            <label>Verification code</label>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter email code"
            />
          </div>
          <button
            className="btn btn-primary full"
            disabled={busy || !email}
          >
            {busy ? "Verifying…" : "Verify email →"}
          </button>
        </form>
        <button
          className="btn btn-outline full"
          style={{ marginTop: 12 }}
          onClick={resend}
          disabled={!email}
        >
          Resend code
        </button>
        <p className="muted" style={{ marginTop: 18 }}>
          Wrong email?{" "}
          <Link className="small-link" href="/signup">
            Sign up again
          </Link>
        </p>
      </section>
    </main>
  );
}