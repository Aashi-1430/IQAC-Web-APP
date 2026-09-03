"use client";

import RequireRole from "../../components/RequireRole";
import DashboardHeader from "../../components/DashboardHeader";

export default function HodLayout({ children }) {
  return (
    <RequireRole role="hod">
      <div className="dashboard-page">
        <DashboardHeader roleLabel="Head of Department" withDropdown />
        <main className="dashboard-content">{children}</main>
      </div>
    </RequireRole>
  );
}
