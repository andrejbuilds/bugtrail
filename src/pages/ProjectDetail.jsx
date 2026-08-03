import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import IssueListItem from "../components/issues/IssueListItem";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import ReportCard from "../components/reports/ReportCard";
import ProjectStatusPill from "../components/shared/ProjectStatusPill";
import { useBugTrail } from "../context/BugTrailContext";
import NotFound from "./NotFound";
import "../styles/detail.css";

function ProjectDetail() {
  const { projects, issues, reports, updateProject, deleteProject } = useBugTrail();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <NotFound
        title="Project not found"
        description="The project you requested does not exist."
        returnTo="/projects"
        returnLabel="Return to projects"
      />
    );
  }

  const projectIssues = issues.filter((issue) => issue.projectId === project.id);
  const projectReports = reports.filter((report) => report.projectId === project.id);

  function handleDelete() {
    deleteProject(project.id);
    navigate("/projects");
  }

  return (
    <>
      <div className="main_content detail_page">
        <div className="detail_breadcrumb">
          <Link to="/projects">Projects</Link>
          <span>/</span>
          <span>{project.name}</span>
        </div>

        <div className="detail_header">
          <div>
            <h1 className="dashboard_heading">{project.name}</h1>
            <p className="dashboard_sub_heading">{project.website}</p>
          </div>
          <div className="detail_actions">
            <button type="button" className="detail_secondary_button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button type="button" className="detail_danger_button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="detail_grid">
          <section className="detail_panel">
            <h2>Project Details</h2>
            <dl className="detail_definition_list">
              <div>
                <dt>Status</dt>
                <dd>
                  <ProjectStatusPill status={project.status} tone={project.statusTone} />
                </dd>
              </div>
              <div>
                <dt>Visibility</dt>
                <dd>{project.visibility}</dd>
              </div>
              <div>
                <dt>Open issues</dt>
                <dd>{project.openIssues}</dd>
              </div>
              <div>
                <dt>Fixed issues</dt>
                <dd>{project.fixedIssues}</dd>
              </div>
            </dl>
            {project.description && <p className="detail_body_text">{project.description}</p>}
          </section>

          <section className="detail_panel">
            <h2>Teammates</h2>
            {(project.teammates ?? []).length > 0 ? (
              <div className="detail_tag_list">
                {(project.teammates ?? []).map((email) => (
                  <span className="detail_tag" key={email}>
                    {email}
                  </span>
                ))}
              </div>
            ) : (
              <p className="detail_muted">No teammates invited.</p>
            )}
          </section>
        </div>

        <section className="detail_section">
          <h2>Issues</h2>
          <div className="issues_list">
            {projectIssues.length > 0 ? (
              projectIssues.map((issue) => (
                <Link className="issue_list_link" key={issue.id} to={`/issues/${issue.id}`}>
                  <IssueListItem {...issue} />
                </Link>
              ))
            ) : (
              <p className="detail_empty_line">No issues attached to this project.</p>
            )}
          </div>
        </section>

        <section className="detail_section">
          <h2>Reports</h2>
          <div className="reports_grid detail_reports_grid">
            {projectReports.length > 0 ? (
              projectReports.map((report) => (
                <Link className="report_card_link" key={report.id} to={`/reports/${report.id}`}>
                  <ReportCard {...report} />
                </Link>
              ))
            ) : (
              <p className="detail_empty_line">No reports attached to this project.</p>
            )}
          </div>
        </section>
      </div>

      {isEditing && (
        <CreateProjectModal
          onClose={() => setIsEditing(false)}
          onCreateProject={(projectData) => updateProject(project.id, projectData)}
          initialData={project}
          title="Edit project"
          description="Update the project details."
          footerNote="Changes apply to linked issues and reports."
          primaryAction="Save changes"
        />
      )}
    </>
  );
}

export default ProjectDetail;
