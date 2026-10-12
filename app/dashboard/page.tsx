
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Home,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MenuItem = {
  title: string;
  description: string;
  href: string;
  icon: typeof LayoutDashboard;
  paid?: boolean;
  adminOnly?: boolean;
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    description: "Your account overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Passport Agent Training",
    description: "Lessons, exercises and learning progress",
    href: "/course",
    icon: GraduationCap,
    paid: true,
  },
  {
    title: "Find Clients",
    description: "Explore customer enquiries and opportunities",
    href: "/course",
    icon: Users,
    paid: true,
  },
  {
    title: "My Calendar",
    description: "Appointments, tasks and reminders",
    href: "/course",
    icon: CalendarDays,
    paid: true,
  },
  {
    title: "Agent Workspace",
    description: "Organize client work and follow-ups",
    href: "/course",
    icon: BriefcaseBusiness,
    paid: true,
  },
  {
    title: "Client Checklists & Templates",
    description: "Practical tools for helping applicants",
    href: "/course",
    icon: ClipboardCheck,
    paid: true,
  },
  {
    title: "My Progress",
    description: "Track your training journey",
    href: "/course",
    icon: ChartNoAxesCombined,
    paid: true,
  },
  {
    title: "Help & Support",
    description: "Get assistance from PassPorta",
    href: "/assistance",
    icon: CircleHelp,
  },
  {
    title: "Admin",
    description: "Administrative tools",
    href: "/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("there");
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      if (!user.email_confirmed_at) {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      if (!active) return;

      setName(
        String(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "there"
        )
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.onboarding_completed) {
        router.replace("/onboarding");
        return;
      }

      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!active) return;

      setIsAdmin(Boolean(role));
      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  if (loading) {
    return (
      <main className="form-wrap">
        <div className="form-card">Loading your dashboard…</div>
      </main>
    );
  }

  const visibleItems = menuItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <main className="dashboard">
      <header className="dash-head">
        <div className="container nav dashboard-nav">
          <Link className="brand" href="/">
            <span className="logo">P</span>
            PassPorta
          </Link>

          <div className="desktop-actions">
            <Link className="btn btn-outline" href="/">
              Home
            </Link>
            <button className="btn btn-outline" onClick={logout}>
              Log out
            </button>
          </div>

          <button
            type="button"
            className="dashboard-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="agent-menu-backdrop" onClick={closeMenu}>
          <aside
            className="agent-menu"
            aria-label="Agent navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="agent-menu-heading">
              <div>
                <strong>My PassPorta</strong>
                <p>Agent workspace</p>
              </div>

              <button
                type="button"
                className="agent-menu-close"
                onClick={closeMenu}
                aria-label="Close navigation menu"
              >
                <X size={23} />
              </button>
            </div>

            <nav className="agent-menu-links">
              {visibleItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="agent-menu-link"
                    onClick={closeMenu}
                  >
                    <Icon size={21} className="agent-menu-icon" />

                    <span className="agent-menu-copy">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>

                    {item.paid && (
                      <LockKeyhole
                        size={17}
                        className="agent-menu-lock"
                        aria-label="Activation required"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="agent-menu-footer">
              <Link
                href="/course"
                className="btn btn-primary full"
                onClick={closeMenu}
              >
                Unlock Agent Features
              </Link>

              <Link
                href="/"
                className="agent-menu-home"
                onClick={closeMenu}
              >
                <Home size={17} />
                Home
              </Link>

              <button
                type="button"
                className="agent-menu-logout"
                onClick={logout}
              >
                <LogOut size={17} />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="container dash-layout">
        <aside className="sidebar desktop-only">
          <strong className="sidebar-title">Agent Workspace</strong>

          {visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={
                  item.title === "Dashboard" ? "active" : "sidebar-link"
                }
              >
                <Icon size={18} />
                <span>{item.title}</span>
                {item.paid && <LockKeyhole size={14} />}
              </Link>
            );
          })}
        </aside>

        <section className="dash-main">
          <div className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">YOUR AGENT JOURNEY</p>
              <h1>Welcome back, {name.split(" ")[0]}</h1>
              <p>
                Learn the process, prepare to help applicants, and organize
                your work responsibly.
              </p>
            </div>
          </div>

          <div className="dash-grid">
            <article className="card">
              <div className="card-icon">📚</div>
              <h3>Passport Agent Training</h3>
              <p>
                Explore the training programme, practical checklists and
                resources planned for your learning journey.
              </p>
              <div className="dashboard-card-action">
                <Link className="btn btn-blue" href="/course">
                  View Training →
                </Link>
              </div>
            </article>

            <article className="card">
              <div className="card-icon">💬</div>
              <h3>Help & Support</h3>
              <p>
                Need help with PassPorta? Send a request to the support team.
              </p>
              <div className="dashboard-card-action">
                <Link className="btn btn-primary" href="/assistance">
                  Get Support →
                </Link>
              </div>
            </article>
          </div>

          <article className="card dashboard-roadmap">
            <h3>Your Agent Roadmap</h3>
            <p>
              Learn official procedures → Prepare applicants responsibly →
              Organize enquiries and follow-ups → Build your service.
            </p>
            <p className="dashboard-disclaimer">
              PassPorta is an independent guidance platform, not the Nigerian
              Immigration Service. Training does not guarantee employment,
              income or passport approval.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
