import EmptyDashboard from "../../../components/EmptyDashboard";

export default function AuditsPage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label">ADMINISTRATOR</span>
          <h1>Audits</h1>
          <p>Track and manage IQAC audits.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="AUD"
        title="Coming Soon"
        description="This module is under construction."
      />
    </>
  );
}
