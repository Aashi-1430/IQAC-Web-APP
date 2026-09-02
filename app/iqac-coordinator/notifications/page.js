import EmptyDashboard from "../../../components/EmptyDashboard";

export default function NotificationsPage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label">ADMINISTRATOR</span>
          <h1>Notifications</h1>
          <p>View IQAC portal notifications.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="NOTIF"
        title="Coming Soon"
        description="This module is under construction."
      />
    </>
  );
}
