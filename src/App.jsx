import { useState } from "react";
import { BrowserRouter, Navigate, NavLink, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import IssueDetail from "./pages/IssueDetail";
import ProjectDetail from "./pages/ProjectDetail";
import ReportDetail from "./pages/ReportDetail";

import logo from "./assets/bugtrail_logo.png";
import dashboard_icon from "./assets/dashboard_icon.png";
import projects_icon from "./assets/projects_icon.png";
import issues_icon from "./assets/issues_icon.png";
import reports_icon from "./assets/reports_icon.png";
import settings_icon from "./assets/settings_icon.png";
import default_profile from "./assets/default_profile.png";

import "./styles/app-shell.css";
import "./styles/modals.css";

const initialProjects = [];
const initialIssues = [];
const initialReports = [];

function getIssueStatusTone(status) {
  const toneByStatus = {
    Open: "open",
    "In Review": "review",
    Fixed: "fixed",
  };

  return toneByStatus[status] ?? "open";
}

function getProjectStatusTone(status) {
  return status === "Archived" ? "success" : "warning";
}

function buildReportSnapshot(reportData, projects, issues) {
  const selectedProject = projects.find((project) => project.id === reportData.projectId);
  const projectIssues = issues.filter((issue) => issue.projectId === reportData.projectId);
  const openCount = projectIssues.filter((issue) => issue.status !== "Fixed").length;
  const fixedCount = projectIssues.filter((issue) => issue.status === "Fixed").length;
  const totalCount = openCount + fixedCount;
  const openPercent = totalCount > 0 ? Math.round((openCount / totalCount) * 100) : 0;
  const fixedPercent = totalCount > 0 ? 100 - openPercent : 0;

  return {
    ...reportData,
    project: selectedProject?.name ?? "Unknown project",
    openCount,
    fixedCount,
    sharedWith: reportData.recipients.length,
    openWidth: `${openPercent}%`,
    fixedWidth: `${fixedPercent}%`,
  };
}

function applyProjectIssueCounts(projects, issues) {
  return projects.map((project) => {
    const projectIssues = issues.filter((issue) => issue.projectId === project.id);
    const openIssues = projectIssues.filter((issue) => issue.status !== "Fixed").length;
    const fixedIssues = projectIssues.filter((issue) => issue.status === "Fixed").length;

    return {
      ...project,
      openIssues,
      fixedIssues,
    };
  });
}

function refreshReportsForProjects(reports, projects, issues, projectIds) {
  return reports.map((report) =>
    projectIds.includes(report.projectId)
      ? {
          ...report,
          ...buildReportSnapshot(report, projects, issues),
          updatedAt: "Just now",
        }
      : report,
  );
}

function SidebarLink({ to, baseClass, icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) => (isActive ? `${baseClass} active` : baseClass)}
      onClick={onNavigate}
    >
      <img src={icon} alt="" />
      <h3>{label}</h3>
    </NavLink>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [issues, setIssues] = useState(initialIssues);
  const [reports, setReports] = useState(initialReports);
  const closeSidebar = () => setIsSidebarOpen(false);

  function handleCreateProject(projectData) {
    const newProject = {
      id: crypto.randomUUID(),
      ...projectData,
      openIssues: 0,
      fixedIssues: 0,
      status: projectData.status,
      updatedAt: "Just now",
      badge: projectData.name.charAt(0).toUpperCase(),
      badgeClassName: "project_badge_blue",
      statusTone: getProjectStatusTone(projectData.status),
    };

    setProjects((currentProjects) => [newProject, ...currentProjects]);
  }

  function handleUpdateProject(projectId, projectData) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...projectData,
              badge: projectData.name.charAt(0).toUpperCase(),
              statusTone: getProjectStatusTone(projectData.status),
              updatedAt: "Just now",
            }
          : project,
      ),
    );

    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.projectId === projectId ? { ...issue, project: projectData.name } : issue,
      ),
    );

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.projectId === projectId ? { ...report, project: projectData.name, updatedAt: "Just now" } : report,
      ),
    );
  }

  function handleDeleteProject(projectId) {
    setProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId));
    setIssues((currentIssues) => currentIssues.filter((issue) => issue.projectId !== projectId));
    setReports((currentReports) => currentReports.filter((report) => report.projectId !== projectId));
  }

  function handleCreateIssue(issueData) {
    const selectedProject = projects.find((project) => project.id === issueData.projectId);
    const newIssue = {
      id: crypto.randomUUID(),
      issueId: `BUG-${String(issues.length + 1).padStart(3, "0")}`,
      ...issueData,
      project: selectedProject?.name ?? "Unknown project",
      openedAt: "opened just now",
      createdAt: "Just now",
      updatedAt: "Just now",
      reporter: "Andrej",
      priority: issueData.severity.toLowerCase(),
      status: "Open",
      statusTone: "open",
      comments: [],
    };

    const nextIssues = [newIssue, ...issues];

    setIssues(nextIssues);
    setProjects((currentProjects) =>
      applyProjectIssueCounts(currentProjects, nextIssues).map((project) =>
        project.id === issueData.projectId ? { ...project, updatedAt: "Just now" } : project,
      ),
    );
    setReports((currentReports) =>
      refreshReportsForProjects(currentReports, projects, nextIssues, [issueData.projectId]),
    );
  }

  function handleUpdateIssue(issueId, issueData) {
    const selectedProject = projects.find((project) => project.id === issueData.projectId);
    const existingIssue = issues.find((issue) => issue.id === issueId);

    const nextIssues = issues.map((issue) =>
      issue.id === issueId
        ? {
            ...issue,
            ...issueData,
            project: selectedProject?.name ?? issue.project,
            priority: issueData.severity.toLowerCase(),
            statusTone: getIssueStatusTone(issueData.status),
            updatedAt: "Just now",
          }
        : issue,
    );

    setIssues(nextIssues);
    setProjects((currentProjects) =>
      applyProjectIssueCounts(currentProjects, nextIssues).map((project) =>
        project.id === issueData.projectId ? { ...project, updatedAt: "Just now" } : project,
      ),
    );
    setReports((currentReports) =>
      refreshReportsForProjects(
        currentReports,
        projects,
        nextIssues,
        Array.from(new Set([existingIssue?.projectId, issueData.projectId].filter(Boolean))),
      ),
    );
  }

  function handleDeleteIssue(issueId) {
    const issueToDelete = issues.find((issue) => issue.id === issueId);
    const nextIssues = issues.filter((issue) => issue.id !== issueId);

    setIssues(nextIssues);

    if (issueToDelete) {
      setProjects((currentProjects) =>
        applyProjectIssueCounts(currentProjects, nextIssues).map((project) =>
          project.id === issueToDelete.projectId
            ? { ...project, updatedAt: "Just now" }
            : project,
        ),
      );
      setReports((currentReports) =>
        refreshReportsForProjects(currentReports, projects, nextIssues, [issueToDelete.projectId]),
      );
    }
  }

  function handleAddIssueComment(issueId, commentText) {
    const newComment = {
      id: crypto.randomUUID(),
      author: "Andrej",
      body: commentText.trim(),
      createdAt: "Just now",
    };

    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              comments: [...(issue.comments ?? []), newComment],
              updatedAt: "Just now",
            }
          : issue,
      ),
    );
  }

  function handleCreateReport(reportData) {
    const newReport = {
      id: crypto.randomUUID(),
      ...buildReportSnapshot(reportData, projects, issues),
      status: reportData.status,
      updatedAt: "Just now",
    };

    setReports((currentReports) => [newReport, ...currentReports]);
  }

  function handleUpdateReport(reportId, reportData) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              ...buildReportSnapshot(reportData, projects, issues),
              updatedAt: "Just now",
            }
          : report,
      ),
    );
  }

  function handleDeleteReport(reportId) {
    setReports((currentReports) => currentReports.filter((report) => report.id !== reportId));
  }

  return (
    <BrowserRouter>
      <div className="main_container">
        <button
          className={isSidebarOpen ? "mobile_sidebar_toggle hidden" : "mobile_sidebar_toggle"}
          type="button"
          aria-label="Open sidebar"
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={isSidebarOpen ? "sidebar_overlay open" : "sidebar_overlay"}
          onClick={closeSidebar}
        ></div>

        <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
          <div className="sidebar_content">
            <button
              className="mobile_sidebar_close"
              type="button"
              aria-label="Close sidebar"
              onClick={closeSidebar}
            >
              X
            </button>

            <div className="name_area">
              <img src={logo} alt="BugTrail logo" />
              <h1>BugTrail</h1>
            </div>

            <SidebarLink
              to="/"
              baseClass="dashboard_area"
              icon={dashboard_icon}
              label="Dashboard"
              onNavigate={closeSidebar}
            />
            <SidebarLink
              to="/projects"
              baseClass="projects_area"
              icon={projects_icon}
              label="Projects"
              onNavigate={closeSidebar}
            />
            <SidebarLink
              to="/issues"
              baseClass="issues_area"
              icon={issues_icon}
              label="Issues"
              onNavigate={closeSidebar}
            />
            <SidebarLink
              to="/reports"
              baseClass="reports_area"
              icon={reports_icon}
              label="Reports"
              onNavigate={closeSidebar}
            />
            <SidebarLink
              to="/settings"
              baseClass="settings_area"
              icon={settings_icon}
              label="Settings"
              onNavigate={closeSidebar}
            />

            <div className="my_profile_area">
              <img src={default_profile} alt="Andrej profile" />
              <h3>Andrej</h3>
            </div>
          </div>
        </div>

        <div className="main_area">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  projects={projects}
                  issues={issues}
                  reports={reports}
                  onCreateProject={handleCreateProject}
                />
              }
            />
            <Route
              path="/projects"
              element={<Projects projects={projects} onCreateProject={handleCreateProject} />}
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProjectDetail
                  projects={projects}
                  issues={issues}
                  reports={reports}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                />
              }
            />
            <Route
              path="/issues"
              element={
                <Issues
                  projects={projects}
                  issues={issues}
                  onCreateIssue={handleCreateIssue}
                />
              }
            />
            <Route
              path="/issues/:issueId"
              element={
                <IssueDetail
                  projects={projects}
                  issues={issues}
                  onUpdateIssue={handleUpdateIssue}
                  onDeleteIssue={handleDeleteIssue}
                  onAddIssueComment={handleAddIssueComment}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <Reports
                  projects={projects}
                  reports={reports}
                  onCreateReport={handleCreateReport}
                />
              }
            />
            <Route
              path="/reports/:reportId"
              element={
                <ReportDetail
                  projects={projects}
                  reports={reports}
                  issues={issues}
                  onUpdateReport={handleUpdateReport}
                  onDeleteReport={handleDeleteReport}
                />
              }
            />
            <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
            <Route path="/settings/:section" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
