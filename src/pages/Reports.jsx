import { useState } from "react";

import CreateReportModal from "../components/reports/CreateReportModal";
import ReportGrid from "../components/reports/ReportGrid";
import ReportTabs from "../components/reports/ReportTabs";
import AddIcon from "../components/shared/AddIcon";
import "../styles/reports.css";

function Reports({ projects, reports, onCreateReport }) {
  const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Published");
  const openCreateReportModal = () => setIsCreateReportModalOpen(true);
  const closeCreateReportModal = () => setIsCreateReportModalOpen(false);
  const filteredReports = reports.filter((report) => report.status === activeTab);

  function handleCreateReport(reportData) {
    onCreateReport(reportData);
    setActiveTab(reportData.status);
  }

  return (
    <>
      <div className="main_content reports_page">
        <div className="main_header reports_header">
          <div className="header_one">
            <h1 className="dashboard_heading">Client Reports</h1>
            <p className="dashboard_sub_heading">Shareable QA reports for your clients</p>
          </div>
          <div className="header_two">
            <button className="new_project_btn reports_new_button" onClick={openCreateReportModal}>
              <AddIcon />
              Generate Report
            </button>
          </div>
        </div>

        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <ReportGrid reports={reports} filteredReports={filteredReports} activeTab={activeTab} />
      </div>
      {isCreateReportModalOpen && (
        <CreateReportModal
          onClose={closeCreateReportModal}
          onCreateReport={handleCreateReport}
          projects={projects}
        />
      )}
    </>
  );
}

export default Reports;
