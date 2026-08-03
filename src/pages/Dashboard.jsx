import { useState } from "react";

import projects_icon from "../assets/projects_icon.png";
import projects_card_icon from "../assets/projects_card_icon.png";
import issues_card_icon from "../assets/issues_card_icon.png";
import resolved_card_icon from "../assets/resolved_card_icon.png";
import client_card_icon from "../assets/client_card_icon.png";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import AddIcon from "../components/shared/AddIcon";
import { useBugTrail } from "../context/BugTrailContext";
import "../styles/dashboard.css";

function Dashboard() {
  const { projects, issues, reports, createProject } = useBugTrail();
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const openCreateProjectModal = () => setIsCreateProjectModalOpen(true);
  const closeCreateProjectModal = () => setIsCreateProjectModalOpen(false);
  const openIssueCount = issues.filter((issue) => issue.status !== "Fixed").length;
  const fixedIssueCount = issues.filter((issue) => issue.status === "Fixed").length;
  const recentProjects = projects.slice(0, 3);
  const summaryCards = [
    {
      icon: projects_card_icon,
      value: String(projects.length),
      title: "Projects",
      description: "Active QA projects",
      pillText: projects.length === 0 ? "No Projects" : `${projects.length} active`,
      pillStyle: {
        background: "#2a2b2e",
        color: "#d9d9d9",
      },
    },
    {
      icon: issues_card_icon,
      value: String(openIssueCount),
      title: "Open Issues",
      description: "Waiting to be fixed",
      pillText: openIssueCount === 0 ? "All clear" : `${openIssueCount} open`,
      pillStyle: {
        background: "rgba(245, 190, 78, 0.12)",
        border: "1px solid rgba(245, 190, 78, 0.35)",
        color: "#ffd36c",
      },
      iconClassName: "summary_card_icon_large",
    },
    {
      icon: resolved_card_icon,
      value: String(fixedIssueCount),
      title: "Fixed Issues",
      description: "Marked as resolved",
      pillText: `${fixedIssueCount} resolved`,
      pillStyle: {
        background: "rgba(83, 209, 127, 0.12)",
        border: "1px solid rgba(83, 209, 127, 0.35)",
        color: "#8ef0a5",
      },
    },
    {
      icon: client_card_icon,
      value: String(reports.length),
      title: "Client Reports",
      description: "Reports ready to share",
      pillText: reports.length === 0 ? "None ready" : `${reports.length} ready`,
      pillStyle: {
        background: "rgba(76, 157, 255, 0.12)",
        border: "1px solid rgba(76, 157, 255, 0.35)",
        color: "#79bbff",
      },
    },
  ];

  return (
    <>
      <div className="main_content">
        <div className="main_header">
          <div className="header_one">
            <h1 className="dashboard_heading">QA Dashboard</h1>
            <p className="dashboard_sub_heading">Overview of your projects, issues, and reports.</p>
          </div>
          <div className="header_two">
            <button className="new_project_btn" onClick={openCreateProjectModal}>
              <AddIcon />
              New Project
            </button>
          </div>
        </div>
        <div className="cards">
          {summaryCards.map((card) => (
            <DashboardSummaryCard key={card.title} {...card} />
          ))}
        </div>
        <div className="recent_projects_area">
          <h3 className="recent_projects_h3">Recent Projects</h3>
          {recentProjects.length > 0 ? (
            <div className="recent_projects_list">
              {recentProjects.map((project) => (
                <article className="recent_project_row" key={project.id}>
                  <span className={`project_badge ${project.badgeClassName}`}>{project.badge}</span>
                  <div>
                    <h2>{project.name}</h2>
                    <p>
                      {project.openIssues} open, {project.fixedIssues} fixed
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <>
              <img className="recent_project_card_icon" src={projects_icon} alt="" />
              <h2 className="recent_projects_qa">No QA projects yet</h2>
              <p className="recent_projects_p">Create your first project to start tracking website issues</p>
              <button className="recent_projects_btn" onClick={openCreateProjectModal}>
                <AddIcon />
                Create Project
              </button>
            </>
          )}
        </div>
      </div>
      {isCreateProjectModalOpen && (
        <CreateProjectModal
          onClose={closeCreateProjectModal}
          onCreateProject={createProject}
        />
      )}
    </>
  );
}

export default Dashboard;
