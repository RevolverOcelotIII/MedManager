# MedManager ERP - Hospital Operations Suite

**MedManager** is a high-performance, customizable ERP (Enterprise Resource Planning) platform designed to streamline hospital operations, clinical workflows, and resource management. It focuses on granular security, data integrity, and a flexible, model-driven architecture.

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

## 🏗 Architectural Design
The project follows a model-driven approach where UI components (Grids, Forms, Detail Modals) are generated based on shared configuration objects, ensuring visual consistency and rapid development.

- **Frontend Models**: Define column visibility, validation rules, and specialized rendering (badges, dates, search inputs).
- **Backend Services**: Encapsulate complex logic, such as role-based visibility filters and automated cache invalidation patterns.

---

## 🔒 Security & Access Guide (RBAC)
MedManager implements a sophisticated Role-Based Access Control system centered around **5 Access Levels** and **4 Permission Scopes**:

### Access Levels
1.  **Admin**: Full system control.
2.  **Doctor**: Clinical leadership and specialized execution.
3.  **Nurse**: Clinical execution and triage.
4.  **Attendant**: Operational logistics and patient intake.
5.  **Pharmaceutical**: Specialized medication and stock control.

### Permission Scopes
- **Admin Scope**: System configuration, User/Employee/Role management.
- **Log (Logistics) Scope**: Patient registration and Attendance initiation.
- **Med (Medical) Scope**: Clinical updates, procedure execution, and medical notes.
- **Pharma Scope**: Medication catalog and inventory management.

### Specialized Procedure Logic
Procedures are defined with a strict split between:
- **Dispatch Roles**: Who is authorized to *order* the procedure (e.g., Doctors).
- **Execute Roles**: Who is qualified to *perform* the procedure (e.g., Nurses for Triage).

---

## 🚀 Basic Workflow Tutorial

1.  **Administrative Setup**:
    *   Create **Roles** (e.g., "ER Physician" with `doctor` level).
    *   Register **Employees** and link them to **Users** for system access.
    *   Create and Configure **Procedures**, assigning appropriate Dispatch and Execute roles.
2.  **Patient Journey**:
    *   **Intake**: Attendants register a **Patient** and start an **Attendance** (assigning an urgency level via the Manchester Protocol).
    *   **Ordering**: Authorized staff add **Procedures** to the attendance record.
    *   **Execution**: Qualified staff update the procedure status to `In Progress`, record clinical observations, and mark as `Done` upon completion.
    *   **Medication**: During execution, staff can log specific **Medications** used, which automatically clears the relevant performance caches.

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
