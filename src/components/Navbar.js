import { React, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogOut = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/");
    } catch (error) {
        console.log(error);
    }
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            Orbit | ACM
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dailyReports">
                  Daily Report
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/paySlip">
                  PaySlip
                </Link>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
