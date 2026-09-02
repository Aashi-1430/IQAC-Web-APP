"use client";

import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { getInitial } from "../lib/api";
import ChangePasswordModal from "./ChangePasswordModal";
import ProfileModal from "./ProfileModal";

export default function DashboardHeader({ roleLabel, withDropdown = false }) {
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const name = user?.name || roleLabel;
  const initial = getInitial(name);

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="small-logo">S</div>
          <div>
            <h2>SVIET IQAC</h2>
            <span>Internal Quality Assurance Cell</span>
          </div>
        </div>

        <div className="user-area">
          <div className="user-info">
            <strong>{name}</strong>
            <span>{user?.role || roleLabel}</span>
          </div>

          {withDropdown ? (
            <div className="user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
              </svg>

              <div className="avatar-dropdown">
                <button className="dropdown-item" onClick={() => setShowProfile(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.42 3.58-8 8-8s8 3.58 8 8" />
                  </svg>
                  Profile
                </button>

                <button className="dropdown-item" onClick={() => setShowChangePassword(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  Change Password
                </button>

                <button className="dropdown-item dropdown-item-danger" onClick={logout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="user-avatar">{initial}</div>
          )}

        </div>
      </header>

      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} user={user} />
      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
    </>
  );
}
