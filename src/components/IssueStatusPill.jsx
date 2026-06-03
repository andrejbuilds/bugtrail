const toneClassNames = {
  open: "issue_status_pill_open",
  review: "issue_status_pill_review",
  fixed: "issue_status_pill_fixed",
};

function IssueStatusPill({ status, tone }) {
  const toneClassName = toneClassNames[tone] ?? toneClassNames.open;

  return <span className={`issue_status_pill ${toneClassName}`}>{status}</span>;
}

export default IssueStatusPill;
