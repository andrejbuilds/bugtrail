import { Link } from "react-router-dom";

import EmptyState from "../shared/EmptyState";
import IssueListItem from "./IssueListItem";

function IssueList({ issues, filteredIssues, onReportIssue }) {
  return (
    <div className="issues_list">
      {filteredIssues.length > 0 ? (
        filteredIssues.map((issue) => (
          <Link className="issue_list_link" key={issue.id} to={`/issues/${issue.id}`}>
            <IssueListItem {...issue} />
          </Link>
        ))
      ) : (
        <EmptyState
          className="issues_empty_state"
          title={issues.length === 0 ? "No issues yet" : "No issues found"}
          description={
            issues.length === 0
              ? "Report an issue when you find something that needs a fix."
              : "Try changing the search, tab, or filters."
          }
          actionLabel={issues.length === 0 ? "Report issue" : undefined}
          onAction={issues.length === 0 ? onReportIssue : undefined}
        />
      )}
    </div>
  );
}

export default IssueList;
