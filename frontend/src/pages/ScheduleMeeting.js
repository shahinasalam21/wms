import { useState, useEffect } from "react";
import axios from "axios";
import "./ScheduleMeeting.css";

function ScheduleMeeting() {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [meetingLink, setMeetingLink] = useState(""); // 🆕 new state
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [error, setError] = useState(null);

    const managerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;

    

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/employees`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployees(response.data);
            } catch (err) {
                setError("Failed to fetch employees. Please try again.");
            }
        };
        fetchEmployees();
    }, [token]);

    const handleEmployeeSelection = (empId) => {
        setSelectedEmployees((prevSelected) =>
            prevSelected.includes(empId)
                ? prevSelected.filter((id) => id !== empId)
                : [...prevSelected, empId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!managerId || !token) {
            setError("Unauthorized: Please log in.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/meeting/create`,
                {
                    manager_id: managerId,
                    title,
                    start_time: startTime,
                    end_time: endTime,
                    meeting_link: meetingLink, // 🆕 pass custom link
                    employee_ids: selectedEmployees,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert(`Meeting Created: ${response.data.meeting_link}`);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create meeting. Try again.");
        }
    };

    return (
        <div>
            <h2 className="text-center fw-bold" style={{ color: "#003366", marginTop: "2rem" }}>
                Schedule a Meeting
            </h2>

            <form onSubmit={handleSubmit} className="meeting-form">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label className="form-label">Start Time:</label>
                <input
                    type="datetime-local"
                    className="input-field"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />

                <label className="form-label">End Time:</label>
                <input
                    type="datetime-local"
                    className="input-field"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />

                <label className="form-label">Google Meet Link:</label>
                <input
                    type="url"
                    className="input-field"
                    placeholder="https://meet.google.com/xyz-abc-def"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    required
                />

                <div className="employee-select-container">
                    <label className="form-label">Select Employees:</label>
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp, index) => (
                                <tr key={emp.id}>
                                    <td>{index + 1}</td>
                                    <td>{emp.name}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(emp.id)}
                                            onChange={() => handleEmployeeSelection(emp.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button type="submit" className="submit-button">Create Meeting</button>
                {error && <p className="error-text">{error}</p>}
            </form>
        </div>
    );
}

export default ScheduleMeeting;

