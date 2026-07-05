import React from "react";
import { Row, Col, Form } from "react-bootstrap";

const ReportFilter = ({
  status,
  setStatus,
  employeeId,
  setEmployeeId,
  employees,
}) => {
  return (
    <Row className="mb-4">

      {/* Status Filter */}

      <Col lg={3} md={6}>

        <Form.Group>

          <Form.Label>Status</Form.Label>

          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </Form.Select>

        </Form.Group>

      </Col>

      {/* Employee Filter */}

      <Col lg={3} md={6}>

        <Form.Group>

          <Form.Label>Employee</Form.Label>

          <Form.Select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            <option value="all">
              All Employees
            </option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.first_name} {employee.last_name}
              </option>
            ))}

          </Form.Select>

        </Form.Group>

      </Col>

    </Row>
  );
};

export default ReportFilter;