import React, { useState } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../../../axios";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "Admin",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirm_password) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Password and Confirm Password do not match.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/authentication/register",
        registerData
      );

      if (response.data.status === 1) {
        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: response.data.message,
          confirmButtonColor: "#0d6efd",
        });

        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.data.message,
          confirmButtonColor: "#0d6efd",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong.",
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col lg={5} md={7}>
          <Card className="auth-card">
            <Card.Body>
              <h2 className="text-center mb-4">
                Register
              </h2>

              <Form onSubmit={handleSubmit}>
                {/* Full Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>

                  <Form.Control
                    type="text"
                    name="full_name"
                    placeholder="Enter Full Name"
                    value={registerData.full_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={registerData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>

                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Password"
                      value={registerData.password}
                      onChange={handleChange}
                      required
                      className="pe-5"
                    />

                    <span
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </span>
                  </div>
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Confirm Password
                  </Form.Label>

                  <div className="position-relative">
                    <Form.Control
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirm_password"
                      placeholder="Confirm Password"
                      value={registerData.confirm_password}
                      onChange={handleChange}
                      required
                      className="pe-5"
                      isInvalid={
                        registerData.confirm_password &&
                        registerData.password !==
                          registerData.confirm_password
                      }
                      isValid={
                        registerData.confirm_password &&
                        registerData.password ===
                          registerData.confirm_password
                      }
                    />

                    <span
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </span>

                    <Form.Control.Feedback type="invalid">
                      Password does not match.
                    </Form.Control.Feedback>

                    <Form.Control.Feedback>
                      Password Matched.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                {/* Role */}
                <Form.Group className="mb-4">
                  <Form.Label>Role</Form.Label>

                  <Form.Select
                    name="role"
                    value={registerData.role}
                    onChange={handleChange}
                  >
                    <option value="Admin">
                      Admin
                    </option>

                    <option value="Employee">
                      Employee
                    </option>
                  </Form.Select>
                </Form.Group>

                {/* Button */}
                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Please Wait..."
                    : "Register"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                Already have an account?

                <Link
                  to="/login"
                  className="ms-2"
                >
                  Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;