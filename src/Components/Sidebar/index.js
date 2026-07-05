import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaTasks, FaChartBar } from "react-icons/fa";


const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
  { label: "Employees", path: "/employees", icon: <FaUsers /> },
  { label: "Tasks", path: "/tasks", icon: <FaTasks /> },
  { label: "Reports", path: "/reports", icon: <FaChartBar /> },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="sidebar d-flex flex-column">
      <div className="sidebar-brand d-flex align-items-center gap-2 px-3">
        <div className="sidebar-logo d-flex align-items-center justify-content-center">
          T
        </div>
        <span className="text-white fw-semibold fs-6">TaskFlow</span>
      </div>

      <Nav className="flex-column p-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Nav.Link
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active" : ""
              }`}
            >
              {item.icon} {item.label}
            </Nav.Link>
          );
        })}
      </Nav>

      <div className="sidebar-footer mt-auto px-3 py-3">
        © {new Date().getFullYear()} TaskFlow Inc.
      </div>
    </div>
  );
};

export default Sidebar;