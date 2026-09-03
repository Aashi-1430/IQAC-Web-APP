# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SVIET IQAC Portal — a Next.js/React application converted from vanilla HTML/CSS/JS. The frontend communicates with a FastAPI backend at `https://fms-backend-ybbn.onrender.com` and preserves the original design system.

## Development Commands

```bash
# Start development server (default port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture & Key Patterns

### Authentication & Session Management

- **Auth state**: Managed via React Context (`lib/AuthContext.js`)
- **Session persistence**: JWT token and user object stored in localStorage
  - Token key: `iqac_token`
  - User key: `iqac_user`
- **Session restoration**: On mount, the AuthProvider reads localStorage, then refreshes the profile via `GET /users/me`
- **Role extraction**: If the API doesn't return a role explicitly, it's decoded from the JWT payload (`role`, `user_role`, or `userRole` claims)
- **Role normalization**: All roles are lowercased and spaces/hyphens converted to underscores (e.g., `"IQAC Coordinator"` → `"iqac_coordinator"`)

### API Layer (`lib/api.js`)

Ported from the original vanilla JS `script.js`. All backend communication goes through helpers in this file:

- **Response parsing**: `parseResponse()` handles both JSON and text responses
- **Error extraction**: `extractErrorMessage()` normalizes FastAPI error formats (single detail string, validation arrays, generic messages)
- **Token/user extraction**: Flexible field extraction from various API response shapes
- **Admin functions**: `getAllUsers()`, `getPendingUsers()`, `approveUser()`, `rejectUser()`, `activateUser()`, `deactivateUser()`, `changeUserRole()`

### Role-Based Routing

Three main protected areas, each with a layout enforcing role requirements:

- **Super Admin** (`/super_admin/*`) — requires `role="super_admin"`
  - Routes: `home`, `user-management`, `departments`, `forms`, `audits`, `notifications`, `task-management`
  - **Full privileges**: Can activate/deactivate any user and change roles between `iqac_coordinator` and `hod`
  - **User management**: Unlike IQAC coordinators, super admins can modify other IQAC coordinators
- **IQAC Coordinator** (`/iqac-coordinator/*`) — requires `role="iqac_coordinator"`
  - Routes: `home`, `user-management`, `departments`, `forms`, `audits`, `notifications`, `task-management`
  - **Limited privileges**: Cannot modify other IQAC coordinators, can only manage HODs
- **HOD** (`/hod/*`) — requires `role="hod"`
  - Routes: `home`

**Route protection**: Each role's layout wraps children in `<RequireRole>`, which redirects to `/` if the user is unauthenticated or lacks the required role.

**Sidebar navigation**: The `Sidebar` component dynamically adjusts navigation links based on the user's role (`super_admin` or `iqac_coordinator`).

### Component Patterns

- **DashboardHeader**: Displays role label, calendar button, and avatar dropdown (profile, change password, logout)
- **Sidebar**: Navigation for Super Admin and IQAC Coordinator dashboards; dynamically adjusts links based on role; uses `usePathname()` to highlight active link
- **RequireRole**: Client component that blocks rendering until auth is initialized, then checks role match
- **Modals**: 
  - `ProfileModal` — displays user name and email
  - `ChangePasswordModal` — current + new password form, calls `AuthContext.changePassword()`
  - `CalendarModal` — interactive calendar with month navigation

### Styling

- **`app/globals.css`**: Full copy of the original `style.css`; all original class names preserved
- CSS is global; components use existing class names like `.dashboard-header`, `.sidebar`, `.main-content`

## Backend API Expectations

- **Auth endpoints**:
  - `POST /auth/login` — returns `{ access_token, user: { role, ... } }`
  - `POST /auth/signup` — creates pending user
  - `POST /auth/change-password` — requires `{ current_password, new_password }`
- **User endpoints**:
  - `GET /users/me` — returns current user profile
- **Admin endpoints** (require auth token):
  - `GET /admin/users` — all users
  - `GET /admin/users/pending` — users awaiting approval
  - `PUT /admin/users/:id/approve|reject|activate|deactivate`
  - `PUT /admin/users/:id/role` — body: `{ role }`

All authenticated requests send `Authorization: Bearer <token>` and `credentials: "include"`.

## Common Patterns

- **New protected page**: Create in `app/super_admin/<name>/page.js`, `app/iqac-coordinator/<name>/page.js`, or `app/hod/<name>/page.js`. The layout already applies role protection.
- **New API call**: Add to `lib/api.js` as an exported async function; use `parseResponse()` and `extractErrorMessage()` for consistency.
- **Modal workflow**: Import modal component, manage `isOpen` state, pass `onClose` callback.
- **Form submission**: Wrap in try/catch, show error via state or alert, clear form on success.

## User Management Permissions

- **Super Admin**: 
  - Can modify all users except themselves
  - Can change roles between `iqac_coordinator` and `hod`
  - Can activate/deactivate any user
- **IQAC Coordinator**: 
  - Cannot modify other IQAC coordinators
  - Can only manage HODs
  - Cannot modify super admins
- **Implementation**: Permission logic in `canModify()` function checks current user role and target user role

## Current Branch

- **Main branch**: `main`
- **Current branch**: `fe_react` (React/Next.js conversion in progress)
