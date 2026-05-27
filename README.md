# MedManager ERP - Hospital Operations Prototype

**MedManager** is a highly customizable ERP (Enterprise Resource Planning) prototype designed to streamline hospital operations, resource management, and patient care workflows. Developed for the **FESF-SUS** selection process, the system focuses on high-granularity access control (RBAC), data integrity, and a flexible procedure-based clinical flow.

## 🎯 Purpose
The system aims to solve the inherent complexity of hospital management by decoupling the **Attendance** (the patient's overall stay) from the **Attendance Procedures** (the specific granular actions performed by various professionals). This allows multiple departments—Reception, Nursing, Medical, and Pharmacy—to collaborate on a single patient journey with strict security and permission boundaries.

---

## 🛠 Tech Stack
- **Backend:** Python 3.10+ | FastAPI (MVC Architecture + Service Layer)
- **Database:** PostgreSQL | SQLAlchemy (ORM)
- **Cache:** Redis (For high-speed attendance queue and session management)
- **Frontend:** React | Next.js | TypeScript
- **Security:** OAuth2 + JWT (Role-Based Access Control)
- **DevOps:** Docker | Docker Compose

---

## 🏗 Architectural Design
The project follows the **MVC (Model-View-Controller)** pattern enhanced with a **Service Layer** to ensure code maintainability and testability:
- **Models:** Defines data structures and complex hospital relationships.
- **Schemas:** Handles data validation and serialization via Pydantic (DTOs).
- **Controllers (Routers):** Manages API endpoints and request/response flow.
- **Services:** Houses granular business logic, inventory calculations, and permission enforcement.

---

## 🚀 Basic Usage Tutorial

### 1. Administrative Setup (Pre-requisites)
Before the clinical flow can begin, an **Administrator** must configure the hospital's infrastructure:
1. **Create Roles:** Define specific variations for base staff types (e.g., Type: `DOCTOR`, Role: `Otolaryngologist` or `Physiotherapist`).
2. **Create Employees:** Register staff members and assign them to their specialized Roles.
3. **Configure Procedures:** Define a Procedure (e.g., "Triage", "X-Ray", or "Oto-Consultation") and link it to the Roles allowed to perform it.

### 2. The Patient Journey Workflow
1. **Registration:** An **Attendant** registers a new **Patient** and initiates an **Attendance** record, setting the initial urgency level and timestamp.
2. **Allocating Procedures:** Inside the active Attendance, the Attendant creates an **Attendance Procedure** (e.g., "Triage"). The system filters and shows only available **Nurses** qualified for that specific procedure. The status is set to `Pending`.
3. **Clinical Execution:**
   - The assigned **Nurse** logs in and views their personalized task queue.
   - They change the status to `In Progress` and fill in clinical notes (symptoms, vitals, recommendations).
   - Once finished, they set the status to `Finished`.
4. **Specialized Care:** The Attendant reviews the Triage notes and creates a subsequent Procedure (e.g., "Consultation") for a **Doctor** based on the nurse's recommendation.
5. **Resource Consumption:** During any procedure, the professional can log **Medicines** used (e.g., a 500mg Dipyrone tablet). This interacts with the inventory system to track consumption.
6. **Discharge:** Once all planned procedures are `Finished`, the Doctor reviews the entire clinical history within that Attendance and issues the **Final Discharge**.

---

## 🔒 Security & Access Guide (RBAC)
To ensure patient privacy (LGPD) and system usability, MedManager implements strict access layers:

- **Attendants:** Full access to Patient registration and Procedure allocation. They **cannot** view or edit medical notes, diagnoses, or sensitive clinical data.
- **Healthcare Staff (Doctors/Nurses):** Can only edit the details of Procedures where they are the **Assigned Responsible**. They have a read-only view of the patient's other procedures within the same attendance for safety and context.
- **Pharmacists:** Read-only access to medication consumption logs and full CRUD for the Medicine inventory and stock levels.
- **Administrators:** Global access to system configuration, audit logs, and employee management.

## 🐳 How to Run
Ensure you have Docker and Docker Compose installed:



# Run the entire stack
docker-compose up --build