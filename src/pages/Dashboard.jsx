import projects_icon from "../assets/projects_icon.png";
import projects_card_icon from "../assets/projects_card_icon.png";
import issues_card_icon from "../assets/issues_card_icon.png";
import resolved_card_icon from "../assets/resolved_card_icon.png";
import client_card_icon from "../assets/client_card_icon.png";

function Dashboard() {
  return (
    <div className="main_content">
      <div className="main_header">
        <div className="header_one">
          <h1 className="dashboard_heading">QA Dashboard</h1>
          <p className="dashboard_sub_heading">Overview of your projects, issues, and reports.</p>
        </div>
        <div className="header_two">
          <button className="new_project_btn">+ New Project</button>
        </div>
      </div>
      <div className="cards">
        <div className="projects_card">
          <img className="projects_card_icon" src={projects_card_icon} alt="" />
          <h1 className="project_card_number">0</h1>
          <p className="projects_card_heading">Projects</p>
          <p className="projects_card_sub_heading">Active QA projects</p>
          <div className="projects_card_pill">No Projects</div>
        </div>
        <div className="issues_card">
          <img className="issues_card_icon" src={issues_card_icon} alt="" />
          <h1 className="issues_card_number">0</h1>
          <p className="issues_card_heading">Open Issues</p>
          <p className="issues_card_sub_heading">Waiting to be fixed</p>
          <div className="issues_card_pill">All clear</div>
        </div>
        <div className="resolved_card">
          <img className="resolved_card_icon" src={resolved_card_icon} alt="" />
          <h1 className="resolved_card_number">0</h1>
          <p className="resolved_card_heading">Fixed Issues</p>
          <p className="resolved_card_sub_heading">Marked as resolved</p>
          <div className="resolved_card_pill">0 resolved</div>
        </div>
        <div className="client_card">
          <img className="client_card_icon" src={client_card_icon} alt="" />
          <h1 className="client_card_number">0</h1>
          <p className="client_card_heading">Client Reports</p>
          <p className="client_card_sub_heading">Reports ready to share</p>
          <div className="client_card_pill">None ready</div>
        </div>
      </div>
      <div className="recent_projects_area">
        <h3 className="recent_projects_h3">Recent Projects</h3>
        <img className="recent_project_card_icon" src={projects_icon} alt="" />
        <h2 className="recent_projects_qa">No QA projects yet</h2>
        <p className="recent_projects_p">Create your first project to start tracking website issues</p>
        <button className="recent_projects_btn">+ Create Project</button>
      </div>
    </div>
  );
}

export default Dashboard;
