import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CreateReportModal from "../components/reports/CreateReportModal";
import ReportProgressBar from "../components/reports/ReportProgressBar";
import { useBugTrail } from "../context/BugTrailContext";
import NotFound from "./NotFound";
import "../styles/detail.css";

function ReportDetail() {
  const { projects, reports, issues, updateReport, deleteReport } = useBugTrail();
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const report = reports.find((item) => item.id === reportId);

  if (!report) {
    return (
      <NotFound
        title="Report not found"
        description="The report you requested does not exist."
        returnTo="/reports"
        returnLabel="Return to reports"
      />
    );
  }

  const reportIssues = issues.filter((issue) => issue.projectId === report.projectId);

  function handleDelete() {
    deleteReport(report.id);
    navigate("/reports");
  }

  return (
    <>
      <div className="main_content detail_page">
        <div className="detail_breadcrumb">
          <Link to="/reports">Reports</Link>
          <span>/</span>
          <span>{report.title}</span>
        </div>

        <div className="detail_header">
          <div>
            <h1 className="dashboard_heading">{report.title}</h1>
            <p className="dashboard_sub_heading">{report.project}</p>
          </div>
          <div className="detail_actions">
            <button type="button" className="detail_secondary_button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button type="button" className="detail_danger_button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="detail_grid">
          <section className="detail_panel">
            <h2>Summary</h2>
            <div className="detail_report_numbers">
              <div>
                <span>Open</span>
                <strong>{report.openCount}</strong>
              </div>
              <div>
                <span>Fixed</span>
                <strong>{report.fixedCount}</strong>
              </div>
              <div>
                <span>Shared with</span>
                <strong>{report.sharedWith}</strong>
              </div>
            </div>
            <ReportProgressBar openWidth={report.openWidth} fixedWidth={report.fixedWidth} />
          </section>

          <section className="detail_panel">
            <h2>Details</h2>
            <dl className="detail_definition_list">
              <div>
                <dt>Project</dt>
                <dd>
                  <Link to={`/projects/${report.projectId}`}>{report.project}</Link>
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{report.status}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{report.updatedAt}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="detail_section">
          <h2>Included Issues</h2>
          {reportIssues.length > 0 ? (
            <div className="detail_issue_summary_list">
              {reportIssues.map((issue) => (
                <Link key={issue.id} to={`/issues/${issue.id}`} className="detail_issue_summary">
                  <span>{issue.issueId}</span>
                  <strong>{issue.title}</strong>
                  <em>{issue.status}</em>
                </Link>
              ))}
            </div>
          ) : (
            <p className="detail_empty_line">No issues were attached when this report was generated.</p>
          )}
        </section>
      </div>

      {isEditing && (
        <CreateReportModal
          onClose={() => setIsEditing(false)}
          onCreateReport={(reportData) => updateReport(report.id, reportData)}
          projects={projects}
          initialData={report}
          title="Edit report"
          description="Update the report details."
          footerNote="Counts refresh from the selected project's current issues."
          primaryAction="Save changes"
        />
      )}
    </>
  );
}

export default ReportDetail;
