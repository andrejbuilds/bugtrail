import { useState } from "react";

import ModalShell from "../shared/ModalShell";

const initialFormData = {
  title: "",
  projectId: "",
  status: "Published",
  recipients: "",
};

const validReportStatuses = ["Drafts", "Published", "Archived"];

function validateReport(values, projects) {
  const validationErrors = {};
  const title = values.title.trim();
  const recipients = values.recipients
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!title) {
    validationErrors.title = "Report title is required.";
  } else if (title.length < 3) {
    validationErrors.title = "Report title must contain at least 3 characters.";
  } else if (title.length > 100) {
    validationErrors.title = "Report title cannot exceed 100 characters.";
  }

  if (projects.length === 0) {
    validationErrors.projectId = "Create a project before generating a report.";
  } else if (!values.projectId) {
    validationErrors.projectId = "Select a project.";
  }

  if (!validReportStatuses.includes(values.status)) {
    validationErrors.status = "Select a valid report status.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = recipients.filter((email) => !emailPattern.test(email));

  if (invalidEmails.length > 0) {
    validationErrors.recipients = `Invalid email: ${invalidEmails[0]}`;
  }

  return validationErrors;
}

function CreateReportModal({
  onClose,
  onCreateReport,
  projects,
  initialData = {},
  title = "Generate report",
  description = "Create a shareable summary for a project.",
  footerNote = "Reports use the current issue counts for the selected project.",
  primaryAction = "Generate report",
}) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    projectId: projects[0]?.id ?? "",
    ...initialData,
    recipients: Array.isArray(initialData.recipients)
      ? initialData.recipients.join(", ")
      : initialData.recipients ?? initialFormData.recipients,
  });
  const [errors, setErrors] = useState({});
  const formId = "create-report-form";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateReport(formData, projects);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onCreateReport({
      title: formData.title.trim(),
      projectId: formData.projectId,
      status: formData.status,
      recipients: formData.recipients
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean),
    });
    onClose();
  }

  return (
    <ModalShell
      title={title}
      description={description}
      footerNote={footerNote}
      primaryAction={primaryAction}
      secondaryAction="Cancel"
      onClose={onClose}
      formId={formId}
    >
      <form id={formId} className="modal_form" onSubmit={handleSubmit} noValidate>
        <label className="modal_field">
          <span>Report title</span>
          <input
            name="title"
            type="text"
            placeholder="Launch QA Summary"
            value={formData.title}
            onChange={handleChange}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && (
            <p className="form_error" role="alert">
              {errors.title}
            </p>
          )}
        </label>

        <label className="modal_field">
          <span>Project</span>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            disabled={projects.length === 0}
            aria-invalid={Boolean(errors.projectId)}
          >
            {projects.length === 0 ? (
              <option value="">No projects available</option>
            ) : (
              projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))
            )}
          </select>
          {errors.projectId && (
            <p className="form_error" role="alert">
              {errors.projectId}
            </p>
          )}
        </label>

        <label className="modal_field">
          <span>Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            aria-invalid={Boolean(errors.status)}
          >
            {validReportStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          {errors.status && (
            <p className="form_error" role="alert">
              {errors.status}
            </p>
          )}
        </label>

        <label className="modal_field">
          <span>Share with (optional)</span>
          <input
            name="recipients"
            type="text"
            placeholder="client@example.com, qa@example.com"
            value={formData.recipients}
            onChange={handleChange}
            aria-invalid={Boolean(errors.recipients)}
          />
          {errors.recipients && (
            <p className="form_error" role="alert">
              {errors.recipients}
            </p>
          )}
        </label>
      </form>
    </ModalShell>
  );
}

export default CreateReportModal;
