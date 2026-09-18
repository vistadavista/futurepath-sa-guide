import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  Bookmark,
  CalendarDays,
  Compass,
  Sparkles,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader, ProgressRing } from "@/components/common";
import { progressMetrics, useStore } from "@/lib/store";
import { SCHOOL_EVENTS, ANNOUNCEMENTS } from "@/data/community";
import { CAREERS } from "@/data/careers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | FuturePath SA" },
      {
        name: "description",
        content:
          "Your FuturePath SA dashboard: interest discovery progress, priority tasks, upcoming school events and application deadlines.",
      },
      { property: "og:title", content: "FuturePath SA Dashboard" },
      {
        property: "og:description",
        content: "Track your career discovery, tasks and deadlines in one place.",
      },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const ROLE_BLURB: Record<string, string> = {
  Learner: "Here is what is waiting for you today.",
  Parent: "A view of how your learner is progressing.",
  Teacher: "A snapshot of your learner's discovery journey.",
  "School Admin": "School-wide view of learner engagement and deadlines.",
};

function Dashboard() {
  const { state, update } = useStore();
  const [greet, setGreet] = React.useState("Welcome back");
  React.useEffect(() => setGreet(greeting()), []);
  const metrics = progressMetrics(state);
  const today = new Date().toISOString().slice(0, 10);
  const priorityTasks = state.tasks
    .filter((t) => !t.done)
    .sort((a, b) => (a.priority === "High" ? -1 : 1) - (b.priority === "High" ? -1 : 1))
    .slice(0, 4);
  const upcoming = [...SCHOOL_EVENTS]
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const saved = CAREERS.filter((c) => state.savedCareers.includes(c.id));

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greet}, ${state.profile.name}!`}
        subtitle={`${ROLE_BLURB[state.role]} ${state.profile.grade} · ${state.profile.school}`}
        action={
          <Badge variant="secondary" className="h-8 px-3 text-sm">
            Viewing as {state.role}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <ProgressRing
              value={metrics.discovery}
              label="Interest Discovery"
              hint="Questionnaire & skills"
              tone="primary"
            />
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <ProgressRing
              value={metrics.exploration}
              label="Career Exploration"
              hint={`${state.savedCareers.length} careers saved`}
              tone="accent"
            />
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <ProgressRing
              value={metrics.planning}
              label="Future Planning"
              hint="Tasks & application steps"
              tone="info"
            />
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/discover", label: "Discover my interests", icon: Compass },
            { to: "/careers", label: "Explore careers", icon: Target },
            { to: "/ai-tools", label: "Ask the AI assistant", icon: Sparkles },
            { to: "/planner", label: "Plan my week", icon: CalendarDays },
          ].map((a) => (
            <Link key={a.to} to={a.to}>
              <Card className="card-hover h-full">
                <CardContent className="flex items-center gap-3 py-5">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <a.icon className="size-5" />
                  </div>
                  <span className="text-sm font-semibold">{a.label}</span>
                  <ArrowRight className="ml-auto size-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-primary" /> High priority tasks
            </CardTitle>
            <CardDescription>The things that matter most right now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorityTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing outstanding. Well done!</p>
            ) : (
              priorityTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 rounded-xl border p-3">
                  <Checkbox
                    checked={t.done}
                    onCheckedChange={() =>
                      update((p) => ({
                        ...p,
                        tasks: p.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                      }))
                    }
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.date} {t.time ? `· ${t.time}` : ""} · {t.category}
                    </p>
                  </div>
                  <Badge
                    variant={t.priority === "High" ? "destructive" : "secondary"}
                    className="ml-auto shrink-0"
                  >
                    {t.priority}
                  </Badge>
                </div>
              ))
            )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/planner">Open My Planner</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5 text-accent" /> Upcoming events & deadlines
            </CardTitle>
            <CardDescription>From your school and the institutions you follow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((e) => (
              <div key={e.id} className="flex items-start gap-3 rounded-xl border p-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent-foreground">
                  <span className="text-xs font-bold">{e.date.slice(8, 10)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.date} · {e.location}
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0">
                  {e.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="size-5 text-info" /> Careers you saved
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {saved.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No saved careers yet — explore the Career Explorer to start your shortlist.
              </p>
            ) : (
              saved.map((c) => (
                <Badge key={c.id} variant="secondary" className="px-3 py-1.5">
                  {c.title}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="size-5 text-warning" /> Latest announcement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{ANNOUNCEMENTS[0]?.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{ANNOUNCEMENTS[0]?.body}</p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link to="/community">See all community news</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
