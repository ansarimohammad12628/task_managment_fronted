import React, { useState } from "react";
import {  FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import DynamicTable from "../../Components/DynamicTable";
import UpdateEmployee from "./EditEmployee";
import { Button } from "react-bootstrap";

// A small fixed palette for avatar chips — picked to stay on-brand
// with the module theme instead of a random hash-to-hue.
const AVATAR_COLORS = [
  "#4F46E5",
  "#0D9488",
  "#B8860B",
  "#E4483A",
  "#2563EB",
  "#7C3AED",
];

const getAvatarColor = (seed = "") => {
  const code = seed
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

const getInitials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatSalary = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (isNaN(num)) return value;
  return `₹${num.toLocaleString("en-IN")}`;
};

const EmployeeDataTable = ({ employees, loading, setUpdatedEmployeeTable }) => {
  const [showEmployee, setShowEmployee] = useState(false);
  const [tableRowData, setTableRowData] = useState({});

  const handleShowEmployee = () => setShowEmployee(true);
  const handleCloseEmployee = () => setShowEmployee(false);

  // ================= Edit =================

  const handleEdit = (row) => {
    setTableRowData(row);
    handleShowEmployee();
  };

  // ================= Delete =================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Employee?",
      text: "This employee will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e4483a",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.delete(`/employee/deleteEmployee/${id}`);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          timer: 1200,
          showConfirmButton: false,
        });

        setUpdatedEmployeeTable(new Date().getTime());
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  // ================= Status =================

  // const handleStatus = async (id) => {
  //   const status = id.status === 1 ? 0 : 1;

  //   const result = await Swal.fire({
  //     title: "Change Status?",
  //     text: "Do you want to update employee status?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     confirmButtonColor: "#4f46e5",
  //   });

  //   if (!result.isConfirmed) return;

  //   try {
  //     const res = await axiosInstance.put(
  //       `/employee/updateEmployeeStatus/${id}`,
  //       {
  //         status,
  //       }
  //     );

  //     if (res.data.success) {
  //       Swal.fire({
  //         icon: "success",
  //         title: res.data.message,
  //         timer: 1200,
  //         showConfirmButton: false,
  //       });

  //       setUpdatedEmployeeTable(new Date().getTime());
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleStatus = async (employee) => {
    const status = employee.status === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "Change Status?",
      text: "Do you want to update employee status?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#4f46e5",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.put(
        `/employee/updateEmployeeStatus/${employee.id}`,
        {
          status,
        },
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          timer: 1200,
          showConfirmButton: false,
        });

        setUpdatedEmployeeTable(new Date().getTime());
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  // ================= Columns =================

  const columns = [
    {
      field: "first_name",
      header: "Employee",
      style: { minWidth: "220px" },
      body: (rowData) => (
        <div className="employee-cell">
          <div
            className="employee-avatar"
            style={{
              background: getAvatarColor(
                `${rowData.first_name}${rowData.last_name}`,
              ),
            }}
          >
            {getInitials(rowData.first_name, rowData.last_name)}
          </div>

          <div>
            <div className="employee-name">
              {rowData.first_name} {rowData.last_name}
            </div>
            <div className="employee-email">{rowData.email}</div>
          </div>
        </div>
      ),
    },
    {
      field: "phone",
      header: "Phone",
    },
    {
      field: "designation",
      header: "Role",
      style: { minWidth: "170px" },
      body: (rowData) => (
        <div>
          <div className="role-title">{rowData.designation}</div>
          <div className="role-department">{rowData.department}</div>
        </div>
      ),
    },
    {
      field: "salary",
      header: "Salary",
      body: (rowData) => formatSalary(rowData.salary),
    },
    {
      field: "joining_date",
      header: "Joining Date",
      body: (rowData) => formatDate(rowData.joining_date),
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <div className="form-check form-switch m-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={rowData.status === 1}
              onChange={() => handleStatus(rowData)}
              style={{
                cursor: "pointer",
                width: "45px",
                height: "22px",
              }}
            />
          </div>

          <span
            style={{
              fontWeight: "600",
              color: rowData.status === 1 ? "#198754" : "#dc3545",
            }}
          >
            {rowData.status === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      header: "Updated At",
      body: (rowData) => formatDate(rowData.updated_at),
    },
    {
      header: "Action",
      body: (rowData) => (
        <div className="action-group">
          <Button
            variant="warning"
            size="sm"
            title="Edit employee"
            onClick={() => handleEdit(rowData)}
          >
            <FaEdit />
          </Button>

          <Button
            variant="danger"
            size="sm"
            title="Delete employee"
            onClick={() => handleDelete(rowData.id)}
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DynamicTable data={employees} columns={columns} loading={loading} />

      <UpdateEmployee
        showEmployee={showEmployee}
        handleCloseEmployee={handleCloseEmployee}
        tableRowData={tableRowData}
        setUpdatedEmployeeTable={setUpdatedEmployeeTable}
      />
    </>
  );
};

export default EmployeeDataTable;
