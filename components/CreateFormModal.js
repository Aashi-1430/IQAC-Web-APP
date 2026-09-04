"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { createForm, updateForm } from "../lib/api";

export default function CreateFormModal({ open, onClose, onSuccess, editForm = null }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subForms, setSubForms] = useState([
    {
      title: "",
      fields: [
        {
          field_name: "",
          field_type: "text",
          placeholder: "",
          required: false,
          options: null,
          validation: null,
        },
      ],
    },
  ]);

  // Populate form when editing
  useEffect(() => {
    if (editForm) {
      setTitle(editForm.title || "");
      setSubForms(editForm.sub_forms && editForm.sub_forms.length > 0 ? editForm.sub_forms : [
        {
          title: "",
          fields: [
            {
              field_name: "",
              field_type: "text",
              placeholder: "",
              required: false,
              options: null,
              validation: null,
            },
          ],
        },
      ]);
    } else {
      // Reset form when not editing
      setTitle("");
      setSubForms([
        {
          title: "",
          fields: [
            {
              field_name: "",
              field_type: "text",
              placeholder: "",
              required: false,
              options: null,
              validation: null,
            },
          ],
        },
      ]);
    }
    setError("");
  }, [editForm, open]);

  const fieldTypes = [
    "text",
    "email",
    "number",
    "textarea",
    "select",
    "checkbox",
    "radio",
    "date",
    "file",
  ];

  const addSubForm = () => {
    setSubForms([
      ...subForms,
      {
        title: "",
        fields: [
          {
            field_name: "",
            field_type: "text",
            placeholder: "",
            required: false,
            options: null,
            validation: null,
          },
        ],
      },
    ]);
  };

  const removeSubForm = (subFormIndex) => {
    setSubForms(subForms.filter((_, i) => i !== subFormIndex));
  };

  const updateSubFormTitle = (subFormIndex, value) => {
    const updated = [...subForms];
    updated[subFormIndex].title = value;
    setSubForms(updated);
  };

  const addField = (subFormIndex) => {
    const updated = [...subForms];
    updated[subFormIndex].fields.push({
      field_name: "",
      field_type: "text",
      placeholder: "",
      required: false,
      options: null,
      validation: null,
    });
    setSubForms(updated);
  };

  const removeField = (subFormIndex, fieldIndex) => {
    const updated = [...subForms];
    updated[subFormIndex].fields = updated[subFormIndex].fields.filter((_, i) => i !== fieldIndex);
    setSubForms(updated);
  };

  const updateField = (subFormIndex, fieldIndex, key, value) => {
    const updated = [...subForms];
    updated[subFormIndex].fields[fieldIndex][key] = value;
    setSubForms(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Form title is required");
      return;
    }

    if (subForms.length === 0) {
      setError("At least one sub-form is required");
      return;
    }

    for (let i = 0; i < subForms.length; i++) {
      if (!subForms[i].title || !subForms[i].title.trim()) {
        setError(`Sub-form ${i + 1}: title is required`);
        return;
      }

      if (subForms[i].fields.length === 0) {
        setError(`Sub-form ${i + 1}: at least one field is required`);
        return;
      }

      for (let j = 0; j < subForms[i].fields.length; j++) {
        if (!subForms[i].fields[j].field_name || !subForms[i].fields[j].field_name.trim()) {
          setError(`Sub-form ${i + 1}, Field ${j + 1}: field_name is required`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const formData = {
        title: title.trim(),
        sub_forms: subForms.map((subForm) => ({
          title: subForm.title.trim(),
          fields: subForm.fields.map((field) => ({
            field_name: field.field_name.trim(),
            field_type: field.field_type,
            placeholder: field.placeholder && field.placeholder.trim() ? field.placeholder.trim() : null,
            required: field.required,
            options: field.options && field.options.trim() ? field.options.trim() : null,
            validation: field.validation && field.validation.trim() ? field.validation.trim() : null,
          })),
        })),
      };

      if (editForm) {
        await updateForm(token, editForm.id, formData);
      } else {
        await createForm(token, formData);
      }

      setTitle("");
      setSubForms([
        {
          title: "",
          fields: [
            {
              field_name: "",
              field_type: "text",
              placeholder: "",
              required: false,
              options: null,
              validation: null,
            },
          ],
        },
      ]);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${editForm ? 'update' : 'create'} form`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editForm ? 'Edit Form' : 'Create New Form'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label>
                Form Title <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="sub-forms-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Sub-Forms</h3>
                <button type="button" className="btn-secondary" onClick={addSubForm} disabled={loading}>
                  + Add Sub-Form
                </button>
              </div>

              {subForms.map((subForm, subFormIndex) => (
                <div key={subFormIndex} className="sub-form-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <strong style={{ fontSize: "15px", color: "var(--primary)" }}>Sub-Form {subFormIndex + 1}</strong>
                    {subForms.length > 1 && (
                      <button
                        type="button"
                        className="btn-danger-small"
                        onClick={() => removeSubForm(subFormIndex)}
                        disabled={loading}
                      >
                        Remove Sub-Form
                      </button>
                    )}
                  </div>

                  <div className="input-group">
                    <label>
                      Sub-Form Title <span style={{ color: "var(--danger)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={subForm.title}
                      onChange={(e) => updateSubFormTitle(subFormIndex, e.target.value)}
                      placeholder="Enter sub-form title"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="fields-subsection">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Fields</h4>
                      <button
                        type="button"
                        className="btn-secondary-small"
                        onClick={() => addField(subFormIndex)}
                        disabled={loading}
                      >
                        + Add Field
                      </button>
                    </div>

                    {subForm.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="field-item">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <strong style={{ fontSize: "13px" }}>Field {fieldIndex + 1}</strong>
                          {subForm.fields.length > 1 && (
                            <button
                              type="button"
                              className="btn-danger-small"
                              onClick={() => removeField(subFormIndex, fieldIndex)}
                              disabled={loading}
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div className="input-group">
                            <label>
                              Field Name <span style={{ color: "var(--danger)" }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={field.field_name}
                              onChange={(e) => updateField(subFormIndex, fieldIndex, "field_name", e.target.value)}
                              placeholder="e.g., email"
                              className="form-input"
                              disabled={loading}
                            />
                          </div>

                          <div className="input-group">
                            <label>Field Type</label>
                            <select
                              value={field.field_type}
                              onChange={(e) => updateField(subFormIndex, fieldIndex, "field_type", e.target.value)}
                              className="form-input"
                              disabled={loading}
                            >
                              {fieldTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="input-group">
                            <label>Placeholder</label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateField(subFormIndex, fieldIndex, "placeholder", e.target.value)}
                              placeholder="e.g., Enter your email"
                              className="form-input"
                              disabled={loading}
                            />
                          </div>

                          {(field.field_type === "select" || field.field_type === "radio") && (
                            <div className="input-group">
                              <label>Options (comma-separated)</label>
                              <input
                                type="text"
                                value={field.options || ""}
                                onChange={(e) => updateField(subFormIndex, fieldIndex, "options", e.target.value)}
                                placeholder="e.g., Option1, Option2, Option3"
                                className="form-input"
                                disabled={loading}
                              />
                            </div>
                          )}

                          <div className="input-group">
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(subFormIndex, fieldIndex, "required", e.target.checked)}
                                disabled={loading}
                              />
                              Required Field
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (editForm ? 'Updating...' : 'Creating...') : (editForm ? 'Update Form' : 'Create Form')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
