import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  GraduationCap,
  LayoutDashboard,
  Map,
  Menu,
  Sparkles,
  CalendarCheck,
  Users,
  UserCog,
  Briefcase,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/careers", label: "Careers", icon: Briefcase },
  { to: "/future-map", label: "My Future Map", icon: Map },
  { to: "/education", label: "Education Explorer", icon: GraduationCap },
  { to: "/ai-tools", label: "AI Tools", icon: Sparkles },
  { to: "/planner", label: "My Planner", icon: CalendarCheck },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile & Settings", icon: UserCog },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <div className="grid size-10 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Compass className="size-5" />
      </div>
      <div>
        <p className="font-display text-lg leading-tight font-bold text-sidebar-foreground">FuturePath</p>
        <p className="text-xs text-sidebar-foreground/70">South Africa</p>
      </div>
    </div>
  );
}

function SidebarFooterCard() {
  const { state } = useStore();
  const initials = state.profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="mt-auto rounded-2xl bg-sidebar-accent p-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
            {initials || "FP"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
            {state.profile.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {state.profile.grade} · {state.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { state } = useStore();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col gap-4 bg-sidebar p-4 lg:flex">
        <Brand />
        <NavLinks />
        <SidebarFooterCard />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-4">
                <Brand />
                <NavLinks onNavigate={() => setOpen(false)} />
                <SidebarFooterCard />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Compass className="size-5 text-primary" />
            <span className="font-display font-bold">FuturePath SA</span>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {state.role}
          </Badge>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
