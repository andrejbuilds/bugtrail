import { useState } from "react";

import ModalShell from "../shared/ModalShell";

const initialFormData = {
  projectId: "",
  severity: "Medium",
  status: "Open",
  title: "",
  assignee: "Unassigned",
  device: "",
  page: "",
  description: "",
  steps: "",
  labels: "",
};

const validSeverities = ["Low", "Medium", "High", "Critical"];
const validStatuses = ["Open", "In Review", "Fixed"];

function validateIssue(values, projects) {
  const validationErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();
  const steps = values.steps.trim();

  if (projects.length === 0) {
    validationErrors.projectId = "Create a project before reporting an issue.";
  } else if (!values.projectId) {
    validationErrors.projectId = "Select a project.";
  }

  if (!validSeverities.includes(values.severity)) {
    validationErrors.severity = "Select a valid severity.";
  }

  if (!validStatuses.includes(values.status)) {
    validationErrors.status = "Select a valid status.";
  }

  if (!title) {
    validationErrors.title = "Issue title is required.";
  } else if (title.length < 5) {
    validationErrors.title = "Issue title must contain at least 5 characters.";
  } else if (title.length > 120) {
    validationErrors.title = "Issue title cannot exceed 120 characters.";
  }

  if (description.length > 1000) {
    validationErrors.description = "Description cannot exceed 1000 characters.";
  }

  if (steps.length > 1000) {
    validationErrors.steps = "Steps cannot exceed 1000 characters.";
  }

  return validationErrors;
}

function ReportIssueModal({
  onClose,
  onCreateIssue,
  projects,
  initialData = {},
  title = "Report issue",
  description = "Capture the bug details your team needs to reproduce and fix it.",
  footerNote = "Attachments and labels can be edited after creation.",
  primaryAction = "Report issue",
}) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    projectId: projects[0]?.id ?? "",
    ...initialData,
    labels: Array.isArray(initialData.labels)
      ? initialData.labels.join(", ")
      : initialData.labels ?? initialFormData.labels,
  });
  const [errors, setErrors] = useState({});
  const formId = "report-issue-form";

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

    const validationErrors = validateIssue(formData, projects);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onCreateIssue({
      projectId: formData.projectId,
      severity: formData.severity,
      status: formData.status,
      title: formData.title.trim(),
      assignee: formData.assignee,
      device: formData.device.trim(),
      page: formData.page.trim(),
      description: formData.description.trim(),
      steps: formData.steps.trim(),
      labels: formData.labels
        .split(",")
        .map((label) => label.trim())
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
      size="large"
    >
      <form id={formId} className="modal_form report_issue_form" onSubmit={handleSubmit} noValidate>
        <div className="modal_form_grid">
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
            <span>Severity</span>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              aria-invalid={Boolean(errors.severity)}
            >
              {validSeverities.map((severity) => (
                <option key={severity}>{severity}</option>
              ))}
            </select>
            {errors.severity && (
              <p className="form_error" role="alert">
                {errors.severity}
              </p>
            )}
          </label>
        </div>

        <label className="modal_field">
          <span>Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            aria-invalid={Boolean(errors.status)}
          >
            {validStatuses.map((status) => (
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
          <span>Issue title</span>
          <input
            name="title"
            type="text"
            placeholder="Login button misaligned on mobile"
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

        <div className="modal_form_grid">
          <label className="modal_field">
            <span>Assignee</span>
            <select name="assignee" value={formData.assignee} onChange={handleChange}>
              <option>Unassigned</option>
              <option>Andrej</option>
            </select>
          </label>

          <label className="modal_field">
            <span>Browser / device</span>
            <input
              name="device"
              type="text"
              placeholder="Safari 17 / iOS"
              value={formData.device}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className="modal_field">
          <span>Page URL</span>
          <input
            name="page"
            type="text"
            placeholder="/login"
            value={formData.page}
            onChange={handleChange}
          />
        </label>

        <label className="modal_field">
          <span>Description</span>
          <textarea
            name="description"
            placeholder="On mobile devices, the login button is not centered within its container."
            value={formData.description}
            onChange={handleChange}
            maxLength={1000}
            aria-invalid={Boolean(errors.description)}
          ></textarea>
          <small className="form_help">{formData.description.length}/1000</small>
          {errors.description && (
            <p className="form_error" role="alert">
              {errors.description}
            </p>
          )}
        </label>

        <label className="modal_field">
          <span>Steps to reproduce</span>
          <textarea
            name="steps"
            placeholder={"1. Open the site on a mobile device\n2. Navigate to /login\n3. Observe the login button alignment"}
            value={formData.steps}
            onChange={handleChange}
            maxLength={1000}
            aria-invalid={Boolean(errors.steps)}
          ></textarea>
          <small className="form_help">{formData.steps.length}/1000</small>
          {errors.steps && (
            <p className="form_error" role="alert">
              {errors.steps}
            </p>
          )}
        </label>

        <div className="modal_form_grid">
          <label className="modal_field">
            <span>Labels</span>
            <input
              name="labels"
              type="text"
              placeholder="ui, mobile, regression"
              value={formData.labels}
              onChange={handleChange}
            />
          </label>

          <label className="modal_field">
            <span>Screenshot</span>
            <div className="modal_upload_box">
              <strong>Attach screenshot</strong>
              <small>PNG, JPG, or WebP</small>
            </div>
          </label>
        </div>
      </form>
    </ModalShell>
  );
}

export default ReportIssueModal;
