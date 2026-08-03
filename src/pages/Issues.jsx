import { useState } from "react";

import IssueFilters from "../components/issues/IssueFilters";
import IssueList from "../components/issues/IssueList";
import IssueTabs from "../components/issues/IssueTabs";
import ReportIssueModal from "../components/issues/ReportIssueModal";
import AddIcon from "../components/shared/AddIcon";
import "../styles/issues.css";

function Issues({ projects, issues, onCreateIssue }) {
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("Open");
  const [projectFilter, setProjectFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const openReportIssueModal = () => setIsReportIssueModalOpen(true);
  const closeReportIssueModal = () => setIsReportIssueModalOpen(false);
  const assignees = Array.from(new Set(issues.map((issue) => issue.assignee))).filter(Boolean);
  const filteredIssues = issues.filter((issue) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      issue.title.toLowerCase().includes(query) ||
      issue.issueId.toLowerCase().includes(query) ||
      issue.project.toLowerCase().includes(query);
    const matchesStatus = activeStatus === "All" || issue.status === activeStatus;
    const matchesProject = projectFilter === "All" || issue.projectId === projectFilter;
    const matchesSeverity = severityFilter === "All" || issue.severity === severityFilter;
    const matchesAssignee = assigneeFilter === "All" || issue.assignee === assigneeFilter;

    return matchesSearch && matchesStatus && matchesProject && matchesSeverity && matchesAssignee;
  });
  const issueTabs = [
    { label: "All", count: issues.length },
    { label: "Open", count: issues.filter((issue) => issue.status === "Open").length },
    { label: "In Review", count: issues.filter((issue) => issue.status === "In Review").length },
    { label: "Fixed", count: issues.filter((issue) => issue.status === "Fixed").length },
  ];

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
              <AddIcon />
              Report Issue
            </button>
          </div>
        </div>

        <IssueTabs tabs={issueTabs} activeStatus={activeStatus} onStatusChange={setActiveStatus} />

        <IssueFilters
          projects={projects}
          assignees={assignees}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
        />

        <IssueList issues={issues} filteredIssues={filteredIssues} />
      </div>
      {isReportIssueModalOpen && (
        <ReportIssueModal
          onClose={closeReportIssueModal}
          onCreateIssue={onCreateIssue}
          projects={projects}
        />
      )}
    </>
  );
}

export default Issues;
