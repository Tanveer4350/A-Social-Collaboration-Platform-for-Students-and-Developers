# ProjectConnect

## A Social Collaboration Platform for Students and Developers

> **Course:** Enterprise Web Application (UTA024)  
> **Institution:** Thapar Institute of Engineering & Technology, Patiala  
> **Submitted To:** Mr. Kashish Kausal  
> **Submitted By:**
> - **Tanveer Singh** (Roll No: 1024030244)
> - **Simerose Kaur** (Roll No: 1024030248)
> - **Harleen Singh** (Roll No: 1024030249)  
> **Batch:** BE Third Year Batch – 3C18 (Computer Science & Engineering)

---

## 📌 Project Overview

**ProjectConnect** is a full-stack social collaboration platform purpose-built for **students and developers** to showcase technical skills, share code snippets and engineering insights, discover real-world projects, recruit teammates, and communicate in real time.

Unlike general social media or corporate networking networks, ProjectConnect combines **technical knowledge sharing** (syntax-highlighted posts, code discussions, tag filtering) with **active project collaboration** (role recruitment, pitch applications, team workspace discussions, and skill-based synergy matching).

---

## 🚀 Key Features

### 1. 🔐 Authentication & Security
- **JWT (JSON Web Token)** stateless authentication with Spring Security 6.
- **BCrypt** password hashing and role-based access controls (`ROLE_STUDENT`, `ROLE_DEVELOPER`, `ROLE_ADMIN`).
- Instant quick-fill demo logins for team evaluators and guests.

### 2. 👨‍💻 Technical User Profiles
- Customizable profile with avatar, headline, bio, education, GitHub, LinkedIn, and portfolio links.
- Interactive **Skill & Interest Pills** with tag management.
- Tabbed profile workspace: User's Posts, Created Projects, Joined Projects, Followers, and Following.

### 3. 📰 Social Feed & Code Sharing
- Create and format technical posts with **syntax-highlighted code snippets** (Java, TypeScript, Python, SQL, etc.).
- Multi-tag classification (e.g. `#SpringBoot`, `#React`, `#SystemDesign`).
- Interactive likes with animation, expandable comments section with author attribution, and shareable permalinks.
- Feed filters: **All Feed**, **Following Feed**, **Trending Discussions**, and **Tag Filtering**.

### 4. 📂 Project Collaboration Hub
- Create and discover collaborative software projects.
- Define required skills, technology stacks, target team size, GitHub repos, and live demos.
- Filter by status: `Recruiting (OPEN)`, `In Progress`, `Completed`, or by tech stack keywords.
- **Application Workflow:** Applicants submit a pitch note; Project Owners can review, accept, or reject applications with instant team roster updates.

### 5. ⚡ Smart Skill-Based Matching Engine
- Multi-factor algorithm matching user skillsets with project requirements and developer profiles:
  - **Project Match %:** Computes overlap between user skills and project required tags.
  - **Collaborator Synergy %:** Analyzes common skills + complementary tech + shared interests.

### 6. 💬 Real-Time Direct & Team Messaging
- 1-on-1 private messaging with unread badges.
- **Project Team Channels:** Dedicated group workspaces for accepted project members to coordinate tasks and requirements.
- Full WebSocket (STOMP + SockJS) infrastructure with REST fallback.

### 7. 🔔 Live Notifications
- Real-time alerts for likes, comments, new followers, project application submissions, application status updates (accepted/declined), and direct messages.
- Flyout notification dropdown with unread badge counter and "Mark all as read" functionality.

### 8. 🔍 Unified Search
- Live multi-index search across Users, Projects, Technical Posts, and Skills.

---

## 🏗️ Architecture & Technology Stack

```
                     ┌────────────────────────┐
                     │   React 18 + Vite UI   │
                     │ Tailwind CSS + Lucide  │
                     └───────────┬────────────┘
                                 │
                   REST APIs     │     WebSocket (STOMP/SockJS)
                   (JSON / JWT)  │     (Real-Time Messaging)
                                 ▼
                     ┌────────────────────────┐
                     │   Spring Boot 3.3.4    │
                     │  Java 17/21/26 Backend │
                     └───────────┬────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
          ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
          │   Spring    │ │   Service   │ │  WebSocket  │
          │  Security   │ │    Layer    │ │   Broker    │
          └─────────────┘ └──────┬──────┘ └─────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │  Spring Data JPA +     │
                     │   Hibernate ORM Layer  │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │ Relational Database    │
                     │ H2 (Embedded Zero-Cfg) │
                     │ MySQL / PostgreSQL     │
                     └────────────────────────┘
```

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router 6, SockJS, StompJS |
| **Backend** | Java 17+, Spring Boot 3.3.4, Spring MVC, Spring Security, Spring Data JPA, Hibernate, Spring WebSocket |
| **Security** | JWT (`io.jsonwebtoken` JJWT 0.12.5), BCrypt Password Encoder |
| **Database** | H2 (Default embedded with in-memory persistence & console), MySQL / PostgreSQL support |
| **Build Tools** | Maven 3.9+, Node.js / NPM |

---

## ⚡ Quick Start Guide

### Option 1: 1-Click Startup (Windows)
Double-click `start.bat` (or execute `.\start.ps1` in PowerShell) in the root directory. This will start both the backend server and frontend development server simultaneously.

### Option 2: Manual Terminal Execution

#### 1. Start the Backend Server:
```bash
cd backend
mvn spring-boot:run
```
*(Backend will initialize and listen on `http://localhost:8080` with sample demo data automatically seeded).*

#### 2. Start the Frontend Server:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend will be accessible at `http://localhost:5173`).*

---

## 👥 Demo Accounts (Pre-Seeded)

All demo accounts use password: `password123`

| Username | Role | Specialization | Description |
|---|---|---|---|
| `tanveer` | `ROLE_DEVELOPER` | Java, Spring Boot, React, Docker | ProjectConnect Project Lead |
| `simerose` | `ROLE_STUDENT` | React, UI/UX, Tailwind CSS, Figma | Frontend Lead & Student |
| `harleen` | `ROLE_STUDENT` | Spring Data JPA, PostgreSQL, SQL | Database Architect & Student |
| `sarah_ai` | `ROLE_DEVELOPER` | Python, PyTorch, LangChain, AI | AI / ML Researcher |
| `alex_dev` | `ROLE_DEVELOPER` | TypeScript, Next.js, Kubernetes | Senior DevOps Engineer |

---

## 📡 Key REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student or developer.
- `POST /api/auth/login` — Authenticate and receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated profile.

### Technical Feed & Posts (`/api/posts`)
- `GET /api/posts` — Get all posts in reverse chronological order.
- `GET /api/posts/feed` — Get posts from followed users.
- `GET /api/posts/trending` — Get trending posts scored by engagement.
- `GET /api/posts/tag/{tag}` — Filter posts by hashtag.
- `POST /api/posts` — Create a new post with code snippet & tags.
- `POST /api/posts/{id}/like` — Toggle like on a post.
- `POST /api/posts/{id}/comments` — Post a comment on a technical post.

### Projects Collaboration (`/api/projects`)
- `GET /api/projects` — List projects with status and tech filter.
- `POST /api/projects` — Create and publish a collaboration project.
- `GET /api/projects/{id}` — Project workspace details.
- `POST /api/projects/{id}/apply` — Submit application with pitch note.
- `GET /api/projects/{id}/applications` — View applications (owner only).
- `POST /api/projects/applications/{id}/respond` — Accept or decline applicant.

### Messaging & Notifications (`/api/messages`, `/api/notifications`)
- `GET /api/messages/conversations` — List active chats with unread badges.
- `GET /api/messages/user/{userId}` — Fetch direct message thread.
- `GET /api/messages/project/{projectId}` — Fetch team group conversation.
- `POST /api/messages` — Send direct or team message.
- `GET /api/notifications` — Retrieve user activity notifications.
- `PATCH /api/notifications/read-all` — Mark all alerts as read.

### Smart Matching & Search (`/api/recommendations`, `/api/search`)
- `GET /api/recommendations` — Compute and fetch personalized project and teammate matches with synergy scores.
- `GET /api/search?q={query}` — Unified search across users, projects, and posts.

---

## 🗄️ Database Console
The embedded H2 database console is enabled by default:
- **URL:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:projectconnectdb`
- **Username:** `sa`
- **Password:** `password`
#   C o l l a b o r a t i o n - S t u d e n t - D e v e l o p e r  
 