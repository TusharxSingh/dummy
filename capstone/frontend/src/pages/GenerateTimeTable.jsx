import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenerateTimeTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [timeslot, setTimeslots] = useState([]);
  const [maxHours, setMaxHours] = useState(6);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      setError("No access token found!");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [teachersRes, coursesRes, timeslotRes] = await Promise.all([
          axios.get("http://localhost:8000/api/teachers/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/courses/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/timeslots/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setTeachers(teachersRes.data || []);
        setCourses(coursesRes.data || []);
        setTimeslots(timeslotRes.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized: Please log in again.");
          navigate("/login");
        } else {
          setError("An error occurred while fetching data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, navigate]);

  const handleGenerate = () => {
    setLoading(true);
    axios
      .post(
        "http://localhost:8000/api/generate-timetable/",
        { max_hours_per_day: maxHours },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => {
        setTimetable(res.data);
      })
      .catch((err) => {
        console.error("Failed to generate timetable", err);
        setError("Failed to generate timetable. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-danger text-white p-4 d-flex flex-column align-items-center" style={{ width: '250px', minHeight: '100vh' }}>
        <img src="/defaulticon.png" alt="profile" className="rounded-circle mb-2" />
        <h5 className="mb-4">admin</h5>
        <ul className="list-unstyled w-100">
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">Dashboard</a></li>
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">About</a></li>
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">Profile Setting</a></li>
          <li className="mb-3"><a href="#" className="text-white text-decoration-none">Change Pin</a></li>
          <li className="nav-item py-2">
            <button onClick={() => navigate('/')} className="btn btn-link nav-link text-white p-0">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5" style={{ backgroundColor: '#fdfde0' }}>
        <h4 className="fw-bold">Welcome Sakshi !</h4>
        <p className="text-muted">Stay Organised , Stay Ahead</p>

        <h2 className="fw-bold mt-4">Generate Timetable</h2>
        <p className="text-muted">Auto-generate based on max hours per day</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="maxHours" className="form-label fw-semibold">Max Hours Per Day:</label>
          <input
            id="maxHours"
            type="number"
            value={maxHours}
            onChange={(e) => setMaxHours(parseInt(e.target.value))}
            className="form-control"
            min="1"
            max="12"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="btn btn-danger mb-4"
        >
          Generate Timetable
        </button>

        {/* Show Teachers List */}
        <div className="mt-4">
          <h3 className="fw-semibold mb-3">Teachers</h3>
          <ul className="list-group">
            {(teachers || []).map((t, i) => (
              <li key={i} className="list-group-item bg-white border rounded shadow-sm">
                <strong>{t.first_name} {t.last_name}</strong> -{" "}
                {courses
                  .filter((c) => c.teacher === t.id)
                  .map((c) => c.name)
                  .join(", ")}
              </li>
            ))}
          </ul>
        </div>

        {/* Generated Timetable */}
        {timetable && (
          <div className="mt-5">
            <h3 className="fw-semibold mb-3">Generated Timetable</h3>
            {timetable.length === 0 ? (
              <p className="text-muted">No timetable generated. Please try again.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-light">
                    <tr>
                      {Object.keys(timetable[0] || {}).map((col, i) => (
                        <th key={i}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(timetable || []).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row || {}).map((val, j) => (
                          <td key={j}>
                            {typeof val === "object" && val !== null
                              ? JSON.stringify(val)
                              : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateTimeTable;