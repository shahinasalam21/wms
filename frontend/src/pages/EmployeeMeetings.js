import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeMeetings() {
    const [meetings, setMeetings] = useState([]);
    
    const employeeId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // ✅ Get the JWT token

    useEffect(() => {
        console.log("Stored Employee ID:", employeeId); 

        if (!employeeId || employeeId === "undefined") {
            console.error("🚨 Error: Employee ID is missing.");
            return;
        }

        if (!token) {
            console.error("🚨 Error: Token is missing. User must log in.");
            return;
        }
        //dispalying meetings for employee
        const fetchMeetings = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/meeting/employee/${employeeId}`,
                    { 
                        headers: { 
                            Authorization: `Bearer ${token}`, // ✅ Include the token
                            "Content-Type": "application/json"
                        } 
                    }
                );
                setMeetings(response.data);
            } catch (error) {
                console.error("Error fetching meetings:", error);
            }
        };
        
        fetchMeetings();
    }, [employeeId, token]);

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
