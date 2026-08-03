function IssueTabs({ tabs, activeStatus, onStatusChange }) {
  return (
    <div className="issue_tabs" role="tablist" aria-label="Issue status tabs">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          className={activeStatus === tab.label ? "issue_tab active" : "issue_tab"}
          aria-pressed={activeStatus === tab.label}
          onClick={() => onStatusChange(tab.label)}
        >
          <span>{tab.label}</span>
          <span className="issue_tab_count">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}

export default IssueTabs;
