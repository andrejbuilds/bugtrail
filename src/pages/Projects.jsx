import ProjectsTableRow from "../components/ProjectsTableRow";
import "../styles/projects.css";

const projectFilters = ["All", "Active", "Archived"];

const projectRows = [
  {
    name: "Acme Marketing Site",
    website: "acme.com",
    openIssues: 12,
    fixedIssues: 47,
    status: "Active",
    updatedAt: "2h ago",
    badge: "A",
    badgeClassName: "project_badge_blue",
    statusTone: "warning",
  },
  {
    name: "Lumen Landing",
    website: "lumen.io",
    openIssues: 3,
    fixedIssues: 21,
    status: "Active",
    updatedAt: "5h ago",
    badge: "L",
    badgeClassName: "project_badge_purple",
    statusTone: "warning",
    rowClassName: "project_table_row_highlighted",
  },
  {
    name: "Northwind Shop",
    website: "northwind.store",
    openIssues: 0,
    fixedIssues: 88,
    status: "Healthy",
    updatedAt: "1d ago",
    badge: "N",
    badgeClassName: "project_badge_green",
    statusTone: "success",
  },
  {
    name: "Helios Docs",
    website: "docs.helios.dev",
    openIssues: 7,
    fixedIssues: 14,
    status: "Active",
    updatedAt: "2d ago",
    badge: "H",
    badgeClassName: "project_badge_orange",
    statusTone: "warning",
  },
  {
    name: "Pivot Blog",
    website: "blog.pivot.co",
    openIssues: 1,
    fixedIssues: 33,
    status: "Healthy",
    updatedAt: "4d ago",
    badge: "P",
    badgeClassName: "project_badge_teal",
    statusTone: "success",
  },
  {
    name: "Beacon Portal",
    website: "beacon.app",
    openIssues: 24,
    fixedIssues: 5,
    status: "Critical",
    updatedAt: "6d ago",
    badge: "B",
    badgeClassName: "project_badge_red",
    statusTone: "danger",
  },
];

function SearchIcon() {
  return (
    <svg
      className="project_search_icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

function Projects() {
  return (
    <div className="main_content projects_page">
      <div className="main_header projects_header">
        <div className="header_one">
          <h1 className="dashboard_heading">Projects</h1>
          <p className="dashboard_sub_heading">All QA projects you're tracking</p>
        </div>
        <div className="header_two">
          <button className="new_project_btn projects_new_button">
            <PlusIcon />
            New Project
          </button>
        </div>
      </div>

      <div className="projects_toolbar">
        <label className="projects_search" aria-label="Search projects">
          <SearchIcon />
          <input type="text" placeholder="Search projects..." />
        </label>

        <div className="projects_filters" role="tablist" aria-label="Project filters">
          {projectFilters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={index === 0 ? "project_filter active" : "project_filter"}
              aria-pressed={index === 0}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

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
            {projectRows.map((project) => (
              <ProjectsTableRow key={project.name} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
