import SearchInput from "../shared/SearchInput";

function IssueFilters({
  projects,
  assignees,
  searchQuery,
  onSearchChange,
  projectFilter,
  onProjectFilterChange,
  severityFilter,
  onSeverityFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
}) {
  return (
    <div className="issues_toolbar">
      <SearchInput
        className="issues_search"
        iconClassName="issues_search_icon"
        label="Search issues"
        placeholder="Search issues..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="issues_filters">
        <label className="issue_filter_field">
          <span>Project</span>
          <select value={projectFilter} onChange={(event) => onProjectFilterChange(event.target.value)}>
            <option value="All">All</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label className="issue_filter_field">
          <span>Severity</span>
          <select value={severityFilter} onChange={(event) => onSeverityFilterChange(event.target.value)}>
            <option value="All">All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>
        <label className="issue_filter_field">
          <span>Assignee</span>
          <select value={assigneeFilter} onChange={(event) => onAssigneeFilterChange(event.target.value)}>
            <option value="All">All</option>
            {assignees.map((assignee) => (
              <option key={assignee}>{assignee}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default IssueFilters;
