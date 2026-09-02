import EmptyDashboard from "../../../components/EmptyDashboard";

export default function FormsPage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label"></span>
          <h1>Forms</h1>
          <p>Manage IQAC forms and templates.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="FORM"
        title="Coming Soon"
        description="This module is under construction."
      />
    </>
  );
}
