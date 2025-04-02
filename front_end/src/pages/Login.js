import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Input
  const validateInput = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage("Email and Password are required!");
      return false;
    }
    if (isRegister && !formData.username) {
      setErrorMessage("Username is required for registration!");
      return false;
    }
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateInput()) return; // Validate input before submitting

    setLoading(true); // Show loading state
    const endpoint = isRegister ? "register" : "login";

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(data.message);

      // On Success
      if (!isRegister) {
        login(data.token); // Save token in context
        localStorage.setItem("token", data.token); // Store token in local storage
        navigate("/");
      } else {
        alert("Registration successful! Please login.");
        setIsRegister(false);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={isRegister}
              />
            </div>
          )}
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;
