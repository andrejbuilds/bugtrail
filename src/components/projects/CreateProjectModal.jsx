import { useState } from "react";

import ModalShell from "../shared/ModalShell";

const initialFormData = {
  name: "",
  website: "",
  description: "",
  visibility: "private",
  status: "Active",
  teammates: "",
};

const validVisibilityOptions = ["private", "workspace", "public"];
const validStatusOptions = ["Active", "Archived"];

function validateProject(values) {
  const validationErrors = {};
  const name = values.name.trim();
  const website = values.website.trim();
  const description = values.description.trim();
  const teammateEmails = values.teammates
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!name) {
    validationErrors.name = "Project name is required.";
  } else if (name.length < 3) {
    validationErrors.name = "Project name must contain at least 3 characters.";
  } else if (name.length > 80) {
    validationErrors.name = "Project name cannot exceed 80 characters.";
  }

  if (!website) {
    validationErrors.website = "Website URL is required.";
  } else {
    try {
      const parsedUrl = new URL(website);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        validationErrors.website = "Website URL must use http or https.";
      }
    } catch {
      validationErrors.website = "Enter a complete URL, such as https://example.com.";
    }
  }

  if (description.length > 500) {
    validationErrors.description = "Description cannot exceed 500 characters.";
  }

  if (!validVisibilityOptions.includes(values.visibility)) {
    validationErrors.visibility = "Select a valid visibility option.";
  }

  if (!validStatusOptions.includes(values.status)) {
    validationErrors.status = "Select a valid project status.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = teammateEmails.filter((email) => !emailPattern.test(email));

  if (invalidEmails.length > 0) {
    validationErrors.teammates = `Invalid email: ${invalidEmails[0]}`;
  }

  return validationErrors;
}

function CreateProjectModal({
  onClose,
  onCreateProject,
  initialData = initialFormData,
  title = "Create new project",
  description = "Set up a workspace to collect QA issues and reports.",
  footerNote = "You can change these later.",
  primaryAction = "Create project",
}) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...initialData,
    teammates: Array.isArray(initialData.teammates)
      ? initialData.teammates.join(", ")
      : initialData.teammates ?? "",
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = "create-project-form";
  const submittingAction = primaryAction === "Create project" ? "Creating..." : "Saving...";

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

    if (submissionError) {
      setSubmissionError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors = validateProject(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      await onCreateProject({
        name: formData.name.trim(),
        website: formData.website.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        status: formData.status,
        teammates: formData.teammates
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
      });
      onClose();
    } catch (error) {
      setSubmissionError(error.message || "Could not save project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={title}
      description={description}
      footerNote={footerNote}
      primaryAction={isSubmitting ? submittingAction : primaryAction}
      secondaryAction="Cancel"
      onClose={onClose}
      formId={formId}
      isSubmitting={isSubmitting}
    >
      <form id={formId} className="modal_form" onSubmit={handleSubmit} noValidate>
        {submissionError && (
          <p className="form_error form_submission_error" role="alert">
            {submissionError}
          </p>
        )}
        <label className="modal_field">
          <span>Project name</span>
          <input
            id="project-name"
            name="name"
            type="text"
            placeholder="Acme Marketing Site"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "project-name-error" : undefined}
          />
          {errors.name && (
            <p id="project-name-error" className="form_error" role="alert">
              {errors.name}
            </p>
          )}
        </label>

        <label className="modal_field">
          <span>Website URL</span>
          <input
            id="project-website"
            name="website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? "project-website-error" : undefined}
          />
          {errors.website && (
            <p id="project-website-error" className="form_error" role="alert">
              {errors.website}
            </p>
          )}
        </label>

        <label className="modal_field">
          <span>Description (optional)</span>
          <textarea
            id="project-description"
            name="description"
            placeholder="What is this project about?"
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
            aria-invalid={Boolean(errors.description)}
            aria-describedby="project-description-help"
          ></textarea>
          <small id="project-description-help" className="form_help">
            {formData.description.length}/500
          </small>
          {errors.description && (
            <p className="form_error" role="alert">
              {errors.description}
            </p>
          )}
        </label>

        <fieldset className="modal_segment_group">
          <legend>Visibility</legend>
          <label>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={formData.visibility === "private"}
              onChange={handleChange}
            />
            <span>Private</span>
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="workspace"
              checked={formData.visibility === "workspace"}
              onChange={handleChange}
            />
            <span>Workspace</span>
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={formData.visibility === "public"}
              onChange={handleChange}
            />
            <span>Public</span>
          </label>
        </fieldset>
        {errors.visibility && (
          <p className="form_error" role="alert">
            {errors.visibility}
          </p>
        )}

        <label className="modal_field">
          <span>Status</span>
          <select
            id="project-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            aria-invalid={Boolean(errors.status)}
          >
            {validStatusOptions.map((status) => (
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
          <span>Invite teammates (optional)</span>
          <input
            id="project-teammates"
            name="teammates"
            type="text"
            placeholder="sarah@acme.com, marcus@acme.com"
            value={formData.teammates}
            onChange={handleChange}
            aria-invalid={Boolean(errors.teammates)}
            aria-describedby={errors.teammates ? "project-teammates-error" : undefined}
          />
          {errors.teammates && (
            <p id="project-teammates-error" className="form_error" role="alert">
              {errors.teammates}
            </p>
          )}
        </label>
      </form>
    </ModalShell>
  );
}

export default CreateProjectModal;
