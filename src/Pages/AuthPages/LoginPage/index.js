import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);



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

                <Form.Group className="mb-3">

                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  label="Remember Me"
                  name="remember_me"
                  checked={loginData.remember_me}
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Please Wait..." : "Login"}
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