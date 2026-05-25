# MiniEMR — Frontend

> A Mini Electronic Medical Record (EMR) System — Angular 20 Single Page Application

## Overview

MiniEMR Frontend is an Angular 20 SPA that provides a role-based interface for managing patients, appointments, and clinical visits. It connects to the [MiniEMR Backend](https://github.com/sufyan067/MiniEMR_Backend) REST API.

### User Roles

| Role | Capabilities |
|---|---|
| **Receptionist** | Register & edit patients, book & manage appointments, view dashboard |
| **Doctor** | All receptionist capabilities + start visits, enter vitals, clinical notes, and prescriptions |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 20 | SPA framework (Standalone Components) |
| Angular Material | Latest | UI component library |
| NgRx | Latest | Global state management (visit form) |
| Angular Signals | Built-in | Component-level reactive state |
| RxJS | Latest | Async streams, debounced validators |
| TypeScript | Latest | Type-safe business logic |
| JWT | — | Authentication token (localStorage) |

---

## Project Structure

```
src/app/
├── core/
│   ├── directives/
│   │   ├── vital-range.directive.ts   ← Attribute directive: highlights vitals by normal range
│   │   └── has-role.directive.ts      ← Structural directive: conditional render by user role
│   ├── guards/
│   │   ├── role.guard.ts              ← Factory guard: role-based route protection
│   │   └── unsaved-changes.guard.ts   ← Prevents leaving visit form with unsaved data
│   ├── guarrds/
│   │   └── auth.guard.ts              ← JWT authentication guard
│   ├── interceptors/
│   │   └── auth.interceptor.ts        ← Auto-attaches Bearer token; handles 401 globally
│   ├── pipes/
│   │   ├── age.pipe.ts                ← Calculates age from date of birth
│   │   └── bmi.pipe.ts                ← Calculates BMI from weight + height
│   ├── services/
│   │   └── appointment-event.service.ts  ← Cross-feature event bus (booking → dashboard refresh)
│   └── layouts/
│       └── main-layout/               ← Sidenav shell for all authenticated pages
│
├── features/
│   ├── auth/                          ← Login page, AuthService, AuthState (signals)
│   ├── dashboard/                     ← Role-aware dashboard, appointment actions
│   ├── patients/                      ← Patient list, detail, register dialog, edit dialog
│   ├── appointments/                  ← Appointment list, booking dialog
│   └── visits/
│       ├── components/                ← vitals-section, clinical-notes-section, prescription-section
│       ├── pages/
│       │   ├── visit-shell/           ← Visit form container (Doctor only)
│       │   └── visit-view/            ← Read-only visit summary
│       └── store/                     ← NgRx: actions, reducer, effects, selectors, state
│
└── shared/
    └── components/
        └── confirm-dialog/            ← Reusable confirmation dialog
```

---

## Key Features Implemented

### Custom Directives
- **`VitalRangeDirective`** (`[appVitalRange]`) — Attribute directive that applies `vital-normal` (green) or `vital-abnormal` (orange) CSS classes to any vital chip based on predefined medical normal ranges. Used in 3 places: visit form, patient history, visit summary.
- **`HasRoleDirective`** (`*hasRole="'Doctor'"`) — Structural directive that conditionally renders DOM elements based on the logged-in user's role.

### Custom Pipes
- **`AgePipe`** (`dateOfBirth | age`) — Calculates exact age in years from a date of birth string.
- **`BmiPipe`** (`weightKg | bmi: heightCm`) — Calculates BMI. Used for live calculation in the visit form and as a fallback when stored BMI is null.

### Route Guards
- **`authGuard`** — Protects all routes; redirects to `/login` if no JWT token.
- **`roleGuard('Doctor')`** — Factory guard; only allows Doctors to access the visit start route.
- **`unsavedChangesGuard`** — Checks NgRx store for dirty state before leaving the visit form; shows a confirmation dialog.

### Async CNIC Validation
Patient registration and edit forms validate CNIC uniqueness against the backend in real-time:
- 400ms debounce using `timer` + `switchMap`
- Calls `GET /api/Patient/check-cnic?cnic=&excludeId=`
- Shows inline error and spinner while pending

### NgRx Visit Store
The visit form uses NgRx because 3 independent child components (Vitals, Clinical Notes, Prescriptions) all contribute to a single submitted payload:

```
Actions:  loadVisitStart | updateClinicalNotes | updateVitals | updatePrescriptions
          saveVisit | saveVisitSuccess | saveVisitFailure | resetVisit
Effects:  POST /api/Visit → on success: update appointment status → navigate to dashboard
Selectors: selectVisitState | selectVisitDirty (used by unsavedChangesGuard)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- MiniEMR Backend running at `https://localhost:7206`

### Installation

```bash
# Clone the repository
git clone https://github.com/sufyan067/MiniEMR_Frontend.git
cd MiniEMR_Frontend

# Install dependencies
npm install

# Start development server
ng serve
```

Navigate to `http://localhost:4200/`

### Environment Configuration

The API base URL is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  apiUrl: 'https://localhost:7206/api'
};
```

### Build for Production

```bash
ng build
```

Build artifacts are placed in the `dist/` directory.

---

## API Integration

This frontend connects to the following backend endpoints:

| Method | Endpoint | Used For |
|---|---|---|
| POST | `/api/Auth/login` | User login |
| GET | `/api/Patient` | Patient list |
| POST | `/api/Patient` | Register patient |
| PUT | `/api/Patient/{id}` | Edit patient |
| GET | `/api/Patient/{id}` | Patient detail |
| GET | `/api/Patient/check-cnic` | Async CNIC uniqueness check |
| GET | `/api/Appointment` | Appointment list |
| POST | `/api/Appointment` | Book appointment |
| PUT | `/api/Appointment/{id}/status` | Update appointment status |
| GET | `/api/Appointment/summary` | Dashboard summary cards |
| GET | `/api/Visit/{appointmentId}` | Load visit start data |
| POST | `/api/Visit` | Submit completed visit |
| GET | `/api/Visit/{id}/detail` | View visit summary |
| GET | `/api/User` | Load doctors for appointment booking |
| GET | `/api/Medicine` | Load medicines for prescription |

---

## Related Repository

- **Backend:** [MiniEMR_Backend](https://github.com/sufyan067/MiniEMR_Backend)
