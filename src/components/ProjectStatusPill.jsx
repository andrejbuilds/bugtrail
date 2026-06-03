const toneClassNames = {
  warning: "project_status_pill_warning",
  success: "project_status_pill_success",
  danger: "project_status_pill_danger",
};

function ProjectStatusPill({ status, tone }) {
  const toneClassName = toneClassNames[tone] ?? toneClassNames.warning;

  return (
    <span className={`project_status_pill ${toneClassName}`}>
      <span className="project_status_dot" aria-hidden="true"></span>
      {status}
    </span>
  );
}

export default ProjectStatusPill;
