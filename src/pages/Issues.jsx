import { useState } from "react";

import IssueListItem from "../components/IssueListItem";
import ReportIssueModal from "../components/ReportIssueModal";
import "../styles/issues.css";

const issueTabs = [
  { label: "All", count: 47 },
  { label: "Open", count: 12, active: true },
  { label: "In Review", count: 6 },
  { label: "Fixed", count: 29 },
];

const issueFilters = [
  { label: "Project", value: "All" },
  { label: "Severity", value: "All" },
  { label: "Assignee", value: "All" },
];

const issues = [
  {
    issueId: "BUG-128",
    title: "Checkout button unresponsive on Safari iOS",
    project: "Northwind Shop",
    openedAt: "opened 3h ago",
    reporter: "Sara K.",
    priority: "critical",
    status: "Open",
    statusTone: "open",
  },
  {
    issueId: "BUG-127",
    title: "Hero image overflows on 1280px viewport",
    project: "Acme Marketing Site",
    openedAt: "opened 3h ago",
    reporter: "Sara K.",
    priority: "medium",
    status: "Open",
    statusTone: "open",
  },
  {
    issueId: "BUG-126",
    title: "Footer links return 404",
    project: "Lumen Landing",
    openedAt: "opened 3h ago",
    reporter: "Sara K.",
    priority: "medium",
    status: "In Review",
    statusTone: "review",
  },
  {
    issueId: "BUG-125",
    title: "Auth modal traps focus",
    project: "Beacon Portal",
    openedAt: "opened 3h ago",
    reporter: "Sara K.",
    priority: "critical",
    status: "Open",
    statusTone: "open",
  },
  {
    issueId: "BUG-124",
    title: "Typo in pricing copy",
    project: "Pivot Blog",
    openedAt: "opened 3h ago",
    reporter: "Sara K.",
    priority: "review",
    status: "In Review",
    statusTone: "review",
  },
  {
    issueId: "BUG-123",
    title: "Form submit double-fires",
    project: "Helios Docs",
    openedAt: "opened 3h ago",
    reporter: "Sara K.",
    priority: "medium",
    status: "Open",
    statusTone: "open",
  },
];

function SearchIcon() {
  return (
    <svg
      className="issues_search_icon"
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

function ChevronIcon() {
  return (
    <svg
      className="issue_filter_chevron"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Issues() {
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const openReportIssueModal = () => setIsReportIssueModalOpen(true);
  const closeReportIssueModal = () => setIsReportIssueModalOpen(false);

  return (
    <>
      <div className="main_content issues_page">
        <div className="main_header issues_header">
          <div className="header_one">
            <h1 className="dashboard_heading">Issues</h1>
            <p className="dashboard_sub_heading">Track and resolve issues across all projects</p>
          </div>
          <div className="header_two">
            <button className="new_project_btn issues_new_button" onClick={openReportIssueModal}>
              <PlusIcon />
              Report Issue
            </button>
          </div>
        </div>

        <div className="issue_tabs" role="tablist" aria-label="Issue status tabs">
          {issueTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={tab.active ? "issue_tab active" : "issue_tab"}
              aria-pressed={Boolean(tab.active)}
            >
              <span>{tab.label}</span>
              <span className="issue_tab_count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="issues_toolbar">
          <label className="issues_search" aria-label="Search issues">
            <SearchIcon />
            <input type="text" placeholder="Search issues..." />
          </label>

          <div className="issues_filters">
            {issueFilters.map((filter) => (
              <button key={filter.label} type="button" className="issue_filter_button">
                <span>
                  {filter.label}: {filter.value}
                </span>
                <ChevronIcon />
              </button>
            ))}
          </div>
        </div>

        <div className="issues_list">
          {issues.map((issue) => (
            <IssueListItem key={issue.issueId} {...issue} />
          ))}
        </div>
      </div>
      {isReportIssueModalOpen && <ReportIssueModal onClose={closeReportIssueModal} />}
    </>
  );
}

export default Issues;
