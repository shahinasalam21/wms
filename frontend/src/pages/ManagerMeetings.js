import { useEffect, useState } from "react";
import axios from "axios";
import "./ManagerMeetings.css";

function ManagerMeetings() {
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState(null);

    // Get managerId and token from localStorage
    const managerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // ✅ Get the JWT token

    useEffect(() => {
        if (!managerId || !token) {
            setError("Unauthorized: Please log in again.");
            return;
        }

        const fetchMeetings = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/meeting/manager/${managerId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }, // ✅ Add the Authorization header
                    }
                );
                setMeetings(response.data);
            } catch (error) {
                console.error("Error fetching meetings:", error);
                setError(error.response?.data?.error || "Failed to load meetings.");
            }
        };

        fetchMeetings();
    }, [managerId, token]);

    return (
        <div className="manager-meetings">  
            <h2>Scheduled Meetings</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {meetings.length > 0 ? (
                    meetings.map((meeting) => (
                        <li key={meeting.id}>
                            <strong>{meeting.title}</strong> <br />
                            📅 {new Date(meeting.start_time).toLocaleString()} - {new Date(meeting.end_time).toLocaleString()} <br />
                            👥 Participants: {meeting.employees?.join(", ") || "None"} <br />
                            🔗 <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer">Join Meeting</a>
                        </li>
                    ))
                ) : (
                    <p>No meetings scheduled.</p>
                )}
            </ul>
        </div>
    );
}

export default ManagerMeetings;
