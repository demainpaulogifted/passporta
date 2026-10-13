
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarDays,
  BriefcaseBusiness,
  ClipboardCheck,
  ChartNoAxesCombined,
  CircleHelp,
  LockKeyhole,
  LogOut,
  Home,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  {
    title: "Dashboard",
    description: "Your account overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresAccess: false,
  },
  {
    title: "Passport Agent Training",
    description: "Explore lessons and course access",
    href: "/course",
    icon: GraduationCap,
    requiresAccess: true,
  },
  {
    title: "Find Clients",
    description: "Explore client opportunities",
    href: "/course",
    icon: Users,
    requiresAccess: true,
  },
  {
    title: "My Calendar",
    description: "Appointments and reminders",
    href: "/course",
    icon: CalendarDays,
    requiresAccess: true,
  },
  {
    title: "Agent Workspace",
    description: "Organize client work and follow-ups",
    href: "/course",
    icon: BriefcaseBusiness,
    requiresAccess: true,
  },
  {
    title: "Client Checklists & Templates",
    description: "Practical guidance tools",
    href: "/course",
    icon: ClipboardCheck,
    requiresAccess: true,
  },
  {
    title: "My Progress",
    description: "Track your learning progress",
    href: "/course",
    icon: ChartNoAxesCombined,
    requiresAccess: true,
  },
  {
    title: "Help & Support",
    description: "Get help from PassPorta",
    href: "/assistance",
    icon: CircleHelp,
    requiresAccess: false,
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const refreshAccess = useCallback(async () => {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setSignedIn(false);
      setHasAccess(false);
      setAccessChecked(true);
      return;
    }

    setSignedIn(true);

    const { data, error } = await supabase
      .from("course_access")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      // Fail closed: don't claim paid access when it cannot be checked.
      setHasAccess(false);
      setAccessChecked(true);
      return;
    }

    setHasAccess(Boolean(data));
    setAccessChecked(true);
  }, []);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function checkInitialSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setSignedIn(false);
        setHasAccess(false);
        setAccessChecked(true);
        return;
      }

      setSignedIn(true);

      const { data, error } = await supabase
        .from("course_access")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      setHasAccess(!error && Boolean(data));
      setAccessChecked(true);
    }

    void checkInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Defer database access until after the auth callback completes.
      window.setTimeout(() => {
        if (active) void refreshAccess();
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [refreshAccess]);

  useEffect(() => {
    setOpen(false);

    // Refresh entitlement when navigating between pages.
    void refreshAccess();
  }, [pathname, refreshAccess]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();

      setSignedIn(false);
      setHasAccess(false);
      setAccessChecked(true);
      setOpen(false);

      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href={signedIn ? "/dashboard" : "/login"}
          className="site-header-brand brand"
          aria-label="PassPorta account"
        >
          <span className="logo" aria-hidden="true">
            P
          </span>
          <span>PassPorta</span>
        </Link>

        <button
          type="button"
          className="site-header-toggle"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="passporta-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {open && (
        <div
          className="site-menu-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <nav
            id="passporta-navigation"
            className="site-menu-panel"
            aria-label="Main navigation"
          >
            <div className="site-menu-heading">
              <div>
                <strong>PassPorta Menu</strong>
                <p>
                  {signedIn
                    ? hasAccess
                      ? "Your lifetime learning access"
                      : "Your learning and agent workspace"
                    : "Passport guidance and training"}
                </p>
              </div>

              <button
                type="button"
                className="site-menu-close"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            {signedIn && accessChecked && hasAccess && (
              <div
                role="status"
                style={{
                  margin: "12px 0",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "#eef9f4",
                  border: "1px solid #c8ecdc",
                  color: "#145b42",
                  fontWeight: 600,
                }}
              >
                Lifetime Access Active
              </div>
            )}

            <div className="site-menu-links">
              {links
                .filter((item) => signedIn || !item.requiresAccess)
                .map((item) => {
                  const Icon = item.icon;
                  const locked =
                    item.requiresAccess && (!accessChecked || !hasAccess);

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="site-menu-link"
                      onClick={() => setOpen(false)}
                      aria-label={
                        locked
                          ? `${item.title} — course access required`
                          : item.title
                      }
                    >
                      <Icon className="site-menu-icon" size={21} />

                      <span className="site-menu-copy">
                        <strong>{item.title}</strong>
                        <small>
                          {locked
                            ? item.description
                            : item.requiresAccess && hasAccess
                              ? item.title === "Passport Agent Training"
                                ? "Your included training materials"
                                : item.description
                              : item.description}
                        </small>
                      </span>

                      {locked && (
                        <LockKeyhole
                          className="site-menu-lock"
                          size={16}
                          aria-label="Course access required"
                        />
                      )}
                    </Link>
                  );
                })}
            </div>

            <div className="site-menu-footer">
              <Link
                href="/"
                className="site-menu-account"
                onClick={() => setOpen(false)}
              >
                <Home size={17} /> Visit public homepage
              </Link>

              {signedIn ? (
                <button
                  type="button"
                  className="logout-btn"
                  disabled={signingOut}
                  onClick={handleSignOut}
                >
                  <LogOut size={17} />
                  {signingOut ? "Signing out..." : "Sign out"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-primary site-menu-activate"
                  onClick={() => setOpen(false)}
                >
                  Sign in to your account
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
