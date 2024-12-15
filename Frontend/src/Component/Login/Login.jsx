import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory for redirection
import "./Login.css";
import SignUp from "../SignUp/SignUp";
import { postData } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useHistory hook for navigation

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Email is required";
    if (!loginData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await postData("/user/login", loginData); // Update the endpoint as necessary
        const token = response.token; // Adjust based on the actual response structure
        toast.success("Login successful!");
        localStorage.setItem("token", token); // Save the token in localStorage
        navigate("/dashboard"); // Redirect to home page
      } catch (error) {
        console.error("Login failed:", error.message);
        toast.error(`Login failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoginErrors(validationErrors);
    }
  };

  return (
    <div className="main_login">
      <ToastContainer />
      <div className="main">
        <div className="all_content">
          <div className="Quiz_parent">
            <p className="Quiz">QUIZZIE</p>
          </div>
          <div className="btns">
            <button
              className={`btn ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
              disabled={loading}
            >
              Sign Up
            </button>
            <button
              className={`btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
              disabled={loading}
            >
              Login
            </button>
          </div>
          <div>
            {activeTab === "signup" ? (
              <SignUp setActiveTab={setActiveTab} />
            ) : (
              <form className="form" onSubmit={handleLoginSubmit}>
                <div className="email_Box">
                  <p className="email">Email</p>
                  <input
                    type="text"
                    name="email"
                    className="input"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder={loginErrors.email || "Enter your email"}
                    disabled={loading}
                  />
                </div>
                <div className="email_Box">
                  <p className="email">Password</p>
                  <input
                    type="password"
                    name="password"
                    className="input"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder={loginErrors.password || "Enter your password"}
                    disabled={loading}
                  />
                </div>
                <div className="btns">
                  <button className="Login" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
