"use client";

import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import PasswordField from "./PasswordField";

export default function SignupForm({ onSwitchToLogin, onSignedUp }) {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setMessage({ text: "Please enter your full name.", type: "error" });
      return;
    }

    if (!trimmedEmail) {
      setMessage({ text: "Please enter your email address.", type: "error" });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: "Password must contain at least 6 characters.", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await signup(trimmedName, trimmedEmail, password);

      setMessage({
        text:
          "Registration successful! Your account is awaiting approval from the IQAC Coordinator. You will be able to login once your account is approved.",
        type: "success",
      });

      setName("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onSignedUp(trimmedEmail);
      }, 3000);
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      setMessage({
        text: error.message || "Unable to create account. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="signupSection">
      <div className="form-heading">
        <h1>Create Account</h1>
        <p>Register for the SVIET IQAC Portal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="signupName">Full Name</label>
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              id="signupName"
              placeholder="Enter your full name"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="signupEmail">Email Address</label>
          <div className="input-wrapper">
            <span className="input-icon">✉</span>
            <input
              type="email"
              id="signupEmail"
              placeholder="Enter your email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <PasswordField
          id="signupPassword"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={setPassword}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <div className="approval-info">
          <span className="approval-icon">ⓘ</span>
          <p>New accounts require approval from the IQAC Coordinator before login.</p>
        </div>

        <button type="submit" className="primary-button" id="signupButton" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <span className="button-arrow">→</span>
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="auth-switch">
        Already have an account?
        <button onClick={onSwitchToLogin}>Login</button>
      </div>
    </div>
  );
}
