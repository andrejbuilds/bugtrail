import ProjectStatusPill from "./ProjectStatusPill";

function ProjectsTableRow({
  name,
  website,
  openIssues,
  fixedIssues,
  status,
  updatedAt,
  badge,
  badgeClassName,
  statusTone,
  rowClassName = "",
}) {
  const tableRowClassName = rowClassName
    ? `project_table_row ${rowClassName}`
    : "project_table_row";
  const projectBadgeClassName = badgeClassName
    ? `project_badge ${badgeClassName}`
    : "project_badge";

  return (
    <div className={tableRowClassName}>
      <div className="project_name_cell">
        <span className={projectBadgeClassName}>{badge}</span>
        <span className="project_name_text">{name}</span>
      </div>
      <span className="project_website_text">{website}</span>
      <span className="project_number_text">{openIssues}</span>
      <span className="project_number_text">{fixedIssues}</span>
      <ProjectStatusPill status={status} tone={statusTone} />
      <span className="project_updated_text">{updatedAt}</span>
    </div>
  );
}

export default ProjectsTableRow;
