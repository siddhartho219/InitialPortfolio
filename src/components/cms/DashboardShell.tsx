"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  UserRoundCog,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/cms/AuthProvider";
import { useUnreadMessageCount } from "@/components/cms/MessagesPage";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/messages", label: "Messages", icon: Mail },
  { href: "/dashboard/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/dashboard/blogs", label: "Blog", icon: Newspaper },
  { href: "/dashboard/skills", label: "Skills", icon: Code2 },
  { href: "/dashboard/experience", label: "Experience", icon: UserRoundCog },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const unreadMessages = useUnreadMessageCount();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
        <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-sidebar px-4 py-5 transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <Link href="/dashboard" className="text-lg font-semibold">
              Portfolio CMS
            </Link>
            <button
              aria-label="Close menu"
              className="rounded-md border border-border p-2 text-muted-foreground lg:hidden"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition hover:bg-sidebar-accent",
                    active && "bg-sidebar-accent text-white",
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.href === "/dashboard/messages" && unreadMessages > 0 ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {unreadMessages}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-5 left-4 right-4 space-y-3">
            <div className="truncate rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
              {user.email}
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              onClick={logout}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {open && (
          <button
            aria-label="Close menu backdrop"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
            type="button"
          />
        )}

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
            <button
              aria-label="Open menu"
              className="rounded-md border border-border p-2 lg:hidden"
              onClick={() => setOpen(true)}
              type="button"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Firebase
              </p>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 lg:px-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
