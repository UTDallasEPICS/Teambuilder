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

## Functional Requirements

### 1. **Filter Management**

- **Course Filter**: Users can filter data based on selected courses (e.g., "2200" and "3200"). Multiple courses can be selected.
- **Demographic Filter**: Users can filter data by gender or ethnicity, with multiple selections allowed.
- **Year and Semester Filter**: Users can filter data by specific years and semesters. Multiple years or semesters can be selected.
- **Y-axis Metric Selection**: Users can choose to display data as either raw counts or percentages.
- **Validation**: Ensures that required filters (e.g., Course, Year, Semester) are selected. Throws error if mandatory filters are not provided.

### 2. **Data Visualization**

- **Charts**: Data is displayed as bar, line, or pie charts based on the user's selection. The chart is updated dynamically when filters change.
  - **Bar Chart**: Displays total students per semester by course. The bars represent the selected demographic data.
  - **Line Chart**: Displays trends over time (e.g., semester-wise changes in demographics).
  - **Pie Chart**: Shows the distribution of selected demographics (gender/ethnicity) across all selected semesters and courses.
- **Tooltip**: Tooltips display additional information when hovering over the chart segments, such as the raw count and percentage of total.
  - Example Tooltip:
    ```javascript
    chartConfig.options.plugins.tooltip.callbacks.label = (context) => {
      const value = context.raw;
      const percentage = ((value / grandTotal) * 100).toFixed(1);
      return `${context.dataset.label}: ${value} students (${percentage}% of total)`;
    };
    ```

### 3. **Data Export**

- **Exporting Data**: Users can export the filtered data in CSV or Excel format.
- **Chart Export**: Users can download the chart as an image (e.g., PNG).

### 4. **Handling Demographics and Courses**

- **Demographics**: Data can be filtered based on ethnicity or gender. Users can choose which demographic (or both) to view.
- **Course Filtering**: Data can be filtered for specific courses, and the app supports combined data from multiple courses (e.g., 2200 and 3200).
  - Example of filtering data by courses:
    ```javascript
    const courses = Course ? String(Course).split(",") : [];
    ```

### 5. **Data Sorting and Display**

- **Sorting Data**: The records are sorted by year and semester to display in chronological order. This ensures data is displayed in the correct order for visual analysis.
  - Sorting logic:
    ```javascript
    records.sort((first, second) => {
      const firstYear = first.Name.substring(0, 2);
      const firstSem = first.Name.substring(2, 3);
      const secondYear = second.Name.substring(0, 2);
      const secondSem = second.Name.substring(2, 3);
      if (firstYear > secondYear) return 1;
      if (firstYear < secondYear) return -1;
      const semesterOrder = ['F', 'U', 'S'];
      return semesterOrder.indexOf(firstSem) - semesterOrder.indexOf(secondSem);
    });
    ```

### 6. **Validation and Error Handling**

- **Validation for Filters**: Ensures that at least one course, one semester, and both years are selected before data is processed. Throws error if conditions are not met.
  - Example error handling:
    ```javascript
    if (courses[0] == "Empty") {
      throw new Error("You must pick at least one Course");
    } else if (years[0] == "Empty" || years.length < 2) {
      throw new Error("Both Years must be chosen");
    } else if (semesters[0] == "Empty") {
      throw new Error("You must pick at least one Semester");
    }
    ```

### 7. **Dynamic Data Updates**

- **Dynamic Chart Updates**: When users select or change filters (such as ethnicity, gender, etc.), the charts update dynamically with the new data.
  - **Example of updating charts dynamically**:
    ```javascript
    chartConfig.data.datasets = selectedCategories.map((category, index) => ({
      label: category,
      data: this.chartData.map((item) => {
        return this.filters.find(f => f.name === "Y-axis").selectedOptions[0] === "Percentages"
          ? (item[category] / item.Total) * 100
          : item[category];
      }),
      backgroundColor: isGenderMode ? this.getColorForGender(category) : this.getColorForEthnicity(category),
      borderColor: isGenderMode ? this.getColorForGender(category) : this.getColorForEthnicity(category),
      fill: false,
      tension: chartType === "Line" ? 0.4 : undefined
    }));
    ```

### 8. **User Interface (UI) and Layout**

- **Responsive Design**: The app is designed to be responsive across devices (desktop, tablet, and mobile).
- **Navigation**: Easy-to-use navigation menus for users to access different pages, such as filtering data, viewing charts, and exporting data.

---

### Summary

This app allows users to:
- Select and filter demographic data by course, year, semester, and gender/ethnicity.
- View the filtered data through dynamic bar, line, and pie charts.
- Export the data in various formats like CSV or Excel.
- Update the charts and data dynamically based on the selected filters.
- Ensure that all data is properly validated and errors are handled gracefully.

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
