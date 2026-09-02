import EmptyDashboard from "../../../components/EmptyDashboard";

export default function HodHomePage() {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label">USER</span>
          <h1>HOD Dashboard</h1>
          <p>Welcome to the SVIET IQAC Portal.</p>
        </div>
      </div>

      <EmptyDashboard
        icon="HOD"
        title="Dashboard Ready"
        description="Departmental IQAC modules will appear here."
      />
    </>
  );
}
