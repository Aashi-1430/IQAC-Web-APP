export default function EmptyDashboard({ icon, title, description, buttonText, onButtonClick }) {
  return (
    <div className="empty-dashboard">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {buttonText && onButtonClick && (
        <button className="btn-primary" onClick={onButtonClick} style={{ marginTop: "20px" }}>
          {buttonText}
        </button>
      )}
    </div>
  );
}
