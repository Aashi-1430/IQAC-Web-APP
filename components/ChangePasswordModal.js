"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import PasswordField from "./PasswordField";

export default function ChangePasswordModal({ open, onClose }) {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setMessage(null);
    }
  }, [open]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && open) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setMessage({ text: "Please enter your current password.", type: "error" });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setMessage({ text: "Password changed successfully!", type: "success" });
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
      setMessage({
        text: error.message || "Unable to change password. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="changePasswordOverlay"
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <h2>Change Password</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <PasswordField
            id="currentPasswordInput"
            label="Current Password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />

          <PasswordField
            id="newPasswordInput"
            label="New Password"
            placeholder="Create a new password"
            autoComplete="new-password"
            minLength={6}
            value={newPassword}
            onChange={setNewPassword}
          />

          <PasswordField
            id="confirmNewPasswordInput"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={setConfirmNewPassword}
          />

          {message && <div className={`message ${message.type}`}>{message.text}</div>}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
