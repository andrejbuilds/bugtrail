import SearchInput from "../shared/SearchInput";

const projectFilters = ["All", "Active", "Archived"];

function ProjectFilters({ searchQuery, onSearchChange, activeFilter, onFilterChange }) {
  return (
    <div className="projects_toolbar">
      <SearchInput
        className="projects_search"
        iconClassName="project_search_icon"
        label="Search projects"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="projects_filters" role="tablist" aria-label="Project filters">
        {projectFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "project_filter active" : "project_filter"}
            aria-pressed={activeFilter === filter}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProjectFilters;
