// src/pages/Auth.js
import React, { useState } from "react";
import { loginUser, signupUser } from "../utils/auth"; // keep your existing functions

function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // only for signup
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      let data;
      if (mode === "signup") {
        data = await signupUser(name, email, password); // your existing signupUser function
      } else {
        data = await loginUser(email, password); // your existing loginUser function
      }

      // store tokens in localStorage (replace this if you want AsyncStorage for React Native)
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      alert(mode === "signup" ? "Signed up!" : "Signed in!");
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
