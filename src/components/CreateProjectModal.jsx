import ModalShell from "./ModalShell";

function CreateProjectModal({ onClose }) {
  return (
    <ModalShell
      title="Create new project"
      description="Set up a workspace to collect QA issues and reports."
      footerNote="You can change these later."
      primaryAction="Create project"
      secondaryAction="Cancel"
      onClose={onClose}
    >
      <form className="modal_form">
        <label className="modal_field">
          <span>Project name</span>
          <input type="text" placeholder="Acme Marketing Site" />
        </label>

        <label className="modal_field">
          <span>Website URL</span>
          <div className="modal_url_input">
            <strong>https://</strong>
            <input type="text" placeholder="acme.com" />
          </div>
        </label>

        <label className="modal_field">
          <span>Description (optional)</span>
          <textarea placeholder="What is this project about?"></textarea>
        </label>

        <fieldset className="modal_segment_group">
          <legend>Visibility</legend>
          <label>
            <input type="radio" name="project_visibility" defaultChecked />
            <span>Private</span>
          </label>
          <label>
            <input type="radio" name="project_visibility" />
            <span>Workspace</span>
          </label>
          <label>
            <input type="radio" name="project_visibility" />
            <span>Public</span>
          </label>
        </fieldset>

        <label className="modal_field">
          <span>Invite teammates (optional)</span>
          <div className="modal_token_input">
            <span className="modal_token">sarah@acme.com</span>
            <span className="modal_token">marcus@acme.com</span>
            <input type="email" placeholder="Add email..." />
          </div>
        </label>
      </form>
    </ModalShell>
  );
}

export default CreateProjectModal;
