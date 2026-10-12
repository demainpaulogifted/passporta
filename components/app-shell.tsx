
"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Keep the public landing page's existing navigation unchanged.
  const isLandingPage = pathname === "/";

  return (
    <>
      {!isLandingPage && <SiteHeader />}
      <div className={isLandingPage ? "" : "site-content"}>
        {children}
      </div>
    </>
  );
}
