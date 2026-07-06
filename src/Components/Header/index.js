import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NotificationDropDown from "./NotifictionDropDown";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // Token Remove
      localStorage.removeItem("token");

      // Agar future me aur data store ho to
      // localStorage.clear();

      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <Navbar className="app-header">
      <Container fluid className="px-4">
        <Navbar.Brand className="header-brand">
          Task Management
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-3">

          {/* Notification */}
          <NotificationDropDown />

          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="border-0 bg-transparent d-flex align-items-center"
            >
              <FaUserCircle
                size={30}
                color="#6366f1"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                Profile
              </Dropdown.Item>

              <Dropdown.Item>
                Settings
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                className="text-danger"
                onClick={handleLogout}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;