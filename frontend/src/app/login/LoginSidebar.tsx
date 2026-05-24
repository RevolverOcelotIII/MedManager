import { FaHeartbeat } from "react-icons/fa";

export function LoginSidebar() {
  return (
    <div className="login-sidebar">
      <div className="blob-1"></div>
      <div className="blob-2"></div>
      
      <div className="header">
        <div className="header-icon">
          <FaHeartbeat size={20} />
        </div>
        <span className="header-name">MedManager</span>
      </div>

      <div className="content">
        <h2 className="headline">
          One workspace for every patient, prescription, and procedure.
        </h2>
        <p className="subtext">
          Built for clinical teams who need calm, reliable tools — not another spreadsheet.
        </p>
      </div>

      <div className="footer-text">
        © Placeholder footer
      </div>
    </div>
  );
}
