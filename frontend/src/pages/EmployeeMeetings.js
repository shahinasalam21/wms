import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeMeetings() {
    const [meetings, setMeetings] = useState([]);
    
    // ✅ Ensure employeeId is correctly retrieved
    const employeeId = localStorage.getItem("userId");

    useEffect(() => {
        console.log("Stored Employee ID:", employeeId); // ✅ Debugging

        if (!employeeId || employeeId === "undefined") {
            console.error("🚨 Error: Employee ID is missing.");
            return;
        }

        const fetchMeetings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/meeting/employee/${employeeId}`);
                setMeetings(response.data);
            } catch (error) {
                console.error("❌ Error fetching meetings:", error);
            }
        };
        
        fetchMeetings();
    }, [employeeId]);

    return (
        <div>
            <h2>Your Meetings</h2>
            <ul>
                {meetings.length > 0 ? meetings.map((meeting) => (
                    <li key={meeting.id}>
                        <strong>{meeting.title}</strong> <br />
                        📅 {new Date(meeting.start_time).toLocaleString()} - {new Date(meeting.end_time).toLocaleString()} <br />
                        🔗 <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer">Join Meeting</a>
                    </li>
                )) : <p>No meetings found.</p>}
            </ul>
        </div>
    );
}

export default EmployeeMeetings;
