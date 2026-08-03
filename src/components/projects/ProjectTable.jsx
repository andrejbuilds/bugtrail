import { Link } from "react-router-dom";

import EmptyState from "../shared/EmptyState";
import ProjectsTableRow from "./ProjectsTableRow";

function ProjectTable({ projects, filteredProjects, onCreateProject }) {
  return (
    <div className="projects_table_shell">
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
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link className="project_table_link" key={project.id} to={`/projects/${project.id}`}>
                <ProjectsTableRow {...project} />
              </Link>
            ))
          ) : (
            <EmptyState
              className="projects_empty_state"
              title={projects.length === 0 ? "No projects yet" : "No projects found"}
              description={
                projects.length === 0
                  ? "Create your first QA project to start tracking issues."
                  : "Try changing the search or project filter."
              }
              actionLabel={projects.length === 0 ? "Create project" : undefined}
              onAction={projects.length === 0 ? onCreateProject : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectTable;
