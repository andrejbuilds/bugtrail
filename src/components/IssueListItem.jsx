import IssueStatusPill from "./IssueStatusPill";

function IssueListItem({
  issueId,
  title,
  project,
  openedAt,
  reporter,
  priority,
  status,
  statusTone,
}) {
  return (
    <article className="issue_list_item">
      <div className={`issue_priority_dot issue_priority_${priority}`} aria-hidden="true"></div>
      <div className="issue_id">{issueId}</div>
      <div className="issue_main">
        <h3 className="issue_title">{title}</h3>
        <div className="issue_project_tag">{project}</div>
        <div className="issue_meta">
          <div className="issue_reporter_avatar" aria-hidden="true">
            {reporter.charAt(0)}
          </div>
          <p className="issue_meta_text">
            {openedAt} by {reporter}
          </p>
        </div>
      </div>
      <div className="issue_status_cell">
        <IssueStatusPill status={status} tone={statusTone} />
      </div>
    </article>
  );
}

export default IssueListItem;
