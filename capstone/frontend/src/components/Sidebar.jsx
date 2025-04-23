import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light vh-100" style={{ width: '250px' }}>
      <div className="mb-4 text-center">
        <h4>{user?.username}</h4>
        <span className="text-muted text-capitalize">{user?.role}</span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link active" aria-current="page">
            <i className="bi bi-house-door me-2"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile" className="nav-link text-dark">
            <i className="bi bi-person-circle me-2"></i> Profile
          </Link>
        </li>
        <li>
          <Link to="/settings" className="nav-link text-dark">
            <i className="bi bi-gear me-2"></i> Settings
          </Link>
        </li>
        <li>
          <Link to="/logout" className="nav-link text-dark">
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
