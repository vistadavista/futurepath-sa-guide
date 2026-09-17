import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Megaphone, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/common";
import { ACHIEVEMENTS, ANNOUNCEMENTS, SCHOOL_EVENTS } from "@/data/community";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community | FuturePath SA" },
      {
        name: "description",
        content:
          "School career days, university visits, announcements and learner achievements from your FuturePath SA community.",
      },
      { property: "og:title", content: "Community | FuturePath SA" },
      {
        property: "og:description",
        content: "Events, announcements and learner achievements.",
      },
    ],
  }),
  component: Community,
});

function Community() {
  const events = [...SCHOOL_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        subtitle="What is happening at school and who is doing great things."
      />
      <Tabs defaultValue="events">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="events">School events</TabsTrigger>
          <TabsTrigger value="news">Announcements</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4 grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <Card key={e.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarDays className="size-5 text-primary" />
                    {e.title}
                  </CardTitle>
                  <Badge variant="secondary">{e.type}</Badge>
                </div>
                <CardDescription>
                  {e.date} · {e.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{e.description}</CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="news" className="mt-4 space-y-4">
          {ANNOUNCEMENTS.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Megaphone className="size-5 text-warning" />
                  {a.title}
                </CardTitle>
                <CardDescription>
                  {a.from} · {a.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{a.body}</CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="mt-4 grid gap-4 md:grid-cols-2">
          {ACHIEVEMENTS.map((a) => (
            <Card key={a.id} className="card-hover">
              <CardContent className="flex gap-4 py-6">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {a.learner
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="flex items-center gap-2 font-display font-semibold">
                    <Trophy className="size-4 text-accent" /> {a.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {a.learner} · {a.grade}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
