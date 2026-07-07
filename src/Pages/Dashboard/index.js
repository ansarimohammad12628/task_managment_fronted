import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import axiosInstance from "../../axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    recentTasks: [],
  });

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/dashboard/getDashboard"
      );

      if (response.data.success) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Employees",
      count: dashboard.totalEmployees,
      icon: <FaUsers size={35} />,
      color: "primary",
    },
    {
      title: "Total Tasks",
      count: dashboard.totalTasks,
      icon: <FaTasks size={35} />,
      color: "success",
    },
    {
      title: "Completed Tasks",
      count: dashboard.completedTasks,
      icon: <FaCheckCircle size={35} />,
      color: "warning",
    },
    {
      title: "Pending Tasks",
      count: dashboard.pendingTasks,
      icon: <FaClock size={35} />,
      color: "danger",
    },
  ];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid>

      <h2 className="fw-bold mb-4">
        Dashboard
      </h2>

      <Row>

        {cards.map((item, index) => (

          <Col lg={3} md={6} sm={12} key={index} className="mb-4">

            <Card className={`shadow-sm border-${item.color}`}>

              <Card.Body>

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>{item.title}</h6>

                    <h2>{item.count}</h2>

                  </div>

                  <div className={`text-${item.color}`}>
                    {item.icon}
                  </div>

                </div>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

      <Row>

        <Col lg={12}>

          <Card className="shadow-sm">

            <Card.Body>

              <h5 className="mb-3">
                Recent Tasks
              </h5>

              <Table responsive hover>

                <thead>

                  <tr>

                    <th>Employee</th>

                    <th>Task</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {
                    dashboard.recentTasks.length > 0 ?

                      dashboard.recentTasks.map((task) => (

                        <tr key={task.id}>

                          <td>{task.employee_name}</td>

                          <td>{task.title}</td>

                          <td>

                            <span
                              className={`badge
                              ${
                                task.status === "Completed"
                                  ? "bg-success"
                                  : task.status === "Pending"
                                  ? "bg-warning text-dark"
                                  : "bg-primary"
                              }`}
                            >
                              {task.status}
                            </span>

                          </td>

                        </tr>

                      ))

                      :

                      <tr>

                        <td
                          colSpan={3}
                          className="text-center"
                        >
                          No Tasks Found
                        </td>

                      </tr>

                  }

                </tbody>

              </Table>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
};

export default Dashboard;