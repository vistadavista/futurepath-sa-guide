import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { GraduationCap, RotateCcw, Save, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common";
import { useStore, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings | FuturePath SA" },
      {
        name: "description",
        content:
          "Update your learner profile, school subjects and preview how FuturePath looks for parents, teachers and school admins.",
      },
      { property: "og:title", content: "Profile & Settings | FuturePath SA" },
      { property: "og:description", content: "Your learner profile and role previews." },
    ],
  }),
  component: ProfilePage,
});

const ROLES: { role: Role; blurb: string }[] = [
  { role: "Learner", blurb: "Full access: discovery, careers, planner and AI tools." },
  { role: "Parent", blurb: "See progress, deadlines and funding options for your child." },
  { role: "Teacher", blurb: "Guide learners, see class events and share resources." },
  { role: "School Admin", blurb: "School-wide events, announcements and engagement." },
];

const GRADES = ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

function ProfilePage() {
  const { state, update, reset } = useStore();
  const [form, setForm] = React.useState(state.profile);
  const [subject, setSubject] = React.useState("");

  React.useEffect(() => setForm(state.profile), [state.profile]);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile & Settings" subtitle="Keep your details up to date so your guidance stays relevant." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" /> Learner profile
            </CardTitle>
            <CardDescription>This personalises your dashboard and future map.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Grade</Label>
                <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Province</Label>
                <Select value={form.province} onValueChange={(v) => setForm({ ...form, province: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="about">About me</Label>
              <Textarea
                id="about"
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
            </div>
            <div>
              <Label>My subjects</Label>
              <div className="mt-2 mb-2 flex flex-wrap gap-2">
                {form.subjects.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setForm({ ...form, subjects: form.subjects.filter((x) => x !== s) })}
                  >
                    {s} ✕
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Add a subject"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const s = subject.trim();
                    if (!s) return;
                    setForm({ ...form, subjects: Array.from(new Set([...form.subjects, s])) });
                    setSubject("");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                update((p) => ({ ...p, profile: form }));
                toast.success("Profile saved");
              }}
            >
              <Save className="size-4" /> Save profile
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-accent" /> Role preview
              </CardTitle>
              <CardDescription>
                Switch roles to preview how FuturePath looks for different people at your school.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    update((p) => ({ ...p, role: r.role }));
                    toast.success(`Now previewing as ${r.role}`);
                  }}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-colors",
                    state.role === r.role ? "border-primary bg-primary/5" : "hover:bg-muted/60",
                  )}
                >
                  <p className="font-semibold">{r.role}</p>
                  <p className="text-sm text-muted-foreground">{r.blurb}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your data</CardTitle>
              <CardDescription>
                Everything you do in FuturePath is saved on this device only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  toast("Everything reset to the starting point");
                }}
              >
                <RotateCcw className="size-4" /> Reset my FuturePath data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
