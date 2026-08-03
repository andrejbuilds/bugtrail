import { useState } from "react";

import CreateProjectModal from "../components/projects/CreateProjectModal";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectTable from "../components/projects/ProjectTable";
import ProjectsSkeleton from "../components/projects/ProjectsSkeleton";
import AddIcon from "../components/shared/AddIcon";
import ErrorState from "../components/shared/ErrorState";
import { useBugTrail } from "../context/BugTrailContext";
import "../styles/projects.css";

function Projects() {
  const { projects, status, error, retryData, createProject } = useBugTrail();
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const openCreateProjectModal = () => setIsCreateProjectModalOpen(true);
  const closeCreateProjectModal = () => setIsCreateProjectModalOpen(false);
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      project.name.toLowerCase().includes(query) ||
      project.website.toLowerCase().includes(query);
    const matchesStatus = activeFilter === "All" || project.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="main_content projects_page">
        <div className="main_header projects_header">
          <div className="header_one">
            <h1 className="dashboard_heading">Projects</h1>
            <p className="dashboard_sub_heading">All QA projects you're tracking</p>
          </div>
          <div className="header_two">
            <button className="new_project_btn projects_new_button" onClick={openCreateProjectModal}>
              <AddIcon />
              New Project
            </button>
          </div>
        </div>

        <ProjectFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {status === "loading" ? (
          <ProjectsSkeleton />
        ) : status === "error" ? (
          <ErrorState message={error} onRetry={retryData} />
        ) : (
          <ProjectTable
            projects={projects}
            filteredProjects={filteredProjects}
            onCreateProject={openCreateProjectModal}
          />
        )}
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

export default Projects;
