# FuturePath SA — build plan

A South African education and career-discovery platform for school learners, built as one app with a sidebar shell and eight main sections.

## Approach

- No login for now: the app opens straight into the learner experience, with a role switcher (Learner, Parent, Teacher, School Admin) that previews how the dashboard changes.
- All learner data (answers, saved careers, tasks, chat history, profile) is saved on the device so it survives refreshes. Accounts and cloud sync can be added later.
- The AI features (Research Assistant, Chatbot, Task Planner) run through Lovable's built-in AI, called from the server so nothing sensitive sits in the browser. Every AI screen shows the same responsible-AI note.
- South African demo content is written into the app as realistic sample data (universities, TVET colleges, NSFAS/Funza Lushaka bursaries, learnerships, careers with subject requirements).

## Design direction

Modern, friendly, youth-facing: warm South African palette (deep indigo base with amber/teal accents), rounded cards, soft shadows, bold friendly headings, generous spacing, subtle motion on hover and page transitions. Full dark-mode-capable token set, no hardcoded colours. Fully responsive — sidebar on desktop, slide-in drawer on mobile.

## Sections

1. **Dashboard** — greeting by name and time of day, three progress rings (Interest Discovery, Career Exploration, Future Planning), quick actions, high-priority tasks, upcoming events and deadlines.
2. **Discover** — Interest Discovery questionnaire (multi-step, no "right" answers), skills self-assessment, and a radar chart plus score breakdown of the resulting interest profile.
3. **Careers** — Career Explorer with search, filters (field, education level, subject), detail view covering SA pathways, required school subjects, qualifications, salary bands, and a saved-careers toggle.
4. **My Future Map** — visual connected pathway: Interests → Skills → Career Areas → Subjects → Qualifications → Institutions → Application Planning, populated from the learner's own answers and clickable node by node.
5. **Education Explorer** — tabbed browsing of Universities, TVET Colleges, Qualifications, Learnerships, Apprenticeships and Bursaries with search and filters.
6. **AI Tools** — Research Assistant (summary, key terms, study notes, revision questions), FuturePath Chatbot (streamed replies, quick prompts, saved history), Task Planner (turns plain goals into a structured daily/weekly schedule with breaks and priorities, editable and completable).
7. **My Planner** — Today, This Week, Calendar and Completed views with create, edit, delete and status controls; AI-planned tasks land here too.
8. **Community** — School Events (career days, university visits), Announcements, Achievements showcase.
9. **Profile & Settings** — learner profile (name, grade, school, subjects), preferences, and the role-preview switch.

## Technical notes

- TanStack Start file routes per section under a shared sidebar layout; shadcn sidebar + Sheet drawer for mobile.
- Shared state via a persisted store (localStorage) with typed selectors; progress metrics derive from questionnaire completion, saved careers, and map/planner activity.
- AI calls: server routes/functions using the Lovable AI gateway; chat streams, Research Assistant and Planner return structured output validated with Zod. Errors (rate limit, credits) surface as clear in-app messages.
- Per-route head metadata (unique titles and descriptions) for SEO.

## Build order

1. Design system + shell (sidebar, drawer, routes, profile store)
2. SA demo data layer + Dashboard
3. Discover + Careers + Future Map
4. Education Explorer + Community
5. Planner
6. AI tools (chatbot, research assistant, task planner) + disclaimer
7. Profile & Settings, polish pass
