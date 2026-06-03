import ReportCard from "../components/ReportCard";
import "../styles/reports.css";

const reportTabs = ["Drafts", "Published", "Archived"];

const reports = [
  {
    title: "October QA Recap",
    project: "Acme Marketing Site",
    openCount: 12,
    fixedCount: 47,
    sharedWith: 3,
    updatedAt: "2d ago",
    openWidth: "36%",
    fixedWidth: "44%",
  },
  {
    title: "Pre-launch Audit",
    project: "Lumen Landing",
    openCount: 12,
    fixedCount: 47,
    sharedWith: 3,
    updatedAt: "2d ago",
    openWidth: "35%",
    fixedWidth: "46%",
  },
  {
    title: "Q3 Stability Report",
    project: "Northwind Shop",
    openCount: 12,
    fixedCount: 47,
    sharedWith: 3,
    updatedAt: "2d ago",
    openWidth: "37%",
    fixedWidth: "44%",
  },
  {
    title: "Accessibility Pass",
    project: "Helios Docs",
    openCount: 12,
    fixedCount: 47,
    sharedWith: 3,
    updatedAt: "2d ago",
    openWidth: "36%",
    fixedWidth: "44%",
  },
  {
    title: "Critical Fix Summary",
    project: "Beacon Portal",
    openCount: 12,
    fixedCount: 47,
    sharedWith: 3,
    updatedAt: "2d ago",
    openWidth: "35%",
    fixedWidth: "46%",
  },
  {
    title: "Content Review",
    project: "Pivot Blog",
    openCount: 12,
    fixedCount: 47,
    sharedWith: 3,
    updatedAt: "2d ago",
    openWidth: "36%",
    fixedWidth: "45%",
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

function Reports() {
  return (
    <div className="main_content reports_page">
      <div className="main_header reports_header">
        <div className="header_one">
          <h1 className="dashboard_heading">Client Reports</h1>
          <p className="dashboard_sub_heading">Shareable QA reports for your clients</p>
        </div>
        <div className="header_two">
          <button className="new_project_btn reports_new_button">
            <PlusIcon />
            Generate Report
          </button>
        </div>
      </div>

      <div className="reports_tabs" role="tablist" aria-label="Report tabs">
        {reportTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === "Published" ? "reports_tab active" : "reports_tab"}
            aria-pressed={tab === "Published"}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="reports_grid">
        {reports.map((report) => (
          <ReportCard key={report.title} {...report} />
        ))}
      </div>
    </div>
  );
}

export default Reports;
