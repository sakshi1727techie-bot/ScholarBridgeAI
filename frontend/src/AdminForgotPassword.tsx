import React, { useState } from "react";
import "./AdminForgotPassword.css";

interface AdminForgotPasswordProps {
  onBackToLogin?: () => void;
}

interface FormErrors {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const AdminForgotPassword: React.FC<AdminForgotPasswordProps> = ({
  onBackToLogin,
}) => {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return "Email address is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address.";
    }

    return undefined;
  };

  const validateNewPassword = (value: string): string | undefined => {
    if (!value) {
      return "New password is required.";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return undefined;
  };

  const validateConfirmPassword = (
    value: string,
    original: string
  ): string | undefined => {
    if (!value) {
      return "Please confirm your new password.";
    }

    if (value !== original) {
      return "Passwords do not match.";
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(email),
      newPassword: validateNewPassword(newPassword),
      confirmPassword: validateConfirmPassword(
        confirmPassword,
        newPassword
      ),
    };

    setErrors(newErrors);

    return (
      !newErrors.email &&
      !newErrors.newPassword &&
      !newErrors.confirmPassword
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      /*
       * TODO:
       * Connect this form to the Django Admin password reset API.
       *
       * The backend password-reset API has not been connected yet.
       * For now, this page performs frontend validation only.
       */

      console.log("Admin password reset payload ready for Django API:", {
        email: email.trim(),
        newPassword,
      });

      await new Promise((resolve) => setTimeout(resolve, 700));

      setSuccessMessage(
        "Your password has been reset successfully. You can now sign in with your new password."
      );

      setErrors({});
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = (): void => {
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  return (
    <div className="admin-fp-page">
      {/* ================= LEFT IMAGE PANEL ================= */}
      <div className="admin-fp-image">
        <img
          src="/assets/admin-forgot-password-hero.jpg"
          alt="Professional administrator in an institutional office"
          className="admin-fp-image-photo"
        />

        <div className="admin-fp-image-overlay" />

        <div className="admin-fp-brand">
          <div className="admin-fp-brand-row">
            <div className="admin-fp-brand-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10.5L12 13L16 10.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="admin-fp-brand-name">
              ScholarBridge AI
            </span>
          </div>

          <p className="admin-fp-brand-tag">
            Intelligent scholarship management and institutional
            administration platform.
          </p>
        </div>

        <div className="admin-fp-content">
          <div className="admin-fp-pill">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 3L19 6V11C19 15.5 16.2 19.4 12 21C7.8 19.4 5 15.5 5 11V6L12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
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
            Secure Account Recovery
          </div>

          <h1 className="admin-fp-heading">
            Regain secure access to your administrator account.
          </h1>

          <p className="admin-fp-supporting">
            Update your administrator password securely and continue
            managing scholarships, providers, students, applications,
            and platform operations.
          </p>

          <div className="admin-fp-security-card">
            <div className="admin-fp-security-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
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
                <path
                  d="M12 14V16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <p className="admin-fp-security-title">
                Protected administrator access
              </p>

              <p className="admin-fp-security-text">
                Your administrative account is intended for authorized
                platform personnel only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="admin-fp-panel">
        <div className="admin-fp-panel-inner">
          <button
            type="button"
            className="admin-fp-back-top"
            onClick={handleBackToLogin}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M11 18L5 12L11 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Admin Login
          </button>

          <div className="admin-fp-form-wrap">
            <div className="admin-fp-portal-badge">
              <span className="admin-fp-dot" />
              Administrator Portal
            </div>

            <h2 className="admin-fp-title">
              Reset your password
            </h2>

            <p className="admin-fp-subtitle">
              Enter your registered administrator email and choose a
              new password for your ScholarBridge AI account.
            </p>

            {successMessage ? (
              <div className="admin-fp-success">
                <div className="admin-fp-success-icon">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3 className="admin-fp-title">
                  Password reset successful
                </h3>

                <p className="admin-fp-success-text">
                  {successMessage}
                </p>

                <button
                  type="button"
                  className="admin-fp-submit-button"
                  onClick={handleBackToLogin}
                >
                  Return to Admin Login
                </button>
              </div>
            ) : (
              <form
                className="admin-fp-form"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* EMAIL */}
                <div className="admin-fp-field">
                  <label
                    htmlFor="admin-fp-email"
                    className="admin-fp-label"
                  >
                    Email Address{" "}
                    <span className="admin-fp-required">*</span>
                  </label>

                  <div className="admin-fp-input-wrap">
                    <span className="admin-fp-input-icon">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M4 7L12 13L20 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <input
                      id="admin-fp-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);

                        if (errors.email) {
                          setErrors((previous) => ({
                            ...previous,
                            email: undefined,
                          }));
                        }
                      }}
                      placeholder="Enter your administrator email"
                      className={`admin-fp-input ${
                        errors.email
                          ? "admin-fp-input--error"
                          : ""
                      }`}
                      autoComplete="email"
                    />
                  </div>

                  {errors.email && (
                    <p className="admin-fp-error-text">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* NEW PASSWORD */}
                <div className="admin-fp-field">
                  <label
                    htmlFor="admin-fp-new-password"
                    className="admin-fp-label"
                  >
                    New Password{" "}
                    <span className="admin-fp-required">*</span>
                  </label>

                  <div className="admin-fp-input-wrap">
                    <span className="admin-fp-input-icon">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
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
                      </svg>
                    </span>

                    <input
                      id="admin-fp-new-password"
                      type={
                        showNewPassword ? "text" : "password"
                      }
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);

                        if (errors.newPassword) {
                          setErrors((previous) => ({
                            ...previous,
                            newPassword: undefined,
                          }));
                        }
                      }}
                      placeholder="Enter your new password"
                      className={`admin-fp-input ${
                        errors.newPassword
                          ? "admin-fp-input--error"
                          : ""
                      }`}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="admin-fp-toggle-visibility"
                      onClick={() =>
                        setShowNewPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNewPassword ? (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 3L21 21"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9.88 5.08C10.56 4.9 11.27 4.8 12 4.8C17 4.8 20.5 8.6 21.5 12C21.12 13.3 20.43 14.47 19.5 15.43"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.61 6.61C4.84 7.72 3.55 9.4 2.5 12C3.5 15.4 7 19.2 12 19.2C13.15 19.2 14.25 19.02 15.27 18.69"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.5 12C3.5 8.6 7 4.8 12 4.8C17 4.8 20.5 8.6 21.5 12C20.5 15.4 17 19.2 12 19.2C7 19.2 3.5 15.4 2.5 12Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
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

                  {errors.newPassword && (
                    <p className="admin-fp-error-text">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="admin-fp-field">
                  <label
                    htmlFor="admin-fp-confirm-password"
                    className="admin-fp-label"
                  >
                    Confirm New Password{" "}
                    <span className="admin-fp-required">*</span>
                  </label>

                  <div className="admin-fp-input-wrap">
                    <span className="admin-fp-input-icon">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
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
                      </svg>
                    </span>

                    <input
                      id="admin-fp-confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);

                        if (errors.confirmPassword) {
                          setErrors((previous) => ({
                            ...previous,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      placeholder="Confirm your new password"
                      className={`admin-fp-input ${
                        errors.confirmPassword
                          ? "admin-fp-input--error"
                          : ""
                      }`}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="admin-fp-toggle-visibility"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 3L21 21"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9.88 5.08C10.56 4.9 11.27 4.8 12 4.8C17 4.8 20.5 8.6 21.5 12C21.12 13.3 20.43 14.47 19.5 15.43"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.61 6.61C4.84 7.72 3.55 9.4 2.5 12C3.5 15.4 7 19.2 12 19.2C13.15 19.2 14.25 19.02 15.27 18.69"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.5 12C3.5 8.6 7 4.8 12 4.8C17 4.8 20.5 8.6 21.5 12C20.5 15.4 17 19.2 12 19.2C7 19.2 3.5 15.4 2.5 12Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
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

                  {errors.confirmPassword && (
                    <p className="admin-fp-error-text">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="admin-fp-submit-error">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  className="admin-fp-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="admin-fp-spinner" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
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
            )}

            {!successMessage && (
              <div className="admin-fp-back-bottom">
                Remembered your password?{" "}
                <button
                  type="button"
                  className="admin-fp-back-bottom-link"
                  onClick={handleBackToLogin}
                >
                  Back to Admin Login
                </button>
              </div>
            )}
          </div>

          <footer className="admin-fp-footer">
            <span>Authorized administrative use only.</span>
            <span>© 2026 ScholarBridge AI Inc. All rights reserved.</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;