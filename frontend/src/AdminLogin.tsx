import React, { FormEvent, useState } from "react";
import "./AdminLogin.css";

interface AdminLoginProps {
  onLoginSuccess?: () => void;
  onForgotPassword?: () => void;
}

interface LoginResponse {
  token?: string;
  user_id?: number | string;
  email?: string;
  role?: string;
  detail?: string;
  message?: string;
  error?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setSubmitError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Administrator email is required.");
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedEmail)
    ) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must contain at least 6 characters.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      let loginData: LoginResponse = {};

      try {
        loginData = await response.json();
      } catch {
        loginData = {};
      }

      if (!response.ok) {
        setSubmitError(
          loginData.detail ||
            loginData.message ||
            loginData.error ||
            "Invalid administrator email or password."
        );
        return;
      }

      const role = loginData.role?.toUpperCase();

      if (role !== "ADMIN") {
        setSubmitError(
          "Access denied. This account does not have administrator privileges."
        );
        return;
      }

      if (!loginData.token) {
        setSubmitError(
          "Login was successful, but the authentication token was not received."
        );
        return;
      }

      /*
       * Clear old admin authentication from both storages
       * before saving the new session.
       */
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user_id");
      localStorage.removeItem("admin_email");
      localStorage.removeItem("admin_role");

      sessionStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_user_id");
      sessionStorage.removeItem("admin_email");
      sessionStorage.removeItem("admin_role");

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("admin_token", loginData.token);
      storage.setItem(
        "admin_user_id",
        String(loginData.user_id ?? "")
      );
      storage.setItem(
        "admin_email",
        loginData.email || email.trim()
      );
      storage.setItem("admin_role", "ADMIN");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Admin login error:", error);

      setSubmitError(
        "Unable to connect to the server. Please make sure the Django backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  return (
    <div className="admin-login-page">
      {/* =====================================================
          LEFT IMAGE PANEL
          ===================================================== */}

      <section className="admin-login-image">
        {/* CSS handles the actual image */}
        <img
          className="admin-login-image-photo"
          src=""
          alt=""
          aria-hidden="true"
        />

        <div className="admin-login-image-overlay" />

        {/* BRAND */}
        <div className="admin-login-brand">
          <div className="admin-login-brand-row">
            <div className="admin-login-brand-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3L4 7V10C4 15.2 7.4 19.7 12 21C16.6 19.7 20 15.2 20 10V7L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="admin-login-brand-name">
              <span>ScholarBridge</span>

              <span className="admin-login-brand-ai">
                AI
              </span>
            </div>
          </div>

          <div className="admin-login-brand-tag">
            Administration Portal
          </div>

          <p className="admin-login-brand-desc">
            Manage scholarships, students, providers, applications,
            verification and platform operations from one secure
            administration portal.
          </p>
        </div>

        {/* INFORMATION CARD */}
        <div className="admin-login-info-card">
          <div className="admin-login-info-header">
            <div className="admin-login-info-title">
              <span className="admin-login-dot admin-login-dot--blue" />
              Secure Administration
            </div>

            <div className="admin-login-info-badge">
              <span className="admin-login-dot" />
              Protected Access
            </div>
          </div>

          <ul className="admin-login-info-list">
            <li>
              <span className="admin-login-info-dot" />
              Manage platform users and providers
            </li>

            <li>
              <span className="admin-login-info-dot" />
              Verify and monitor scholarship listings
            </li>

            <li>
              <span className="admin-login-info-dot" />
              Review applications and platform activity
            </li>
          </ul>

          <div className="admin-login-info-footer">
            <span>ScholarBridge AI</span>

            <span className="admin-login-status">
              System Protected
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          RIGHT LOGIN PANEL
          ===================================================== */}

      <section className="admin-login-panel">
        <div className="admin-login-panel-inner">
          {/* PORTAL BADGE */}

          <div className="admin-login-portal-badge">
            <span className="admin-login-dot admin-login-dot--blue" />
            Administrator Portal
          </div>

          {/* FORM AREA */}

          <div className="admin-login-form-wrap">
            <h1 className="admin-login-title">
              Welcome Back
            </h1>

            <p className="admin-login-subtitle">
              Sign in with your administrator credentials to access
              the ScholarBridge AI management portal.
            </p>

            <form
              className="admin-login-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* EMAIL */}

              <div className="admin-login-field">
                <div className="admin-login-label-row">
                  <label
                    className="admin-login-label"
                    htmlFor="admin-email"
                  >
                    Administrator Email
                    <span className="admin-login-required">
                      {" "}
                      *
                    </span>
                  </label>
                </div>

                <div className="admin-login-input-wrap">
                  <span className="admin-login-input-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6H20C20.55 6 21 6.45 21 7V17C21 17.55 20.55 18 20 18H4C3.45 18 3 17.55 3 17V7C3 6.45 3.45 6 4 6Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.5 7L12 13L20.5 7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="admin-email"
                    type="email"
                    className={`admin-login-input ${
                      emailError
                        ? "admin-login-input--error"
                        : ""
                    }`}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (emailError) {
                        setEmailError("");
                      }

                      if (submitError) {
                        setSubmitError("");
                      }
                    }}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                {emailError && (
                  <p className="admin-login-error-text">
                    {emailError}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div className="admin-login-field">
                <div className="admin-login-label-row">
                  <label
                    className="admin-login-label"
                    htmlFor="admin-password"
                  >
                    Password
                    <span className="admin-login-required">
                      {" "}
                      *
                    </span>
                  </label>

                  <button
                    type="button"
                    className="admin-login-forgot-link"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="admin-login-input-wrap">
                  <span className="admin-login-input-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <path
                        d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="12"
                        cy="15"
                        r="1"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    className={`admin-login-input ${
                      passwordError
                        ? "admin-login-input--error"
                        : ""
                    }`}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);

                      if (passwordError) {
                        setPasswordError("");
                      }

                      if (submitError) {
                        setSubmitError("");
                      }
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    className="admin-login-toggle-visibility"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 3L21 21"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10.58 10.58C10.2 10.96 10 11.47 10 12C10 13.1 10.9 14 12 14C12.53 14 13.04 13.8 13.42 13.42"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9.88 5.08C10.56 4.86 11.27 4.75 12 4.75C17.5 4.75 21 12 21 12C21 12 19.88 14.32 17.7 16.35"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6.61 6.61C4.37 8.31 3 12 3 12C3 12 6.5 19.25 12 19.25C13.24 19.25 14.42 18.92 15.48 18.4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 12C3 12 6.5 5 12 5C17.5 5 21 12 21 12C21 12 17.5 19 12 19C6.5 19 3 12 3 12Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {passwordError && (
                  <p className="admin-login-error-text">
                    {passwordError}
                  </p>
                )}

                {!passwordError && (
                  <p className="admin-login-hint-text">
                    Use your registered administrator password.
                  </p>
                )}
              </div>

              {/* SERVER ERROR */}

              {submitError && (
                <div
                  className="admin-login-submit-error"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              {/* REMEMBER ME */}

              <label className="admin-login-checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  disabled={isLoading}
                />

                <span>Remember me on this device</span>
              </label>

              {/* SIGN IN */}

              <button
                type="submit"
                className="admin-login-submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.3"
                      />

                      <path
                        d="M21 12C21 7.03 16.97 3 12 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Administration

                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <path
                        d="M13 6L19 12L13 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* TRUST BANNER */}

            <div className="admin-login-trust-banner">
              <span className="admin-login-trust-icon">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3L4.5 6V11.5C4.5 16.1 7.6 19.9 12 21C16.4 19.9 19.5 16.1 19.5 11.5V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8.5 12L10.8 14.3L15.5 9.7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>
                Your administrator session is protected with
                authenticated access.
              </span>
            </div>

            {/* RESTRICTED ACCESS */}

            <div className="admin-login-restricted-banner">
              <span className="admin-login-restricted-icon">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3L21 20H3L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M12 9V13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="12"
                    cy="16"
                    r="0.8"
                    fill="currentColor"
                  />
                </svg>
              </span>

              <span>
                Restricted area. Only authorized ScholarBridge AI
                administrators can access this portal.
              </span>
            </div>
          </div>

          {/* FOOTER */}

          <footer className="admin-login-footer">
            <span>
              © {new Date().getFullYear()} ScholarBridge AI
            </span>

            <div className="admin-login-footer-links">
              <a href="#privacy">Privacy</a>
              <a href="#security">Security</a>
              <a href="#support">Support</a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;