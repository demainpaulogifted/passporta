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
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  {
    title: "Dashboard",
    description: "Your account overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Passport Agent Training",
    description: "Your training materials",
    href: "/course",
    icon: GraduationCap,
  },
  {
    title: "Find Clients",
    description: "Explore client opportunities",
    href: "/course",
    icon: Users,
  },
  {
    title: "My Calendar",
    description: "Appointments and reminders",
    href: "/course",
    icon: CalendarDays,
  },
  {
    title: "Agent Workspace",
    description: "Organize client work",
    href: "/course",
    icon: BriefcaseBusiness,
  },
  {
    title: "Client Checklists",
    description: "Practical guidance tools",
    href: "/course",
    icon: ClipboardCheck,
  },
  {
    title: "My Progress",
    description: "Track your learning",
    href: "/course",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Help & Support",
    description: "Get help from PassPorta",
    href: "/assistance",
    icon: CircleHelp,
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
      if (active) setSignedIn(Boolean(data.session));
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSignedIn(Boolean(session));
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
          href={signedIn ? "/dashboard" : "/"}
          className="site-header-brand brand"
        >
          <span className="logo">P</span>
          <span>PassPorta</span>
        </Link>

        <button
          type="button"
          className="site-header-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="site-menu-overlay"
          onClick={() => setOpen(false)}
        >
          <nav
            className="site-menu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="site-menu-heading">
              <div>
                <strong>PassPorta Menu</strong>
                <p>Your agent workspace</p>
              </div>
              <button
                type="button"
                className="site-menu-close"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="site-menu-links">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="site-menu-link"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="site-menu-icon" size={18} />
                    <span className="site-menu-copy">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="site-menu-footer">
              {signedIn && (
                <button
                  type="button"
                  className="logout-btn"
                  disabled={signingOut}
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  {signingOut ? "Signing out..." : "Sign out"}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}