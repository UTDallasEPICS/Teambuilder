# EPICS Team Builder 

## Overview

This project is for the EPICS program that helps the Directors to automatically create teams. 
It works by sorting a list of students, available projects, and partners into one group based on an algorithm.
The purpose of this project is to:

- Steamline the team sorting and creation process
- Keep track of the available projects and partners available

## Users/Roles

#### Administration and Directors of EPICS

- View all teams and projects
- Manage teams, projects, partners
- Admin privileges such as adding/removing students from teams
- Look at data analytics


## Functional Requirements

### Shopping Functionality

- The page shall display the item picture, item name, and any existing deal associated with each item for all in-stock items.
- The user shall be able to search for items.
- The user shall be able to filter for items by category and deals.
- The student shall be able to add/remove an item to/from cart.
- The student shall be able to denote the expired count for items in cart.
- The student shall be able to view all cart item information.
- The student shall be able submit cart for verification.

### Questionaire Functionality

- The student shall be able to accept/decline the Statement of Understanding and Nondiscrimination clause.

### Cart Verification Functionality

- For a pending cart, the volunteer/staff shall be able to view the cart's owner and the adjusted count breakdown dependent on actual item count, applied deals, and applied expired items.
- For a pending cart, the page shall display a notification for the following conditions.
  - Cart contains expired items.
  - Adjusted cart item count exceeds 6 items.
  - Adjusted cart item count for a category exceeds 1 item.
- The volunteer/staff shall be able to accept/reject a cart.
  - Upon cart acceptance, the system shall record the cart transaction in the database.
- Upon a cart acceptance/rejection, the corresponding cart owner shall be notified of the result of cart verification.

### Inventory Functionality

- The page shall display the item picture, item name, and any existing deal associated with each item for all items.
- The volunteer/staff shall be able to search for items.
- The volunteer/staff shall be able to filter for items by category and deals.
- The volunteer/staff shall be able to modify an item's image, name, category, quantity, or deal.
- The volunteer/staff shall be able to select a source (eg. Community Garden) when modifying item counts.
- The volunteer/staff shall be able to add an item entity to the inventory.
- The staff shall be able to delete an item entity from the inventory.

### Data Analytics Functionality

data and graphs goes crazy here


## Tech Stack

Front End: Vue, Nuxt
Database: PostgresSQL
Other packages: Prisma
Other technologies: Postman, Node.js, Type Script Execute

## Vue

Look at the [Vue 3 documentation](https://vuejs.org/guide/introduction.html) to learn more.

## Nuxt

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## PostgresSQL

Look at the [Postgres documentation](https://www.postgresql.org/docs/) to learn more.

## Prisma

Look at the [Prisma documentation](https://www.prisma.io/docs) to learn more.

## Postman

Look at the [Postman documentation](https://learning.postman.com/docs/introduction/overview/) to learn more.

## Node.js

Look at the [Node.js documentation](https://nodejs.org/docs/latest/api/) to learn more.

## Type Script Execute

Look at the [Type Script Execute documentation](https://tsx.is/getting-started) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
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
# npm
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
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
