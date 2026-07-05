import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import axiosInstance from "../../axios";
import EmployeeDataTable from "./EmployeeDataTable";
import AddEmployee from "./AddEmployee";
// import "./employee.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showEmployee, setShowEmployee] = useState(false);

  const [updatedEmployeeTable, setUpdatedEmployeeTable] = useState("");

  const handleShowEmployee = () => setShowEmployee(true);
  const handleCloseEmployee = () => setShowEmployee(false);

  // ============================
  // Get Employees
  // ============================

  const getEmployees = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/employee/getAllEmployees"
      );

      if (
        res.data.success &&
        Array.isArray(res.data.data)
      ) {
        setEmployees(res.data.data);
      } else {
        setEmployees([]);
      }

    } catch (error) {
      console.log("Employee Error =>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, [updatedEmployeeTable]);

  return (
    <div className="module-root">

      {/* Header */}

      <div className="module-header">

        <div>
          <h4 className="module-title">
            Employee Management
          </h4>
          <p className="module-subtitle">
            {employees.length} {employees.length === 1 ? "employee" : "employees"} on record
          </p>
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowEmployee}
        >
          <FaPlus /> Add Employee
        </Button>

      </div>

      {/* Table */}

      <div className="table-card">

        <EmployeeDataTable
          employees={employees}
          loading={loading}
          setUpdatedEmployeeTable={setUpdatedEmployeeTable}
        />

      </div>

      {/* Add Modal */}

      <AddEmployee
        showEmployee={showEmployee}
        handleCloseEmployee={handleCloseEmployee}
        setUpdatedEmployeeTable={setUpdatedEmployeeTable}
      />

    </div>
  );
};

export default Employees;
