import EmptyDashboard from "../../../components/EmptyDashboard";

export default function IqacTaskManagementPage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label"></span>
          <h1>Task Management</h1>
          <p>Manage and track tasks.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="Task Management"
        title="Task Management Ready"
        description="Task management modules will appear here."
      />
    </>
  );
}