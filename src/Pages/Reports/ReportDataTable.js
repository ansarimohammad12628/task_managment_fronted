import React from "react";
import DynamicTable from "../../Components/DynamicTable";

const ReportDataTable = ({ reports, loading }) => {
  const columns = [
    {
      field: "id",
      header: "ID",
    },
    {
      field: "employee_name",
      header: "Employee",
    },
    {
      field: "title",
      header: "Task",
    },
    {
      field: "description",
      header: "Description",
      body: (rowData) => (
        <div style={{ maxWidth: "250px" }}>
          {rowData.description}
        </div>
      ),
    },
    {
      field: "priority",
      header: "Priority",
      body: (rowData) => (
        <span
          className={`status-badge ${
            rowData.priority === "High"
              ? "in-active"
              : rowData.priority === "Medium"
              ? "pending"
              : "active"
          }`}
        >
          {rowData.priority}
        </span>
      ),
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <span
          className={`status-badge ${
            rowData.status === "Completed"
              ? "active"
              : rowData.status === "Pending"
              ? "pending"
              : "in-progress"
          }`}
        >
          {rowData.status}
        </span>
      ),
    },
    {
      field: "start_date",
      header: "Start Date",
    },
    {
      field: "due_date",
      header: "Due Date",
    },
  ];

  return (
    <DynamicTable
      data={reports}
      columns={columns}
      loading={loading}
    />
  );
};

export default ReportDataTable;