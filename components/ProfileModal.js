"use client";

export default function ProfileModal({ open, onClose, user }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <h2>Profile</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.25rem 0 1.25rem" }}>
          <div>
            <strong>Name: </strong>
            {user?.name || "N/A"}
          </div>
          <div>
            <strong>Email: </strong>
            {user?.email || "N/A"}
          </div>
          <div>
            <strong>Role: </strong>
            {user?.role || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
