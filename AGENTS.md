# AGENTS - IQAC Web App

## Commands

- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint/Next.js lint

## Structure

- `app/` - Next.js 14 app router
  - `app/iqac-coordinator/` - Coordinator layout with Sidebar + DashboardHeader
  - `app/iqac-coordinator/layout.js` - Wraps pages with `<RequireRole role="iqac_coordinator">`, includes `<DashboardHeader withDropdown />` and `<Sidebar />`
  - Pages live in `app/iqac-coordinator/<name>/page.js` (e.g., `home`, `user-management`, `forms`, `audits`, `notifications`, `departments`, `task-management`)
- `components/` - Reusable React components
  - `Sidebar.js` - Navigation nav with `NAV_ITEMS` array; active state via `usePathname()`
  - `DashboardHeader.js` - Header with brand, user info, avatar dropdown; supports `withDropdown` prop
  - `EmptyDashboard.js` - Skeleton dashboard used by new pages
  - `ProfileModal.js`, `ChangePasswordModal.js` - Modals triggered from header
- `globals.css` - Global styles; key classes: `.dashboard-header`, `.dashboard-brand`, `.sidebar-nav`, `.user-area`, `.avatar-dropdown`, `.dropdown-item`
- `lib/` - Auth and API helpers (`AuthContext`, `api`)

## Conventions

- Sidebar nav items: object with `href`, `label`, `icon`; active detected via `pathname === item.href`
- DashboardHeader: `withDropdown` prop toggles avatar dropdown; calendar tab added before `user-area` with its own dropdown
- New pages: follow pattern of existing pages — `page.js` returning JSX with `dashboard-title` and `EmptyDashboard`
- `router.push()` from `next/navigation` for client-side navigation (e.g., dashboard-brand onClick → `/home`, calendar trigger → `/calendar`)
- Calendar dropdown in DashboardHeader: position absolute, appears on `user-avatar:hover` or `calendar-trigger:hover`, contains 3 buttons: "Academic Calendar", "IQAC Calendar", "Activity Calendar"

## Adding a new sidebar tab

1. Edit `components/Sidebar.js` — add object to `NAV_ITEMS` array with `href`, `label`, `icon`
2. Create page at `app/iqac-coordinator/<name>/page.js` following existing patterns

## Adding a new header tab

1. Edit `components/DashboardHeader.js` — add tab element before `.user-area` with `onClick={router.push("/<path>")}`
2. Add CSS styles for the new trigger and dropdown in `app/globals.css`
3. Create temporary page at `app/iqac-coordinator/<name>/page.js` if needed