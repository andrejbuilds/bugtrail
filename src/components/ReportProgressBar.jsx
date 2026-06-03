function ReportProgressBar({ openWidth = "35%", fixedWidth = "45%" }) {
  return (
    <div className="report_progress_track" aria-hidden="true">
      <span className="report_progress_open" style={{ width: openWidth }}></span>
      <span className="report_progress_fixed" style={{ width: fixedWidth }}></span>
    </div>
  );
}

export default ReportProgressBar;
