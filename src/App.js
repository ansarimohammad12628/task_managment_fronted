import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import Login from "./Pages/AuthPages/LoginPage/index";
import Register from "./Pages/AuthPages/RegisterPage/index";

import MainLayouts from "./Layouts/MainLayouts";
import Dashboard from "./Pages/Dashboard/index";
import Employees from "./Pages/EmployeePages/Index";
import Task from "./Pages/TaskPages/index";
import Reports from "./Pages/Reports/index";

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayouts />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/employees" element={<Employees />} />

          <Route path="/tasks" element={<Task />} />

          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
