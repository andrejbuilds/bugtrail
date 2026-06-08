import ModalShell from "./ModalShell";

function ReportIssueModal({ onClose }) {
  return (
    <ModalShell
      title="Report issue"
      description="Capture the bug details your team needs to reproduce and fix it."
      footerNote="Attachments and labels can be edited after creation."
      primaryAction="Report issue"
      secondaryAction="Cancel"
      onClose={onClose}
      size="large"
    >
      <form className="modal_form report_issue_form">
        <div className="modal_form_grid">
          <label className="modal_field">
            <span>Project</span>
            <select defaultValue="Acme Marketing">
              <option>Acme Marketing</option>
              <option>Northwind Shop</option>
              <option>Beacon Portal</option>
            </select>
          </label>

          <label className="modal_field">
            <span>Severity</span>
            <select defaultValue="High">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>
        </div>

        <label className="modal_field">
          <span>Issue title</span>
          <input type="text" placeholder="Login button misaligned on mobile" />
        </label>

        <div className="modal_form_grid">
          <label className="modal_field">
            <span>Assignee</span>
            <select defaultValue="Marcus K.">
              <option>Marcus K.</option>
              <option>Sarah C.</option>
              <option>Unassigned</option>
            </select>
          </label>

          <label className="modal_field">
            <span>Browser / device</span>
            <input type="text" placeholder="Safari 17 / iOS" />
          </label>
        </div>

        <label className="modal_field">
          <span>Page URL</span>
          <input type="text" placeholder="/login" />
        </label>

        <label className="modal_field">
          <span>Description</span>
          <textarea placeholder="On mobile devices, the login button is not centered within its container."></textarea>
        </label>

        <label className="modal_field">
          <span>Steps to reproduce</span>
          <textarea placeholder={"1. Open the site on a mobile device\n2. Navigate to /login\n3. Observe the login button alignment"}></textarea>
        </label>

        <div className="modal_form_grid">
          <label className="modal_field">
            <span>Labels</span>
            <div className="modal_token_input">
              <span className="modal_token blue">ui</span>
              <span className="modal_token blue">mobile</span>
              <span className="modal_token teal">regression</span>
              <input type="text" placeholder="Add label..." />
            </div>
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
