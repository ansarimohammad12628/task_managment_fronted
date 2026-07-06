import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../../../axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../ReduxManager/action";
import Swal from "sweetalert2";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/authentication/login",
        loginData
      );

      if (response.data.status === 1) {
        dispatch(loginUser(response.data.data));

        localStorage.setItem(
          "token",
          response.data.data.token
        );

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message,
          confirmButtonColor: "#0d6efd",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
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
        <Col lg={4} md={6} sm={10}>
          <Card className="auth-card">
            <Card.Body>

              <h2 className="text-center mb-4">
                Login
              </h2>

              <Form onSubmit={handleSubmit}>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    name="email"
                    value={loginData.email}
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
                      placeholder="Enter Password"
                      name="password"
                      value={loginData.password}
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

                {/* Remember Me */}
                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  label="Remember Me"
                  name="remember_me"
                  checked={loginData.remember_me}
                  onChange={handleChange}
                />

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Please Wait..."
                    : "Login"}
                </Button>

              </Form>

              <div className="text-center mt-3">
                Don't have an account?

                <Link
                  to="/register"
                  className="ms-2"
                >
                  Register
                </Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;