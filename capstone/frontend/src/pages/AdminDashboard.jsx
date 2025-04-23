import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    if (logout) logout();
    navigate('/');
  };

  const handleTeachersRedirect = () => {
    navigate('/Teachers');
  };

  const handleCoursesClick = () => {
    navigate('/courses');
  };

  const handleRoomsRedirect = () => {
    navigate('/rooms'); // <--- Route to your Rooms page
  };

  const handleGenerateTimeTableRedirect = () => {
    navigate('/generatetimetable');
  };
  

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-danger text-white d-flex flex-column align-items-center p-3" style={{ width: '250px', minHeight: '100vh' }}>
        <img
          src="\defaulticon.png"
          alt="avatar"
          className="rounded-circle mb-3"
          width={100}
          height={100}
        />
        <h5 className="fw-bold text-capitalize">admin</h5>

        <ul className="nav flex-column text-center w-100 mt-4">
          <li className="nav-item border-bottom py-2"><a href="#" className="nav-link text-white">Dashboard</a></li>
          <li className="nav-item border-bottom py-2"><a href="#" className="nav-link text-white">About</a></li>
          <li className="nav-item border-bottom py-2"><a href="#" className="nav-link text-white">Profile Setting</a></li>
          <li className="nav-item border-bottom py-2"><a href="#" className="nav-link text-white">Change Pin</a></li>
          <li className="nav-item py-2">
            <button onClick={handleLogout} className="btn btn-link nav-link text-white p-0">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light p-5">
        <h4 className="fw-bold">
          Welcome <span className="text-danger">{user?.first_name || user?.username}</span>!
        </h4>
        <p className="text-muted mb-4">Stay Organised , Stay Ahead</p>

        <h5 className="mb-4">Start Generating Time Table</h5>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <button onClick={handleCoursesClick} className="btn btn-danger w-100 text-white shadow text-center p-4">
              <FaCalendarAlt size={30} className="mb-2" />
              <div className="fw-bold">Total Subjects</div>
            </button>
          </div>

          <div className="col-md-4">
            <button onClick={handleTeachersRedirect} className="btn btn-danger w-100 text-white shadow text-center p-4">
              <FaUser size={30} className="mb-2" />
              <div className="fw-bold">Total Teachers</div>
            </button>
          </div>

          <div className="col-md-4">
            <button onClick={handleRoomsRedirect} className="btn btn-danger w-100 text-white shadow text-center p-4">
              <FaMapMarkerAlt size={30} className="mb-2" />
              <div className="fw-bold">Total Rooms</div>
            </button>
          </div>
        </div>

        <button onClick={handleGenerateTimeTableRedirect} className="btn btn-light border-danger text-danger fw-bold shadow-sm">Start Generating</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
