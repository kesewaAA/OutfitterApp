// src/pages/Auth.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../utils/auth"; // keep your existing functions
import './Auth.css'; // Import the new CSS file

function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // only for signup
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signup") {
        await signupUser(name, email, password);
      } else {
        await loginUser(email, password);
      }

      // Simulate a successful login by setting a flag and navigating
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");

    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className="auth-container">
      <h1>{mode === "signin" ? "Sign In" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{mode === "signin" ? "Sign In" : "Create Account"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />
      <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
        {mode === "signin" ? "Switch to Sign Up" : "Switch to Sign In"}
      </button>
    </div>
  );
}

export default Auth;
