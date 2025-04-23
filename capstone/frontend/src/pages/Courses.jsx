import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: '',
    department: '',
    teacher: ''
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = () => {
    axios.get('http://localhost:8000/api/courses/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  };

  const fetchTeachers = () => {
    axios.get('http://localhost:8000/api/teachers/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setTeachers(response.data))
      .catch(error => console.error('Error fetching teachers:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const url = editingId
      ? `http://localhost:8000/api/courses/${editingId}/`
      : 'http://localhost:8000/api/courses/';
    const method = editingId ? 'put' : 'post';

    axios[method](url, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchCourses();
        setFormData({ name: '', code: '', semester: '', department: '', teacher: '' });
        setEditingId(null);
      })
      .catch(error => console.error('Error saving course:', error));
  };

  const handleEdit = (course) => {
    setFormData({
      id: course.id,
      name: course.name,
      code: course.code,
      semester: course.semester,
      department: course.department,
      teacher: course.teacher || ''
    });
    setEditingId(course.id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/courses/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchCourses())
      .catch(error => console.error('Error deleting course:', error));
  };

  return (
    <div className="d-flex">
      {/* Sidebar (unchanged) */}

      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#fdfae4', minHeight: '100vh' }}>
        <h4 className="fw-bold">Welcome <span className="text-danger">Sakshi</span>!</h4>
        <p className="text-muted mb-4">Stay Organised , Stay Ahead</p>

        <h3 className="fw-bold mb-3">Courses</h3>
        <p>Existing Courses</p>

        <table className="table table-hover bg-white shadow-sm rounded">
          <thead className="table-light">
            <tr>
              <th>Course Name</th>
              <th>Code</th>
              <th>Semester</th>
              <th>Department</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.semester}</td>
                <td>{course.department}</td>
                <td>{course.teacher_name || '—'}</td>
                <td>
                  <FaEdit onClick={() => handleEdit(course)} className="me-3 text-primary" style={{ cursor: 'pointer' }} />
                  <FaTrash onClick={() => handleDelete(course.id)} className="text-danger" style={{ cursor: 'pointer' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form */}
        <div className="mt-4">
          <h5 className="fw-bold">{editingId ? 'Edit Course' : 'Add Course'}</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Course Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Course Code</label>
              <input type="text" className="form-control" name="code" value={formData.code} onChange={handleChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Semester</label>
              <input type="number" className="form-control" name="semester" value={formData.semester} onChange={handleChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Department</label>
              <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Teacher</label>
              <select className="form-select" name="teacher" value={formData.teacher} onChange={handleChange}>
                <option value="">Select Teacher</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button className={`btn ${editingId ? 'btn-primary' : 'btn-danger'}`} onClick={handleSubmit}>
                {editingId ? 'Update' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
