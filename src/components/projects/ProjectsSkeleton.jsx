function ProjectsSkeleton() {
  return (
    <div className="projects_table_shell" aria-label="Loading projects">
      <div className="projects_table">
        <div className="project_table_header">
          <span>Project name</span>
          <span>Website</span>
          <span>Open</span>
          <span>Fixed</span>
          <span>Status</span>
          <span>Last updated</span>
        </div>
        <div className="project_table_body">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="project_table_row project_skeleton_row" key={index}>
              <span className="skeleton_line wide"></span>
              <span className="skeleton_line"></span>
              <span className="skeleton_line short"></span>
              <span className="skeleton_line short"></span>
              <span className="skeleton_line pill"></span>
              <span className="skeleton_line"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsSkeleton;
