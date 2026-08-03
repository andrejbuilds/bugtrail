import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ReportIssueModal from "../components/issues/ReportIssueModal";
import IssueStatusPill from "../components/shared/IssueStatusPill";
import defaultProfile from "../assets/default_profile.png";
import NotFound from "./NotFound";
import "../styles/detail.css";

function IssueDetail({ projects, issues, onUpdateIssue, onDeleteIssue, onAddIssueComment }) {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const issue = issues.find((item) => item.id === issueId);

  if (!issue) {
    return (
      <NotFound
        title="Issue not found"
        description="The issue you requested does not exist."
        returnTo="/issues"
        returnLabel="Return to issues"
      />
    );
  }

  function handleDelete() {
    onDeleteIssue(issue.id);
    navigate("/issues");
  }

  function handleCommentSubmit(event) {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    onAddIssueComment(issue.id, commentText);
    setCommentText("");
  }

  return (
    <>
      <div className="main_content detail_page issue_detail_page">
        <div className="detail_breadcrumb">
          <Link to="/issues">Issues</Link>
          <span>/</span>
          <Link to={`/projects/${issue.projectId}`}>{issue.project}</Link>
          <span>/</span>
          <span>{issue.issueId}</span>
        </div>

        <div className="detail_header">
          <div>
            <h1 className="dashboard_heading">{issue.title}</h1>
            <p className="dashboard_sub_heading">{issue.issueId}</p>
          </div>
          <div className="detail_actions">
            <IssueStatusPill status={issue.status} tone={issue.statusTone} />
            <span className="detail_severity_pill">
              <span className={`detail_severity_dot issue_priority_${issue.priority}`} aria-hidden="true"></span>
              {issue.severity}
            </span>
            <button type="button" className="detail_secondary_button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button type="button" className="detail_danger_button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="issue_detail_layout">
          <main>
            <section className="issue_screenshot_placeholder">
              <div className={issue.screenshot?.dataUrl ? "issue_screenshot_preview" : ""}>
                <span className="issue_screenshot_marker">1</span>
                {issue.screenshot?.dataUrl ? (
                  <img src={issue.screenshot.dataUrl} alt={issue.screenshot.name} />
                ) : (
                  <>
                    <h2>{issue.screenshot?.name || issue.page || "Page reference"}</h2>
                    <p>
                      {issue.screenshot
                        ? "Screenshot attached"
                        : issue.device || "No browser or device captured."}
                    </p>
                  </>
                )}
              </div>
            </section>

            <section className="detail_text_block">
              <h2>Description</h2>
              <p>{issue.description || "No description added."}</p>
            </section>

            <section className="detail_text_block">
              <h2>Steps to reproduce</h2>
              {issue.steps ? (
                <p className="detail_preserve_lines">{issue.steps}</p>
              ) : (
                <p>No steps added.</p>
              )}
            </section>

            <section className="detail_text_block">
              <h2>Activity</h2>
              <div className="issue_activity_feed">
                <div className="detail_activity_item">
                  <img className="detail_activity_avatar" src={defaultProfile} alt="" />
                  <p>
                    <strong>{issue.reporter}</strong> opened this issue / {issue.openedAt.replace("opened ", "")}
                  </p>
                </div>
                <div className="detail_activity_item">
                  <img className="detail_activity_avatar" src={defaultProfile} alt="" />
                  <p>
                    <strong>{issue.assignee}</strong> assigned to <span className="detail_activity_link">@devteam</span>
                  </p>
                </div>

                {(issue.comments ?? []).length > 0 ? (
                  (issue.comments ?? []).map((comment) => (
                    <article className="detail_activity_comment" key={comment.id}>
                      <img className="detail_activity_avatar" src={defaultProfile} alt="" />
                      <div className="issue_comment_bubble">
                        <p className="issue_comment_body">{comment.body}</p>
                        <p className="issue_comment_meta">{comment.createdAt}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="detail_muted">No comments yet.</p>
                )}
              </div>

              <form className="issue_comment_form" onSubmit={handleCommentSubmit}>
                <img className="detail_activity_avatar" src={defaultProfile} alt="" />
                <label className="issue_comment_field">
                  <span className="sr_only">Write a comment</span>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Write a comment..."
                  />
                </label>
                <button type="submit" className="new_project_btn issue_comment_button">
                  Comment
                </button>
              </form>
            </section>
          </main>

          <aside className="detail_sidebar">
            <section className="detail_panel">
              <h2>Details</h2>
              <dl className="detail_definition_list">
                <div>
                  <dt>Project</dt>
                  <dd>
                    <Link to={`/projects/${issue.projectId}`}>{issue.project}</Link>
                  </dd>
                </div>
                <div>
                  <dt>Severity</dt>
                  <dd>
                    <span className="detail_severity_inline">
                      <span className={`detail_severity_dot issue_priority_${issue.priority}`} aria-hidden="true"></span>
                      {issue.severity}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{issue.status}</dd>
                </div>
                <div>
                  <dt>Assignee</dt>
                  <dd>
                    <span className="detail_person">
                      <img src={defaultProfile} alt="" />
                      {issue.assignee}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Reporter</dt>
                  <dd>
                    <span className="detail_person">
                      <img src={defaultProfile} alt="" />
                      {issue.reporter}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Browser</dt>
                  <dd>{issue.device || "Not set"}</dd>
                </div>
                <div>
                  <dt>URL</dt>
                  <dd>{issue.page || "Not set"}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{issue.createdAt ?? issue.openedAt.replace("opened ", "")}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{issue.updatedAt ?? "Not updated"}</dd>
                </div>
              </dl>
            </section>

            <section className="detail_panel">
              <h2>Labels</h2>
              {(issue.labels ?? []).length > 0 ? (
                <div className="detail_tag_list">
                  {(issue.labels ?? []).map((label) => (
                    <span className="detail_tag" key={label}>
                      {label}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="detail_muted">No labels.</p>
              )}
            </section>
          </aside>
        </div>
      </div>

      {isEditing && (
        <ReportIssueModal
          onClose={() => setIsEditing(false)}
          onCreateIssue={(issueData) => onUpdateIssue(issue.id, issueData)}
          projects={projects}
          initialData={issue}
          title="Edit issue"
          description="Update the issue details."
          footerNote="Project issue counts update after saving."
          primaryAction="Save changes"
        />
      )}
    </>
  );
}

export default IssueDetail;
