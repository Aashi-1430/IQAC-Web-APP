"use client";

import RequireRole from "../../components/RequireRole";
import DashboardHeader from "../../components/DashboardHeader";
import Sidebar from "../../components/Sidebar";

export default function IqacCoordinatorLayout({ children }) {
  return (
    <RequireRole role="iqac_coordinator">
      <div className="dashboard-page has-sidebar">
        <DashboardHeader roleLabel="IQAC Coordinator" withDropdown />

        <main className="dashboard-content">
          <Sidebar />
          {children}
        </main>
      </div>
    </RequireRole>
  );
}
