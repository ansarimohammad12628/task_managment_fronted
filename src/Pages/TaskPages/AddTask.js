import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

import axiosInstance from "../../axios";

const AddTask = ({ show, handleClose, getAllTasks }) => {
  const initialState = {
    employee_id: "",
    title: "",
    description: "",
    priority: "",
    status: "",
    start_date: "",
    due_date: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (show) {
      getEmployees();
    }
  }, [show]);

  const getEmployees = async () => {
    try {
      const res = await axiosInstance.get("/employee/getAllEmployees");

      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only PDF, JPG, JPEG and PNG files are allowed.",
      });

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Maximum file size is 5 MB.",
      });

      e.target.value = "";
      return;
    }

    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.employee_id ||
      !formData.title ||
      !formData.priority ||
      !formData.status ||
      !formData.start_date ||
      !formData.due_date
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation",
        text: "Please fill all required fields.",
      });

      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("employee_id", formData.employee_id);
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("priority", formData.priority);
      payload.append("status", formData.status);
      payload.append("start_date", formData.start_date);
      payload.append("due_date", formData.due_date);

      if (attachment) {
        payload.append("attachment", attachment);
      }

      const res = await axiosInstance.post("/task/addTask", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
        });

        setFormData(initialState);
        setAttachment(null);
        handleClose();
        getAllTasks();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add task.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Employee</Form.Label>

              <Form.Select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
              >
                <option value="">Select Employee</option>

                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Title</Form.Label>

              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Col>

            <Col md={12} className="mb-3">
              <Form.Label>Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Priority</Form.Label>

              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">Select Priority</option>

                <option value="Low">Low</option>

                <option value="Medium">Medium</option>

                <option value="High">High</option>
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Status</Form.Label>

              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>

                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Completed">Completed</option>
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Start Date</Form.Label>

              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Due Date</Form.Label>

              <Form.Control
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </Col>

            <Col md={12} className="mb-3">
              <Form.Label>Attachment</Form.Label>

              <Form.Control
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleAttachment}
              />

              <Form.Text className="text-muted">
                Accept PDF, JPG, JPEG and PNG files up to 5 MB.
              </Form.Text>

              {attachment && (
                <div className="mt-2 text-success">
                  Selected File : {attachment.name}
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Task"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddTask;
