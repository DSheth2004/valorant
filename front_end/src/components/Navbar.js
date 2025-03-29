import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">VALORANT</Link>

        <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/agents">Agents</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/maps">Maps</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/arsenal">Arsenal</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/specs">Specs</Link></li>
          </ul>

          <div className="ms-auto d-flex gap-3">
            <Link className="btn btn-warning" to="/shop">Shop Now</Link>

            {isAuthenticated ? (
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link className="btn btn-register" to="/login">
                Register/Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
