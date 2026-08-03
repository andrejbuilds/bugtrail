import { NavLink, useParams } from "react-router-dom";

import default_profile from "../assets/default_profile.png";
import "../styles/settings.css";

const settingsSections = [
  { label: "Profile", path: "profile" },
  { label: "Workspace", path: "workspace" },
  { label: "Members", path: "members" },
  { label: "Notifications", path: "notifications" },
  { label: "Danger Zone", path: "danger-zone", danger: true },
];

const members = [
  { name: "Alex Morgan", email: "alex@bugtrail.dev", role: "Owner", status: "Active" },
  { name: "Sara K.", email: "sara@bugtrail.dev", role: "QA Lead", status: "Active" },
  { name: "Milan Petrovski", email: "milan@bugtrail.dev", role: "Developer", status: "Invited" },
];

function ChevronIcon() {
  return (
    <svg
      className="settings_select_icon"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileSettings() {
  return (
    <section className="settings_panel">
      <div className="settings_panel_header">
        <h2>Profile</h2>
        <p>Update your personal information</p>
      </div>

      <div className="settings_avatar_row">
        <img src={default_profile} alt="Alex Morgan profile" />
        <button type="button" className="settings_secondary_button">
          Change
        </button>
      </div>

      <form className="settings_form">
        <label className="settings_field">
          <span>Full name</span>
          <input type="text" value="Alex Morgan" readOnly />
        </label>
        <label className="settings_field">
          <span>Email</span>
          <input type="email" value="alex@bugtrail.dev" readOnly />
        </label>
        <label className="settings_field">
          <span>Role</span>
          <input type="text" value="Owner" readOnly disabled />
        </label>
        <label className="settings_field">
          <span>Timezone</span>
          <div className="settings_select_shell">
            <select defaultValue="Europe/Lisbon (UTC+0)">
              <option>Europe/Lisbon (UTC+0)</option>
              <option>Europe/Skopje (UTC+1)</option>
              <option>America/New_York (UTC-5)</option>
            </select>
            <ChevronIcon />
          </div>
        </label>
      </form>

      <div className="settings_panel_actions">
        <button type="button" className="new_project_btn settings_save_button">
          Save changes
        </button>
        <button type="button" className="settings_cancel_button">
          Cancel
        </button>
      </div>
    </section>
  );
}

function WorkspaceSettings() {
  return (
    <section className="settings_panel">
      <div className="settings_panel_header">
        <h2>Workspace</h2>
        <p>Manage how your QA workspace appears to your team</p>
      </div>

      <form className="settings_form">
        <label className="settings_field">
          <span>Workspace name</span>
          <input type="text" value="BugTrail QA" readOnly />
        </label>
        <label className="settings_field">
          <span>Default project status</span>
          <div className="settings_select_shell">
            <select defaultValue="Active">
              <option>Active</option>
              <option>Archived</option>
            </select>
            <ChevronIcon />
          </div>
        </label>
        <label className="settings_field">
          <span>Report visibility</span>
          <div className="settings_select_shell">
            <select defaultValue="Only invited clients">
              <option>Only invited clients</option>
              <option>Anyone with the link</option>
            </select>
            <ChevronIcon />
          </div>
        </label>
      </form>

      <div className="settings_workspace_summary">
        <div>
          <span>Projects</span>
          <strong>6</strong>
        </div>
        <div>
          <span>Open issues</span>
          <strong>47</strong>
        </div>
        <div>
          <span>Published reports</span>
          <strong>6</strong>
        </div>
      </div>

      <div className="settings_panel_actions">
        <button type="button" className="new_project_btn settings_save_button">
          Save workspace
        </button>
        <button type="button" className="settings_cancel_button">
          Cancel
        </button>
      </div>
    </section>
  );
}

function MembersSettings() {
  return (
    <section className="settings_panel">
      <div className="settings_panel_header settings_members_header">
        <div>
          <h2>Members</h2>
          <p>Control who can access this workspace</p>
        </div>
        <button type="button" className="new_project_btn settings_invite_button">
          Invite member
        </button>
      </div>

      <div className="settings_members_list">
        {members.map((member) => (
          <article className="settings_member_row" key={member.email}>
            <div className="settings_member_avatar" aria-hidden="true">
              {member.name.charAt(0)}
            </div>
            <div className="settings_member_identity">
              <h3>{member.name}</h3>
              <p>{member.email}</p>
            </div>
            <span className="settings_member_role">{member.role}</span>
            <span className={member.status === "Active" ? "settings_member_status active" : "settings_member_status"}>
              {member.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function NotificationsSettings() {
  return (
    <section className="settings_panel">
      <div className="settings_panel_header">
        <h2>Notifications</h2>
        <p>Choose which workspace events should reach your inbox</p>
      </div>

      <div className="settings_toggle_list">
        <label className="settings_toggle_row">
          <span>
            <strong>New issues</strong>
            <small>Send an email when a teammate reports a new issue.</small>
          </span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="settings_toggle_row">
          <span>
            <strong>Status changes</strong>
            <small>Notify me when issues move between open, review, and fixed.</small>
          </span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="settings_toggle_row">
          <span>
            <strong>Client report activity</strong>
            <small>Send a digest when a report is generated or shared.</small>
          </span>
          <input type="checkbox" />
        </label>
      </div>

      <form className="settings_form settings_notification_form">
        <label className="settings_field">
          <span>Digest frequency</span>
          <div className="settings_select_shell">
            <select defaultValue="Daily">
              <option>Immediate</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
            <ChevronIcon />
          </div>
        </label>
      </form>

      <div className="settings_panel_actions">
        <button type="button" className="new_project_btn settings_save_button">
          Save notifications
        </button>
        <button type="button" className="settings_cancel_button">
          Cancel
        </button>
      </div>
    </section>
  );
}

function DangerZoneSettings({ dataSource, onClearData, onRestoreSampleData }) {
  return (
    <section className="settings_panel settings_danger_panel">
      <div className="settings_panel_header">
        <h2>Danger Zone</h2>
        <p>Permanent workspace actions that need extra care</p>
      </div>

      <div className="settings_danger_list">
        <article className="settings_danger_row">
          <div>
            <h3>Archive workspace</h3>
            <p>Freeze projects and reports while keeping historical data available.</p>
          </div>
          <button type="button" className="settings_secondary_button">
            Archive
          </button>
        </article>
        <article className="settings_danger_row">
          <div>
            <h3>Transfer ownership</h3>
            <p>Move owner permissions to another active workspace member.</p>
          </div>
          <button type="button" className="settings_secondary_button">
            Transfer
          </button>
        </article>
        <article className="settings_danger_row critical">
          <div>
            <h3>Clear workspace data</h3>
            <p>Remove all projects, issues, and reports from {dataSource}.</p>
          </div>
          <button type="button" className="settings_danger_button" onClick={onClearData}>
            Clear data
          </button>
        </article>
        <article className="settings_danger_row">
          <div>
            <h3>Restore sample data</h3>
            <p>Replace the current workspace with a small project, issue, and report dataset.</p>
          </div>
          <button type="button" className="settings_secondary_button" onClick={onRestoreSampleData}>
            Restore
          </button>
        </article>
      </div>
    </section>
  );
}

function Settings({ dataSource, onClearData, onRestoreSampleData }) {
  const { section = "profile" } = useParams();
  const settingsViews = {
    profile: <ProfileSettings />,
    workspace: <WorkspaceSettings />,
    members: <MembersSettings />,
    notifications: <NotificationsSettings />,
    "danger-zone": (
      <DangerZoneSettings
        dataSource={dataSource}
        onClearData={onClearData}
        onRestoreSampleData={onRestoreSampleData}
      />
    ),
  };
  const activeView = settingsViews[section] ?? settingsViews.profile;

  return (
    <div className="main_content settings_page">
      <div className="settings_page_header">
        <h1 className="dashboard_heading">Settings</h1>
        <p className="dashboard_sub_heading">Manage your account and workspace</p>
      </div>

      <div className="settings_layout">
        <nav className="settings_nav" aria-label="Settings sections">
          {settingsSections.map((section) => (
            <NavLink
              key={section.path}
              to={`/settings/${section.path}`}
              className={({ isActive }) =>
                [
                  "settings_nav_link",
                  isActive ? "active" : "",
                  section.danger ? "danger" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              {section.label}
            </NavLink>
          ))}
        </nav>

        {activeView}
      </div>
    </div>
  );
}

export default Settings;
