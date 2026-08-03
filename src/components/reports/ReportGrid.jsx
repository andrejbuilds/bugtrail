import { Link } from "react-router-dom";

import EmptyState from "../shared/EmptyState";
import ReportCard from "./ReportCard";

function ReportGrid({ reports, filteredReports, activeTab }) {
  return (
    <div className="reports_grid">
      {filteredReports.length > 0 ? (
        filteredReports.map((report) => (
          <Link className="report_card_link" key={report.id} to={`/reports/${report.id}`}>
            <ReportCard {...report} />
          </Link>
        ))
      ) : (
        <EmptyState
          className="reports_empty_state"
          title={reports.length === 0 ? "No reports yet" : `No ${activeTab.toLowerCase()} reports`}
          description={
            reports.length === 0
              ? "Generate a client report after you have project issues to summarize."
              : "Try another report tab."
          }
        />
      )}
    </div>
  );
}

export default ReportGrid;
