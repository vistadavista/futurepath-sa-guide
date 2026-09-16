import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common";
import { INTEREST_QUESTIONS, LIKERT, SKILLS } from "@/data/questionnaire";
import { interestScores, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover your interests | FuturePath SA" },
      {
        name: "description",
        content:
          "Complete the Interest Discovery questionnaire and skills self-assessment to build your personal interest profile.",
      },
      { property: "og:title", content: "Discover your interests | FuturePath SA" },
      {
        property: "og:description",
        content: "There are no right or wrong answers — just what feels like you.",
      },
    ],
  }),
  component: Discover,
});

const PAGE_SIZE = 6;

function Discover() {
  const { state, update } = useStore();
  const [page, setPage] = React.useState(0);
  const pages = Math.ceil(INTEREST_QUESTIONS.length / PAGE_SIZE);
  const slice = INTEREST_QUESTIONS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const answered = Object.keys(state.interestAnswers).length;
  const scores = interestScores(state.interestAnswers);
  const chartData = scores.map((s) => ({ area: s.label.split(" ")[0], score: s.score }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover"
        subtitle="There are no right or wrong answers here. Answer honestly and your profile builds itself."
      />

      <Tabs defaultValue="interests">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="interests">Interest Discovery</TabsTrigger>
          <TabsTrigger value="skills">Skills assessment</TabsTrigger>
          <TabsTrigger value="profile">My interest profile</TabsTrigger>
        </TabsList>

        <TabsContent value="interests" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Part {page + 1} of {pages}
              </CardTitle>
              <CardDescription>
                {answered} of {INTEREST_QUESTIONS.length} statements answered
              </CardDescription>
              <Progress value={(answered / INTEREST_QUESTIONS.length) * 100} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {slice.map((q) => (
                <div key={q.id} className="rounded-2xl border p-4">
                  <p className="font-medium">{q.text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {LIKERT.map((opt) => {
                      const active = state.interestAnswers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            update((p) => ({
                              ...p,
                              interestAnswers: { ...p.interestAnswers, [q.id]: opt.value },
                            }))
                          }
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "hover:bg-muted",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => update((p) => ({ ...p, interestAnswers: {} }))}
                >
                  <RotateCcw className="size-4" /> Start over
                </Button>
                <Button
                  disabled={page >= pages - 1}
                  onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                >
                  Next <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>How confident are you right now?</CardTitle>
              <CardDescription>
                Slide from 1 (still learning) to 5 (this is a strength). You can change these any time.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {SKILLS.map((s) => {
                const value = state.skills[s.id] ?? 3;
                return (
                  <div key={s.id} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{s.label}</p>
                      <Badge variant="secondary">{value}/5</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
                    <Slider
                      className="mt-4"
                      min={1}
                      max={5}
                      step={1}
                      value={[value]}
                      onValueChange={(v) =>
                        update((p) => ({ ...p, skills: { ...p.skills, [s.id]: v[0] } }))
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-4 space-y-4">
          {answered === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="font-display text-lg font-semibold">Your profile is still empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Answer a few statements in the Interest Discovery tab and your profile appears here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Interest radar</CardTitle>
                  <CardDescription>A picture of where your energy goes.</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} outerRadius="72%">
                      <PolarGrid stroke="var(--color-border)" />
                      <PolarAngleAxis
                        dataKey="area"
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        dataKey="score"
                        stroke="var(--color-primary)"
                        fill="var(--color-primary)"
                        fillOpacity={0.35}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score breakdown</CardTitle>
                  <CardDescription>
                    Higher simply means "more like me" — not better or worse.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scores.map((s) => (
                    <div key={s.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{s.label}</span>
                        <span className="text-muted-foreground">{s.score}%</span>
                      </div>
                      <Progress value={s.score} className="mt-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground">{s.blurb}</p>
                    </div>
                  ))}
                  <Button asChild className="w-full">
                    <Link to="/future-map">See my Future Map</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
