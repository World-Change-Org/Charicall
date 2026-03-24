<div align="center">
  <h1>❤️ Charicall</h1>
  <p><strong>A transparent, cause-driven charity donation platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square" />
    <img src="https://img.shields.io/badge/Backend-NestJS-E0234E?style=flat-square&logo=nestjs" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql" />
    <img src="https://img.shields.io/badge/ORM-TypeORM-FE0902?style=flat-square" />
    <img src="https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens" />
    <img src="https://img.shields.io/badge/Docs-Swagger-85EA2D?style=flat-square&logo=swagger" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  </p>
</div>

---

## Table of Contents

1. [Overview](#-overview)
2. [Mission Statement](#-mission-statement)
3. [Cause Categories](#-cause-categories)
4. [Features](#-features)
5. [Architecture](#-architecture)
6. [Project Structure](#-project-structure)
7. [Tech Stack](#-tech-stack)
8. [Data Models](#-data-models)
9. [API Reference](#-api-reference)
10. [Authentication & Authorization](#-authentication--authorization)
11. [Donation Flow](#-donation-flow)
12. [Environment Variables](#-environment-variables)
13. [Getting Started (Local Development)](#-getting-started-local-development)
14. [Running with Docker](#-running-with-docker)
15. [Testing](#-testing)
16. [Deployment](#-deployment)
17. [Security](#-security)
18. [Roadmap](#-roadmap)
19. [Contributing](#-contributing)
20. [Code of Conduct](#-code-of-conduct)
21. [License](#-license)

---

## 📖 Overview

**Charicall** is an open-source, full-stack charity donation platform that connects compassionate donors with verified humanitarian causes. Unlike generic fundraising platforms, Charicall is built around **cause categories** — giving donors full clarity on exactly what their money supports.

Every donation on Charicall is:
- **Transparent** — tracked from submission to disbursement
- **Categorised** — attributed to a specific, verified humanitarian cause
- **Accountable** — managed by verified organisations with admin oversight

The platform serves three actors: **donors** who give, **organisations** (NGOs, charities, foundations) who manage causes and withdraw funds, and **administrators** who verify organisations and oversee platform integrity.

---

## 💛 Mission Statement

> _"We believe that giving should be simple, trustworthy, and meaningful. Charicall exists to remove the friction between compassion and action — so that anyone, anywhere, can direct their generosity to where it matters most."_

Charicall is built with the conviction that every dollar donated deserves to be tracked, every cause deserves verification, and every donor deserves confidence that their contribution is making a real difference.

---

## 🗂️ Cause Categories

Charicall organises charitable causes into the following primary categories. Each category contains multiple individual causes created and managed by verified organisations.

| Icon | Category | Description |
|---|---|---|
| 🌊 | **Relief Funds** | Emergency and general humanitarian aid for communities facing poverty, famine, earthquakes, floods, and other crises. Funds are disbursed rapidly to maximise impact. |
| 🎗️ | **Cancer Patients** | Financial support covering treatment costs, chemotherapy, palliative care, psychological support, and cancer research grants for patients who cannot afford care. |
| 🌀 | **Hurricane Victims** | Rapid-response relief for individuals and families whose homes, livelihoods, and communities have been devastated by hurricanes, cyclones, and tropical storms. |
| 🎀 | **HIV / AIDS** | Programmes targeting treatment access (ARVs), awareness campaigns, education initiatives, stigma reduction, orphan support, and long-term care for those living with HIV/AIDS. |

> **Note for administrators:** New categories can be created through the admin panel as global humanitarian needs evolve. All categories require admin approval before going live on the platform.

---

## ✨ Features

### For Donors
- **Browse causes** by category, urgency, funding progress, or location
- **Donate securely** with full confirmation and receipt
- **Personal donation dashboard** — view total giving, causes supported, and impact reports
- **Campaign updates** — receive notifications when causes they've donated to post updates
- **Anonymous giving** — opt out of public attribution while maintaining internal records

### For Organisations
- **Campaign management** — create, update, and close individual causes
- **Fund disbursement** — submit verified withdrawal requests for disbursement of raised funds
- **Donor analytics** — view aggregate giving statistics per campaign
- **Organisation profile** — public-facing page showcasing verified status, mission, and active causes
- **Impact reporting** — post updates to donors on how funds are being used

### For Administrators
- **Organisation verification** — review and approve/reject organisation applications
- **Cause moderation** — approve causes before publication, flag suspicious campaigns
- **Platform analytics** — total donations, active causes, donor retention, category breakdowns
- **User management** — manage donor and organisation accounts
- **Withdrawal approval** — review and approve fund disbursement requests from organisations

### Platform-wide
- 🔐 **JWT-secured API** with role-based access control
- 📬 **Email notifications** for donations, receipts, withdrawals, and updates
- 📊 **Real-time funding progress** bars for each cause
- 🌍 **Multi-currency support** (planned)
- ⛓️ **On-chain donation records** via smart contracts (planned)
- 📱 **Responsive web application** accessible on all devices (planned)

---

## 🏗️ Architecture

Charicall follows a **monorepo structure** with three major subsystems — a REST API backend, a web frontend, and a smart contract layer.

```
┌───────────────────────────────────────────────────────────┐
│                        CHARICALL                          │
│                                                           │
│   ┌─────────────┐   REST/JSON   ┌────────────────────┐   │
│   │             │◄─────────────►│                    │   │
│   │  Frontend   │               │  NestJS Backend    │   │
│   │  (Next.js)  │               │  REST API          │   │
│   │             │               │                    │   │
│   └─────────────┘               └────────┬───────────┘   │
│                                          │                │
│                              ┌───────────▼──────────┐    │
│                              │   PostgreSQL Database │    │
│                              │   (TypeORM)           │    │
│                              └───────────────────────┘    │
│                                                           │
│   ┌────────────────────────────────────────────────────┐  │
│   │  Smart Contract Layer (Solidity)  — planned        │  │
│   │  Immutable on-chain donation record keeping        │  │
│   └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### Backend Architecture (NestJS)

The backend follows NestJS's **modular architecture pattern**. Each domain is encapsulated in its own module with its own controllers, services, DTOs, and entities.

```
src/
├── auth/               # Authentication — login, register, JWT strategy
├── users/              # User accounts — donors and organisation users
├── organisations/      # NGO/charity org management and verification
├── causes/             # Cause CRUD, categories, progress tracking
├── categories/         # Cause categories (relief, cancer, hurricane, HIV)
├── donations/          # Donation processing and history
├── withdrawals/        # Fund disbursement requests and approvals
├── notifications/      # Email and in-app notifications
├── admin/              # Admin-only routes and reporting
└── common/             # Shared guards, decorators, interceptors, pipes
```

---

## 📁 Project Structure

```
Charicall/
│
├── README.md                   ← You are here
│
├── Backend/                    # NestJS REST API server
│   ├── src/
│   │   ├── main.ts             # App bootstrap — Swagger, pipes, CORS
│   │   ├── app.module.ts       # Root module — Config + TypeORM
│   │   ├── auth/               # JWT auth module
│   │   ├── users/              # User management
│   │   ├── causes/             # Cause management
│   │   ├── categories/         # Cause categories
│   │   ├── donations/          # Donation processing
│   │   ├── organisations/      # Org management and verification
│   │   ├── withdrawals/        # Fund withdrawal requests
│   │   └── common/             # Shared utilities, guards, decorators
│   ├── test/                   # e2e tests
│   ├── .env                    # Local environment variables (never commit)
│   ├── .env.example            # Environment variable template
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── Frontend/                   # Web client (Next.js) — planned
│   ├── app/
│   ├── components/
│   ├── styles/
│   └── package.json
│
└── Contract/                   # Solidity smart contracts — planned
    ├── src/
    │   └── CharicallDonation.sol
    ├── test/
    └── foundry.toml / hardhat.config.ts
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [NestJS](https://nestjs.com/) | v10+ | Primary server framework — modular, scalable TypeScript |
| [TypeORM](https://typeorm.io/) | latest | ORM — entities, relations, migrations |
| [PostgreSQL](https://www.postgresql.org/) | v14+ | Primary relational database |
| [Passport.js](https://www.passportjs.org/) | latest | Auth middleware |
| [@nestjs/jwt](https://github.com/nestjs/jwt) | latest | JWT token generation and validation |
| [class-validator](https://github.com/typestack/class-validator) | latest | DTO input validation |
| [class-transformer](https://github.com/typestack/class-transformer) | latest | Object transformation and serialisation |
| [@nestjs/config](https://docs.nestjs.com/techniques/configuration) | latest | Environment variable management |
| [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) | latest | Auto-generated OpenAPI/Swagger docs |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | latest | Password hashing |
| [Nodemailer](https://nodemailer.com/) | latest | Transactional email (receipts, alerts) |

### Frontend _(planned)_
| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework — SSR, routing, API integration |
| [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [React Query](https://tanstack.com/query) | Server state and data fetching |
| [Stripe / Paystack](https://stripe.com/) | Payment processing |

### Smart Contracts _(planned)_
| Technology | Purpose |
|---|---|
| [Solidity](https://soliditylang.org/) | On-chain donation record logic |
| [Foundry](https://getfoundry.sh/) | Contract testing and deployment |
| [Ethers.js](https://ethers.org/) | Frontend contract interaction |

---

## 🗄️ Data Models

Below are the core entities that power the Charicall platform.

### `User`
```
id            UUID        Primary key
email         string      Unique — used for login
passwordHash  string      bcrypt hashed
firstName     string
lastName      string
role          enum        donor | organisation | admin
isVerified    boolean     Email verification status
createdAt     timestamp
updatedAt     timestamp
```

### `Organisation`
```
id            UUID        Primary key
userId        UUID        FK → User (one-to-one, org admin account)
name          string      Organisation display name
description   text        Mission and background
websiteUrl    string      Public website
logoUrl       string      Logo image URL
isVerified    boolean     Admin-approved flag
verifiedAt    timestamp
causes        Cause[]     One-to-many
createdAt     timestamp
```

### `Category`
```
id            UUID        Primary key
name          string      e.g. "Relief Funds", "Cancer Patients"
slug          string      URL-safe identifier
description   text
isActive      boolean
```

### `Cause`
```
id            UUID        Primary key
organisationId UUID       FK → Organisation
categoryId    UUID        FK → Category
title         string      Campaign title
description   text        Full cause description
targetAmount  decimal     Fundraising goal
raisedAmount  decimal     Current total raised
currency      string      Default: USD
status        enum        draft | active | paused | completed | closed
imageUrl      string      Hero image for the cause
startDate     timestamp
endDate       timestamp   Optional campaign deadline
donations     Donation[]  One-to-many
createdAt     timestamp
updatedAt     timestamp
```

### `Donation`
```
id            UUID        Primary key
donorId       UUID        FK → User
causeId       UUID        FK → Cause
amount        decimal
currency      string
isAnonymous   boolean     Hides donor identity on public pages
paymentRef    string      External payment provider reference
status        enum        pending | successful | failed | refunded
receiptSentAt timestamp
createdAt     timestamp
```

### `Withdrawal`
```
id              UUID        Primary key
organisationId  UUID        FK → Organisation
causeId         UUID        FK → Cause
amount          decimal
bankDetails     jsonb       Encrypted bank/payment account details
status          enum        pending | approved | rejected | disbursed
requestedAt     timestamp
reviewedAt      timestamp
reviewedByAdminId UUID      FK → User (admin)
notes           text        Admin notes on decision
```

---

## 📚 API Reference

All routes are prefixed with `/api`. Interactive docs available at `http://localhost:3000/api/docs`.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new donor account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `POST` | `/api/auth/refresh` | Bearer | Refresh an expired access token |
| `GET` | `/api/auth/me` | Bearer | Get the currently authenticated user's profile |
| `POST` | `/api/auth/logout` | Bearer | Invalidate the current session |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/me` | Bearer | Get own profile |
| `PATCH` | `/api/users/me` | Bearer | Update name, email, password |
| `GET` | `/api/users/me/donations` | Bearer | Get own donation history |

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List all active cause categories |
| `GET` | `/api/categories/:slug` | Public | Get a category and its active causes |
| `POST` | `/api/categories` | Admin | Create a new category |
| `PATCH` | `/api/categories/:id` | Admin | Update a category |
| `DELETE` | `/api/categories/:id` | Admin | Deactivate a category |

### Causes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/causes` | Public | List all active causes (filterable by category, status, organisation) |
| `GET` | `/api/causes/:id` | Public | Get full detail of a cause including progress |
| `POST` | `/api/causes` | Organisation | Create a new cause (starts as `draft`) |
| `PATCH` | `/api/causes/:id` | Organisation | Update cause details |
| `POST` | `/api/causes/:id/publish` | Organisation | Submit cause for admin review |
| `POST` | `/api/causes/:id/close` | Organisation | Close a completed cause |
| `POST` | `/api/causes/:id/approve` | Admin | Approve a cause and make it live |
| `POST` | `/api/causes/:id/reject` | Admin | Reject a cause with a reason |

### Donations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/donations` | Bearer (donor) | Submit a donation to a cause |
| `GET` | `/api/donations/:id` | Bearer | Get donation detail and status |
| `GET` | `/api/donations/my` | Bearer | List all personal donations |
| `GET` | `/api/donations/cause/:causeId` | Public | List public (non-anonymous) donors for a cause |

### Organisations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/organisations/apply` | Bearer (donor) | Apply to register as a charity organisation |
| `GET` | `/api/organisations` | Public | List all verified organisations |
| `GET` | `/api/organisations/:id` | Public | Get organisation profile and active causes |
| `PATCH` | `/api/organisations/me` | Organisation | Update own organisation profile |
| `POST` | `/api/organisations/:id/verify` | Admin | Approve an organisation application |
| `POST` | `/api/organisations/:id/reject` | Admin | Reject an organisation application |

### Withdrawals

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/withdrawals` | Organisation | Request a withdrawal of raised funds |
| `GET` | `/api/withdrawals/my` | Organisation | List own withdrawal requests |
| `GET` | `/api/withdrawals` | Admin | List all withdrawal requests |
| `POST` | `/api/withdrawals/:id/approve` | Admin | Approve a withdrawal request |
| `POST` | `/api/withdrawals/:id/reject` | Admin | Reject a withdrawal request with reason |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Platform-wide analytics and totals |
| `GET` | `/api/admin/users` | Admin | List all platform users |
| `PATCH` | `/api/admin/users/:id` | Admin | Update any user account |
| `GET` | `/api/admin/donations` | Admin | View all donations platform-wide |

---

## 🔐 Authentication & Authorization

### How it Works

Charicall uses **JWT Bearer tokens** for authentication.

1. The client sends credentials to `POST /api/auth/login`
2. On success, the server returns an `access_token` (short-lived) and `refresh_token` (long-lived)
3. The client includes `Authorization: Bearer <access_token>` on subsequent requests
4. Expired access tokens can be refreshed at `POST /api/auth/refresh`

### Role-Based Access Control (RBAC)

| Role | Who | Access |
|---|---|---|
| `donor` | Registered donors | Browse causes, donate, view own history |
| `organisation` | Verified NGOs / charities | Manage their own causes and withdrawal requests |
| `admin` | Platform administrators | Full platform access, moderation, analytics |

Guards at the route level enforce RBAC. Attempting to access a higher-privilege route returns `403 Forbidden`.

### Password Security
- Passwords are hashed with **bcrypt** (salt rounds: 12) before storage
- Plain-text passwords are **never stored or logged**

---

## 💸 Donation Flow

```
Donor selects a Cause
        │
        ▼
Donor submits donation amount
        │
        ▼
POST /api/donations
  → Donation record created (status: pending)
  → Payment initiated via payment provider (Stripe/Paystack)
        │
        ├── Payment SUCCESS
        │       → Donation status → successful
        │       → Cause.raisedAmount updated
        │       → Receipt email sent to donor
        │       → Organisation notified
        │
        └── Payment FAILURE
                → Donation status → failed
                → Donor notified with error details
```

---

## ⚙️ Environment Variables

All environment variables are defined in `.env`. Use `.env.example` as your template.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | Yes | `development` | App environment (`development`, `production`, `test`) |
| `PORT` | No | `3000` | Port the HTTP server listens on |
| `DB_HOST` | Yes | `localhost` | PostgreSQL host |
| `DB_PORT` | Yes | `5432` | PostgreSQL port |
| `DB_USERNAME` | Yes | `postgres` | Database username |
| `DB_PASSWORD` | Yes | `postgres` | Database password |
| `DB_NAME` | Yes | `charicall` | Database name |
| `JWT_SECRET` | Yes | — | Secret key for signing JWT tokens — use a long, random string in production |
| `JWT_EXPIRES_IN` | No | `7d` | JWT access token expiry duration |
| `SMTP_HOST` | No | — | SMTP server host for sending emails |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | — | SMTP authentication username |
| `SMTP_PASS` | No | — | SMTP authentication password |
| `SMTP_FROM` | No | — | "From" address for outgoing emails |
| `STRIPE_SECRET_KEY` | No | — | Stripe secret key for payment processing |
| `PAYSTACK_SECRET_KEY` | No | — | Paystack secret key used by backend payment initialization/verification |
| `PAYSTACK_CALLBACK_URL` | No | `http://localhost:3000/api/payments/paystack/verify` | Callback URL sent to Paystack during transaction initialization |
| `FRONTEND_URL` | No | `http://localhost:3001` | Allowed CORS origin for the frontend |

> ⚠️ **Never commit your `.env` file to version control.** It is listed in `.gitignore`.

---

## 🚀 Getting Started (Local Development)

### Prerequisites

Ensure you have the following installed:

- **Node.js** `v18+`
- **npm** `v9+`
- **PostgreSQL** `v14+`

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/charicall.git
cd charicall
```

### Step 2 — Set Up the Backend

```bash
cd Backend
cp .env.example .env
```

Open `.env` and fill in your local database credentials and a secure JWT secret.

### Step 3 — Create the Database

```bash
psql -U postgres -c "CREATE DATABASE charicall;"
```

### Step 4 — Install Dependencies

```bash
npm install
```

### Step 5 — Run the Development Server

```bash
npm run start:dev
```

The API will be available at:

| Service | URL |
|---|---|
| REST API | `http://localhost:3000/api` |
| Swagger Docs | `http://localhost:3000/api/docs` |

### Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start in watch mode (hot reload) |
| `npm run start:prod` | Start compiled production build |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint` | Run ESLint on all source files |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end test suite |
| `npm run test:cov` | Run tests with coverage report |

---

## 🐳 Running with Docker

The backend and PostgreSQL database are fully containerised with `docker-compose.yml`.

### Prerequisites

- Docker Desktop (or Docker Engine + Compose)

### Step 1 — Configure Environment Variables

```bash
cd Backend
cp .env.example .env
```

`docker-compose.yml` loads `Backend/.env` and overrides `DB_HOST` to `db` so the backend can connect to the Postgres service container.

### Step 2 — Build and Start Services

```bash
cd ..
docker compose up --build
```

### Services

| Service | URL/Port | Notes |
|---|---|---|
| Backend API | `http://localhost:3000/api` | NestJS production build running in container |
| Swagger Docs | `http://localhost:3000/api/docs` | OpenAPI docs |
| PostgreSQL | `localhost:5432` | Database persisted to Docker volume `pg_data` |

### Useful Commands

```bash
# Start in detached mode
docker compose up -d --build

# Stop and remove containers
docker compose down

# Stop and remove containers + database volume
docker compose down -v
```

---

## 🧪 Testing

### Unit Tests

Unit tests are co-located with their source files (`*.spec.ts`). They test individual services and utilities in isolation using mocked dependencies.

```bash
npm run test
```

### End-to-End Tests

E2e tests are located in the `test/` directory and test full request/response cycles against a real test database.

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:cov
```

Coverage reports are generated in `.coverage/`. Aim for >80% coverage across services.

---

## 🚢 Deployment

### Environment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use a strong, unique `JWT_SECRET`
- [ ] Set `DB_*` to point to a managed/cloud PostgreSQL instance
- [ ] Configure SMTP credentials for transactional emails
- [ ] Set `FRONTEND_URL` to your deployed frontend domain
- [ ] Disable TypeORM `synchronize` (use migrations instead)

### Building for Production

```bash
npm run build
npm run start:prod
```

### Recommended Hosting

| Layer | Recommended Platform |
|---|---|
| Backend API | Railway, Render, AWS ECS, Heroku |
| Database | Supabase, Neon, AWS RDS, Railway Postgres |
| Frontend | Vercel, Netlify |
| File Storage | AWS S3, Cloudinary (for org logos, cause images) |

---

## 🔒 Security

Charicall takes security seriously. The following measures are implemented or planned:

| Area | Measure |
|---|---|
| Authentication | JWT with short expiry + refresh token rotation |
| Passwords | bcrypt with salt rounds ≥ 12 |
| Input validation | `class-validator` on all DTOs — whitelist mode enabled |
| SQL injection | All queries via TypeORM parameterised queries |
| Rate limiting | `@nestjs/throttler` on auth and donation endpoints |
| CORS | Restricted to frontend origin via `FRONTEND_URL` |
| Secrets management | All secrets loaded via environment variables, never hardcoded |
| HTTPS | Enforced at infrastructure/reverse proxy level (Nginx / load balancer) |
| XSS | Output sanitisation on user-provided content |

> **Found a security vulnerability?** Please disclose it privately to `security@charicall.org` — do not open a public issue.

---

## 🗺️ Roadmap

### Phase 1 — Foundation _(current)_
- [x] NestJS backend scaffold with TypeORM, Config, Swagger, JWT
- [ ] Auth module (register, login, refresh, roles)
- [ ] User and organisation modules
- [ ] Cause and category modules
- [ ] Donation processing module
- [ ] Admin module

### Phase 2 — Payments & Notifications
- [ ] Stripe / Paystack payment integration
- [ ] Donation receipts via email
- [ ] Cause progress tracking (real-time via WebSockets)
- [ ] Organisation campaign update notifications

### Phase 3 — Frontend
- [ ] Next.js donor-facing web application
- [ ] Organisation dashboard
- [ ] Admin panel
- [ ] Progressive Web App (PWA) support

### Phase 4 — On-Chain Transparency _(planned)_
- [ ] Solidity smart contract for immutable donation records
- [ ] Contract deployment on Ethereum / Base / Polygon
- [ ] Frontend wallet connection (MetaMask, WalletConnect)
- [ ] On-chain donation verification badges

### Phase 5 — Scale & Growth
- [ ] Multi-currency and multi-language support
- [ ] Mobile apps (iOS, Android)
- [ ] Public impact reports and annual transparency reports
- [ ] API for third-party charity integrations

---

## 🤝 Contributing

Contributions are welcome from developers, designers, and humanitarian technologists alike.

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a feature branch** following the naming convention:
   - `feat/short-description` — new features
   - `fix/short-description` — bug fixes
   - `docs/short-description` — documentation updates
   - `refactor/short-description` — code improvements
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(donations): add anonymous donation support
   fix(auth): handle expired refresh token edge case
   docs(readme): update API reference table
   ```
5. **Push** to your fork and open a **Pull Request** against `main`

### Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Include tests for any new functionality
- Ensure `npm run lint` and `npm run test` pass before requesting review
- Reference any related GitHub issues in the PR description

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold a respectful and inclusive environment for all contributors.

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

<div align="center">
  <p>Built with ❤️ for humanity</p>
  <p>
    <a href="http://localhost:3000/api/docs">API Docs</a> •
    <a href="https://github.com/your-org/charicall/issues">Report a Bug</a> •
    <a href="https://github.com/your-org/charicall/discussions">Discussions</a>
  </p>
</div>
