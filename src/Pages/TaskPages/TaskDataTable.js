import Swal from "sweetalert2";
import { Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaBan } from "react-icons/fa";

import axiosInstance from "../../axios";
import DynamicTable from "../../Components/DynamicTable";

const TaskDataTable = ({
    data,
    loading,
    getAllTasks,
    onEdit,
}) => {

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
            const res = await axiosInstance.delete(
                `/task/deleteTask/${id}`
            );

            if (res.data.success) {
                Swal.fire(
                    "Deleted!",
                    res.data.message,
                    "success"
                );

                getAllTasks();
            }
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message ||
                    "Something went wrong.",
                "error"
            );
        }
    };

    const handleStatus = async (id) => {
        try {
            const res = await axiosInstance.put(
                `/task/updateTaskStatus/${id}`
            );

            if (res.data.success) {
                Swal.fire(
                    "Success",
                    res.data.message,
                    "success"
                );

                getAllTasks();
            }
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message ||
                    "Failed to update status.",
                "error"
            );
        }
    };

    const priorityBody = (rowData) => {
        switch (rowData.priority) {
            case "High":
                return <Badge bg="danger">High</Badge>;

            case "Medium":
                return <Badge bg="warning">Medium</Badge>;

            default:
                return <Badge bg="success">Low</Badge>;
        }
    };

    const statusBody = (rowData) => {
        return rowData.status ? (
            <Badge bg="success">Completed</Badge>
        ) : (
            <Badge bg="secondary">Pending</Badge>
        );
    };

    const actionBody = (rowData) => (
        <div className="d-flex gap-2">
            <Button
                variant="warning"
                size="sm"
                onClick={() => onEdit(rowData)}
            >
                <FaEdit />
            </Button>

            <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatus(rowData.id)}
            >
                <FaBan />
            </Button>

            <Button
                variant="danger"
                size="sm"
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
        },
        {
            field: "priority",
            header: "Priority",
            body: priorityBody,
            sortable: true,
        },
        {
            field: "status",
            header: "Status",
            body: statusBody,
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
            style: {
                width: "170px",
            },
        },
    ];

    return (
        <DynamicTable
            columns={columns}
            data={data}
            loading={loading}
        />
    );
};

export default TaskDataTable;