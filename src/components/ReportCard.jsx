import ReportProgressBar from "./ReportProgressBar";

function DocumentIcon() {
  return (
    <svg
      className="report_card_icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3.75H13.5L18.25 8.5V19.25C18.25 20.2165 17.4665 21 16.5 21H7C6.0335 21 5.25 20.2165 5.25 19.25V5.5C5.25 4.5335 6.0335 3.75 7 3.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M13.25 3.75V8.75H18.25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 12H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 15.5H13.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      className="report_copy_icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 14L14 10M8 16L6.5 17.5C4.84315 19.1569 4.84315 21.8431 6.5 23.5C8.15685 25.1569 10.8431 25.1569 12.5 23.5L14 22M16 8L17.5 6.5C19.1569 4.84315 21.8431 4.84315 23.5 6.5C25.1569 8.15685 25.1569 10.8431 23.5 12.5L22 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReportCard({
  title,
  project,
  openCount,
  fixedCount,
  sharedWith,
  updatedAt,
  openWidth,
  fixedWidth,
}) {
  return (
    <article className="report_card">
      <div className="report_card_body">
        <DocumentIcon />
        <h3 className="report_card_title">{title}</h3>
        <p className="report_card_project">{project}</p>
        <p className="report_card_counts">
          <span>{openCount} open</span>
          <span className="report_counts_separator">•</span>
          <span>{fixedCount} fixed</span>
        </p>
        <ReportProgressBar openWidth={openWidth} fixedWidth={fixedWidth} />
      </div>

      <div className="report_card_footer">
        <p className="report_card_meta">
          Shared with {sharedWith} people
          <span className="report_counts_separator">•</span>
          Updated {updatedAt}
        </p>
        <button type="button" className="report_copy_button">
          <LinkIcon />
          Copy link
        </button>
      </div>
    </article>
  );
}

export default ReportCard;
