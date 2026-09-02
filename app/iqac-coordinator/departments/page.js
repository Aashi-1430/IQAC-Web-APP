import EmptyDashboard from "../../../components/EmptyDashboard";

export default function DepartmentsPage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label">ADMINISTRATOR</span>
          <h1>Departments</h1>
          <p>Manage departmental IQAC records.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="DEPT"
        title="Coming Soon"
        description="This module is under construction."
      />
    </>
  );
}
