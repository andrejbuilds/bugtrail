import { Link } from "react-router-dom";

import "../styles/detail.css";

function NotFound({
  title = "Page not found",
  description = "The page you requested does not exist.",
  returnTo = "/projects",
  returnLabel = "Return to projects",
}) {
  return (
    <main className="main_content not_found_page">
      <section className="not_found_panel">
        <p className="not_found_code">404</p>
        <h1 className="dashboard_heading">{title}</h1>
        <p className="dashboard_sub_heading">{description}</p>
        <Link className="new_project_btn not_found_link" to={returnTo}>
          {returnLabel}
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
