import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../Components/Header/index";
import Sidebar from "../Components/Sidebar/index";

const MainLayouts = () => {
  return (
    <div style={{ overflowX: "hidden", width: "100vw", maxWidth: "100%" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          minHeight: "100vh",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <Header />

        <div style={{ padding: "1.5rem", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayouts;