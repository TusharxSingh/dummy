import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ first_name: '', last_name: '', designation: '' });
  const [editId, setEditId] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/teachers/', config);
      setTeachers(res.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/api/teachers/${editId}/`, newTeacher, config);
        setEditId(null);
      } else {
        await axios.post('http://localhost:8000/api/teachers/', newTeacher, config);
      }
      setNewTeacher({ first_name: '', last_name: '', designation: '' });
      setShowForm(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error submitting teacher:', error);
    }
  };

  const handleEdit = (teacher) => {
    setNewTeacher(teacher);
    setEditId(teacher.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/teachers/${id}/`, config);
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    if (logout) logout();
    navigate('/');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-danger text-white p-4 d-flex flex-column align-items-center" style={{ width: '250px', minHeight: '100vh' }}>
        <img src="\defaulticon.png" alt="profile" className="rounded-circle mb-2" />
        <h5 className="mb-4">admin</h5>
        <ul className="list-unstyled w-100">
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">Dashboard</a></li>
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">About</a></li>
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">Profile Setting</a></li>
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">Change Pin</a></li>
          <li className="nav-item py-2">
            <button onClick={handleLogout} className="btn btn-link nav-link text-white p-0">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f9f8e3' }}>
        <h4 className="fw-bold">Welcome Sakshi !</h4>
        <p className="text-muted">Stay Organised , Stay Ahead</p>

        <h2 className="fw-bold mt-4">Teachers</h2>
        <p className="text-muted">Existing Teachers</p>

        <table className="table align-middle">
          <thead className="fw-bold">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Designation</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id}>
                <td>{t.first_name}</td>
                <td>{t.last_name}</td>
                <td>{t.designation}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(t)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(t.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end">
          <button
            className="btn btn-sm btn-light text-danger border border-danger"
            onClick={() => {
              setShowForm(!showForm);
              setNewTeacher({ first_name: '', last_name: '', designation: '' });
              setEditId(null);
            }}
          >
            {editId ? 'Cancel Editing' : 'Add New Entry'}
          </button>
        </div>

        {showForm && (
          <div className="row g-2 mt-3">
            <div className="col-md-3">
              <input
                type="text"
                name="first_name"
                className="form-control"
                placeholder="First Name"
                value={newTeacher.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="last_name"
                className="form-control"
                placeholder="Last Name"
                value={newTeacher.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="designation"
                className="form-control"
                placeholder="Designation"
                value={newTeacher.designation}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-danger w-100" onClick={handleSubmit}>
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers;
