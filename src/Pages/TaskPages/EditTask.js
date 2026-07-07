import { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import axiosInstance from "../../axios";

// Same pattern as AppBannerList: read token the way the rest of the app
// stores it (localStorage / context / redux). Update if needed.
const getAuthToken = () => localStorage.getItem("token");

const initialState = {
  employee_id: "",
  title: "",
  description: "",
  priority: "",
  status: "",
  start_date: "",
  due_date: "",
};

const EditTask = ({ show, handleClose, taskId, getAllTasks }) => {
  const [formData, setFormData] = useState(initialState);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [attachment, setAttachment] = useState(null); // newly selected file (File object)

  // oldAttachment holds the preview info for the file already saved on the task
  // { url: <blob object url>, type: <mime type>, name: <original path/name> }
  const [oldAttachment, setOldAttachment] = useState(null);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  // keep track of every blob url created, so we can revoke them all on cleanup
  const objectUrlsRef = useRef([]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     if (show && taskId) {
  //       await getEmployees();
  //       await getTaskById();
  //     }
  //   };

  //   loadData();

  //   return () => {
  //     resetAttachmentState();
  //   };
  // }, [show, taskId,getTaskById(())]);

  const resetAttachmentState = () => {
    setAttachment(null);
    setOldAttachment(null);

    // revoke every blob url we created for this task, then clear the list
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
  };

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

useEffect(() => {
  const loadData = async () => {
    if (!show || !taskId) return;

    await getEmployees();

    try {
      setLoading(true);

      const res = await axiosInstance.get(`/task/getTaskById/${taskId}`);

      if (res.data.success) {
        const task = res.data.data[0];

        setFormData({
          employee_id: Number(task.employee_id),
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "",
          status: task.status || "",
          start_date: task.start_date
            ? task.start_date.split("T")[0]
            : "",
          due_date: task.due_date
            ? task.due_date.split("T")[0]
            : "",
        });

        if (task.attachment) {
          fetchOldAttachment(taskId);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  loadData();

  return () => {
    resetAttachmentState();
  };
}, [show, taskId]);

  // Backend route is JWT protected and streams the raw file (image/pdf) using
  // the task id, so we fetch it as a blob (with an explicit Authorization
  // header, same as AppBannerList) and read its content-type to decide how
  // to render it.
  const fetchOldAttachment = async (id) => {
    try {
      setAttachmentLoading(true);

      const res = await axiosInstance.get(`/task/getTaskAttachmentById/${id}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      const contentType = res.headers["content-type"] || res.data?.type || "";

      const blobUrl = URL.createObjectURL(res.data);
      objectUrlsRef.current.push(blobUrl);

      setOldAttachment({
        url: blobUrl,
        type: contentType,
      });
    } catch (error) {
      console.error("Attachment fetch failed:", error.message);
      setOldAttachment(null);
    } finally {
      setAttachmentLoading(false);
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
        text: "Maximum size is 5 MB.",
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

      const res = await axiosInstance.put(
        `/task/updateTask/${taskId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
        });

        handleClose();
        getAllTasks();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update task.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Decide how to render the existing attachment based on its mime type
  const renderOldAttachmentPreview = () => {
    if (attachmentLoading) {
      return (
        <div className="mt-2 d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Loading attachment...</span>
        </div>
      );
    }

    if (!oldAttachment) return null;

    const isImage = oldAttachment.type?.startsWith("image/");
    const isPdf = oldAttachment.type === "application/pdf";

    return (
      <div className="mt-2">
        <strong>Current File:</strong>

        {isImage && (
          <div className="mt-2">
            <img
              src={oldAttachment.url}
              alt="attachment preview"
              style={{
                maxWidth: "220px",
                maxHeight: "220px",
                objectFit: "contain",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                display: "block",
              }}
            />
          </div>
        )}

        {isPdf && (
          <div className="mt-2">
            <embed
              src={oldAttachment.url}
              type="application/pdf"
              width="100%"
              height="300px"
              style={{ border: "1px solid #dee2e6", borderRadius: "6px" }}
            />
          </div>
        )}

        <div className="mt-1">
          <a href={oldAttachment.url} target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
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
                PDF, JPG, JPEG, PNG (Max 5 MB)
              </Form.Text>

              {/* Show existing attachment preview only if user hasn't picked a new file */}
              {!attachment && renderOldAttachmentPreview()}

              {attachment && (
                <div className="mt-2 text-success">
                  Selected File: <strong>{attachment.name}</strong>
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
            {loading ? "Updating..." : "Update Task"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditTask;
