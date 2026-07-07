import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

import axiosInstance from "../../axios";
import DynamicTable from "../../Components/DynamicTable";
import { Button } from "react-bootstrap";

const TaskDataTable = ({ data, loading, getAllTasks, onEdit }) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Task?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.delete(`/task/deleteTask/${id}`);

      if (res.data.success) {
        Swal.fire("Deleted!", res.data.message, "success");
        getAllTasks();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong.",
        "error",
      );
    }
  };

  const priorityBody = (rowData) => {
    const level = (rowData.priority || "").toLowerCase();
    return (
      <span className={`priority-badge ${level}`}>{rowData.priority}</span>
    );
  };

  const actionBody = (rowData) => (
    <div className="action-group">
      <Button
        variant="warning"
        size="sm"
        title="Edit employee"
        onClick={() =>onEdit(rowData)}
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
  );

  const columns = [
    {
      field: "id",
      header: "ID",
      sortable: true,
    },
    {
      field: "employee_name",
      header: "Employee",
      sortable: true,
    },
    {
      field: "title",
      header: "Title",
      sortable: true,
    },
    {
      field: "description",
      header: "Description",
      sortable: false,
    },
    {
      field: "priority",
      header: "Priority",
      body: priorityBody,
      sortable: true,
    },
    {
      field: "start_date",
      header: "Start Date",
      sortable: true,
    },
    {
      field: "due_date",
      header: "Due Date",
      sortable: true,
    },
    {
      field: "created_at",
      header: "Created At",
      sortable: true,
    },
    {
      field: "updated_at",
      header: "Updated At",
      sortable: true,
    },
    {
      field: "action",
      header: "Action",
      body: actionBody,
      style: { width: "120px" },
    },
  ];

  return <DynamicTable columns={columns} data={data} loading={loading} />;
};

export default TaskDataTable;
