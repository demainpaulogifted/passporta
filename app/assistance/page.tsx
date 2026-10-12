"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Assistance() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    request_type: "Application guidance",
    message: "",
  });

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
        router.replace("/login");
        return;
      }
      setForm((f) => ({
        ...f,
        full_name: String(user.user_metadata?.full_name || ""),
        email: user.email || "",
      }));
      setLoading(false);
    })();
  }, [router]);

  function change(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess(false);
    const s = createClient();
    const {
      data: { user },
    } = await s.auth.getUser();
    if (!user) {
      setError("Please sign in again.");
      setBusy(false);
      return;
    }
    const { error } = await s.from("assistance_requests").insert({
      user_id: user.id,
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      request_type: form.request_type,
      message: form.message.trim(),
    });
    setBusy(false);
    if (error) {
      setError(
        "We couldn't save this request. Please retry. If this continues, the database setup may not have been applied."
      );
      return;
    }
    setSuccess(true);
    setForm((f) => ({ ...f, phone: "", message: "" }));
  }

  if (loading)
    return (
      <main className="form-wrap">
        <div className="form-card">Loading…</div>
      </main>
    );

  return (
    <main className="form-wrap">
      <section className="form-card" style={{ width: "min(600px,100%)" }}>
        <Link className="brand" href="/dashboard">
          <span className="logo">P</span>PassPorta
        </Link>
        <h1>Request assistance</h1>
        <p className="muted">
          Tell us what guidance you need. Our team can review your request and
          contact you. Please do not include passport numbers, passwords, or
          sensitive documents here.
        </p>
        {error && <div className="message error">{error}</div>}
        {success && (
          <div className="message success">
            Your request has been submitted. You can return to your dashboard.
          </div>
        )}
        <form onSubmit={submit}>
          <div className="field">
            <label>Full name</label>
            <input
              name="full_name"
              required
              value={form.full_name}
              onChange={change}
            />
          </div>
          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={change}
            />
          </div>
          <div className="field">
            <label>Phone / WhatsApp number</label>
            <input
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={change}
              placeholder="+234…"
            />
          </div>
          <div className="field">
            <label>What do you need help with?</label>
            <select
              name="request_type"
              value={form.request_type}
              onChange={change}
            >
              <option>Application guidance</option>
              <option>Document requirements</option>
              <option>Appointment information</option>
              <option>Application status guidance</option>
              <option>General question</option>
            </select>
          </div>
          <div className="field">
            <label>Message</label>
            <textarea
              name="message"
              rows={4}
              required
              maxLength={2000}
              value={form.message}
              onChange={change}
              placeholder="Briefly describe the guidance you need…"
            />
          </div>
          <button className="btn btn-primary full" disabled={busy}>
            {busy ? "Submitting…" : "Submit request →"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 20 }}>
          <Link className="small-link" href="/dashboard">
            ← Back to dashboard
          </Link>
        </p>
      </section>
    </main>
  );
}