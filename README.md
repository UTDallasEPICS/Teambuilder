# UTDesign EPICS Teambuilder Project

This project is the Spring 2024 EPICS Team formation project. The core technologies used are:

- [ReactJS](https://www.react.dev): A front-end Javascript library for building UI based on components
- [Next.js](https://nextjs.org): A full stack web development framework
- [Prisma](https://prisma.io): A database ORM used to connect Next.js to a database
- [PostgreSQL](https://www.postgresql.org): An open source SQL database

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Table of Contents</h2></summary>

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
  - [Installing Node](#installing-node)
    - [Node for Windows](#node-for-windows)
    - [Node for Mac/Linux](#node-for-maclinux)
  - [Installing Docker](#installing-docker)
  - [Installing pnpm (recommended/optional)](#installing-pnpm-recommendedoptional)
- [Running This Project](#running-this-project)
- [Learn More](#learn-more)
  - [Learn HTML, CSS, JavaScript, and TypeScript](#learn-html-css-javascript-and-typescript)
    - [HTML](#html)
    - [CSS](#css)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
  - [Learn Next.js](#learn-nextjs)
  - [Learn Prisma](#learn-prisma)
- [Deploying This Project](#deploying-this-project)

</details>

## Getting Started

1. Setup your development environment to ensure you have everything installed to run the project (see the [prerequisites section](#prerequisites)).
2. Run your project (see the [running the project section](#running-this-project)).
3. Start coding!

## Requirements from Taz in Discord
projects should be their own entities in the database, with associated descriptions, links to external resources such as the github repo, etc. projects need a status too, something like 'in progress', 'delivered', etc. can also think about putting seniority requirements, major requirements, etc in this database table as well.
generated teams must be associated with a semester. conceptually, this may be representred as 'create new semester roster', where the semester must be specified (year, spring/summer/fall) BEFORE we get into the weeds of things
with projects living in the database, we can select which projects need teams for the current roster we are making via a dropdown select instead of relying on a CSV upload which eliminates a whole class of possible bugs.
after teams have been generated, we can save the roster to the database - probably a join table between students table and projects table, where the join table is labeled with semester information (project_id, student_id, year, spring/fall/summer)
we will want to be integrating various other useful automations like auto-assigning teams to discord channels/github repos, generating PDFs of teams, etc. we dont need to get into the weeds of that just yet but keep the concept of integrating with external services in mind as we design and build this thing
when loading students from an uploaded CSV, we should make sure that we check which ones are returning and already have entries in the database we can reuse - key by netid/email

all of the above should be chewed over by the team and converted into requirements for the readme.md in the repo as well as broken out into issues on the repo 

## Prerequisites

In order to run this project, a few technologies are required:

- [ReactJS](https://www.react.dev)
- [Node.js](https://nodejs.org)
- [Docker](https://www.docker.com)

If you have these installed already, you can skip to [running this project](#running-this-project).

React.js transforms web development by extending JavaScript to create dynamic and responsive user interfaces. It simplifies the development process with a declarative syntax and a component-based architecture, enabling easier maintenance and scalability. With React.js, developers seamlessly integrate front-end and back-end functionality for simpler, more secure application development.

Node.js is what allows us to write all our applications in JavaScript. Usually, JavaScript is run only in a web browser. By building on top of Node.js, we can write code that is executed on the server, simpler to write, and/or more secure.

Docker is a container framework. Containers allow us to standardize the environment that software runs on. In the case of this project, we use Docker to run the PostgreSQL database. By running the database in a container, the database of every person on the team will be configured exactly the same way. Since databases are quite complex applications, this greatly reduces the likelihood of experiencing issues with the database.

### Installing React

Instructions to install react [here](https://kinsta.com/knowledgebase/install-react/).

### Installing Node

You can install node from the [Node.js downloads page](https://nodejs.org/en/download). 

### Installing Docker

Docker Desktop is the recommended way to install Docker. If you choose to install Docker another way, there is no guarantee that you will have everything installed correctly. To install docker desktop download and run the installer from [Docker's Getting Started Page](https://www.docker.com/get-started/).


## Running This Project

First, run the development server:


## Deploying This Project

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


