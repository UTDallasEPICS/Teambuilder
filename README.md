# EPICS Team Builder 

## Overview

This project is for the EPICS program that helps the Directors to automatically create teams. 
It works by sorting a list of students, available projects, and partners into one group based on an algorithm.
The purpose of this project is to:

- Steamline the team sorting and creation process
- Keep track of the available projects and partners available

## Users/Roles

#### User/Administration and Directors of EPICS

- View all teams and projects
- Manage teams, projects, partners
- Admin privileges such as adding/removing students from teams
- Look at data analytics


## Functional Requirements

### Team Creation Functionality

- The user shall be able to create teams based on the projects available and the student's preference
- The user shall be able to update and modify current teams 

### Team/Project Viewing Functionality

- The page shall display the current created teams and availabe projects, students, and partners


## Tech Stack

Documentation linked:
- Front End: [Vue](https://vuejs.org/guide/introduction.html), [Nuxt](https://nuxt.com/docs/getting-started/introduction)
- Database: [PostgresSQL](https://www.postgresql.org/docs/)
- Other packages: [Prisma](https://www.prisma.io/docs)
- Other technologies: [Postman](https://learning.postman.com/docs/introduction/overview/), [Node.js](https://nodejs.org/docs/latest/api/), [Type Script Execute](https://tsx.is/getting-started)

## Setup

Make sure to install the dependencies:

```bash
# npm [Default, use this unless told otherwise]
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start/run the development server on `http://localhost:3000` (Useful for seeing results of your code/see a local verison of the application):

```bash
# npm [Default, use this unless told otherwise]
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm [Default, use this unless told otherwise]
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm [Default, use this unless told otherwise]
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

## Possible Setup Bugs:

It has been known that some errors may come up when developing this application on Apple machines, follow these install steps to fix any issues:

```bash
# Run the following commands one at a time:
```
