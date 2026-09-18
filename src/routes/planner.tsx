import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, EmptyState } from "@/components/common";
import { newId, useStore, type Task } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "My Planner | FuturePath SA" },
      {
        name: "description",
        content:
          "Plan your studies, projects and application deadlines with a today, week, calendar and completed view.",
      },
      { property: "og:title", content: "My Planner | FuturePath SA" },
      { property: "og:description", content: "Your study and application to-do list." },
    ],
  }),
  component: Planner,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function weekDates() {
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

const EMPTY: Omit<Task, "id"> = {
  title: "",
  notes: "",
  date: todayISO(),
  time: "",
  priority: "Medium",
  category: "Study",
  done: false,
  source: "manual",
};

function Planner() {
  const { state, update } = useStore();
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Omit<Task, "id">>(EMPTY);

  const startNew = () => {
    setEditing(null);
    setDraft(EMPTY);
    setOpen(true);
  };
  const startEdit = (t: Task) => {
    setEditing(t);
    const { id: _id, ...rest } = t;
    setDraft(rest);
    setOpen(true);
  };

  const save = () => {
    if (!draft.title.trim()) {
      toast.error("Give your task a name first.");
      return;
    }
    if (editing) {
      update((p) => ({
        ...p,
        tasks: p.tasks.map((t) => (t.id === editing.id ? { ...draft, id: editing.id } : t)),
      }));
      toast.success("Task updated");
    } else {
      update((p) => ({ ...p, tasks: [...p.tasks, { ...draft, id: newId() }] }));
      toast.success("Task added");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    update((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== id) }));
    toast("Task deleted");
  };

  const toggle = (id: string) =>
    update((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));

  const today = todayISO();
  const week = weekDates();
  const todayTasks = state.tasks.filter((t) => t.date === today && !t.done);
  const weekTasks = state.tasks.filter((t) => week.includes(t.date) && !t.done);
  const completed = state.tasks.filter((t) => t.done);

  const list = (tasks: Task[], empty: string) =>
    tasks.length === 0 ? (
      <EmptyState title="Nothing here yet" description={empty} />
    ) : (
      <div className="space-y-3">
        {tasks
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((t) => (
            <Card key={t.id} className="card-hover">
              <CardContent className="flex items-start gap-3 py-4">
                <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} className="mt-1" />
                <div className="min-w-0 flex-1">
                  <p className={cn("font-medium", t.done && "text-muted-foreground line-through")}>
                    {t.title}
                  </p>
                  {t.notes ? <p className="text-sm text-muted-foreground">{t.notes}</p> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{t.date}</Badge>
                    {t.time ? <Badge variant="outline">{t.time}</Badge> : null}
                    <Badge variant="secondary">{t.category}</Badge>
                    <Badge variant={t.priority === "High" ? "destructive" : "secondary"}>
                      {t.priority}
                    </Badge>
                    {t.source === "ai" ? <Badge className="bg-info/20 text-info-foreground">AI</Badge> : null}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label="Edit task" onClick={() => startEdit(t)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Delete task" onClick={() => remove(t.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Planner"
        subtitle="Study sessions, projects and deadlines — with space to breathe."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={startNew}>
                <Plus className="size-4" /> New task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task</Label>
                  <Input
                    id="title"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="e.g. Revise Physical Sciences Chapter 4"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={draft.notes ?? ""}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={draft.time ?? ""}
                      onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={draft.priority}
                      onValueChange={(v) => setDraft({ ...draft, priority: v as Task["priority"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["High", "Medium", "Low"].map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={draft.category}
                      onValueChange={(v) => setDraft({ ...draft, category: v as Task["category"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Study", "Application", "Project", "Break", "Personal"].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={save}>{editing ? "Save changes" : "Add task"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="today">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
          <TabsTrigger value="week">This week ({weekTasks.length})</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="done">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          {list(todayTasks, "Add a task for today or let the AI Task Planner build your day.")}
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          {list(weekTasks, "Nothing planned for the next 7 days.")}
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" /> Next 7 days
              </CardTitle>
              <CardDescription>A quick look at how your week is filling up.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {week.map((d) => {
                const dayTasks = state.tasks.filter((t) => t.date === d);
                return (
                  <div key={d} className="rounded-2xl border p-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {new Date(d).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {dayTasks.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Free</p>
                      ) : (
                        dayTasks.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => toggle(t.id)}
                            className={cn(
                              "w-full rounded-lg bg-muted px-2 py-1.5 text-left text-xs",
                              t.done && "text-muted-foreground line-through",
                            )}
                          >
                            {t.time ? `${t.time} · ` : ""}
                            {t.title}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="done" className="mt-4">
          {list(completed, "Completed tasks will appear here — tick something off!")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
