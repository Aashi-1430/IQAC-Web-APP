"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/AuthContext";
import { getAllForms, deleteForm } from "../../../lib/api";
import EmptyDashboard from "../../../components/EmptyDashboard";
import CreateFormModal from "../../../components/CreateFormModal";
import ViewFormModal from "../../../components/ViewFormModal";

export default function FormsPage() {
  const { token } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [viewingForm, setViewingForm] = useState(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await getAllForms(token);
      setForms(data);
    } catch (err) {
      console.error("Failed to fetch forms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchForms();
    }
  }, [token]);

  const handleFormCreated = () => {
    fetchForms();
  };

  const handleView = (form) => {
    setViewingForm(form);
  };

  const handleEdit = (form) => {
    setEditingForm(form);
    setShowCreateForm(true);
  };

  const handleDelete = async (formId) => {
    if (!confirm("Are you sure you want to delete this form?")) {
      return;
    }

    try {
      await deleteForm(token, formId);
      fetchForms();
    } catch (err) {
      alert(err.message || "Failed to delete form");
    }
  };

  const handleCloseModal = () => {
    setShowCreateForm(false);
    setEditingForm(null);
  };

  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="dashboard-label"></span>
          <h1>Forms</h1>
          <p>Manage IQAC forms and templates.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
          + Create Form
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
          Loading forms...
        </div>
      ) : forms.length === 0 ? (
        <EmptyDashboard
          icon="FORM"
          title="No Forms Yet"
          description="Create your first form to get started."
          buttonText="+ Create Form"
          onButtonClick={() => setShowCreateForm(true)}
        />
      ) : (
        <div className="forms-grid">
          {forms.map((form) => (
            <div key={form.id} className="form-card">
              <div className="form-card-header">
                <h3>{form.title}</h3>
                <div className="form-card-actions">
                  <button
                    className="icon-btn icon-btn-view"
                    onClick={() => handleView(form)}
                    title="View Form"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    className="icon-btn icon-btn-edit"
                    onClick={() => handleEdit(form)}
                    title="Edit Form"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="icon-btn icon-btn-delete"
                    onClick={() => handleDelete(form.id)}
                    title="Delete Form"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
              {form.description && (
                <p className="form-card-description">{form.description}</p>
              )}
              <div className="form-card-footer">
                <span className="form-fields-count">
                  {form.sub_forms?.length || 0} {form.sub_forms?.length === 1 ? 'sub-form' : 'sub-forms'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateFormModal
        open={showCreateForm}
        onClose={handleCloseModal}
        onSuccess={handleFormCreated}
        editForm={editingForm}
      />

      <ViewFormModal
        open={!!viewingForm}
        onClose={() => setViewingForm(null)}
        form={viewingForm}
      />
    </>
  );
}
