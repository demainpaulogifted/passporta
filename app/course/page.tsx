
"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const lessons = [
  {
    id: "lesson-1",
    title: "1. Understanding the Nigerian passport process",
    content:
      "Learn the difference between independent guidance and official passport processing. Understand the applicant's role, the role of the Nigerian Immigration Service (NIS), and the importance of directing applicants to official sources. Never claim to be an NIS officer or promise approval.",
  },
  {
    id: "lesson-2",
    title: "2. Finding and checking official requirements",
    content:
      "Start with https://immigration.gov.ng/passports/ and the official application portal at https://passport.immigration.gov.ng/. Check the current instructions for the applicant's specific application type. Requirements can change, so confirm details against official guidance before advising a client.",
  },
  {
    id: "lesson-3",
    title: "3. Helping clients prepare documents",
    content:
      "Prepare a written checklist based on current official requirements. Help clients check spelling, dates of birth, and consistency across documents. Do not alter documents, fabricate information, retain account passwords, or collect unnecessary sensitive information.",
  },
  {
    id: "lesson-4",
    title: "4. Supporting an application responsibly",
    content:
      "Explain the official application steps and help clients understand instructions while the applicant remains in control of their account and declarations. The applicant must review their details personally. Never impersonate an applicant or claim you can influence an official decision.",
  },
  {
    id: "lesson-5",
    title: "5. Client communication and service fees",
    content:
      "Agree on your service scope and fee in writing before starting. Separate your assistance fee from official government charges. Explain what is included, provide receipts, protect client information, and never guarantee a passport, appointment, approval date, or income.",
  },
  {
    id: "lesson-6",
    title: "6. Building a trustworthy service",
    content:
      "Use clear terms, secure records, written consent, and a reliable follow-up system. Do not advertise yourself as an immigration official unless legally authorized. Build trust through accurate information and transparent pricing, not promises of guaranteed earnings.",
  },
];

function CourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);

  const loadCourse = useCallback(async () => {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setSignedIn(false);
      setHasAccess(false);
      setCompleted([]);
      setLoading(false);
      return;
    }

    setSignedIn(true);

    const { data: access, error: accessError } = await supabase
      .from("course_access")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (accessError) {
      setMessage("Could not check course access. Please refresh the page.");
      setLoading(false);
      return;
    }

    const accessGranted = Boolean(access);
    setHasAccess(accessGranted);

    if (accessGranted) {
      const { data: progress, error: progressError } = await supabase
        .from("course_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (progressError) {
        setMessage("Course access is active, but progress could not be loaded.");
      } else {
        setCompleted((progress || []).map((row) => row.lesson_id));
      }
    } else {
      setCompleted([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference || !signedIn) return;

    let cancelled = false;

    async function verifyPayment() {
      setBusy(true);
      setMessage("Checking your payment securely…");

      try {
        const response = await fetch("/api/course/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok || !result.success) {
          setMessage(
            result.error ||
              "We could not verify this payment yet. Please try again."
          );
          return;
        }

        // Reload the entitlement from Supabase after server verification.
        await loadCourse();

        if (cancelled) return;

        setMessage("Payment verified. Your lifetime access is active!");

        // Remove the payment reference from the URL after verification.
        router.replace("/course");
      } catch {
        if (!cancelled) {
          setMessage("Verification failed temporarily. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams, signedIn, router, loadCourse]);

  async function startPayment() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/course/initialize", {
        method: "POST",
      });

      const result = await response.json();

      if (result.alreadyEnrolled) {
        await loadCourse();
        setMessage(result.message || "Your course access is already active.");
        return;
      }

      if (!response.ok || !result.authorizationUrl) {
        setMessage(result.error || "Could not start checkout.");
        return;
      }

      window.location.assign(result.authorizationUrl);
    } catch {
      setMessage("Unable to start payment. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleLesson(lessonId: string) {
    if (!hasAccess) {
      setMessage("Lifetime course access is required to save lesson progress.");
      return;
    }

    const supabase = createClient();
    const nextCompleted = !completed.includes(lessonId);

    setMessage("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setMessage("Please sign in to save your progress.");
      return;
    }

    const { error } = await supabase.from("course_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: nextCompleted,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

    if (error) {
      setMessage("Your progress could not be saved. Please try again.");
      return;
    }

    setCompleted((previous) =>
      nextCompleted
        ? [...previous.filter((id) => id !== lessonId), lessonId]
        : previous.filter((id) => id !== lessonId)
    );
  }

  if (loading) {
    return (
      <main className="form-wrap">
        <div className="form-card">Loading your course…</div>
      </main>
    );
  }

  return (
    <main
      className="form-wrap"
      style={{ alignItems: "flex-start", paddingTop: 40 }}
    >
      <div className="form-card" style={{ maxWidth: 720 }}>
        <Link
          className="brand"
          href="/dashboard"
          style={{ marginBottom: 24, display: "inline-flex" }}
        >
          <span className="logo">P</span>PassPorta
        </Link>

        <p className="muted">PASSPORT AGENT LEARNING PROGRAMME</p>

        <h1>Passport Agent Training</h1>

        <p className="muted">
          Learn to guide applicants responsibly, understand official
          requirements, prepare document checklists, and build a transparent
          client service.
        </p>

        {hasAccess ? (
          <div
            role="status"
            style={{
              background: "#eef9f4",
              border: "1px solid #c8ecdc",
              borderRadius: 14,
              padding: 18,
              margin: "24px 0",
              lineHeight: 1.7,
              color: "#145b42",
            }}
          >
            <strong>Lifetime Access Active</strong>
            <p style={{ margin: "6px 0 0" }}>
              Your payment has been verified. You have lifetime access to the
              training materials included with your purchase. You do not need
              to pay again.
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#eef9f4",
              border: "1px solid #c8ecdc",
              borderRadius: 14,
              padding: 18,
              margin: "24px 0",
              lineHeight: 1.7,
            }}
          >
            <strong>One-time fee: ₦5,000</strong>
            <p style={{ margin: "6px 0 0" }}>
              Pay once for lifetime access to the training materials included
              with this course. No annual renewal fee.
            </p>
          </div>
        )}

        {message && (
          <div className="message" role="status" aria-live="polite">
            {message}
          </div>
        )}

        {!hasAccess ? (
          <>
            <h2>What you will learn</h2>

            <ul style={{ color: "var(--muted)", lineHeight: 1.9 }}>
              <li>Understanding official passport procedures</li>
              <li>Checking current requirements and preparing documents</li>
              <li>Helping clients navigate applications responsibly</li>
              <li>Client communication, service scope, and transparent fees</li>
              <li>Building a trustworthy assistance service</li>
              <li>Protecting client information and avoiding common mistakes</li>
            </ul>

            {signedIn ? (
              <button
                className="btn btn-primary full"
                onClick={startPayment}
                disabled={busy}
                type="button"
              >
                {busy ? "Please wait…" : "Pay ₦5,000 for Lifetime Access"}
              </button>
            ) : (
              <Link className="btn btn-primary full" href="/login">
                Sign in to enrol
              </Link>
            )}
          </>
        ) : (
          <>
            <h2>Your training lessons</h2>

            <p className="muted">
              Completed {completed.length} of {lessons.length} lessons.
            </p>

            <div
              className="progress"
              role="progressbar"
              aria-label="Course progress"
              aria-valuemin={0}
              aria-valuemax={lessons.length}
              aria-valuenow={completed.length}
            >
              <span
                style={{
                  width: `${(completed.length / lessons.length) * 100}%`,
                }}
              />
            </div>

            {lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="card"
                style={{ margin: "16px 0" }}
              >
                <h3>{lesson.title}</h3>

                <p style={{ lineHeight: 1.8, color: "var(--muted)" }}>
                  {lesson.content}
                </p>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 16,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={completed.includes(lesson.id)}
                    onChange={() => void toggleLesson(lesson.id)}
                  />
                  Mark lesson complete
                </label>
              </article>
            ))}
          </>
        )}

        <p className="muted" style={{ marginTop: 24, fontSize: 12 }}>
          PassPorta is an independent guidance platform, not the Nigerian
          Immigration Service. Official requirements, charges, appointments,
          and passport decisions are determined by the relevant authorities.
          Training does not guarantee employment, income, or passport
          approval. Always check the official guidance at{" "}
          <a
            href="https://immigration.gov.ng/passports/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--blue)" }}
          >
            immigration.gov.ng
          </a>.
        </p>

        <Link
          className="btn btn-outline full"
          href="/dashboard"
          style={{ marginTop: 12 }}
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}

export default function CoursePage() {
  return (
    <Suspense
      fallback={
        <main className="form-wrap">
          <div className="form-card">Loading your course…</div>
        </main>
      }
    >
      <CourseContent />
    </Suspense>
  );
}
