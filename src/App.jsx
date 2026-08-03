import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Navigate, NavLink, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import IssueDetail from "./pages/IssueDetail";
import ProjectDetail from "./pages/ProjectDetail";
import ReportDetail from "./pages/ReportDetail";
import NotFound from "./pages/NotFound";
import { sampleData } from "./data/sampleData";
import useLocalStorage from "./hooks/useLocalStorage";
import {
  createResource,
  deleteResource,
  getResource,
  updateResource,
} from "./services/apiClient";

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
const isApiDataSource = import.meta.env.VITE_DATA_SOURCE === "api";

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

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
  const [localProjects, setLocalProjects] = useLocalStorage("bugtrail-projects", initialProjects);
  const [localIssues, setLocalIssues] = useLocalStorage("bugtrail-issues", initialIssues);
  const [localReports, setLocalReports] = useLocalStorage("bugtrail-reports", initialReports);
  const [apiProjects, setApiProjects] = useState(initialProjects);
  const [apiIssues, setApiIssues] = useState(initialIssues);
  const [apiReports, setApiReports] = useState(initialReports);
  const [dataStatus, setDataStatus] = useState(isApiDataSource ? "loading" : "success");
  const [dataError, setDataError] = useState(null);
  const projects = isApiDataSource ? apiProjects : localProjects;
  const issues = isApiDataSource ? apiIssues : localIssues;
  const reports = isApiDataSource ? apiReports : localReports;
  const setProjects = isApiDataSource ? setApiProjects : setLocalProjects;
  const setIssues = isApiDataSource ? setApiIssues : setLocalIssues;
  const setReports = isApiDataSource ? setApiReports : setLocalReports;
  const closeSidebar = () => setIsSidebarOpen(false);

  const loadData = useCallback(
    async (signal) => {
      try {
        setDataStatus("loading");
        setDataError(null);

        const [loadedProjects, loadedIssues, loadedReports] = await Promise.all([
          getResource("projects", signal),
          getResource("issues", signal),
          getResource("reports", signal),
        ]);

        setApiProjects(loadedProjects);
        setApiIssues(loadedIssues);
        setApiReports(loadedReports);
        setDataStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          setDataError(error.message);
          setDataStatus("error");
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!isApiDataSource) {
      return undefined;
    }

    const controller = new AbortController();
    const loadTimeout = window.setTimeout(() => {
      loadData(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(loadTimeout);
      controller.abort();
    };
  }, [loadData]);

  function handleRetryData() {
    if (isApiDataSource) {
      loadData();
    } else {
      setDataError(null);
      setDataStatus("success");
    }
  }

  async function createDataResource(resource, item) {
    return isApiDataSource ? createResource(resource, item) : item;
  }

  async function updateDataResource(resource, id, item) {
    if (isApiDataSource) {
      await updateResource(resource, id, item);
    }
  }

  async function deleteDataResource(resource, id) {
    if (isApiDataSource) {
      await deleteResource(resource, id);
    }
  }

  async function patchChangedProjects(nextProjects, projectIds) {
    const ids = Array.from(new Set(projectIds.filter(Boolean)));

    if (!isApiDataSource || ids.length === 0) {
      return;
    }

    await Promise.all(
      nextProjects
        .filter((project) => ids.includes(project.id))
        .map((project) => updateResource("projects", project.id, project)),
    );
  }

  async function patchChangedReports(nextReports, projectIds) {
    const ids = Array.from(new Set(projectIds.filter(Boolean)));

    if (!isApiDataSource || ids.length === 0) {
      return;
    }

    await Promise.all(
      nextReports
        .filter((report) => ids.includes(report.projectId))
        .map((report) => updateResource("reports", report.id, report)),
    );
  }

  async function handleCreateProject(projectData) {
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

    try {
      const createdProject = await createDataResource("projects", newProject);

      setProjects((currentProjects) => [createdProject, ...currentProjects]);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
      throw error;
    }
  }

  async function handleUpdateProject(projectId, projectData) {
    const nextProjects = projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            ...projectData,
            badge: projectData.name.charAt(0).toUpperCase(),
            statusTone: getProjectStatusTone(projectData.status),
            updatedAt: "Just now",
          }
        : project,
    );
    const nextIssues = issues.map((issue) =>
      issue.projectId === projectId ? { ...issue, project: projectData.name } : issue,
    );
    const nextReports = reports.map((report) =>
      report.projectId === projectId ? { ...report, project: projectData.name, updatedAt: "Just now" } : report,
    );

    try {
      const updatedProject = nextProjects.find((project) => project.id === projectId);

      await updateDataResource("projects", projectId, updatedProject);

      if (isApiDataSource) {
        await Promise.all([
          ...nextIssues
            .filter((issue) => issue.projectId === projectId)
            .map((issue) => updateResource("issues", issue.id, issue)),
          ...nextReports
            .filter((report) => report.projectId === projectId)
            .map((report) => updateResource("reports", report.id, report)),
        ]);
      }

      setProjects(nextProjects);
      setIssues(nextIssues);
      setReports(nextReports);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
      throw error;
    }
  }

  async function handleDeleteProject(projectId) {
    const nextProjects = projects.filter((project) => project.id !== projectId);
    const nextIssues = issues.filter((issue) => issue.projectId !== projectId);
    const nextReports = reports.filter((report) => report.projectId !== projectId);

    try {
      await deleteDataResource("projects", projectId);

      if (isApiDataSource) {
        await Promise.all([
          ...issues
            .filter((issue) => issue.projectId === projectId)
            .map((issue) => deleteResource("issues", issue.id)),
          ...reports
            .filter((report) => report.projectId === projectId)
            .map((report) => deleteResource("reports", report.id)),
        ]);
      }

      setProjects(nextProjects);
      setIssues(nextIssues);
      setReports(nextReports);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
      throw error;
    }
  }

  async function handleCreateIssue(issueData) {
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

    try {
      const createdIssue = await createDataResource("issues", newIssue);
      const nextIssues = [createdIssue, ...issues];
      const nextProjects = applyProjectIssueCounts(projects, nextIssues).map((project) =>
        project.id === issueData.projectId ? { ...project, updatedAt: "Just now" } : project,
      );
      const nextReports = refreshReportsForProjects(reports, nextProjects, nextIssues, [issueData.projectId]);

      await patchChangedProjects(nextProjects, [issueData.projectId]);
      await patchChangedReports(nextReports, [issueData.projectId]);

      setIssues(nextIssues);
      setProjects(nextProjects);
      setReports(nextReports);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
      throw error;
    }
  }

  async function handleUpdateIssue(issueId, issueData) {
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
    const updatedIssue = nextIssues.find((issue) => issue.id === issueId);
    const affectedProjectIds = Array.from(new Set([existingIssue?.projectId, issueData.projectId].filter(Boolean)));
    const nextProjects = applyProjectIssueCounts(projects, nextIssues).map((project) =>
      affectedProjectIds.includes(project.id) ? { ...project, updatedAt: "Just now" } : project,
    );
    const nextReports = refreshReportsForProjects(reports, nextProjects, nextIssues, affectedProjectIds);

    try {
      await updateDataResource("issues", issueId, updatedIssue);
      await patchChangedProjects(nextProjects, affectedProjectIds);
      await patchChangedReports(nextReports, affectedProjectIds);

      setIssues(nextIssues);
      setProjects(nextProjects);
      setReports(nextReports);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
      throw error;
    }
  }

  async function handleDeleteIssue(issueId) {
    const issueToDelete = issues.find((issue) => issue.id === issueId);
    const nextIssues = issues.filter((issue) => issue.id !== issueId);

    try {
      await deleteDataResource("issues", issueId);
      setIssues(nextIssues);

      if (issueToDelete) {
        const nextProjects = applyProjectIssueCounts(projects, nextIssues).map((project) =>
          project.id === issueToDelete.projectId ? { ...project, updatedAt: "Just now" } : project,
        );
        const nextReports = refreshReportsForProjects(reports, nextProjects, nextIssues, [issueToDelete.projectId]);

        await patchChangedProjects(nextProjects, [issueToDelete.projectId]);
        await patchChangedReports(nextReports, [issueToDelete.projectId]);

        setProjects(nextProjects);
        setReports(nextReports);
      }

      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
    }
  }

  async function handleAddIssueComment(issueId, commentText) {
    const newComment = {
      id: crypto.randomUUID(),
      author: "Andrej",
      body: commentText.trim(),
      createdAt: "Just now",
    };
    const nextIssues = issues.map((issue) =>
      issue.id === issueId
        ? {
            ...issue,
            comments: [...(issue.comments ?? []), newComment],
            updatedAt: "Just now",
          }
        : issue,
    );
    const updatedIssue = nextIssues.find((issue) => issue.id === issueId);

    try {
      await updateDataResource("issues", issueId, updatedIssue);
      setIssues(nextIssues);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
    }
  }

  async function handleCreateReport(reportData) {
    const newReport = {
      id: crypto.randomUUID(),
      ...buildReportSnapshot(reportData, projects, issues),
      status: reportData.status,
      updatedAt: "Just now",
    };

    try {
      const createdReport = await createDataResource("reports", newReport);

      setReports((currentReports) => [createdReport, ...currentReports]);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
    }
  }

  async function handleUpdateReport(reportId, reportData) {
    const nextReports = reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            ...buildReportSnapshot(reportData, projects, issues),
            updatedAt: "Just now",
          }
        : report,
    );
    const updatedReport = nextReports.find((report) => report.id === reportId);

    try {
      await updateDataResource("reports", reportId, updatedReport);
      setReports(nextReports);
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
    }
  }

  async function handleDeleteReport(reportId) {
    try {
      await deleteDataResource("reports", reportId);
      setReports((currentReports) => currentReports.filter((report) => report.id !== reportId));
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
    }
  }

  async function handleClearData() {
    const shouldClear = window.confirm(
      "Clear all BugTrail projects, issues, and reports from this data source?",
    );

    if (!shouldClear) {
      return;
    }

    try {
      if (isApiDataSource) {
        await Promise.all([
          ...projects.map((project) => deleteResource("projects", project.id)),
          ...issues.map((issue) => deleteResource("issues", issue.id)),
          ...reports.map((report) => deleteResource("reports", report.id)),
        ]);
      }

      setProjects(initialProjects);
      setIssues(initialIssues);
      setReports(initialReports);
      setDataStatus("success");
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
    }
  }

  async function handleRestoreSampleData() {
    const nextSampleData = cloneData(sampleData);

    try {
      if (isApiDataSource) {
        await Promise.all([
          ...projects.map((project) => deleteResource("projects", project.id)),
          ...issues.map((issue) => deleteResource("issues", issue.id)),
          ...reports.map((report) => deleteResource("reports", report.id)),
        ]);
        await Promise.all([
          ...nextSampleData.projects.map((project) => createResource("projects", project)),
          ...nextSampleData.issues.map((issue) => createResource("issues", issue)),
          ...nextSampleData.reports.map((report) => createResource("reports", report)),
        ]);
      }

      setProjects(nextSampleData.projects);
      setIssues(nextSampleData.issues);
      setReports(nextSampleData.reports);
      setDataStatus("success");
      setDataError(null);
    } catch (error) {
      setDataError(error.message);
      setDataStatus("error");
    }
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
          {isApiDataSource && dataStatus === "loading" && (
            <div className="app_data_notice">Loading mock API data...</div>
          )}
          {dataError && (
            <div className="app_data_notice error">
              {isApiDataSource ? "Mock API error" : "Storage error"}: {dataError}
            </div>
          )}
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
              element={
                <Projects
                  projects={projects}
                  status={dataStatus}
                  error={dataError}
                  onRetry={handleRetryData}
                  onCreateProject={handleCreateProject}
                />
              }
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
                  status={dataStatus}
                  error={dataError}
                  onRetry={handleRetryData}
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
            <Route
              path="/settings/:section"
              element={
                <Settings
                  dataSource={isApiDataSource ? "Mock API" : "localStorage"}
                  onClearData={handleClearData}
                  onRestoreSampleData={handleRestoreSampleData}
                />
              }
            />
            <Route path="*" element={<NotFound returnTo="/" returnLabel="Return to dashboard" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
