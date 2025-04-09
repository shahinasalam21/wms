import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, ListGroup, Button, Alert, Spinner } from "react-bootstrap";

function EmployeeMeetings() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const employeeId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!employeeId || employeeId === "undefined") {
            setError("Employee ID is missing. Please log in again.");
            setLoading(false);
            return;
        }
        if (!token) {
            setError("Authentication token is missing. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchMeetings = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/meeting/employee/${employeeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setMeetings(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching meetings:", error);
                setError("Failed to load meetings. Please try again later.");
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [employeeId, token]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your meetings...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 px-5">
            <Row className="mb-4">
                <Col>
                    <div style={{ backgroundColor: '#e6f2ff' }} className="text-white p-4 rounded shadow w-100">
                        <h1
                            className="display-6 mb-1"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
                        >
                            📅 YOUR MEETINGS
                        </h1>
                        <p
                            className="lead mb-0"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        >
                            View and manage your scheduled meetings!
                        </p>
                    </div>
                </Col>
            </Row>

            {error && (
                <Row>
                    <Col>
                        <Alert variant="danger">{error}</Alert>
                    </Col>
                </Row>
            )}

            <Row>
                <Col>
                    {meetings.length > 0 ? (
                        <Card className="shadow-sm">
                            <ListGroup variant="flush">
                                {meetings.map((meeting) => (
                                    <ListGroup.Item key={meeting.id} className="p-4 border-bottom">
                                        <Row className="align-items-center">
                                            <Col md={8}>
                                                <h4 className="text-primary mb-2">{meeting.title}</h4>
                                                <div className="d-flex align-items-center text-muted">
                                                    <span className="me-2">🕒</span>
                                                    <span>
                                                        {formatDate(meeting.start_time)} - {formatDate(meeting.end_time)}
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col md={4} className="text-md-end mt-3 mt-md-0">
                                                {new Date(meeting.end_time) > new Date() ? (
                                                    <Button
                                                        variant="outline-primary"
                                                        href={meeting.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4"
                                                    >
                                                        🔗 Join Meeting
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline-secondary" disabled className="px-4">
                                                        ✅ Meeting Ended
                                                    </Button>
                                                )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    ) : (
                        <Card className="shadow-sm text-center p-5">
                            <Card.Body>
                                <h4 className="text-muted mb-3">No meetings scheduled</h4>
                                <p className="text-muted">You don't have any upcoming meetings at this time.</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default EmployeeMeetings;
