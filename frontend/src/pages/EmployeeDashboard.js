import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge, Button, ProgressBar } from 'react-bootstrap';
import { Bell, Calendar, CheckCircle, FileText, User, ChevronRight, Clock } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notifications] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
  
        if (!token) {
          console.error("No token found. User must log in.");
          return;
        }
  
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
  
        const [taskResponse, meetingResponse, userResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/tasks/getTask/${employeeId}`, { headers }),
          fetch(`http://localhost:5000/api/meeting/emp/employee/${employeeId}`, { headers }),
          fetch(`http://localhost:5000/api/employees/${employeeId}`, { headers }), // Add your actual endpoint here
        ]);
  
        if (!taskResponse.ok || !meetingResponse.ok || !userResponse.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const [taskData, meetingData, userData] = await Promise.all([
          taskResponse.json(),
          meetingResponse.json(),
          userResponse.json(),
        ]);
  
        setTasks(taskData);
        setMeetings(meetingData);
        setName(userData.name); // Save employee name
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "primary";
      case "To Do":
        return "secondary";
      default:
        return "light";
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Container fluid className="py-4">
        <header className="mb-4">
          <h1 className="h3 mb-0 fw-bold">Employee Dashboard</h1>
          <p className="text-muted">Welcome back, {name || "Employee"}! Here's your activity summary.</p>

        </header>

        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-primary-subtle p-3 me-3">
                    <CheckCircle className="text-primary" size={22} />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Total Tasks</h6>
                    <h2 className="mb-0 fw-bold">{tasks.length}</h2>
                  </div>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <small>{tasks.filter(t => t.status === "Completed").length} Completed</small>
                  <small>{tasks.filter(t => t.status === "In Progress").length} In Progress</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-success-subtle p-3 me-3">
                    <Calendar className="text-success" size={22} />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Today's Meetings</h6>
                    <h2 className="mb-0 fw-bold">{meetings.length}</h2>
                  </div>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <Clock size={14} className="me-1" />
                  <small>
                    {meetings.length > 0 ? `Next meeting: ${meetings[0].time}` : "No meetings today"}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-warning-subtle p-3 me-3">
                    <Bell className="text-warning" size={22} />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Notifications</h6>
                    <h2 className="mb-0 fw-bold">{notifications.length}</h2>
                  </div>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <small>{notifications.filter(n => n.isNew).length} unread notifications</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={7}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 fw-bold">
                    <FileText className="me-2" size={18} /> My Tasks
                  </h5>
                </div>
                <div className="task-list">
                  {tasks.map(task => (
                    <div key={task.id} className="p-3 border-bottom">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="mb-0">{task.title}</h6>
                        <Badge bg={getStatusVariant(task.status)} pill>
                          {task.status}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Due: {task.dueDate}</small>
                        <div style={{ width: '40%' }}>
                          <ProgressBar
                            now={task.progress}
                            variant={getStatusVariant(task.status)}
                            className="mb-1"
                            style={{ height: '6px' }}
                          />
                          <div className="d-flex justify-content-end">
                            <small className="text-muted">{task.progress}%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 fw-bold">
                    <Calendar className="me-2" size={18} /> Today's Schedule
                  </h5>
                </div>
                <div className="meeting-list">
                {meetings.map(meeting => (
                    <div key={meeting.id} className="p-3 border-bottom">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="mb-0">{meeting.title}</h6>
                        <small className="text-muted">{meeting.time}</small>
                      </div>
                      <p className="mb-1 text-muted">{meeting.description}</p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center text-muted">
                          <User size={14} className="me-1" />
                          <small>{meeting.organizer}</small>
                        </div>
                        <Button variant="outline-primary" size="sm">
                          Join <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {meetings.length === 0 && (
                    <div className="text-center text-muted p-4">
                      No meetings scheduled for today.
                    </div>
                  )}

                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmployeeDashboard;
