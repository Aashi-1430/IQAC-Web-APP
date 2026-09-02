"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [prefillEmail, setPrefillEmail] = useState("");

  function handleSignedUp(email) {
    setPrefillEmail(email);
    setMode("login");
  }

  return (
    <div id="authPage" className="auth-page">
      {/* LEFT SIDE */}
      <section className="auth-left">
        <div className="brand">
          <div className="brand-logo">S</div>
          <div>
            <h2>SVIET</h2>
            <span>Swami Vivekanand Institute</span>
          </div>
        </div>

        <div className="hero-content">
          <div className="iqac-badge">IQAC</div>
          <h1>
            Internal Quality
            <br />
            Assurance Cell
          </h1>
          <p>Quality. Excellence. Continuous Improvement.</p>
          <div className="hero-line"></div>
          <p className="college-name">
            Swami Vivekanand Institute of Engineering &amp; Technology
          </p>
        </div>

        <div className="left-footer">© 2026 SVIET IQAC</div>
      </section>

      {/* RIGHT SIDE */}
      <section className="auth-right">
        <div className="auth-container">
          <div className="mobile-brand">
            <div className="brand-logo">S</div>
            <div>
              <h2>SVIET</h2>
              <span>IQAC Portal</span>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-tabs">
              <button
                id="loginTab"
                className={`auth-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                id="signupTab"
                className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            {mode === "login" ? (
              <LoginForm onSwitchToSignup={() => setMode("signup")} prefillEmail={prefillEmail} />
            ) : (
              <SignupForm onSwitchToLogin={() => setMode("login")} onSignedUp={handleSignedUp} />
            )}
          </div>

          <div className="security-note">
            <span>🔐</span>
            <span>Secure authentication powered by JWT</span>
          </div>
        </div>
      </section>
    </div>
  );
}
