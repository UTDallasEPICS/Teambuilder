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

## Endpoints
<details close>
<summary>Expand</summary>

### Get projects with semesters
```http
GET /api/projects
```

<details close>
<summary>Details</summary>
<br>

| Code | Description |
| :--- | :--- |
| 200 | `OK` |

Example response:
```json
[
  {
    "id": "40c129a8-c4b6-4057-88d9-0c653b86f14d",
    "name": "Handcrafted Aluminum Fish",
    "description": "Calamitas defessus traho.",
    "type": "SOFTWARE",
    "status": "HOLD",
    "repoURL": "https://finished-window.name/",
    "partnerId": "eaf74e1a-ca69-4312-892b-a0d154edad8a",
    "createdAt": "2025-04-17T23:56:36.138Z",
    "updatedAt": "2025-04-17T23:56:36.138Z",
    "teams": [
      {
        "semester": {
          "id": "3b6776a9-7997-40fd-ad24-0d23a8ef1429",
          "year": 2023,
          "season": "SUMMER",
          "createdAt": "2025-04-17T23:56:36.135Z",
          "updatedAt": "2025-04-17T23:56:36.135Z"
        }
      },
      {
        "semester": {
          "id": "3d0ae042-42f7-41fc-adde-4789318a3b47",
          "year": 2023,
          "season": "FALL",
          "createdAt": "2025-04-17T23:56:36.135Z",
          "updatedAt": "2025-04-17T23:56:36.135Z"
        }
      },
    ]
  },
  {
    "id": "cd4274dd-20d9-4b40-bd0c-7949bb67fd0b",
    "name": "Recycled Metal Chips",
    "description": "Bos tendo carpo consectetur coma auctor beneficium avarus vetus.",
    "type": "BOTH",
    "status": "RETURNING",
    "repoURL": "https://raw-marksman.biz",
    "partnerId": "ee073720-87f6-4f98-9c7b-0de0cc1b0a44",
    "createdAt": "2025-04-17T23:56:36.138Z",
    "updatedAt": "2025-04-17T23:56:36.138Z",
    "teams": [
      {
        "semester": {
          "id": "38eb5cba-1517-434c-a3ef-5e03cbabb0ec",
          "year": 2024,
          "season": "FALL",
          "createdAt": "2025-04-17T23:56:36.135Z",
          "updatedAt": "2025-04-17T23:56:36.135Z"
        }
      },
      {
        "semester": {
          "id": "3b6776a9-7997-40fd-ad24-0d23a8ef1429",
          "year": 2023,
          "season": "SUMMER",
          "createdAt": "2025-04-17T23:56:36.135Z",
          "updatedAt": "2025-04-17T23:56:36.135Z"
        }
      },
    ]
  },
]
```
</details>

</details>


## Possible Setup Bugs:

It has been known that some errors may come up when developing this application on Apple machines, follow these install steps to fix any issues:

```bash
# Run the following commands one at a time:
rm
rm 
npm install
npm audit fix
```
