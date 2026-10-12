"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function verifyEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Your email address is missing. Please sign up again.");
      return;
    }

    if (!code.trim()) {
      setMessage("Enter the verification code from your email.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: "signup",
      });

      if (error) {
        setMessage(
          "That code could not be verified. Check it and try again."
        );
        return;
      }

      router.replace("/onboarding");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setMessage("");

    if (!email) {
      setMessage("Your email address is missing. Please sign up again.");
      return;
    }

    setResending(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        setMessage("We could not send a new code. Please try again shortly.");
        return;
      }

      setMessage("A new verification code has been sent to your email.");
    } catch {
      setMessage("Unable to resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="form-wrap">
      <section className="form-card">
        <Link href="/" className="brand">
          <span className="brand-mark">P</span>
          <span>PassPorta</span>
        </Link>

        <h1>Verify your email</h1>

        <p className="form-description">
          We sent a verification code to{" "}
          <strong>{email || "your email address"}</strong>.
          Enter the code below to secure your account and continue.
        </p>

        <form onSubmit={verifyEmail} className="form">
          <label htmlFor="verification-code">
            Verification code
          </label>

          <input
            id="verification-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter your email code"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\s/g, ""))
            }
            maxLength={12}
            required
          />

          {message && (
            <p role="status" aria-live="polite" className="form-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="button button-primary"
            disabled={loading || !email}
          >
            {loading ? "Verifying..." : "Verify email →"}
          </button>
        </form>

        <button
          type="button"
          className="button button-secondary"
          onClick={resendCode}
          disabled={resending || !email}
        >
          {resending ? "Sending..." : "Resend code"}
        </button>

        <p className="form-footer">
          Wrong email? <Link href="/signup">Sign up again</Link>
        </p>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="form-wrap">
          <section className="form-card">
            <p>Loading PassPorta verification...</p>
          </section>
        </main>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}