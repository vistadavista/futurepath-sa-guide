import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/common";
import { interestScores, useStore } from "@/lib/store";
import { CAREERS } from "@/data/careers";
import { INSTITUTIONS } from "@/data/education";
import { SKILLS } from "@/data/questionnaire";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/future-map")({
  head: () => ({
    meta: [
      { title: "My Future Map | FuturePath SA" },
      {
        name: "description",
        content:
          "See how your interests connect to skills, career areas, school subjects, qualifications, institutions and your application plan.",
      },
      { property: "og:title", content: "My Future Map | FuturePath SA" },
      {
        property: "og:description",
        content: "One visual pathway from who you are today to where you want to go.",
      },
    ],
  }),
  component: FutureMap,
});

const APPLICATION_STEPS = [
  "Check the subject requirements for my top career",
  "Create a list of 3 institutions to apply to",
  "Collect ID, results and proof of residence",
  "Apply for NSFAS or a bursary",
  "Submit institution applications before the closing date",
  "Follow up on my application status",
];

function FutureMap() {
  const { state, update } = useStore();
  const scores = interestScores(state.interestAnswers);
  const topInterests = scores.filter((s) => s.score > 0).slice(0, 3);
  const topSkills = Object.entries(state.skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id, v]) => ({ label: SKILLS.find((s) => s.id === id)?.label ?? id, value: v }));

  const matched = React.useMemo(() => {
    const ids = topInterests.map((i) => i.id);
    const saved = CAREERS.filter((c) => state.savedCareers.includes(c.id));
    const byInterest = ids.length
      ? CAREERS.filter((c) => c.interests.some((i) => ids.includes(i)))
      : [];
    const merged = [...saved];
    for (const c of byInterest) if (!merged.find((m) => m.id === c.id)) merged.push(c);
    return merged.slice(0, 4);
  }, [state.savedCareers, topInterests]);

  const subjects = Array.from(new Set(matched.flatMap((c) => c.subjects))).slice(0, 8);
  const quals = Array.from(new Set(matched.flatMap((c) => c.qualifications))).slice(0, 6);
  const insts = Array.from(new Set(matched.flatMap((c) => c.institutions)))
    .map((id) => INSTITUTIONS.find((i) => i.id === id))
    .filter(Boolean)
    .slice(0, 6);

  const stepsDone = APPLICATION_STEPS.filter((s) => state.applicationSteps[s]).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Future Map"
        subtitle="Your answers, joined up. Every block below grows as you explore more of FuturePath."
      />

      {topInterests.length === 0 && state.savedCareers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-display text-lg font-semibold">Your map is waiting</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Answer the Interest Discovery questions or save a career, and your pathway appears here.
            </p>
            <Button asChild className="mt-4">
              <Link to="/discover">Start with Discover</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        <MapStage index={1} title="Interests" tone="primary">
          {topInterests.length ? (
            topInterests.map((i) => (
              <Chip key={i.id} label={`${i.label} · ${i.score}%`} />
            ))
          ) : (
            <Hint to="/discover" text="Complete the questionnaire to fill this in" />
          )}
        </MapStage>

        <MapStage index={2} title="Skills" tone="info">
          {topSkills.length ? (
            topSkills.map((s) => <Chip key={s.label} label={`${s.label} · ${s.value}/5`} />)
          ) : (
            <Hint to="/discover" text="Rate your skills in Discover" />
          )}
        </MapStage>

        <MapStage index={3} title="Career areas" tone="accent">
          {matched.length ? (
            matched.map((c) => <Chip key={c.id} label={c.title} />)
          ) : (
            <Hint to="/careers" text="Save a career to link your pathway" />
          )}
        </MapStage>

        <MapStage index={4} title="School subjects" tone="primary">
          {subjects.length ? (
            subjects.map((s) => (
              <Chip
                key={s}
                label={s}
                highlight={state.profile.subjects.includes(s)}
              />
            ))
          ) : (
            <Hint to="/careers" text="Subjects appear once you choose careers" />
          )}
        </MapStage>

        <MapStage index={5} title="Qualifications" tone="info">
          {quals.length ? (
            quals.map((q) => <Chip key={q} label={q} />)
          ) : (
            <Hint to="/education" text="Browse qualifications in Education Explorer" />
          )}
        </MapStage>

        <MapStage index={6} title="Institutions" tone="accent">
          {insts.length ? (
            insts.map((i) => <Chip key={i!.id} label={`${i!.name} (${i!.province})`} />)
          ) : (
            <Hint to="/education" text="Find universities and TVET colleges" />
          )}
        </MapStage>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application planning</CardTitle>
          <CardDescription>
            {stepsDone} of {APPLICATION_STEPS.length} steps ticked off.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {APPLICATION_STEPS.map((step) => (
            <label
              key={step}
              className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm hover:bg-muted/50"
            >
              <Checkbox
                checked={!!state.applicationSteps[step]}
                onCheckedChange={() =>
                  update((p) => ({
                    ...p,
                    applicationSteps: {
                      ...p.applicationSteps,
                      [step]: !p.applicationSteps[step],
                    },
                  }))
                }
              />
              <span className={cn(state.applicationSteps[step] && "text-muted-foreground line-through")}>
                {step}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MapStage({
  index,
  title,
  tone,
  children,
}: {
  index: number;
  title: string;
  tone: "primary" | "accent" | "info";
  children: React.ReactNode;
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    info: "bg-info/15 text-info-foreground",
  }[tone];
  return (
    <div className="relative">
      <Card className="card-hover">
        <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
            <span className={cn("grid size-9 place-items-center rounded-xl font-bold", toneClass)}>
              {index}
            </span>
            <p className="font-display text-lg font-semibold">{title}</p>
          </div>
          <div className="flex flex-wrap gap-2">{children}</div>
        </CardContent>
      </Card>
      <div className="mx-auto h-4 w-px bg-border" aria-hidden />
    </div>
  );
}

function Chip({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <Badge
      variant={highlight ? "default" : "secondary"}
      className="rounded-full px-3 py-1.5 text-xs font-medium"
    >
      {label}
    </Badge>
  );
}

function Hint({ to, text }: { to: "/discover" | "/careers" | "/education"; text: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
      {text} <ChevronRight className="size-4" />
    </Link>
  );
}
