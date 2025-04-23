import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({ name: '', capacity: '', type: '', available: true });

  const navigate = useNavigate(); // 👈 React Router hook for navigation

  const token = localStorage.getItem('accessToken');
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axios
      .get('http://localhost:8000/api/rooms/', authHeaders)
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  };

  const handleShowModal = (room = null) => {
    if (room) {
      setEditMode(true);
      setCurrentRoom(room);
    } else {
      setEditMode(false);
      setCurrentRoom({ name: '', capacity: '', type: '', available: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoom({
      ...currentRoom,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editMode
      ? axios.put(`http://localhost:8000/api/rooms/${currentRoom.id}/`, currentRoom, authHeaders)
      : axios.post('http://localhost:8000/api/rooms/', currentRoom, authHeaders);

    request
      .then(() => {
        fetchRooms();
        handleCloseModal();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      axios
        .delete(`http://localhost:8000/api/rooms/${id}/`, authHeaders)
        .then(fetchRooms)
        .catch(console.error);
    }
  };
  const { user, logout } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    if (logout) logout();
    navigate('/');
  };

  return (
    <div className="container-fluid" style={{ minHeight: '100vh' }}>
      <div className="row">
        {/* Sidebar */}
        <div
          className="col-md-2 d-flex flex-column align-items-center text-white py-4"
          style={{ backgroundColor: '#A10000', minHeight: '100vh' }}
        >
          <img
            src="\defaulticon.png"
            alt="profile"
            className="rounded-circle mb-3"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <h5 className="text-white">admin</h5>
          <hr className="bg-white w-100" />
          <nav className="nav flex-column w-100 text-center">
            <a href="#" className="nav-link text-white">Dashboard</a>
            <a href="#" className="nav-link text-white">About</a>
            <a href="#" className="nav-link text-white">Profile Setting</a>
            <a href="#" className="nav-link text-white">Change Pin</a>
            <a href="#" onClick={handleLogout} className="nav-link text-white mt-3">Logout</a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-5" style={{ backgroundColor: '#fdfbe6' }}>
          <h4 className="fw-bold">Welcome Sakshi !</h4>
          <p className="mb-4">Stay Organised , Stay Ahead</p>

          <h2 className="fw-bold mb-3">Rooms</h2>
          <p className="text-muted">Existing Rooms</p>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Room Name</th>
                <th>Capacity</th>
                <th>Type</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.type}</td>
                  <td>{room.available ? 'Yes' : 'No'}</td>
                  <td>
                    <FaEdit
                      className="text-primary me-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleShowModal(room)}
                    />
                    <FaTrash
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(room.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button variant="danger" onClick={() => handleShowModal()} className="mt-3">
            Add Rooms
          </Button>
        </div>
      </div>

      {/* Modal for Add/Edit Room */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Room' : 'Add Room'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentRoom.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={currentRoom.capacity}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={currentRoom.type} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Lab">Lab</option>
                <option value="Theatre">Theatre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available"
                name="available"
                checked={currentRoom.available}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              {editMode ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Rooms;
