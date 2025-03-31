import { useState, useEffect } from "react";
import axios from "axios";

function ScheduleMeeting() {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [error, setError] = useState(null);

    const managerId = localStorage.getItem("userId"); // ✅ Dynamic Manager ID
    const API_BASE_URL = "http://localhost:5000/api"; // ✅ Replaced the import

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/employees`);
                setEmployees(response.data);
            } catch (err) {
                setError("Failed to fetch employees. Please try again.");
            }
        };
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!managerId) {
            setError("Manager ID is missing. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/meeting/create`, {
                manager_id: managerId, // ✅ Use dynamic ID
                title,
                start_time: startTime,
                end_time: endTime,
                employee_ids: selectedEmployees,
            });

            alert(`Meeting Created: ${response.data.meeting_link}`);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create meeting. Try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

           
            <div className="mb-3">
    <label className="form-label">Select Employees:</label>
    <select 
        multiple 
        className="form-select form-control" 
        style={{ height: "250px", overflowY: "auto" }} 
        onChange={(e) => setSelectedEmployees([...e.target.selectedOptions].map(opt => opt.value))}
    >
        {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
        ))}
    </select>
</div>


            <button type="submit">Create Meeting</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}

export default ScheduleMeeting;
