export default function EmptyDashboard({ icon, title, description }) {
  return (
    <div className="empty-dashboard">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
