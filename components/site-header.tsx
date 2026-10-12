
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarDays,
  BriefcaseBusiness,
  ClipboardCheck,
  ChartNoAxesCombined,
  CircleHelp,
  LockKeyhole,
} from "lucide-react";

const links = [
  {
    title: "Home",
    description: "PassPorta homepage",
    href: "/",
    icon: Home,
    free: true,
  },
  {
    title: "Dashboard",
    description: "Your account overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    free: true,
  },
  {
    title: "Passport Agent Training",
    description: "Lessons and learning resources",
    href: "/course",
    icon: GraduationCap,
    free: false,
  },
  {
    title: "Find Clients",
    description: "Customer enquiries and opportunities",
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
    description: "Practical application guidance tools",
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
    description: "Contact PassPorta support",
    href: "/assistance",
    icon: CircleHelp,
    free: true,
  },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link
            href="/"
            className="brand site-header-brand"
            onClick={closeMenu}
            aria-label="PassPorta home"
          >
            <span className="logo">P</span>
            <span>PassPorta</span>
          </Link>

          <button
            type="button"
            className="site-header-toggle"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="site-navigation"
          >
            {open ? <X size={27} /> : <Menu size={30} />}
          </button>
        </div>
      </header>

      {open && (
        <div
          className="site-menu-overlay"
          onClick={closeMenu}
        >
          <aside
            id="site-navigation"
            className="site-menu-panel"
            aria-label="Main navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="site-menu-heading">
              <div>
                <strong>My PassPorta</strong>
                <p>Your passport journey</p>
              </div>

              <button
                type="button"
                className="site-menu-close"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={23} />
              </button>
            </div>

            <nav className="site-menu-links">
              {links.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="site-menu-link"
                    onClick={closeMenu}
                  >
                    <Icon size={21} className="site-menu-icon" />

                    <span className="site-menu-copy">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>

                    {!item.free && (
                      <LockKeyhole
                        size={17}
                        className="site-menu-lock"
                        aria-label="Activation required"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="site-menu-footer">
              <Link
                href="/course"
                className="btn btn-primary site-menu-activate"
                onClick={closeMenu}
              >
                View Activation & Training
              </Link>

              <Link
                href="/login"
                className="site-menu-account"
                onClick={closeMenu}
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="site-menu-account"
                onClick={closeMenu}
              >
                Create an account
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
