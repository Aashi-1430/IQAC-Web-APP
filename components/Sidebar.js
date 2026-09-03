"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/iqac-coordinator/home",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/iqac-coordinator/user-management",
    label: "User Management",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c0-3.3 2.46-6 6-6s6 2.7 6 6" />
        <path d="M16 8.2a3 3 0 1 1 1 5.8" />
        <path d="M19.5 20c0-2.7-1.7-4.9-4-5.7" />
      </svg>
    ),
  },
  {
    href: "/iqac-coordinator/departments",
    label: "Departments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21V9l9-6 9 6v12" />
        <path d="M9 21v-7h6v7" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
  {
    href: "/iqac-coordinator/forms",
    label: "Forms",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 3h8l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M9 12h6M9 16h6M9 8h2" />
      </svg>
    ),
  },
  {
    href: "/iqac-coordinator/audits",
    label: "Audits",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.2-3.2" />
        <path d="M9 11l1.5 1.5L14 9" />
      </svg>
    ),
  },
  {
    href: "/iqac-coordinator/notifications",
    label: "Notifications",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9a6 6 0 1 1 12 0c0 3.6 1 5.4 1.6 6.2a1 1 0 0 1-.8 1.6H5.2a1 1 0 0 1-.8-1.6C5 14.4 6 12.6 6 9z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    ),
  },
  {
    href: "/iqac-coordinator/task-management",
    label: "Task Management",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18V3zm4.11 2.9a1.6 1.6 0 0 1 2.23 0L17 7.68V13H13l3.06-3.98a1.6 1.6 0 1 1 2.57 2.53L20.5 15H13v5.06a1.6 1.6 0 1 1-3.2 0V15a1.6 1.6 0 0 1-3.2 0v-.93a1.6 1.6 0 0 1 1.06-1.45l3.18-4.05a1.6 1.6 0 0 1 0-2.57z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar-nav">
      <nav>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={pathname === item.href ? "active" : ""}>
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
