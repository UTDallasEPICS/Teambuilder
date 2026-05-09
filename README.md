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
- **Email Restriction**: Only `@utdallas.edu` emails are permitted.
- **Initial Login**: First login creates a user record with `whitelisted: false` (pending approval).
- **Admin Approval**: An Admin must navigate to `/admin/users` (this page is currently hidden from the navbar) and approve them.
- **Persistent Access**: Approved users get `whitelisted: true` and can log in normally via magic link.
- **Promotion**: Admins can remove users or promote them to the `admin` role from that page.

#### Admin User Setup
- A hardcoded admin user is automatically created/ensured on every server startup via an upsert in `server/utils/auth.ts`.
- **Current Seeding**: Seeded with `sxt230118@utdallas.edu`. 
- **Maintenance**: Future teams must update this email in the source code before deploying to ensure they maintain primary access.

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
- Run the team generation algorithm with configurable size constraints 
- Preview and manually reassign students before saving 
- Export finalized teams to Excel 
### Generate Teams (`/generate-teams`)
- Select semester/meeting day and trigger the CP-SAT algorithm 

### Discord / S.C.I.P.E. (`/SCIPE`)
- Manage the EPICS Discord bot status (Start/Stop)
- Synchronize roles and channels with the project database
- Run diagnostics for mismatches

### GitHub (`/github`)
- Connect via Personal Access Token and view organization repositories 
- Automate creation of repositories for project teams

### Demographics (`/Demographics`)
- Import demographic spreadsheets and visualize data using charts

### User Management (`/admin/users`)
- Manage pending approvals, active users, and admin roles.

## Tech Stack
This project uses **Nuxt 3** as a meta-framework, combining the frontend (Vue 3) and backend (Nitro server)

- **Meta-framework**: Nuxt 3 / Vue 3 
- **Database**: SQLite (via Prisma) 
- **Authentication**: Better-Auth (Magic Link via Nodemailer)
- **Styling/UI**: Tailwind CSS v3, PrimeVue 4
- **Algorithm**: Python 3 + Google OR-Tools CP-SAT
- **Package Manager**: pnpm 

## Third-Party Integrations

### Authentication (Better-Auth)
Uses a passwordless magic link system. Login links are sent via SMTP (Nodemailer).

### Discord (discord.js)
Connects to the EPICS Discord server to manage channels and roles. Requires `TOKEN`, `GUILD_ID`, and `BOT_ID`

### GitHub (Octokit)
Interacts with the GitHub API to automate repository creation. Requires `GITHUB_TOKEN`.

### Google OR-Tools (CP-SAT solver)
Runs as a Python subprocess to solve team assignment constraints.

## Setup & Environment

### Environment Variables (.env)
Edit your `.env` file with the following:
- `BETTER_AUTH_SECRET`: Random secret string (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: Full URL of the deployed app (e.g., `https://teambuilder-stage.npts.tech/`)
- `SMTP_HOST` / `SMTP_PORT`: SMTP server hostname and port (use 465 for SSL)
- `SMTP_USER` / `SMTP_PASS`: SMTP credentials (for Gmail, use an App Password)
- `SMTP_FROM`: Outgoing display name and address
- `PRISMA_DB_URL`: Path to SQLite file (e.g., `file:./dev.db`)
- `ADMIN_BCC`: (Optional) Email to receive BCC copies of magic links for manual debugging

### Development Setup
1. **Install Dependencies**: `pnpm install`
2. **Setup Database**: 
   - `pnpm prisma generate` 
   - `pnpm prisma migrate dev`
   - `pnpm prisma db seed` 
3. **Python Setup**: `pip install ortools`
4. **Run Server**: `pnpm dev` 

### Running with Docker
```bash
docker compose up --build
