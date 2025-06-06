import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(null);
  const navigate = useNavigate();

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(null);

    if (!username || !password) {
      handleShowAlert("Please fill in all fields", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        handleShowAlert(data.error || "Login failed.", "danger");
        return;
      }

      const data = await response.json();

      if (!data.token) {
        handleShowAlert("Login failed. No token recieved.", "danger");
        return;
      }

      localStorage.setItem("jwtToken", data.token);
      handleShowAlert("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/posts");
      }, 3000);
    } catch (error) {
      console.error("Failed to login:", error.message);
      handleShowAlert("Failed to login.", "danger");
    }
  };

  return (
    <>
      <h1>Login</h1>
      {showAlert && (
        <Alert variant={showAlert.variant}>{showAlert.message}</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}
