import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

import axiosInstance from "../../axios";
import TaskDataTable from "./TaskDataTable";
import AddTask from "./AddTask";
import UpdateTask from "./EditTask";

const Task = () => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    useEffect(() => {
        getAllTasks();
    }, []);

    const getAllTasks = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.get("/task/getAllTasks");

            if (res.data.success) {
                setTasks(res.data.data);
            }
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.message ||
                    "Failed to fetch task list.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = () => {
        setShowAddModal(false);
        getAllTasks();
    };

    const handleUpdateSuccess = () => {
        setShowUpdateModal(false);
        setSelectedTaskId(null);
        getAllTasks();
    };

    const handleEdit = (task) => {
        setSelectedTaskId(task.id);
        setShowUpdateModal(true);
    };

    return (
        <Card className="shadow-sm border-0">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="mb-0">Task Management</h2>

                    <Button
                        variant="primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        <FaPlus className="me-2" />
                        Add Task
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <TaskDataTable
                        data={tasks}
                        loading={loading}
                        getAllTasks={getAllTasks}
                        onEdit={handleEdit}
                    />
                )}

                <AddTask
                    show={showAddModal}
                    handleClose={() => setShowAddModal(false)}
                    getAllTasks={handleAddSuccess}
                />

                <UpdateTask
                    show={showUpdateModal}
                    handleClose={() => {
                        setShowUpdateModal(false);
                        setSelectedTaskId(null);
                    }}
                    taskId={selectedTaskId}
                    getAllTasks={handleUpdateSuccess}
                />
            </Card.Body>
        </Card>
    );
};

export default Task;