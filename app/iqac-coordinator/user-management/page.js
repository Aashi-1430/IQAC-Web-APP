"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../lib/AuthContext";
import {
  ADMIN_ROLES,
  activateUser,
  approveUser,
  changeUserRole,
  deactivateUser,
  getAllUsers,
  getPendingUsers,
  rejectUser,
} from "../../../lib/api";

const ROLE_LABELS = {
  hod: "HOD",
  iqac_coordinator: "IQAC Coordinator",
  super_admin: "Super Admin",
};

function formatRole(role) {
  if (!role) return "—";
  return ROLE_LABELS[role] || role;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

export default function UserManagementPage() {
  const { token, user: currentUser } = useAuth();

  const [tab, setTab] = useState("all"); // "all" | "pending"
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState(null);

  // id of the row currently performing an action (disables its buttons)
  const [actingId, setActingId] = useState(null);
  // { user, action } for a destructive action awaiting confirmation
  const [confirmAction, setConfirmAction] = useState(null);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [users, pending] = await Promise.all([
        getAllUsers(token),
        getPendingUsers(token),
      ]);
      setAllUsers(users);
      setPendingUsers(pending);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 3500);
    return () => clearTimeout(timer);
  }, [banner]);

  const rows = tab === "pending" ? pendingUsers : allUsers;

  const isSelf = useCallback(
    (u) => currentUser && (u.id === currentUser.id || u.email === currentUser.email),
    [currentUser]
  );

  async function runAction(user, action, fn) {
    setActingId(user.id);
    setBanner(null);
    try {
      await fn();
      setBanner({ type: "success", text: `User ${action} successfully.` });
      await loadUsers();
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      setBanner({ type: "error", text: err.message || `Unable to ${action} user.` });
    } finally {
      setActingId(null);
      setConfirmAction(null);
    }
  }

  function handleApprove(user) {
    runAction(user, "approved", () => approveUser(token, user.id));
  }

  function handleReject(user) {
    setConfirmAction({
      user,
      label: "Reject",
      description: `Reject ${user.name}'s account request? This cannot be undone.`,
      run: () => runAction(user, "rejected", () => rejectUser(token, user.id)),
    });
  }

  function handleActivate(user) {
    runAction(user, "activated", () => activateUser(token, user.id));
  }

  function handleDeactivate(user) {
    setConfirmAction({
      user,
      label: "Deactivate",
      description: `Deactivate ${user.name}'s account? They will lose access immediately.`,
      run: () => runAction(user, "deactivated", () => deactivateUser(token, user.id)),
    });
  }

  function handleRoleChange(user, newRole) {
    if (!newRole || newRole === user.role) return;
    setConfirmAction({
      user,
      label: "Change Role",
      description: `Change ${user.name}'s role from ${formatRole(user.role)} to ${formatRole(
        newRole
      )}?`,
      run: () => runAction(user, "role updated", () => changeUserRole(token, user.id, newRole)),
    });
  }

  const pendingCount = pendingUsers.length;

  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label"></span>
          <h1>User Management</h1>
          <p>Manage IQAC portal user accounts and approvals.</p>
        </div>
      </div>

      {banner && <div className={`message ${banner.type}`}>{banner.text}</div>}

      <div className="table-tabs">
        <button
          type="button"
          className={`table-tab ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          All Users
        </button>
        <button
          type="button"
          className={`table-tab ${tab === "pending" ? "active" : ""}`}
          onClick={() => setTab("pending")}
        >
          Pending Approvals
          {pendingCount > 0 && <span className="tab-count">{pendingCount}</span>}
        </button>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="table-state">
            <span className="loading-spinner"></span>
            <span>Loading users...</span>
          </div>
        ) : error ? (
          <div className="table-state table-state-error">{error}</div>
        ) : rows.length === 0 ? (
          <div className="table-state">
            {tab === "pending" ? "No pending approvals." : "No users found."}
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => {
                  const acting = actingId === u.id;
                  const self = isSelf(u);
                  const isSuperAdmin = u.role === "super_admin";

                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <span className="user-cell-avatar">
                            {(u.name || "?").trim().charAt(0).toUpperCase()}
                          </span>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="muted-cell">{u.email}</td>
                      <td>
                        {isSuperAdmin || self ? (
                          <span className="role-pill">{formatRole(u.role)}</span>
                        ) : (
                          <select
                            className="role-select"
                            value={u.role}
                            disabled={acting}
                            onChange={(e) => handleRoleChange(u, e.target.value)}
                          >
                            {ADMIN_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {formatRole(r)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        <span className={`status-pill ${u.is_active ? "status-active" : "status-inactive"}`}>
                          {u.is_active ? "Active" : tab === "pending" ? "Pending" : "Inactive"}
                        </span>
                      </td>
                      <td className="muted-cell">{formatDate(u.created_at)}</td>
                      <td>
                        <div className="row-actions">
                          {tab === "pending" ? (
                            <>
                              <button
                                type="button"
                                className="row-action row-action-approve"
                                disabled={acting}
                                onClick={() => handleApprove(u)}
                              >
                                {acting ? "..." : "Approve"}
                              </button>
                              <button
                                type="button"
                                className="row-action row-action-reject"
                                disabled={acting}
                                onClick={() => handleReject(u)}
                              >
                                Reject
                              </button>
                            </>
                          ) : self || isSuperAdmin ? (
                            <span className="muted-cell">—</span>
                          ) : u.is_active ? (
                            <button
                              type="button"
                              className="row-action row-action-reject"
                              disabled={acting}
                              onClick={() => handleDeactivate(u)}
                            >
                              {acting ? "..." : "Deactivate"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="row-action row-action-approve"
                              disabled={acting}
                              onClick={() => handleActivate(u)}
                            >
                              {acting ? "..." : "Activate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmAction && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setConfirmAction(null);
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h2>{confirmAction.label}</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setConfirmAction(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="confirm-text">{confirmAction.description}</p>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={actingId === confirmAction.user.id}
                onClick={confirmAction.run}
              >
                {actingId === confirmAction.user.id ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Working...</span>
                  </>
                ) : (
                  <span>Confirm</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
