"use client";

export default function ViewFormModal({ open, onClose, form }) {
  if (!open || !form) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>View Form: {form.title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-view-container">
            <div className="form-info">
              <div className="info-row">
                <strong>Form Title:</strong>
                <span>{form.title}</span>
              </div>
              {form.description && (
                <div className="info-row">
                  <strong>Description:</strong>
                  <span>{form.description}</span>
                </div>
              )}
              <div className="info-row">
                <strong>Total Sub-Forms:</strong>
                <span>{form.sub_forms?.length || 0}</span>
              </div>
            </div>

            {form.sub_forms && form.sub_forms.length > 0 ? (
              <div className="sub-forms-view">
                {form.sub_forms.map((subForm, subFormIndex) => (
                  <div key={subFormIndex} className="sub-form-view-item">
                    <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--primary)", marginBottom: "12px" }}>
                      {subForm.title}
                    </h4>

                    {subForm.fields && subForm.fields.length > 0 ? (
                      <div className="fields-row">
                        {subForm.fields.map((field, fieldIndex) => (
                          <span key={fieldIndex} className="field-name-tag">
                            {field.field_name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "var(--muted)", fontSize: "13px", fontStyle: "italic" }}>
                        No fields in this sub-form
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: "20px" }}>
                No sub-forms available
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
