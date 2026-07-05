import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import axiosInstance from "../../axios";
import ReportDataTable from "./ReportDataTable";
import CONFIG from "../../config";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("all");

  // ============================
  // Get Reports
  // ============================

  const getReports = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/report/taskReport?status=${status}`,
      );

      if (res.data.success) {
        setReports(res.data.data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.log(error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [status]);

  const handleExportExcel = () => {
    window.open(`${CONFIG.BASE_URL}/report/exportExcel?status=${status}`);
  };
  const handleExportCSV = () => {
    window.open(`${CONFIG.BASE_URL}/report/exportCSV?status=${status}`);
  };
  return (
    <div className="module-root">
      {/* Header */}

      <div className="module-header">
        <div>
          <h4 className="module-title">Task Reports</h4>
        </div>
      </div>

      {/* Filters */}

      <Row className="mb-4">
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

        <Col lg={9} className="d-flex justify-content-end align-items-end">
          <Button
            variant="success"
            className="me-2"
            onClick={handleExportExcel}
          >
            <FaFileExcel className="me-2" />
            Export Excel
          </Button>

          <Button variant="primary" onClick={handleExportCSV}>
            <FaFileCsv className="me-2" />
            Export CSV
          </Button>
        </Col>
      </Row>

      {/* Table */}

      <div className="table-card">
        <ReportDataTable reports={reports} loading={loading} />
      </div>
    </div>
  );
};

export default Reports;
