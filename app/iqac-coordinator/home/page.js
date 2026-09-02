import EmptyDashboard from "../../../components/EmptyDashboard";

export default function IqacHomePage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label"></span>
          <h1>IQAC Coordinator Dashboard</h1>
          <p>Welcome to the SVIET Internal Quality Assurance Cell.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="IQAC"
        title="Dashboard Ready"
        description="IQAC management modules will appear here."
      />
    </>
  );
}
