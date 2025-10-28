# EPICS Team Builder 

## Overview

This project is for the EPICS program that helps the Directors to automatically create teams. 
It works by sorting a list of students, available projects, and partners into one group based on an algorithm.
The purpose of this project is to:

- Steamline the team sorting and creation process
- Keep track of the available projects and partners available

In addition, the purpose of this project is to import demographic data in order to
graphically display said demographic data. The demographics include Ethnicity (African American,
Asian, Hispanic, White, International, and other) and Gender (Male Female), and the different way
to display this data is based on the course, (2200/3200), semester(Spring, Summer, Fall), the year, 
and finally by percentage, raw count, or total. The options of diplaying the data is by seperate Bar Graphs,
a single pie chart, or a single line graph.

## Users/Roles

#### User/Administration and Directors of EPICS

- View all teams and projects
- Manage teams, projects, partners
- Admin privileges such as adding/removing students from teams
- Look at data analytics
- Import Demographic data
- Display demographic data by Bar Graphs, Pie Charts, or Line Graphs

### Summary

This app allows users to:
- Select and filter demographic data by course, year, semester, and gender/ethnicity.
- View the filtered data through dynamic bar, line, and pie charts.
- Export the data in various formats like CSV or Excel.
- Update the charts and data dynamically based on the selected filters.
- Ensure that all data is properly validated and errors are handled gracefully.
- Update the EPICS Discord server using the [S.C.I.P.E.](https://github.com/AlexQuigley/S.C.I.P.E) bot to automatically add missing channels and roles for projects. 

### Team Creation Functionality

- The user shall be able to create teams based on the projects available and the student's preference
- The user shall be able to update and modify the current teams 

### Team/Project Viewing Functionality

- The page shall display the current created teams and available projects, students, and partners


## Tech Stack

Documentation linked:
- Front End: [Vue](https://vuejs.org/guide/introduction.html), [Nuxt](https://nuxt.com/docs/getting-started/introduction)
- Database: [SQLite](https://www.sqlite.org/docs.html)
- Style/UI: [PrimeVue](https://primevue.org/)
- Other packages: [Prisma](https://www.prisma.io/docs)
- Other technologies: [Postman](https://learning.postman.com/docs/introduction/overview/), [Node.js](https://nodejs.org/docs/latest/api/), [Type Script Execute](https://tsx.is/getting-started), and [SheetJS](https://docs.sheetjs.com/docs/)

## Migration Scripts
- If the database is not populated on your device, you will need a copy of the domain-specific demographic data Excel sheet, provided by the University.
- After running the website, navigate to the Demographics page and import the demographics spreadsheet using the provided "Import File" button in the bottom left.
- Then, click "Send Extracted Data" to populate the database using the Excel sheet.
- (This assumes your Excel sheet will be of the same layout as those provided in prior years, which is a necessary assumption.)
- If it is a new semester and you have a spreadsheet with the most recent data on it, simply import that file in the same manner as previously described. The database will be updated with the new data.

## Setup

Make sure to install the dependencies:

## INSTALLATION [9/2/25 and onward] 
```bash
# For Windows Machines, to setup environment run these commands in a WSL console in VS Code

# Update your WSL instance
sudo apt update
sudo apt upgrade

# Copy the desired branch (This command only copys the main branch
sudo git clone github.com/UTDallasEPICS/Teambuilder
cd Teambuilder

# Installs nodejs and the node package manager (npm)
sudo apt install nodejs
sudo apt install nodejs npm

# Sets up npm in the /Teambuilder directory
sudo npm install
npm audit fix

# Starts running an instance of the website
npm run dev
```
## UI

- Much of the app utilizes pre-made components from [PrimeVue](https://primevue.org/).
- Colors for PrimeVue are defined in nuxt.config.ts, where an object with color settings is passed into PrimeVue's initialization (MyPreset).
- It is strongly recommended to modify colors using [Semantic Tokens](https://primevue.org/theming/styled/), which can be used to target specific parts of components.
- The specific shape of the color settings object can be a bit tricky to nail down at times, but are generally found under "Design Tokens" for a component's style page, e.g. [DataTable Design Tokens](https://primevue.org/datatable/#theming.tokens).

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
    "semesters": [
      {
        "id": "3b6776a9-7997-40fd-ad24-0d23a8ef1429",
        "year": 2023,
        "season": "SUMMER",
        "createdAt": "2025-04-17T23:56:36.135Z",
        "updatedAt": "2025-04-17T23:56:36.135Z"
      },
      {
        "id": "3d0ae042-42f7-41fc-adde-4789318a3b47",
        "year": 2023,
        "season": "FALL",
        "createdAt": "2025-04-17T23:56:36.135Z",
        "updatedAt": "2025-04-17T23:56:36.135Z"
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
    "semesters": [
      {
        "id": "38eb5cba-1517-434c-a3ef-5e03cbabb0ec",
        "year": 2024,
        "season": "FALL",
        "createdAt": "2025-04-17T23:56:36.135Z",
        "updatedAt": "2025-04-17T23:56:36.135Z"
      },
      {
        "id": "3b6776a9-7997-40fd-ad24-0d23a8ef1429",
        "year": 2023,
        "season": "SUMMER",
        "createdAt": "2025-04-17T23:56:36.135Z",
        "updatedAt": "2025-04-17T23:56:36.135Z"
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
