import { useState } from "react";
import { BrowserRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";

import { BugTrailProvider, useBugTrail } from "./context/BugTrailContext";
import Dashboard from "./pages/Dashboard";
import IssueDetail from "./pages/IssueDetail";
import Issues from "./pages/Issues";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";
import ReportDetail from "./pages/ReportDetail";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import logo from "./assets/bugtrail_logo.png";
import dashboard_icon from "./assets/dashboard_icon.png";
import projects_icon from "./assets/projects_icon.png";
import issues_icon from "./assets/issues_icon.png";
import reports_icon from "./assets/reports_icon.png";
import settings_icon from "./assets/settings_icon.png";
import default_profile from "./assets/default_profile.png";

import "./styles/app-shell.css";
import "./styles/modals.css";

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

function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { dataSource, status, error } = useBugTrail();
  const closeSidebar = () => setIsSidebarOpen(false);

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
          {dataSource === "Mock API" && status === "loading" && (
            <div className="app_data_notice">Loading mock API data...</div>
          )}
          {error && (
            <div className="app_data_notice error">
              {dataSource === "Mock API" ? "Mock API error" : "Storage error"}: {error}
            </div>
          )}

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/issues/:issueId" element={<IssueDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:reportId" element={<ReportDetail />} />
            <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
            <Route path="/settings/:section" element={<Settings />} />
            <Route path="*" element={<NotFound returnTo="/" returnLabel="Return to dashboard" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <BugTrailProvider>
      <AppShell />
    </BugTrailProvider>
  );
}

export default App;
