# EPICS Team Builder

## Overview
This project is an internal tool for the UTD EPICS program. Each semester, directors must assign hundreds of students to project teams based on student project preferences, major, class year, and meeting day availability. This application manages that entire process against a central database, storing students, partners, projects, semesters, and team assignments, and automates team generation using a constraint-programming algorithm.

The purpose of this project is to:
- Automate and streamline the team assignment process using a CP-SAT constraint solver
- Maintain a persistent database of students, partners, projects, semesters, and team rosters
- Allow directors to import student bid data from UTDesign CSVs and manage records directly
- Synchronize finalized teams with the EPICS Discord server and GitHub organization
- Provide demographic data visualization as a secondary feature for program reporting

## Users/Roles

#### Administration and Directors of EPICS
- View all teams and projects
- Manage teams, projects, and partners
- Admin privileges such as adding/removing students from teams
- View data analytics and import/display demographic data

#### User Access Flow
- **Email Restriction**: Only `@utdallas.edu` emails are permitted
- **Initial Login**: First login creates a user record with `whitelisted: false` (pending approval)
- **Admin Approval**: An admin must navigate to `/admin/users` and approve them. This link is visible in the navbar only to users with the `admin` role
- **Persistent Access**: Approved users get `whitelisted: true` and can log in normally via magic link
- **Promotion**: Admins can remove users or promote them to the `admin` role from that page

#### Admin User Setup
- A pre-approved users list is defined in `server/utils/auth.ts` under `PRE_APPROVED_USERS`
- Every user in this list is automatically upserted into the database on every server startup with `whitelisted: true`
- Currently seeded with `sxt230118@utdallas.edu` (Snigdha Tadi) and `amt101000@utdallas.edu` (Andrea Turcatti) as admins
- **Future teams must update this list in `server/utils/auth.ts` before deploying** to ensure they maintain primary access

## Functional Requirements (by Page)

### Home (`/`)
- Landing page introducing the application

### Projects (`/projects`)
- View all projects with type (Software / Hardware / Both), status, meeting day, and partner
- Add, edit, or delete projects
- Activate a project for a specific semester (creates a team slot)
- View which semesters a project has been active

### Partners (`/partners`)
- View, add, edit, and delete community partner organizations

### Students (`/students`)
- View student details (name, NetID, major, class year, meeting day, status)
- Import student data from UTDesign bid-response CSVs
- Manually edit student details and set status (Active / Inactive)

### Teams (`/teams`)
- View generated teams grouped by project and semester
- Filter by semester and meeting day
- Manually move or remove members from teams
- Export finalized teams to CSV

### Generate Teams (`/generate-teams`)
- Select semester/meeting day and trigger the CP-SAT algorithm with configurable min/max team size constraints

### Discord / S.C.I.P.E. (`/SCIPE`)
- Manage the EPICS Discord bot status (Start/Stop)
- Synchronize roles and channels with the project database
- Run diagnostics for mismatches

### GitHub (`/github`)
- Connect via Personal Access Token and view organization repositories
- Automate creation of repositories for project teams

### Demographics (`/newDemographics`)
- Import demographic spreadsheets and visualize data using charts

### User Management (`/admin/users`)
- Visible in the navbar only to admin users
- Manage pending approvals, active users, and admin roles
- Dismiss pending users (deletes record, allows them to re-request)
- Restore or permanently remove previously denied users

## Tech Stack
This project uses **Nuxt 3** as a meta-framework, combining the frontend (Vue 3) and backend (Nitro server).

- **Meta-framework**: Nuxt 3 / Vue 3
- **Database**: SQLite (via Prisma)
- **Authentication**: Better-Auth (Magic Link via Nodemailer or Resend)
- **Styling/UI**: Tailwind CSS v3, PrimeVue 4
- **Algorithm**: Python 3 + Google OR-Tools CP-SAT
- **Package Manager**: pnpm

## Third-Party Integrations

### Authentication (Better-Auth + Nodemailer)
Uses a passwordless magic link system. Login links are sent via SMTP using Nodemailer. If `RESEND_API_KEY` is set in the environment, the app automatically switches to Resend's API instead of SMTP for sending emails. To use Resend with a custom domain, the domain must be verified in the Resend dashboard with the appropriate DNS records (SPF, DKIM).

### Discord (discord.js)
Connects to the EPICS Discord server to manage channels and roles per project. Requires `TOKEN`, `GUILD_ID`, and `BOT_ID` environment variables. Source based on [S.C.I.P.E.](https://github.com/AlexQuigley/S.C.I.P.E) by Alex Quigley.

### GitHub (Octokit / @octokit/rest)
Interacts with the GitHub API to automate repository creation for project teams. Requires `GITHUB_TOKEN`.

### Google OR-Tools (CP-SAT solver)
Runs as a Python subprocess called from Node.js. Receives student and project data, solves the constraint-satisfaction problem, and returns team assignments. Requires Python 3 and the `ortools` package.

## Deployment Notes
- Containerized with Docker, deployed to **AWS ECS (Elastic Container Service)**
- Docker images are built and pushed to **AWS ECR** via GitHub Actions
- Two active deployment pipelines: `stage.yml` (triggers on push to `stage`) and `main.yml` (triggers on push to `main`)
- The SQLite database is persisted via a Docker named volume (`db_data`), mounted at `/app/prisma` inside the container — the database survives container restarts but is separate from your local `prisma/dev.db`
- `entrypoint.sh` runs `prisma generate`, `prisma migrate deploy`, and `prisma db seed` on every container start — **note: `prisma db seed` inserts fake development data and should be removed or guarded before production use**
- **Infrastructure owner**: The UTD EPICS program / npts.tech manages the server

## Setup & Environment

### Environment Variables (.env)
Copy `.env.example` and fill in your values:

**Auth**
- `BETTER_AUTH_SECRET`: random secret string, generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL`: full URL of the deployed app (e.g. `https://teambuilder-stage.npts.tech`). Must match actual deployment URL or magic link redirects will break
- `SMTP_HOST`: SMTP server hostname (e.g. `smtp.gmail.com`)
- `SMTP_PORT`: SMTP port (use `465` for SSL)
- `SMTP_USER`: email address used to send magic links
- `SMTP_PASS`: app password for the sending account (for Gmail: Google Account → Security → 2-Step Verification → App passwords)
- `SMTP_FROM`: display name and address (e.g. `EPICS Teambuilder <youremail@gmail.com>`)
- `RESEND_API_KEY`: (optional) if set, overrides SMTP and uses Resend API instead. Domain must be verified in Resend dashboard first
- `ADMIN_BCC`: (optional) email address to BCC on every magic link sent, useful for debugging login issues

**Database**
- `PRISMA_DB_URL`: path to SQLite file (e.g. `file:./dev.db`)

**Discord Bot**
- `TOKEN`: Discord bot token
- `GUILD_ID`: Discord server ID
- `BOT_ID`: Discord bot application ID

**GitHub**
- `GITHUB_TOKEN`: Personal Access Token for GitHub organization access

### Development Setup
```bash
# Install dependencies
pnpm install

# Copy environment variable template and fill in your values
cp .env.example .env

# Set up the database
pnpm prisma generate
pnpm prisma migrate dev

# (Optional) Seed with fake development data
pnpm prisma db seed

# Install Python OR-Tools (required for team generation)
pip install ortools

# Start the dev server
pnpm dev
```

### Running with Docker
```bash
# Builds the image and starts the container (runs migrations and seed automatically)
docker compose up --build
```
The app will be available at `http://localhost:3000`.

## Migration Scripts
- If the database is not populated, you will need a copy of the domain-specific demographic data Excel sheet provided by the University
- Navigate to the Demographics page and import the spreadsheet using the "Import File" button
- Click "Send Extracted Data" to populate the database
- This assumes the Excel sheet matches the layout of those provided in prior years
- For student bid data: export the UTDesign bid-response spreadsheet as a CSV each semester and import via the Students page. Re-importing upserts existing students by NetID and replaces their project choices

## Auth-Related Files
- `server/utils/auth.ts`: main Better-Auth config, SMTP/Resend transport, pre-approved user upsert on startup. **Update `PRE_APPROVED_USERS` here for new teams**
- `server/middleware/serverAuth.ts`: blocks all `/api/` routes for unauthenticated or non-whitelisted users
- `middleware/auth.global.ts`: client-side middleware, redirects unauthenticated users to `/login`
- `composables/useAuthState.ts`: composable for accessing current user session in frontend components
- `pages/login.vue`: magic link request form
- `pages/admin/users.vue`: user management UI (approve, dismiss, deny, restore, make admin)
- `server/api/auth/[...all].ts`: catch-all route that passes auth requests to Better-Auth