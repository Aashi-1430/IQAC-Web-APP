"use client";

import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import PasswordField from "./PasswordField";

export default function LoginForm({ onSwitchToSignup, prefillEmail }) {
  const { login } = useAuth();

  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // { text, type }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMessage({ text: "Please enter your email and password.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await login(trimmedEmail, password);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage({
        text: error.message || "Unable to login. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="loginSection">
      <div className="form-heading">
        <h1>Welcome Back</h1>
        <p>Login to access the IQAC Portal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="loginEmail">Email Address</label>
          <div className="input-wrapper">
            <span className="input-icon">✉</span>
            <input
              type="email"
              id="loginEmail"
              placeholder="Enter your email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <PasswordField
          id="loginPassword"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />

        <button type="submit" className="primary-button" id="loginButton" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <span className="button-arrow">→</span>
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="auth-switch">
        Don&apos;t have an account?
        <button onClick={onSwitchToSignup}>Create Account</button>
      </div>
    </div>
  );
}
