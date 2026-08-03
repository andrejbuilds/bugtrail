function IssuesSkeleton() {
  return (
    <div className="issues_list" aria-label="Loading issues">
      {Array.from({ length: 5 }).map((_, index) => (
        <article className="issue_list_item issue_skeleton_item" key={index}>
          <span className="skeleton_dot"></span>
          <span className="skeleton_line issue_id_skeleton"></span>
          <div className="issue_main">
            <span className="skeleton_line wide"></span>
            <span className="skeleton_line tag"></span>
            <span className="skeleton_line"></span>
          </div>
          <span className="skeleton_line pill"></span>
        </article>
      ))}
    </div>
  );
}

export default IssuesSkeleton;
