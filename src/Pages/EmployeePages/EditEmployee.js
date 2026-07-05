import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";

const EditEmployee = ({
  showEmployee,
  handleCloseEmployee,
  tableRowData,
  setUpdatedEmployeeTable,
}) => {
  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joining_date: "",
  });

  useEffect(() => {
    if (tableRowData) {
      setEmployee({
        first_name: tableRowData.first_name || "",
        last_name: tableRowData.last_name || "",
        email: tableRowData.email || "",
        phone: tableRowData.phone || "",
        department: tableRowData.department || "",
        designation: tableRowData.designation || "",
        salary: tableRowData.salary || "",
        joining_date: tableRowData.joining_date || "",
      });
    }
  }, [tableRowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axiosInstance.put(
        `/employee/updateEmployee/${tableRowData.id}`,
        employee
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          timer: 1200,
          showConfirmButton: false,
        });

        handleCloseEmployee();

        setUpdatedEmployeeTable(new Date().getTime());
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showEmployee}
      onHide={handleCloseEmployee}
      centered
      size="lg"
      backdrop="static"
      className="employee-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Employee</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleUpdateEmployee}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={employee.first_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={employee.last_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  value={employee.designation}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={employee.salary}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type="date"
                  name="joining_date"
                  value={employee.joining_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEmployee}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              "Update Employee"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditEmployee;
