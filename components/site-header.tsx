
"use client";

import { useEffect, useState } from "react";
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
    free: true,
  },
  {
    title: "Passport Agent Training",
    description: "Explore lessons and course access",
    href: "/course",
    icon: GraduationCap,
    free: false,
  },
  {
    title: "Find Clients",
    description: "Explore client opportunities",
    href: "/course",
    icon: Users,
    free: false,
  },
  {
    title: "My Calendar",
    description: "Appointments and reminders",
    href: "/course",
    icon: CalendarDays,
    free: false,
  },
  {
    title: "Agent Workspace",
    description: "Organize client work and follow-ups",
    href: "/course",
    icon: BriefcaseBusiness,
    free: false,
  },
  {
    title: "Client Checklists & Templates",
    description: "Practical guidance tools",
    href: "/course",
    icon: ClipboardCheck,
    free: false,
  },
  {
    title: "My Progress",
    description: "Track your learning progress",
    href: "/course",
    icon: ChartNoAxesCombined,
    free: false,
  },
  {
    title: "Help & Support",
    description: "Get help from PassPorta",
    href: "/assistance",
    icon: CircleHelp,
    free: true,
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (active) {
        setSignedIn(Boolean(data.session));
      }
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setSignedIn(Boolean(session));
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
                    ? "Your learning and agent workspace"
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

            <div className="site-menu-links">
              {links
                .filter((item) => signedIn || item.free)
                .map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="site-menu-link"
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="site-menu-icon" size={21} />

                      <span className="site-menu-copy">
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>

                      {item.free ? null : (
                        <LockKeyhole
                          className="site-menu-lock"
                          size={16}
                          aria-label="Training access may be required"
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
