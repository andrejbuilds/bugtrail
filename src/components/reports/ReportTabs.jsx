const reportTabs = ["Drafts", "Published", "Archived"];

function ReportTabs({ activeTab, onTabChange }) {
  return (
    <div className="reports_tabs" role="tablist" aria-label="Report tabs">
      {reportTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={activeTab === tab ? "reports_tab active" : "reports_tab"}
          aria-pressed={activeTab === tab}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default ReportTabs;
