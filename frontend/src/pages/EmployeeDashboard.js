import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge} from 'react-bootstrap';
import { Bell, Calendar, CheckCircle, FileText, User,  Clock } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
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
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/getTask/${employeeId}`, { headers }),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/meeting/emp/employee/${employeeId}`, { headers }),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employees/${employeeId}`, { headers }),
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
        setName(userData.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
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
          {/* 🔔 Notifications */}
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-warning-subtle p-3 me-3">
                    <Bell className="text-warning" size={22} />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">New Updates</h6>
                    <h2 className="mb-0 fw-bold">{tasks.length + meetings.length}</h2>
                  </div>
                </div>
                <div className="text-muted d-flex justify-content-between">
                  <small> Tasks: {tasks.length}</small>
                  <small> Meetings: {meetings.length}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* ✅ Tasks */}
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

          {/* Meetings */}
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-success-subtle p-3 me-3">
                    <Calendar className="text-success" size={22} />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">All Meetings</h6>
                    <h2 className="mb-0 fw-bold">{meetings.length}</h2>
                  </div>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <Clock size={14} className="me-1" />
                  <small>
                    {meetings.length > 0 ? `Next: ${meetings[0].start_time}` : "No meetings yet"}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          {/* Task List */}
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
                        <Badge bg={getPriorityVariant(task.priority)} pill>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Due: {task.due_date}</small>
                        
                      </div>
                    </div>
                  ))}

                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Meeting List */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 fw-bold">
                    <Calendar className="me-2" size={18} /> Meeting Schedule
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
                       
                      </div>
                    </div>
                  ))}
                  {meetings.length === 0 && (
                    <div className="text-center text-muted p-4">
                      No meetings scheduled.
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
