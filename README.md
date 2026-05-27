# MedManager ERP - Hospital Operations Suite

**MedManager** is a prototype and Proof of Concept for a high-performance, customizable hospital ERP (Enterprise Resource Planning) platform. It demonstrates a robust approach to streamlining hospital operations, clinical workflows, and resource management through a fully dynamic, model-driven architecture.

---

## 🏗 System Overview: Dynamic Logic & Configuration
Unlike traditional rigid ERPs, MedManager is built on a **fully dynamic entity engine**. The behavior of the clinical flow is not hardcoded but is defined by the relationship between two primary administrative entities:

1.  **Dynamic Roles**: Administrators create job titles (e.g., "Cardiac Surgeon", "Triage Nurse") and map them to one of the **5 Base Access Levels**. This determines the broad data scope the user can access (Medical, Logistics, Pharmaceutical, or Admin).
2.  **Dynamic Procedures**: Every clinical action (e.g., "Blood Test", "MRI Scan", "Pre-Op Triage") is an entry in the catalog that can be created and personalized at any time by an Administrator. 

### The Permission Matrix (RBAC)
The core innovation of the prototype is the **Role-Procedure Junction**. For every Procedure created, Administrators explicitly define:
-   **Dispatch Roles**: Which specific Roles are authorized to *order* this action.
-   **Execute Roles**: Which specific Roles are qualified to *perform* this action and record clinical notes.

This dynamic mapping creates a precise "need-to-know" and "authorized-to-act" environment. A Doctor role might be able to execute 50 different procedures but only dispatch 5, while a Nurse role might execute the Triage that the Attendant dispatched.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15+ (App Router) | TypeScript
- **State Management:** Zustand (Global Session, RBAC, and UI State)
- **Internationalization:** i18n-js (v4) with support for English and Portuguese
- **Testing:** Jest + React Testing Library (Strict **0-Mock Policy** for internal components)
- **Styling:** Vanilla CSS Variables (Zinc palette, OKLCH colors)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL | SQLAlchemy 2.0 (ORM) | Alembic (Migrations)
- **Cache:** Redis (Integrated caching for catalog data and grid performance)
- **Testing:** Pytest + Pytest-Describe + Pytest-Asyncio (Behavioral TDD)
- **Architecture:** Service Layer pattern for decoupled business logic

---

## 🚀 Step-by-Step Clinical Tutorial

### 1. The Administrative Engine (Setup)
Before any patient arrives, the system's "brain" must be configured.
-   **Step 1: Roles**: Create specialized roles. Assigning a role to a user dictates which Attendances they "receive" (visible in their medical queue).
-   **Step 2: Procedures**: Define clinical actions. 
    -   *Example*: Create a "General Consultation". Add "Physician" to Dispatch Roles and Execute Roles.
    -   *Example*: Create "Triage". Add "Attendant" to Dispatch and "Nurse" to Execute.

> ![Screenshot: Admin Role and Procedure Configuration](docs/screenshots/admin-setup.png)

### 2. Patient Intake & Initial Dispatch
-   **Step 3: Registration**: An **Attendant** registers a patient and initiates an **Attendance**.
-   **Step 4: The First Order**: The Attendant dispatches the "Triage" procedure. Because of the dynamic config, only "Triage" (and other Attendant-dispatchable items) will appear in their menu.

> ![Screenshot: Patient Intake and Procedure Dispatching](docs/screenshots/intake-dispatch.png)

### 3. The Clinical Execution Loop
-   **Step 5: Receiving the Task**: A **Nurse** logs in. Their dashboard automatically filters for Attendances where they have executable procedures pending.
-   **Step 6: Execution**: The Nurse opens the Triage record, sets it to `In Progress`, and fills in vital signs.
-   **Step 7: Chaining the Workflow**: Upon finishing Triage, the Nurse (if authorized by their Role) can **dispatch the next step**—for example, a "Specialized Consultation"—effectively passing the "clinical baton" to a Doctor.

> ![Screenshot: Clinical Execution and Workflow Chaining](docs/screenshots/clinical-loop.png)

### 4. Advanced Clinical Review
-   **Step 8: Review & Execute**: The **Doctor** receives the attendance. They can read the Nurse's Triage notes (Read-Only) and execute their own Consultation.
-   **Step 9: Resource Management**: During any execution, professionals log **Medications** used. This interacts with the **Pharma Scope**, allowing Pharmacists to track real-time consumption triggered by clinical actions.

---

## 🐳 Setup Guide

### 1. Prerequisites
- Docker & Docker Compose
- A `.env` file in the root directory (see `.env.example`)

### 2. Launch Infrastructure
```bash
# Start all services (Postgres, Redis, API, Web)
docker-compose up --build
```

### 3. Database Migrations
Migrations run automatically on container startup. To manually manage:
```bash
docker-compose exec api alembic upgrade head
```

### 4. Running Tests
The project maintains a heavy focus on behavioral verification.

**Backend Tests (Pytest):**
```bash
docker-compose exec api pytest app/tests/
```

**Frontend Tests (Jest):**
```bash
docker-compose exec frontend npm test
```

---

## 🌍 Localisation
The system is fully internationalized. Language preferences are persisted in `localStorage` and applied globally via the `AuthGuard` and `useAuthStore`. Currently supported:
- 🇧🇷 Portuguese (Default)
- 🇺🇸 English
