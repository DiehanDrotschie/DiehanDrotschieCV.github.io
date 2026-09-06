# Diehan Drotschie — CV / Portfolio Content

This file is the single source of truth for all text/content currently displayed on the
React version of the site, captured before the Astro refactor so nothing is lost.

Downloadable/media assets referenced below live in `public/`:
- `public/DiehanCV.pdf` — downloadable CV
- `public/Photos/pfp.jpg` — profile photo
- `public/Photos/*` — project screenshots (see Portfolio section)

---

## Navigation

- About → `#about`
- Skills → `#skills`
- Work → `#work`
- Experience → `#experience`
- Achievements → `#achievements`
- Contact → `#contact`

Nav bar also has a "Download CV" button linking to `DiehanCV.pdf`.

---

## Hero

**Eyebrow:** Software Developer

**Headline:** Building reliable backend services for live games — C# and .NET at
the core, AWS alongside.

**Subhead:** Software Developer at Games Global, focused on scalable service
development, internal tooling, and AI-assisted workflows — with a data-informed
mindset from a Computer Science background.

**CTAs:** "View Portfolio" (→ `#work`), "Get In Touch" (→ `#contact`)

**Tags/chips:** South African · Software Developer level 1 · .NET + C# Focus

**Image:** `Photos/pfp.jpg`

---

## About

### Summary
Software Developer at Games Global, where I own service development end-to-end —
building .NET/C# game backends, a Blazor-based simulation management and testing
website, and an AI-powered translation tool on AWS Bedrock that cut the team's
localisation costs. BSc Computer Science (Data Science) from Stellenbosch. I've
mentored a junior developer through their first service build, and I'm always
looking for the next thing to build or learn.

### About Me
- **Location:** South Africa
- **Role:** Software Developer, Games Global
- **Focus:** .NET + C# (AWS)

---

## Skills

Grouped the same way as the Skills app in the live site.

### Languages
- Java
- C
- Python
- HTML
- CSS
- R
- Delphi
- C#
- JavaScript
- TypeScript
- Dart
- Svelte

### Frameworks & Tools
- .NET
- Blazor
- Flutter
- React
- PixiJS
- Firebase
- PostgreSQL
- REST APIs
- Docker
- Git
- NUnit
- Postman

### Cloud (AWS)
- AWS API Gateway
- AWS Cognito
- AWS Step Functions
- AWS Lambda
- AWS S3
- AWS EC2
- AWS DynamoDB
- AWS Bedrock
- AWS SNS
- AWS SQS

### Automation
- n8n

### Agile & Collaboration
- Agile
- Jira
- Confluence
- CI/CD

---

## Portfolio / Work

**Superseded 2026-08-20.** This section described the site's *original* (pre-refactor)
six-project list, kept here only as history. The Work app's actual content now comes
from a completely different, much richer source — see below.

### Current source of truth

Each project's **full** write-up (course/client context, architecture notes, every
screenshot with a caption, and a note on how the screenshots were captured) lives in
`ProjectsScreenshotsAndInfo/<slug>/content.md` at the repo root, with the screenshots
alongside it. That folder is the canonical, most-detailed version of each project.

`src/data/projects.js` is a **curated, CV-facing trim** of those write-ups — stack,
role (where applicable), a summary, and the 3-4 most technically substantial
highlights per project — which is what actually renders in the Work app. It is not
a full copy of the `content.md` files; deliberately shorter, focused on what's
relevant to a software engineer's CV. Screenshots are duplicated into
`public/Projects/<slug>/` (Astro only serves `public/`, so the source folder's images
can't be referenced directly).

Current project list (in display order — see `projects.js` for why): Propagen
Website, Real Estate Website (Propagen client site), E-Spaza (CS344), InkLink
(CS343), Instagram Clone, Gomoku AI Player (CS314), DFA-Based Image Compression
(CS214), Moving Maze (CS144), Impasse (CS114), Wedding Table Allocation.

**Dropped**: the original "Tic Tac Toe" project isn't in `ProjectsScreenshotsAndInfo/`
and was dropped when this was rebuilt — the user confirmed that folder is the
definitive project list going forward. If Tic Tac Toe should come back, it needs its
own `ProjectsScreenshotsAndInfo/<slug>/` entry first, not a direct add to
`projects.js`.

If you edit a project's content, update `content.md` in
`ProjectsScreenshotsAndInfo/` first (it's the detailed source), then bring the
relevant trimmed version into `projects.js` to match — don't let the two drift.

---

## Experience

### Software Engineering Internship, Games Global
**June 2024 – July 2024**
Contributed to interactive gameplay features and collaborated with a talented team,
gaining hands-on experience in game development.

### Graduate Software Developer, Games Global
**January 2025 – May 2025**
Focused on service development while upskilling in AWS and C#. Continued to
contribute to interactive gameplay features across team projects.

### Software Developer Level 1, Games Global
**May 2025 – Present**
Took on expanded responsibility across multiple games simultaneously, handling
service-related bug fixes and contributing to game architecture improvements.
Onboarded and mentored a new developer through building their first game service.
Built a Blazor-based simulation management website, hosted on a remote machine,
that lets the team request, run, and sign off game simulations for release — and
supports ad-hoc testing by spawning games via CLI on the remote host, driving them
through HTTP requests, and launching the client to validate changes both visually
and functionally — all while continuing to deepen expertise in C#, .NET, and
scalable backend development.

In 2026, assumed sole ownership of all service development — responsible for
creating, managing, and improving game services end-to-end. Expanded into
client-side development, implementing features across games. Developed an
AI-powered translation tool leveraging AWS to automate and significantly reduce the
cost of the team's localisation workflow.

---

## Achievements

### Professional
Games Global, 2024 - Present.

- Progressed from Software Engineering Intern to Software Developer Level 1 in
  under a year, taking on sole ownership of all service development along the way
- Mentored a new developer through building their first game service
- Completed the AWS Solutions Architect Associate course

### Academic
Robertson High School (2017–2021) | Grade 12 (Senior Certificate) - 94%

- Robertson High School Dux Learners Award
- Top 10 Achievers Award - Western Cape
- Student Council Member: Deputy Head Boy
- Honorary academic awards - 5 years
- 1st Position in Grade - Gr 8-12
- SA Mathematics Olympiad
- Member of Golden Key International Society
- Grade 12 Average: 94.57%

### Culture
- CSV Team Leader

### Sports
- Hockey: 0/19 A First Team, Hockey Umpire, Qualified for Tour team to New Zealand
- Athletics: Captain of Team
- Swimming: School First Team, Captain of Team

### University Education
Stellenbosch University 2022: BSc Computer Science focal area - Data Science.

- Runner-up, Top Undergraduate BSc Computer Science Student, Stellenbosch University

#### 1st Year marks
| Subject | Mark | Remarks |
|---|---|---|
| Computer Science 114 | 91 | Pass with distinction |
| Mathematics 114 | 83 | Pass with distinction |
| Probability Theory and Statistics 114 | 77 | Pass with distinction |
| Science in Context 178 | 77 | Pass with distinction |
| Data Science 141 | 81 | Pass with distinction |
| Computer Science 144 | 94 | Pass with distinction |
| Applied Mathematics 144 | 88 | Pass with distinction |
| Mathematics 144 | 84 | Pass with distinction |

#### 2nd Year marks
| Subject | Mark | Remarks |
|---|---|---|
| Computer Science 214 | 80 | Pass with distinction |
| Applied Mathematics 214 | 85 | Pass with distinction |
| Mathematics 214 | 84 | Pass with distinction |
| Mathematical Statistics 214 | 80 | Pass with distinction |
| Computer Science 244 | 76 | Pass with distinction |
| Mathematics 244 | 82 | Pass with distinction |
| Mathematical Statistics 245 | 60 | Pass |
| Mathematical Statistics 246 | 85 | Pass with distinction |
| Data Science 241 | 76 | Pass with distinction |

#### 3rd Year marks
| Subject | Mark | Remarks |
|---|---|---|
| Computer Science 315 | 83 | Pass with distinction |
| Computer Science 314 | 91 | Pass with distinction |
| Mathematical Statistics 312 | 73 | Pass |
| Data Science 316 | 82 | Pass with distinction |
| Computer Science 343 | 92 | Pass with distinction |
| Computer Science 344 | 86 | Pass with distinction |
| Computer Science 345 | 90 | Pass with distinction |
| Data Science 346 | 84 | Pass with distinction |

---

## Contact

**Heading:** Let us build something solid.
**Subtext:** Reach out for collaborations, roles, or project discussions.

- Email: [diehandrotschie@gmail.com](mailto:diehandrotschie@gmail.com) ("Email Me" button)
- LinkedIn: https://www.linkedin.com/in/diehan-drotschie-168a781b3/ ("LinkedIn" button)

---

## Footer

(c) 2026 Diehan Drotschie. Built with React and Material UI.
(To be updated to reflect Astro after the refactor.)

---

## Assets inventory (must be carried over to Astro `public/`)

- `DiehanCV.pdf`
- `Photos/pfp.jpg`
- `Photos/tictactoe.jpg`
- `Photos/imp1.jpg`
- `Photos/imp2.jpg`
- `Photos/mvz.jpg`
- `Photos/decsoft.jpg`
- `Photos/wedding1.jpg`
- `Photos/wedding2.jpg`
- `Photos/ios1.jpg` … `Photos/ios10.jpg`

## Deployment notes

- Deployed to GitHub Pages at `https://diehandrotschie.github.io/DiehanCV`
- GitHub Actions workflow: `.github/workflows/pages.yml` (build on push/PR to `main`,
  deploy on push to `main` via `peaceiris/actions-gh-pages`)
- `package.json` also has a manual `npm run deploy` via `gh-pages -d dist`
