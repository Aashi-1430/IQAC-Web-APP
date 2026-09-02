import EmptyDashboard from "../../../components/EmptyDashboard";

export default function UserManagementPage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label">ADMINISTRATOR</span>
          <h1>User Management</h1>
          <p>Manage IQAC portal user accounts and approvals.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="USR"
        title="Coming Soon"
        description="This module is under construction."
      />
    </>
  );
}
