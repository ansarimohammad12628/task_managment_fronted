import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import NotificationDropDown from "./NotifictionDropDown";


const Header = () => {
  return (
    <Navbar className="app-header">
      <Container fluid className="px-4">
        <Navbar.Brand className="header-brand">Task Management</Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-3">
          {/* Notification bell yaha standalone hai */}
          <NotificationDropDown />

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="border-0 bg-transparent d-flex align-items-center"
            >
              <FaUserCircle size={30} color="#6366f1" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;