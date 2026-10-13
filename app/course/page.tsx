"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { course } from "@/lib/course-data";
import { createClient } from "@/lib/supabase/client";

function CourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check whether the signed-in user already has course access.
  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data, error: accessError } = await supabase
          .from("course_access")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (accessError) {
          throw accessError;
        }

        if (!cancelled) {
          setHasAccess(Boolean(data));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to check your course access. Please refresh and try again.");
          setLoading(false);
        }
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Verify a Paystack payment when the customer returns to this page.
  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (!reference || hasAccess) return;

    let cancelled = false;

    async function verifyPayment() {
      setVerifying(true);
      setError("");
      setMessage("Verifying your payment...");

      try {
        const res = await fetch("/api/course/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not verify payment.");
        }

        if (!cancelled) {
          setHasAccess(true);
          setMessage("Payment successful! Your lifetime access is now active.");
          router.replace("/course");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Verification failed. Please try again or contact support."
          );
        }
      } finally {
        if (!cancelled) {
          setVerifying(false);
        }
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams, hasAccess, router]);

  async function startPayment() {
    setPaying(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/course/initialize", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not start payment.");
      }

      if (data.alreadyEnrolled) {
        setHasAccess(true);
        setMessage("Your lifetime access is already active.");
        return;
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      throw new Error("Unexpected response from payment server.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again."
      );
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <main className="form-wrap">
        <div className="form-card">Checking your access…</div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div
        className="container"
        style={{ paddingTop: 28, paddingBottom: 60 }}
      >
        <div style={{ marginBottom: 28 }}>
          <p className="dashboard-eyebrow">PASSPORT AGENT TRAINING</p>

          <h1 style={{ fontSize: 26, marginBottom: 8, lineHeight: 1.25 }}>
            {course.title}
          </h1>

          <p
            style={{
              color: "var(--muted)",
              maxWidth: 520,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {course.subtitle}
          </p>
        </div>

        {/* Access and payment card */}
        <div
          className="card"
          style={{
            marginBottom: 28,
            background: hasAccess
              ? "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)"
              : "linear-gradient(135deg, #f0fdf6 0%, #eef6ff 100%)",
            border: hasAccess
              ? "1px solid #86efac"
              : "1px solid #c6e9d8",
          }}
        >
          {hasAccess ? (
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--green)",
                  marginBottom: 6,
                }}
              >
                LIFETIME ACCESS ACTIVE
              </div>

              <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>
                You have full access to the course
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "var(--muted)",
                  fontSize: 14,
                }}
              >
                All 6 lessons and the complete toolkit are unlocked for you.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--green)",
                    marginBottom: 4,
                  }}
                >
                  FULL ACCESS
                </div>

                <h3 style={{ margin: "0 0 4px", fontSize: 20 }}>
                  ₦{course.price.toLocaleString()} — One-time
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: 14,
                  }}
                >
                  Lifetime access to all 6 lessons + complete toolkit
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={startPayment}
                disabled={paying || verifying}
              >
                {paying
                  ? "Starting payment..."
                  : verifying
                    ? "Verifying..."
                    : `Pay ₦${course.price.toLocaleString()} →`}
              </button>
            </div>
          )}

          {message && (
            <p
              style={{
                margin: "14px 0 0",
                color: "var(--green)",
                fontSize: 14,
              }}
            >
              {message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              style={{
                margin: "14px 0 0",
                color: "#c0392b",
                fontSize: 14,
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Course curriculum */}
        <h2
          style={{
            fontSize: 18,
            marginBottom: 14,
            color: "var(--navy)",
          }}
        >
          Course Curriculum
        </h2>

        <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
          {course.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={hasAccess ? `/course/${lesson.id}` : "#"}
              onClick={(event) => {
                if (!hasAccess) {
                  event.preventDefault();
                  setError("Please unlock the course first to access lessons.");
                }
              }}
              className="card"
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "16px 18px",
                textDecoration: "none",
                opacity: hasAccess ? 1 : 0.7,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "var(--navy)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {String(lesson.id).padStart(2, "0")}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 3,
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                    {lesson.title}
                  </h3>

                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {hasAccess ? lesson.duration : "Locked"}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: 13.5,
                    lineHeight: 1.45,
                  }}
                >
                  {lesson.goal}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Course inclusions */}
        <div className="card" style={{ marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
            What is included
          </h3>

          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: "var(--muted)",
              lineHeight: 1.75,
              fontSize: 14,
            }}
          >
            <li>6 practical lessons with full scripts</li>
            <li>Quizzes and action tasks for every lesson</li>
            <li>Complete document checklists</li>
            <li>Client intake form & service agreement</li>
            <li>WhatsApp message templates</li>
            <li>Pricing worksheet</li>
            <li>Final assessment + completion certificate</li>
          </ul>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          PassPorta is an independent training platform and is not affiliated
          with the Nigeria Immigration Service. Official fees and decisions
          remain under the control of the relevant authorities.
        </p>
      </div>
    </main>
  );
}

export default function CoursePage() {
  return (
    <Suspense
      fallback={
        <main className="form-wrap">
          <div className="form-card">Loading course…</div>
        </main>
      }
    >
      <CourseContent />
    </Suspense>
  );
}