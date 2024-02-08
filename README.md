# UTDesign EPICS Teambuilder Project

This project is the Spring 2024 EPICS Team formation project. The core technologies used are:

- [Next.js](https://nextjs.org): A full stack web development framework
- [Prisma](https://prisma.io): A database ORM used to connect Next.js to a database
- [PostgreSQL](https://www.postgresql.org): An open source SQL database
- [ReactJS](https://www.react.dev): A front-end Javascript library for building UI based on components

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
2. Run your project (see the [running the project section].(#running-your-project))
3. Start coding!

## Prerequisites

In order to run this project, a few technologies are required:

- [Node.js](https://nodejs.org)
- [Docker](https://www.docker.com)

If you have these installed already, you can skip to [running this project](#running-this-project).

Node.js is what allows us to write all our applications in JavaScript. Usually, JavaScript is run only in a web browser. By building on top of Node.js, we can write code that is executed on the server, simpler to write, and/or more secure.

Docker is a container framework. Containers allow us to standardize the environment that software runs on. In the case of this project, we use Docker to run the PostgreSQL database. By running the database in a container, the database of every person on the team will be configured exactly the same way. Since databases are quite complex applications, this greatly reduces the likelihood of experiencing issues with the database.

### Installing Node

#### Node for Windows/Mac/Linux

You can install node from the [Node.js downloads page](https://nodejs.org/en/download). 

### Installing React

#### React for Windows/Mac/Linux

Instructions to install react [here](https://kinsta.com/knowledgebase/install-react/).

### Installing Docker

Docker Desktop is the recommended way to install Docker. If you choose to install Docker another way, there is no guarantee that you will have everything installed correctly. To install docker desktop download and run the installer from [Docker's Getting Started Page](https://www.docker.com/get-started/).

### Installing pnpm (recommended/optional)

pnpm is an improved version of the Node Package Manager (npm). Though not required, it is highly recommended that you install it. You can install it using the following command in your terminal/powershell after node has been installed

```bash
npm install -g pnpm
```

If you choose to install pnpm, then you can substitute all usage of 'npm' with 'pnpm' and all usage of 'npx' with 'pnpx'. Additionally, you can create an alias in your `.bashrc` (Linux) or `.zshrc` (Mac) files. This will mean that when you type in npm or npx, pnpm and pnpx will be substituted. Use the following commands to add the aliases to the corresponding file:

```bash
# Linux
echo 'alias npm="pnpm"' >> .bashrc

# Mac
echo 'alias npm="pnpm"' >> .zshrc
```

## Running This Project

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

### Learn HTML, CSS, JavaScript, and TypeScript

#### HTML

Websites are built using HTML, CSS, and JavaScript. HTML, or Hypertext Markup Language, is a markup language for the web that defines the structure of web pages[^1]. Examples of these structures include paragraphs, headings, headers, footers, lists, navigation, and images. Each one of these components is defined in an HTML file for every website you visit.

[^1]: [What is HTML - Definition and Meaning of Hypertext Markup Language by freeCodeCamp](https://www.freecodecamp.org/news/what-is-html-definition-and-meaning/)

#### CSS

#### JavaScript

#### TypeScript

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

## Deploying This Project
