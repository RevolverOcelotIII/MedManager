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

> **Note**: To see the prototype in full action, you must create at least **three different users** with different roles (e.g., one Attendant, one Nurse, and one Doctor).

---

## 🚀 Full System Walkthrough (Tutorial)

### 1. Building the Hospital "Brain" (Admin Setup)
First, log in with an **Admin** account to configure the rules of the hospital.

*   **Create Roles**: Navigate to **Administration > Roles** in the sidebar. Click the **"New"** button. Create a "Receptionist" (Level: Attendant), a "General Nurse" (Level: Nurse), and an "ER Physician" (Level: Doctor).
*   **Register Staff**: Go to **Administration > Employees**. Click **"New"** to register your professionals and assign them to the roles created above.
*   **Link Accounts**: Go to **Administration > Users**. Click **"New"** to create login credentials (email/password) and link them to the employee records.
*   **Define Procedures**: Go to **Administration > Procedures**. Click **"New"**.
    *   *Triage*: Add "Receptionist" to **Dispatch Roles** and "General Nurse" to **Execute Roles**.
    *   *Consultation*: Add "General Nurse" to **Dispatch Roles** and "ER Physician" to **Execute Roles**.

> ![Screenshot: Admin Dashboard - Creating Roles and Procedures](docs/screenshots/admin-setup.png)

### 2. Patient Intake (Attendant Flow)
Log out and log in as the **Receptionist**.

*   **Register Patient**: Navigate to **Workspace > Patients**. Click **"New"** and fill out the patient's personal data (CPF, Birth Date, etc.).
*   **Start Attendance**: Go to **Workspace > Attendances**. Click **"New"**. Search for the patient you just created and select a **Gravity Level** (e.g., "Orange - Very Urgent").
*   **Dispatch Triage**: In the Attendances list, click the **"View Details"** (eye icon). Inside the modal, find the **"Procedures"** section and click **"New"**. Select "Triage".The system automatically sets you as the "Ordered By" professional, and filters the "Executed by" list with the available employees that haves a role matching the procedure **"Execute Role"**, making only the previously registered **Nurse** to appear as the only option.

> ![Screenshot: Attendant View - Starting an Attendance and Dispatching Triage](docs/screenshots/intake-dispatch.png)

### 3. Clinical Execution (Nurse Flow)
Log out and log in as the **General Nurse**.

*   **Task Queue**: Go to **Workspace > Attendances**. The list is filtered to show patients waiting for procedures you are qualified to execute.
*   **Perform Triage**: Click **"View Details"** on the patient. In the Procedures list, find the "Triage" entry and click **"Edit"** (pencil icon).
*   **Clinical Notes**: Change the status to **"In Progress"**. Fill the **Description** with vitals (BP, Heart Rate, Symptoms). Once done, change the status to **"Done"**.
*   **Chain Workflow**: Before closing the base Attendance modal, use the **"New"** button in the Procedures section to dispatch a **"Consultation"**. Because you are a Nurse, you have the authority to "hand off" the patient to a Doctor.

> ![Screenshot: Nurse View - Recording Vitals and Chaining to Consultation](docs/screenshots/clinical-loop.png)

### 4. Specialized Care (Doctor Flow)
Log out and log in as the **ER Physician**.

*   **Medical Review**: Open the patient's attendance. You can read the Nurse's Triage notes for context.
*   **Finalize**: Edit the "Consultation" procedure. Add the diagnosis and treatment plan. If medications are administered, select them from the **Medications** searchable input.
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

### 3. Database Migrations & Initial Setup
Migrations run automatically on container startup. To manually manage migrations or seed the database with the initial Admin account:

```bash
# Run migrations
docker-compose exec api alembic upgrade head

# Seed initial data (Admin account, base roles, and sample employees)
docker-compose exec api python -m app.seed
```

**Initial Admin Credentials:**
- **Email**: `admin@medmanager.com`
- **Password**: `admin123`

*Note: You should use this account to perform the initial "Hospital Brain" setup described in the tutorial. The default admin can be removed or deactivated once you have created your own administrative accounts.*

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
