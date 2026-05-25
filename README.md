# BugTrail

BugTrail is a small QA reporting app for website testing. It is intended to be useful enough for real project notes while staying small enough to learn React, GitHub workflows, GitHub Actions, branch protection, pull requests, and deployment.

The app will let a developer or tester create QA projects, add website bugs or UI issues, track status and priority, filter issues, and later export a clean PDF report or share a read-only client view.

## Current Status

This repository currently contains the first React frontend setup using Vite.

Planned first implementation phase:

1. Projects page
2. Create project form
3. Single project page
4. Issue cards
5. Create issue form
6. Status, priority, and device filters

PDF export, read-only client sharing, backend APIs, and authentication are later phases.

## Tech Stack

- React
- Vite
- JavaScript
- ESLint
- GitHub Actions, planned

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Project Scope

A QA project should include information such as:

- project name
- client name
- website URL
- testing type or short description
- testing date

An issue should include:

- title
- description
- priority
- status
- device
- page URL or page name
- notes
- created date

Supported issue priorities:

- Low
- Medium
- High
- Critical

Supported issue statuses:

- Open
- In Progress
- Fixed
- Retest Needed
- Closed

Supported devices:

- Desktop
- Tablet
- Mobile
