import { useState } from "react";

import projects_icon from "../assets/projects_icon.png";
import projects_card_icon from "../assets/projects_card_icon.png";
import issues_card_icon from "../assets/issues_card_icon.png";
import resolved_card_icon from "../assets/resolved_card_icon.png";
import client_card_icon from "../assets/client_card_icon.png";
import CreateProjectModal from "../components/CreateProjectModal";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import "../styles/dashboard.css";

const summaryCards = [
  {
    icon: projects_card_icon,
    value: "0",
    title: "Projects",
    description: "Active QA projects",
    pillText: "No Projects",
    pillStyle: {
      background: "#2a2b2e",
      color: "#d9d9d9",
    },
  },
  {
    icon: issues_card_icon,
    value: "0",
    title: "Open Issues",
    description: "Waiting to be fixed",
    pillText: "All clear",
    pillStyle: {
      background: "rgba(245, 190, 78, 0.12)",
      border: "1px solid rgba(245, 190, 78, 0.35)",
      color: "#ffd36c",
    },
    iconClassName: "summary_card_icon_large",
  },
  {
    icon: resolved_card_icon,
    value: "0",
    title: "Fixed Issues",
    description: "Marked as resolved",
    pillText: "0 resolved",
    pillStyle: {
      background: "rgba(83, 209, 127, 0.12)",
      border: "1px solid rgba(83, 209, 127, 0.35)",
      color: "#8ef0a5",
    },
  },
  {
    icon: client_card_icon,
    value: "0",
    title: "Client Reports",
    description: "Reports ready to share",
    pillText: "None ready",
    pillStyle: {
      background: "rgba(76, 157, 255, 0.12)",
      border: "1px solid rgba(76, 157, 255, 0.35)",
      color: "#79bbff",
    },
  },
];

function PlusIcon() {
  return (
    <svg
      className="project_button_icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Dashboard() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const openCreateProjectModal = () => setIsCreateProjectModalOpen(true);
  const closeCreateProjectModal = () => setIsCreateProjectModalOpen(false);

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
              <PlusIcon />
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
          <img className="recent_project_card_icon" src={projects_icon} alt="" />
          <h2 className="recent_projects_qa">No QA projects yet</h2>
          <p className="recent_projects_p">Create your first project to start tracking website issues</p>
          <button className="recent_projects_btn" onClick={openCreateProjectModal}>
            <PlusIcon />
            Create Project
          </button>
        </div>
      </div>
      {isCreateProjectModalOpen && <CreateProjectModal onClose={closeCreateProjectModal} />}
    </>
  );
}

export default Dashboard;
