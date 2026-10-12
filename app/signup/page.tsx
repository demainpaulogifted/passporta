"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/onboarding");
      return;
    }
    router.push(
      `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`
    );
  }

  return (
    <main className="form-wrap">
      <section className="form-card">
        <Link className="brand" href="/">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>Create your account</h1>
        <p className="muted">
          Start your passport journey with a secure personal account.
        </p>
        {error && <div className="message error">{error}</div>}
        {ok ? (
          <>
            <div className="message success">
              Check your email for the confirmation code or link. Verify your
              email before continuing.
            </div>
            <p className="muted">
              After verification, sign in to continue onboarding.
            </p>
            <Link className="btn btn-primary full" href="/login">
              Go to login
            </Link>
          </>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            <button className="btn btn-primary full" disabled={busy}>
              {busy ? "Creating account…" : "Create account →"}
            </button>
          </form>
        )}
        <p className="muted" style={{ marginTop: 22 }}>
          Already have an account?{" "}
          <Link className="small-link" href="/login">
            Log in
          </Link>
        </p>
        <p className="muted" style={{ fontSize: 12 }}>
          By continuing, you agree to use PassPorta as an independent guidance
          platform.
        </p>
      </section>
    </main>
  );
}