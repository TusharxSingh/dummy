import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user, logout } = useAuth(); // get authenticated user and logout
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');

    if (logout) logout(); // optional, if your context supports it
    navigate('/');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-danger text-white d-flex flex-column align-items-center p-3" style={{ width: '250px', minHeight: '100vh' }}>
        
        <h5 className="fw-bold mb-0">{user?.first_name || user?.username || 'User'}</h5>
        <small className="mb-4">{user?.username}</small>

        <ul className="nav flex-column w-100 text-center">
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">Dashboard</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">About</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">Profile Settings</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">Change Pin</a></li>
          <li className="nav-item mt-3">
            <button onClick={handleLogout} className="btn btn-link nav-link text-white p-0">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light p-5">
        <h4 className="fw-bold">Welcome <span className="text-danger">{user?.first_name || user?.username}</span>!</h4>
        <p className="text-muted mb-4">Stay Organised, Stay Ahead</p>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card bg-danger text-white shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Your Timetable</h5>
                <p className="card-text small">Check your daily and weekly schedule</p>
                <a href="#" className="btn btn-light btn-sm fw-bold">View Timetable</a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-danger text-white shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Faculty Availability</h5>
                <p className="card-text small">Check available slots of other teachers</p>
                <a href="#" className="btn btn-light btn-sm fw-bold">Check Availability</a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-danger text-white shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Classroom Availability</h5>
                <p className="card-text small">Find rooms for extra classes and meetings</p>
                <a href="#" className="btn btn-light btn-sm fw-bold">Search Rooms</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
