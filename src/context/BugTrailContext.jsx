/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

import { sampleData } from "../data/sampleData";
import {
  createResource,
  deleteResource,
  getResource,
  updateResource,
} from "../services/apiClient";

const BugTrailContext = createContext(null);

const initialState = {
  projects: [],
  issues: [],
  reports: [],
  status: import.meta.env.VITE_DATA_SOURCE === "api" ? "loading" : "success",
  error: null,
};

const isApiDataSource = import.meta.env.VITE_DATA_SOURCE === "api";

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function readLocalStorage(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialState() {
  if (isApiDataSource) {
    return initialState;
  }

  return {
    ...initialState,
    projects: readLocalStorage("bugtrail-projects", []),
    issues: readLocalStorage("bugtrail-issues", []),
    reports: readLocalStorage("bugtrail-reports", []),
  };
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

function bugTrailReducer(state, action) {
  switch (action.type) {
    case "data/loading":
      return { ...state, status: "loading", error: null };
    case "data/loaded":
      return { ...state, ...action.payload, status: "success", error: null };
    case "data/error":
      return { ...state, status: "error", error: action.payload };
    case "data/cleared":
      return { ...state, projects: [], issues: [], reports: [], status: "success", error: null };
    case "project/created":
      return { ...state, projects: [action.payload, ...state.projects], error: null };
    case "project/updatedCascade":
      return { ...state, ...action.payload, error: null };
    case "project/deletedCascade":
      return { ...state, ...action.payload, error: null };
    case "issue/createdCascade":
      return { ...state, ...action.payload, error: null };
    case "issue/updatedCascade":
      return { ...state, ...action.payload, error: null };
    case "issue/deletedCascade":
      return { ...state, ...action.payload, error: null };
    case "issue/commentAdded":
      return { ...state, issues: action.payload, error: null };
    case "report/created":
      return { ...state, reports: [action.payload, ...state.reports], error: null };
    case "report/updated":
      return { ...state, reports: action.payload, error: null };
    case "report/deleted":
      return { ...state, reports: state.reports.filter((report) => report.id !== action.payload), error: null };
    default:
      throw new Error(`Unknown action: ${action.type}`);
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

export function BugTrailProvider({ children }) {
  const [state, dispatch] = useReducer(bugTrailReducer, undefined, getInitialState);
  const { projects, issues, reports } = state;

  useEffect(() => {
    if (isApiDataSource) {
      return;
    }

    localStorage.setItem("bugtrail-projects", JSON.stringify(state.projects));
    localStorage.setItem("bugtrail-issues", JSON.stringify(state.issues));
    localStorage.setItem("bugtrail-reports", JSON.stringify(state.reports));
  }, [state.projects, state.issues, state.reports]);

  const loadData = useCallback(async (signal) => {
    try {
      dispatch({ type: "data/loading" });

      const [loadedProjects, loadedIssues, loadedReports] = await Promise.all([
        getResource("projects", signal),
        getResource("issues", signal),
        getResource("reports", signal),
      ]);

      dispatch({
        type: "data/loaded",
        payload: {
          projects: loadedProjects,
          issues: loadedIssues,
          reports: loadedReports,
        },
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        dispatch({ type: "data/error", payload: error.message });
      }
    }
  }, []);

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

  function retryData() {
    if (isApiDataSource) {
      loadData();
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

  async function createProject(projectData) {
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

      dispatch({ type: "project/created", payload: createdProject });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
      throw error;
    }
  }

  async function updateProject(projectId, projectData) {
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

      dispatch({
        type: "project/updatedCascade",
        payload: { projects: nextProjects, issues: nextIssues, reports: nextReports },
      });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
      throw error;
    }
  }

  function archiveProject(projectId) {
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return Promise.resolve();
    }

    return updateProject(projectId, { ...project, status: "Archived" });
  }

  async function deleteProject(projectId) {
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

      dispatch({
        type: "project/deletedCascade",
        payload: { projects: nextProjects, issues: nextIssues, reports: nextReports },
      });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
      throw error;
    }
  }

  async function createIssue(issueData) {
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

      dispatch({
        type: "issue/createdCascade",
        payload: { projects: nextProjects, issues: nextIssues, reports: nextReports },
      });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
      throw error;
    }
  }

  async function updateIssue(issueId, issueData) {
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

      dispatch({
        type: "issue/updatedCascade",
        payload: { projects: nextProjects, issues: nextIssues, reports: nextReports },
      });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
      throw error;
    }
  }

  function updateIssueStatus(issueId, status) {
    const issue = issues.find((item) => item.id === issueId);

    if (!issue) {
      return Promise.resolve();
    }

    return updateIssue(issueId, { ...issue, status });
  }

  async function deleteIssue(issueId) {
    const issueToDelete = issues.find((issue) => issue.id === issueId);
    const nextIssues = issues.filter((issue) => issue.id !== issueId);

    try {
      await deleteDataResource("issues", issueId);

      if (issueToDelete) {
        const nextProjects = applyProjectIssueCounts(projects, nextIssues).map((project) =>
          project.id === issueToDelete.projectId ? { ...project, updatedAt: "Just now" } : project,
        );
        const nextReports = refreshReportsForProjects(reports, nextProjects, nextIssues, [issueToDelete.projectId]);

        await patchChangedProjects(nextProjects, [issueToDelete.projectId]);
        await patchChangedReports(nextReports, [issueToDelete.projectId]);

        dispatch({
          type: "issue/deletedCascade",
          payload: { projects: nextProjects, issues: nextIssues, reports: nextReports },
        });
      } else {
        dispatch({
          type: "issue/deletedCascade",
          payload: { projects, issues: nextIssues, reports },
        });
      }
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
    }
  }

  async function addIssueComment(issueId, commentText) {
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
      dispatch({ type: "issue/commentAdded", payload: nextIssues });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
    }
  }

  async function createReport(reportData) {
    const newReport = {
      id: crypto.randomUUID(),
      ...buildReportSnapshot(reportData, projects, issues),
      status: reportData.status,
      updatedAt: "Just now",
    };

    try {
      const createdReport = await createDataResource("reports", newReport);

      dispatch({ type: "report/created", payload: createdReport });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
    }
  }

  async function updateReport(reportId, reportData) {
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
      dispatch({ type: "report/updated", payload: nextReports });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
    }
  }

  async function deleteReport(reportId) {
    try {
      await deleteDataResource("reports", reportId);
      dispatch({ type: "report/deleted", payload: reportId });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
    }
  }

  async function clearData() {
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

      dispatch({ type: "data/cleared" });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
    }
  }

  async function restoreSampleData() {
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

      dispatch({ type: "data/loaded", payload: nextSampleData });
    } catch (error) {
      dispatch({ type: "data/error", payload: error.message });
    }
  }

  const value = {
    ...state,
    dataSource: isApiDataSource ? "Mock API" : "localStorage",
    createProject,
    updateProject,
    archiveProject,
    deleteProject,
    createIssue,
    updateIssue,
    updateIssueStatus,
    deleteIssue,
    addIssueComment,
    createReport,
    updateReport,
    deleteReport,
    clearData,
    restoreSampleData,
    retryData,
  };

  return <BugTrailContext.Provider value={value}>{children}</BugTrailContext.Provider>;
}

export function useBugTrail() {
  const context = useContext(BugTrailContext);

  if (!context) {
    throw new Error("useBugTrail must be used inside BugTrailProvider");
  }

  return context;
}
