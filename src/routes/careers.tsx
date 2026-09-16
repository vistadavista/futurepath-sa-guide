import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Search, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, EmptyState } from "@/components/common";
import { CAREERS, CAREER_FIELDS, CAREER_LEVELS, CAREER_SUBJECTS } from "@/data/careers";
import { INSTITUTIONS } from "@/data/education";
import { useStore } from "@/lib/store";
import type { Career } from "@/data/types";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Career Explorer | FuturePath SA" },
      {
        name: "description",
        content:
          "Search South African careers, see the school subjects, qualifications and institutions each pathway needs, and save your favourites.",
      },
      { property: "og:title", content: "Career Explorer | FuturePath SA" },
      {
        property: "og:description",
        content: "SA career pathways with subjects, qualifications and salary ranges.",
      },
    ],
  }),
  component: Careers,
});

function Careers() {
  const { state, update } = useStore();
  const [q, setQ] = React.useState("");
  const [field, setField] = React.useState("all");
  const [level, setLevel] = React.useState("all");
  const [subject, setSubject] = React.useState("all");
  const [onlySaved, setOnlySaved] = React.useState(false);
  const [active, setActive] = React.useState<Career | null>(null);

  const results = CAREERS.filter((c) => {
    const text = `${c.title} ${c.field} ${c.summary}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (field !== "all" && c.field !== field) return false;
    if (level !== "all" && c.minLevel !== level) return false;
    if (subject !== "all" && !c.subjects.includes(subject)) return false;
    if (onlySaved && !state.savedCareers.includes(c.id)) return false;
    return true;
  });

  const toggleSave = (id: string) =>
    update((p) => ({
      ...p,
      savedCareers: p.savedCareers.includes(id)
        ? p.savedCareers.filter((x) => x !== id)
        : [...p.savedCareers, id],
    }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Explorer"
        subtitle="Real South African pathways — what to study, where to study it and what the work looks like."
      />

      <Card>
        <CardContent className="grid gap-3 py-5 md:grid-cols-4">
          <div className="relative md:col-span-4 lg:col-span-1">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search careers..."
              className="pl-9"
            />
          </div>
          <Select value={field} onValueChange={setField}>
            <SelectTrigger>
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fields</SelectItem>
              {CAREER_FIELDS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any education level</SelectItem>
              {CAREER_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="School subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any subject</SelectItem>
              {CAREER_SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 md:col-span-4">
            <Switch id="saved" checked={onlySaved} onCheckedChange={setOnlySaved} />
            <Label htmlFor="saved">Show only my saved careers ({state.savedCareers.length})</Label>
          </div>
        </CardContent>
      </Card>

      {results.length === 0 ? (
        <EmptyState
          title="No careers match those filters"
          description="Try clearing a filter or searching for something broader like 'health' or 'design'."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((c) => {
            const saved = state.savedCareers.includes(c.id);
            return (
              <Card key={c.id} className="card-hover flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={saved ? "Remove from saved" : "Save career"}
                      onClick={() => toggleSave(c.id)}
                    >
                      {saved ? (
                        <BookmarkCheck className="size-5 text-primary" />
                      ) : (
                        <Bookmark className="size-5" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>{c.summary}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{c.field}</Badge>
                    <Badge variant="outline">{c.minLevel}</Badge>
                    <Badge className="bg-success/15 text-success-foreground">
                      <TrendingUp className="mr-1 size-3" /> {c.demand} demand
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.salaryRange}</p>
                  <Button variant="outline" className="w-full" onClick={() => setActive(c)}>
                    View pathway
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {active ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{active.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 text-sm">
                <p className="text-muted-foreground">{active.summary}</p>
                <Section title="A day in the life">
                  <p className="text-muted-foreground">{active.dayInLife}</p>
                </Section>
                <Section title="School subjects that help">
                  <div className="flex flex-wrap gap-2">
                    {active.subjects.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </Section>
                <Section title="Qualifications">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {active.qualifications.map((qf) => (
                      <li key={qf}>{qf}</li>
                    ))}
                  </ul>
                </Section>
                <Section title="Where you can study">
                  <div className="flex flex-wrap gap-2">
                    {active.institutions.map((id) => {
                      const inst = INSTITUTIONS.find((i) => i.id === id);
                      return inst ? (
                        <Badge key={id} variant="outline">
                          {inst.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </Section>
                <Section title="The pathway, step by step">
                  <ol className="space-y-2">
                    {active.pathway.map((step, i) => (
                      <li key={step} className="flex gap-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </Section>
                <Section title="Typical earnings">
                  <p className="text-muted-foreground">{active.salaryRange}</p>
                </Section>
                <Button className="w-full" onClick={() => toggleSave(active.id)}>
                  {state.savedCareers.includes(active.id)
                    ? "Remove from my saved careers"
                    : "Save this career"}
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 font-display text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}
