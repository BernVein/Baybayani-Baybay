# Baybayani-Baybay

> A full-stack e-commerce web and Android application built for a local business in Baybay City, Leyte. Handles end-to-end retail operations. Product browsing and ordering for customers, and inventory management and order fulfillment for admins.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
    - [Customer-Facing](#customer-facing)
    - [Admin Panel](#admin-panel)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database & Backend](#database--backend)
- [Getting Started](#getting-started)
- [Mobile (Android)](#mobile-android)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

Baybayani is my capstone thesis project built for a farmer group in Baybay City, Leyte that sells and grows fresh produce. It covers the full retail workflow: customers can browse products, manage their cart, place orders, and chat with admins in real time. On the admin side, the platform provides a full management - tracking orders, managing product catalogs with variant-level pricing and stock, monitoring customer accounts, and live metrics on the dashboard.

The app runs as a web application and is also packaged as an Android APK via Capacitor, with push notification support.

---

## Tech Stack

| Layer                | Technology                                        |
| -------------------- | ------------------------------------------------- |
| Frontend Framework   | React 18 + TypeScript                             |
| Build Tool           | Vite 6                                            |
| UI Component Library | HeroUI (NextUI v2)                                |
| Styling              | Tailwind CSS v4                                   |
| Animation            | Framer Motion, GSAP                               |
| Charts               | ECharts (via echarts-for-react)                   |
| Icons                | Iconify, Lucide React                             |
| Routing              | React Router DOM v6                               |
| Backend / Database   | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Mobile               | Capacitor v8 (Android)                            |
| Push Notifications   | Capacitor Push Notifications (FCM)                |
| Code Quality         | ESLint, Prettier, TypeScript strict mode          |

---

## Features

### Customer-Facing

**Shop**

- Browse products with category and tag filtering
- View detailed product info including variants, pricing (retail & wholesale), and images
- Products support both simple and variant-based listings

**Cart**

- Add items to cart with variant selection
- Adjust quantities and remove items

**Orders**

- Place orders from cart
- Track order status in real time
- View full order history with item-level breakdown

**Account**

- Profile management (name, avatar, contact info)
- Account settings

**Realtime Messaging**

- Floating chat widget (inspired from Facebook Messenger)
- Customers can only message admins
- Messages delivered in real time via Supabase Realtime

---

### Admin Panel

**Dashboard**

- KPI summary cards: total revenue, total orders, total customers, and closing time
- Line chart and grouped bar chart for sales trends
- Recent orders table

**Order Management**

- View all orders with filtering and search
- Update order status (pending, processing, completed, cancelled)
- Detailed order summary modal with per-item breakdown

**Product Management**

- Full CRUD for products
- Multi-image upload with client-side compression (`browser-image-compression`)
- Variant-level management: retail price, wholesale price, stock thresholds
- Stock movement history per variant (tracks acquisitions, sales, losses, cancellation restocks)
- Category and tag management (create, update, delete)

**User Management**

- View all registered customer accounts
- Inspect user profiles and order history from a modal
- Role-based access enforced throughout

**Realtime Messaging**

- Admins receive messages from customers
- Full chat interface within the admin panel

---

## Architecture

The app follows a **role-based layout architecture** with two distinct layout trees:

- `/` -> `CustomerLayout` — used for all customer-facing routes (shop, cart, orders, profile, settings)
- `/admin` -> `AdminLayout` — protected by role guard, used for all admin routes

**Auth & Route Guards**

| Guard           | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `RequireAuth`   | Redirects unauthenticated users to login             |
| `RequireGuest`  | Redirects logged-in users away from login/signup     |
| `RequireRole`   | Enforces role-based access (e.g., Admin-only routes) |
| `RedirectAdmin` | Sends admin users away from the customer layout      |

All pages are **lazy-loaded** via `React.lazy` + `Suspense` to reduce the initial bundle size.

---

## Project Structure

```
src/
├── App.tsx                  # Root route definitions & auth wiring
├── ContextProvider/
│   ├── AuthContext/         # Auth state, session handling, route guards
│   ├── FloatingChatContext/ # Chat visibility state
│   └── LoginModalContext/   # Login modal trigger state
├── components/
│   ├── chat/                # Floating chat widget (FloatingChat, ChatMessage)
│   ├── navbar/              # Responsive navbar components
│   └── icons.tsx            # Centralized SVG icon library
├── data/
│   └── supabase/
│       ├── Admin/           # Admin-scoped data hooks (orders, products, users, etc.)
│       ├── Customer/        # Customer-scoped data hooks (cart, shop, orders)
│       └── General/         # Shared hooks (auth, realtime chat)
├── layouts/
│   ├── AdminLayout.tsx
│   └── CustomerLayout.tsx
├── model/                   # TypeScript interfaces for domain entities
│   ├── Item.ts              # Product model
│   ├── variant.ts           # Variant model (pricing, stock)
│   ├── stockMovement.ts     # Stock movement / audit log model
│   ├── cart.ts
│   ├── cartItemUser.ts
│   ├── orderItemUser.ts
│   └── userProfile.ts
├── pages/
│   ├── Admin/               # Dashboard, Orders, Products, Users
│   ├── Customer/            # Shop, Cart, Orders, Profile, Settings, Messages
│   └── General/             # Login, Signup
└── utils/                   # Shared utilities
```

---

## Database & Backend

The entire backend is powered by **Supabase**:

- **PostgreSQL** - stores all application data (items, variants, orders, stock movements, cart, user profiles, messages)
- **Supabase Auth** - handles user registration, login, session management, and email verification
- **Supabase Storage** - stores product images uploaded by admins
- **Supabase Realtime** - powers the live chat feature between customers and admins

### Key Data Models

**Product & Variants**
Each product (`Item`) can have multiple `Variant`s. Each variant tracks:

- Retail and wholesale pricing (with price history)
- Stock movements: `Acquisition`, `Sale`, `Loss`, `From Cancelled`
- Low stock threshold for alerting
- Soft delete support (data is never hard-deleted)

**Orders**
Orders contain a snapshot of the variant at the time of purchase (`variantSnapshot`), preserving the price even if it changes later.

**Cart**
Cart items are stored per user in the database, not in local storage, so they persist across devices and sessions.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (with the appropriate tables and RLS policies set up)

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

To expose the dev server on your local network (useful for testing on mobile):

```bash
npm run host
```

### Build for Production

```bash
npm run build
```

---

## Mobile (Android)

The app is also distributed as an Android APK using [Capacitor](https://capacitorjs.com/).

**App ID:** `com.baybayani.app`

Push notifications are handled via Firebase Cloud Messaging (FCM) through the `@capacitor/push-notifications` plugin. On Android, the app requests FCM registration on startup and listens for incoming push events.

To sync and build the Android project:

```bash
npx cap sync android
npx cap open android
```

Then build and run from Android Studio.

---

## Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the local Vite dev server           |
| `npm run host`    | Start dev server exposed on local network |
| `npm run build`   | Type-check and build for production       |
| `npm run preview` | Preview the production build locally      |
| `npm run lint`    | Run ESLint with auto-fix                  |

---

## License

MIT — see [LICENSE](./LICENSE) for details.

# No commits

- Feb 7, 2026
  Grabbed system unit to bh
- Feb 16, 2026
  Receive thesis papers and processed field trip papers
