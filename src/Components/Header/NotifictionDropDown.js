import { useEffect, useState } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { FaBell, FaTrash } from "react-icons/fa";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";

const NotificationDropDown = () => {
  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    try {
      const res = await axiosInstance.get(
        "/notification/getAllNotifications"
      );

      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  // Read Notification
  const handleRead = async (id) => {
    try {
      await axiosInstance.put(
        `/notification/readNotification/${id}`
      );

      getNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Notification
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Notification?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(
        `/notification/deleteNotification/${id}`
      );

      getNotifications();

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const unreadCount = notifications.filter(
    (item) => item.is_read === 0
  ).length;

  return (
    <Dropdown align="end">

      <Dropdown.Toggle
        variant="light"
        id="notification-dropdown"
        className="border-0 bg-transparent position-relative"
      >
        <FaBell size={22} />

        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          width: "350px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Dropdown.Header>
          Notifications
        </Dropdown.Header>

        {notifications.length === 0 ? (
          <div className="text-center p-3">
            No Notifications
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="border-bottom p-3"
            >
              <div className="d-flex justify-content-between">

                <div
                  style={{ cursor: "pointer", flex: 1 }}
                  onClick={() => handleRead(item.id)}
                >
                  <strong>{item.title}</strong>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                    }}
                  >
                    {item.message}
                  </div>

                  <small className="text-muted">
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </small>

                  {item.is_read === 0 && (
                    <Badge bg="primary" className="ms-2">
                      New
                    </Badge>
                  )}
                </div>

                <FaTrash
                  color="red"
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={() =>
                    handleDelete(item.id)
                  }
                />

              </div>
            </div>
          ))
        )}
      </Dropdown.Menu>

    </Dropdown>
  );
};

export default NotificationDropDown;