
# UTDesign EPICS Team Formation Project


This project is the Spring 2024 EPICS Teambuilder project. 



Figma Wireframe: [Click Here!](https://www.figma.com/file/pQIawhFYojSBtXk5qAHGEz/Wireframe?type=design&node-id=0%3A1&mode=design&t=zdtVvztLlWfwChsV-1)


## Conceptual Overview

The EPICS Team Builder project aims to streamline the team formation process for UTDesign EPICS staff at the University of Texas at Dallas. It provides a user-friendly interface for uploading student data and inputting project details. The project uses an optimized algorithm for the selection of project teams based on criteria such as major, project preference, and seniority. The intended users are EPICS staff, who will upload student data, input project details, and generate project teams.

## Functional Requirements
- Sign-In Page: EPICS staff access this page to authenticate themselves before gaining access to student data and project details. It ensures security by requiring users to sign in with their credentials, allowing only authorized staff to proceed.
- Student Upload Page: This page facilitates the uploading of student data into the application's database. EPICS staff can upload data in bulk using file upload functionality. The system validates the uploaded data to maintain accuracy and consistency.
- Project Page: EPICS staff utilize this page to manage project details effectively. They can input new project information such as project name, target CS, and partner details. Additionally, staff can delete projects that are no longer active or relevant.
- Generate Button: The generate button triggers an algorithm that analyzes student data and project requirements to form efficient teams. It assigns students to project teams based on factors like major, project preference, and seniority. Clear indication and progress updates keep users informed during the team formation process.

## Tech Stack
The core technologies used for frontend are:
- [React.js](https://www.react.dev): A front-end Javascript library for building UI based on components
- [Next.js](https://nextjs.org): A full stack web development meta framework which combines frontend and backend
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for quickly building custom designs without writing any CSS.

The core technologies used for backend are:
- [Prisma](https://prisma.io): A database ORM used to connect Next.js to a database
- [SQLite](https://www.sqlite.org/): An open source SQL database

## Deployment
As this project is just intended for UTDesign staff and contains sensitive student data, it will not be deployed. 

## Migration
Does not require any data to be migrated from existing systems. 

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Resources for Reference</h2></summary>

- [Getting Started](#getting-started)

- [Running This Project](#running-this-project)
- [Learn More](#learn-more)
  - [Learn HTML, CSS, JavaScript, and TypeScript](#learn-html-css-javascript-and-typescript)
    - [HTML](#html)
    - [CSS](#css)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
  - [Learn Next.js](#learn-nextjs)
  - [Learn Prisma](#learn-prisma)

</details>

## Getting Started

1. Setup your development environment to ensure you have everything installed to run the project (see the [prerequisites section](#prerequisites)).
2. Run your project (see the [running the project section](#running-this-project)).
3. Start coding!
   


## Running This Project

First, run the development server:



## Learn More

### Learn HTML, CSS, and JavaScript

#### [HTML](https://www.freecodecamp.org/news/the-html-handbook/)

Websites are built using HTML, CSS, and JavaScript. HTML, or Hypertext Markup Language, is a markup language for the web that defines the structure of web pages[^1]. Examples of these structures include paragraphs, headings, headers, footers, lists, navigation, and images. Each one of these components is defined in an HTML file for every website you visit.

[^1]: [What is HTML - Definition and Meaning of Hypertext Markup Language by freeCodeCamp](https://www.freecodecamp.org/news/what-is-html-definition-and-meaning/)

#### [CSS](https://www.freecodecamp.org/news/the-css-handbook-a-handy-guide-to-css-for-developers-b56695917d11/)

CSS, or Cascading Style Sheets, enhances the visual presentation of HTML elements. It allows developers to define styles such as colors, fonts, and layouts, ensuring a polished and cohesive appearance across web pages.

#### [JavaScript](https://www.freecodecamp.org/news/the-complete-javascript-handbook-f26b2c71719c/)

JavaScript, a versatile scripting language, adds interactivity to web pages. It enables dynamic content updates, user interactions, and responsive behavior, enhancing the overall user experience on websites.

### Learn Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Official Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Official Next.js with Prisma Example](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Learn Prisma

To learn more about Prisma, take a look at the following resources:

- [Prisma Documentation](https://www.prisma.io/docs)
- [Learn Prisma](https://www.prisma.io/learn)
- [Official Prisma Examples](https://github.com/prisma/prisma-examples)

