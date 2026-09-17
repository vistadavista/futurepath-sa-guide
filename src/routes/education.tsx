import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MapPin, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/common";
import { BURSARIES, INSTITUTIONS, PROGRAMMES, QUALIFICATIONS } from "@/data/education";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education Explorer | FuturePath SA" },
      {
        name: "description",
        content:
          "Browse South African universities, TVET colleges, qualifications, learnerships, apprenticeships and bursaries like NSFAS and Funza Lushaka.",
      },
      { property: "og:title", content: "Education Explorer | FuturePath SA" },
      {
        property: "og:description",
        content: "Where to study, what it costs and how to fund it.",
      },
    ],
  }),
  component: Education,
});

function useSearch<T>(items: T[], keys: (item: T) => string) {
  const [q, setQ] = React.useState("");
  const filtered = items.filter((i) => keys(i).toLowerCase().includes(q.toLowerCase()));
  const field = (
    <div className="relative mb-4">
      <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="pl-9" />
    </div>
  );
  return { filtered, field };
}

function Education() {
  const { state, update } = useStore();
  const unis = INSTITUTIONS.filter((i) => i.type !== "TVET College");
  const tvets = INSTITUTIONS.filter((i) => i.type === "TVET College");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Education Explorer"
        subtitle="Universities, TVET colleges, qualifications, workplace programmes and funding — all in one place."
      />
      <Tabs defaultValue="universities">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="tvet">TVET Colleges</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="programmes">Learnerships & Apprenticeships</TabsTrigger>
          <TabsTrigger value="bursaries">Bursaries</TabsTrigger>
        </TabsList>

        <TabsContent value="universities" className="mt-4">
          <InstitutionList
            items={unis}
            saved={state.savedInstitutions}
            onToggle={(id) =>
              update((p) => ({
                ...p,
                savedInstitutions: p.savedInstitutions.includes(id)
                  ? p.savedInstitutions.filter((x) => x !== id)
                  : [...p.savedInstitutions, id],
              }))
            }
          />
        </TabsContent>

        <TabsContent value="tvet" className="mt-4">
          <InstitutionList
            items={tvets}
            saved={state.savedInstitutions}
            onToggle={(id) =>
              update((p) => ({
                ...p,
                savedInstitutions: p.savedInstitutions.includes(id)
                  ? p.savedInstitutions.filter((x) => x !== id)
                  : [...p.savedInstitutions, id],
              }))
            }
          />
        </TabsContent>

        <TabsContent value="qualifications" className="mt-4">
          <QualificationList />
        </TabsContent>

        <TabsContent value="programmes" className="mt-4">
          <ProgrammeList />
        </TabsContent>

        <TabsContent value="bursaries" className="mt-4">
          <BursaryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InstitutionList({
  items,
  saved,
  onToggle,
}: {
  items: typeof INSTITUTIONS;
  saved: string[];
  onToggle: (id: string) => void;
}) {
  const { filtered, field } = useSearch(items, (i) => `${i.name} ${i.province} ${i.popularFields.join(" ")}`);
  return (
    <div>
      {field}
      {filtered.length === 0 ? (
        <EmptyState title="Nothing found" description="Try a province or field like 'Engineering'." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((i) => (
            <Card key={i.id} className="card-hover">
              <CardHeader>
                <CardTitle className="text-lg">{i.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {i.city}, {i.province} · {i.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{i.blurb}</p>
                <div className="flex flex-wrap gap-2">
                  {i.popularFields.map((f) => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </div>
                <p>
                  <span className="font-medium">Applications:</span> {i.applicationWindow}
                </p>
                <p>
                  <span className="font-medium">Fees:</span> {i.fees}
                </p>
                <Button
                  variant={saved.includes(i.id) ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onToggle(i.id)}
                >
                  {saved.includes(i.id) ? "On my shortlist" : "Add to my shortlist"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function QualificationList() {
  const { filtered, field } = useSearch(
    QUALIFICATIONS,
    (q) => `${q.name} ${q.offeredBy.join(" ")} ${q.leadsTo.join(" ")}`,
  );
  return (
    <div>
      {field}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((q) => (
          <Card key={q.id} className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg">{q.name}</CardTitle>
              <CardDescription>
                NQF Level {q.nqf} · {q.duration}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Entry:</span> {q.requirements}
              </p>
              <p>
                <span className="font-medium">Offered by:</span> {q.offeredBy.join(", ")}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {q.leadsTo.map((l) => (
                  <Badge key={l} variant="outline">
                    {l}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProgrammeList() {
  const { filtered, field } = useSearch(PROGRAMMES, (p) => `${p.name} ${p.host} ${p.field} ${p.type}`);
  return (
    <div>
      {field}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <Card key={p.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <Badge variant="secondary">{p.type}</Badge>
              </div>
              <CardDescription>
                {p.host} · {p.field}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Duration:</span> {p.duration}
              </p>
              <p>
                <span className="font-medium">Stipend:</span> {p.stipend}
              </p>
              <p>
                <span className="font-medium">You need:</span> {p.requirements}
              </p>
              <p className="text-destructive">Closes: {p.closingDate}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BursaryList() {
  const { filtered, field } = useSearch(BURSARIES, (b) => `${b.name} ${b.provider} ${b.fields.join(" ")}`);
  return (
    <div>
      {field}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((b) => (
          <Card key={b.id} className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg">{b.name}</CardTitle>
              <CardDescription>{b.provider}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Covers:</span> {b.covers}
              </p>
              <p>
                <span className="font-medium">Fields:</span> {b.fields.join(", ")}
              </p>
              <p>
                <span className="font-medium">You need:</span> {b.requirements}
              </p>
              <p className="text-destructive">Closing: {b.closingDate}</p>
              <Button asChild variant="outline" className="w-full">
                <a href={b.link} target="_blank" rel="noreferrer">
                  Official website <ExternalLink className="size-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
