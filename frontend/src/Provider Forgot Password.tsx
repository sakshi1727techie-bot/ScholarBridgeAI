import React, { useState } from "react";
import "./provider Forgot Password.css";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export interface ProviderForgotPasswordData {
  email: string;
  new_password1: string;
  new_password2: string;
}

type FieldName = keyof ProviderForgotPasswordData;

type FieldErrors = Partial<Record<FieldName, string>>;

export interface ProviderForgotPasswordProps {
  /**
   * Connect your Django endpoint here. Receives the validated form data
   * (email, new_password1, new_password2). Throw an Error to show its
   * message to the user. If omitted, the success view is shown after
   * validation passes.
   */
  onSubmit?: (data: ProviderForgotPasswordData) => void | Promise<void>;
  /** Called when the user clicks "Back to Sign In". */
  onBackToLogin?: () => void;
}

/* ------------------------------------------------------------------ */
/* Constants & validation                                               */
/* ------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LENGTH = 6;

const INITIAL_VALUES: ProviderForgotPasswordData = {
  email: "",
  new_password1: "",
  new_password2: "",
};

const FIELD_ORDER: FieldName[] = ["email", "new_password1", "new_password2"];

const passwordMeetsRules = (value: string): boolean =>
  value.length >= MIN_PASSWORD_LENGTH && /[A-Za-z]/.test(value) && /\d/.test(value);

function validateField(name: FieldName, values: ProviderForgotPasswordData): string {
  const value = values[name];

  switch (name) {
    case "email": {
      const trimmed = value.trim();
      if (!trimmed) return "Email address is required.";
      if (!EMAIL_PATTERN.test(trimmed)) {
        return "Enter a valid email address, e.g. name@organization.org.";
      }
      return "";
    }

    case "new_password1":
      if (!value) return "New password is required.";
      if (value.length < MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
      }
      if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
        return "Password must contain a mix of letters and numbers.";
      }
      return "";

    case "new_password2":
      if (!value) return "Please confirm your new password.";
      if (value !== values.new_password1) return "Passwords do not match.";
      return "";

    default:
      return "";
  }
}

function validateAll(values: ProviderForgotPasswordData): FieldErrors {
  const errors: FieldErrors = {};
  FIELD_ORDER.forEach((name) => {
    const message = validateField(name, values);
    if (message) errors[name] = message;
  });
  return errors;
}

/* ------------------------------------------------------------------ */
/* Icons (inline SVG - no external files)                               */
/* ------------------------------------------------------------------ */

type IconName =
  | "mail"
  | "lock"
  | "eye"
  | "eyeOff"
  | "check"
  | "arrowRight"
  | "arrowLeft"
  | "shield"
  | "cap"
  | "external"
  | "key"
  | "network"
  | "refresh";

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M9.9 5.2A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1" />
      <path d="M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m3 3 18 18" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  cap: (
    <>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9" />
      <path d="m16 7 3 3" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M12 7v4M12 11l-6 5M12 11l6 5" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 16, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {ICON_PATHS[name]}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

const ProviderForgotPassword: React.FC<ProviderForgotPasswordProps> = ({
  onSubmit,
  onBackToLogin,
}) => {
  const [values, setValues] = useState<ProviderForgotPasswordData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [resetDone, setResetDone] = useState<boolean>(false);

  const setFieldError = (name: FieldName, message: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    const nextValues: ProviderForgotPasswordData = { ...values, [name]: e.target.value };
    setValues(nextValues);
    setFormError("");

    if (touched[name] || errors[name]) {
      setFieldError(name, validateField(name, nextValues));
    }
    if (name === "new_password1" && (touched.new_password2 || errors.new_password2)) {
      setFieldError("new_password2", validateField("new_password2", nextValues));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldError(name, validateField(name, values));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setFormError("");

    const validationErrors = validateAll(values);
    setErrors(validationErrors);
    setTouched({ email: true, new_password1: true, new_password2: true });

    const firstInvalid = FIELD_ORDER.find((name) => validationErrors[name]);
    if (firstInvalid) {
      const el = document.getElementById(`pfp-${firstInvalid}`);
      if (el) el.focus();
      return;
    }

    const cleaned: ProviderForgotPasswordData = {
      email: values.email.trim().toLowerCase(),
      new_password1: values.new_password1,
      new_password2: values.new_password2,
    };

    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(cleaned);
      }
      setResetDone(true);
      setValues(INITIAL_VALUES);
      setErrors({});
      setTouched({});
    } catch (err) {
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : "We could not reset your password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (name: FieldName) => `pfp-field${errors[name] ? " pfp-field--error" : ""}`;
  const describedBy = (name: FieldName) => (errors[name] ? `pfp-${name}-error` : undefined);
  const renderError = (name: FieldName) =>
    errors[name] ? (
      <p className="pfp-error" id={`pfp-${name}-error`} role="alert">
        {errors[name]}
      </p>
    ) : null;

  const rulesMet = passwordMeetsRules(values.new_password1);

  return (
    <div className="pfp-page">
      {/* ------------------------- Visual panel ------------------------- */}
      <aside className="pfp-visual" aria-label="Provider account recovery">
        <div className="pfp-visual__shade">
          <div className="pfp-visual__top">
            <span className="pfp-chip">
              <Icon name="shield" size={12} />
              Provider portal gateway
            </span>
            <span className="pfp-chip">
              <Icon name="network" size={12} />
              Scholarship provider network
            </span>
          </div>

          <div className="pfp-visual__bottom">
            <span className="pfp-visual__badge">
              <Icon name="cap" size={13} />
              ScholarBridge AI · Provider Portal
            </span>
            <h2 className="pfp-visual__title">Provider Account Recovery</h2>
            <p className="pfp-visual__quote">
              &ldquo;Securely reset your ScholarBridge AI provider account password and get back to
              supporting deserving students.&rdquo;
            </p>

            <ul className="pfp-visual__cards">
              <li>
                <span className="pfp-visual__tick">
                  <Icon name="check" size={13} />
                </span>
                Secure Account Recovery
              </li>
              <li>
                <span className="pfp-visual__tick">
                  <Icon name="lock" size={13} />
                </span>
                Protect Your Account
              </li>
              <li>
                <span className="pfp-visual__tick">
                  <Icon name="refresh" size={13} />
                </span>
                Resume Managing Scholarships
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* -------------------------- Form panel -------------------------- */}
      <main className="pfp-panel">
        <div className="pfp-panel__inner">
          <header className="pfp-topbar">
            <div className="pfp-brand">
              <span className="pfp-brand__dot" aria-hidden="true" />
              <span className="pfp-brand__name">ScholarBridge AI</span>
            </div>
            <p className="pfp-topbar__help">
              Need support?{" "}
              <span className="pfp-topbar__link">
                Provider Help Desk
                <Icon name="external" size={11} />
              </span>
            </p>
          </header>

          <div className="pfp-body">
            <span className="pfp-pill">
              <Icon name="cap" size={13} />
              Provider Account Recovery
            </span>

            {resetDone ? (
              <div className="pfp-success" role="status">
                <span className="pfp-success__icon">
                  <Icon name="check" size={26} />
                </span>
                <h1 className="pfp-title">Password Reset Successful</h1>
                <p className="pfp-sub">
                  Your provider account password has been updated. You can now sign in with your
                  new password.
                </p>
                <button type="button" className="pfp-submit" onClick={onBackToLogin}>
                  Back to Sign In
                  <Icon name="arrowRight" size={16} />
                </button>
              </div>
            ) : (
              <>
                <h1 className="pfp-title">Reset Password</h1>
                <p className="pfp-sub">
                  Enter your registered email and create a new password for your account.
                </p>

                <form className="pfp-form" onSubmit={handleSubmit} noValidate>
                  <div className={fieldClass("email")}>
                    <div className="pfp-label-row">
                      <label htmlFor="pfp-email" className="pfp-label">
                        Email Address <span className="pfp-req">*</span>
                      </label>
                      <span className="pfp-hint">Institutional or work email</span>
                    </div>
                    <div className="pfp-control">
                      <Icon name="mail" className="pfp-control__icon" />
                      <input
                        id="pfp-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@organization.org"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("email")}
                      />
                    </div>
                    {renderError("email")}
                  </div>

                  <div className={fieldClass("new_password1")}>
                    <label htmlFor="pfp-new_password1" className="pfp-label">
                      New Password <span className="pfp-req">*</span>
                    </label>
                    <div className="pfp-control">
                      <Icon name="lock" className="pfp-control__icon" />
                      <input
                        id="pfp-new_password1"
                        name="new_password1"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Enter your new password"
                        value={values.new_password1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(errors.new_password1)}
                        aria-describedby={describedBy("new_password1")}
                      />
                      <button
                        type="button"
                        className="pfp-toggle"
                        onClick={() => setShowNewPassword((s) => !s)}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        aria-pressed={showNewPassword}
                      >
                        <Icon name={showNewPassword ? "eyeOff" : "eye"} size={16} />
                      </button>
                    </div>
                    {renderError("new_password1")}
                  </div>

                  <div className={fieldClass("new_password2")}>
                    <label htmlFor="pfp-new_password2" className="pfp-label">
                      Confirm Password <span className="pfp-req">*</span>
                    </label>
                    <div className="pfp-control">
                      <Icon name="lock" className="pfp-control__icon" />
                      <input
                        id="pfp-new_password2"
                        name="new_password2"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                        value={values.new_password2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(errors.new_password2)}
                        aria-describedby={describedBy("new_password2")}
                      />
                      <button
                        type="button"
                        className="pfp-toggle"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        aria-label={
                          showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                        }
                        aria-pressed={showConfirmPassword}
                      >
                        <Icon name={showConfirmPassword ? "eyeOff" : "eye"} size={16} />
                      </button>
                    </div>
                    {renderError("new_password2")}
                  </div>

                  <p className={`pfp-rule${rulesMet ? " pfp-rule--met" : ""}`}>
                    <span className="pfp-rule__mark" aria-hidden="true">
                      {rulesMet && <Icon name="check" size={10} />}
                    </span>
                    Password must be at least {MIN_PASSWORD_LENGTH} characters and contain a mix of
                    letters and numbers.
                  </p>

                  {formError && (
                    <div className="pfp-alert" role="alert">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="pfp-submit"
                    disabled={submitting}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {submitting ? (
                      <>
                        <span className="pfp-spinner" aria-hidden="true" />
                        Resetting password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <Icon name="arrowRight" size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="pfp-back">
                  <button type="button" className="pfp-back__btn" onClick={onBackToLogin}>
                    <Icon name="arrowLeft" size={14} />
                    Back to Sign In
                  </button>
                  <p className="pfp-back__note">
                    ScholarBridge AI Provider Portal · Sign in to manage your scholarships
                  </p>
                </div>
              </>
            )}

            <p className="pfp-trust">
              <span className="pfp-trust__dot" aria-hidden="true" />
              256-bit SSL Encrypted · Secure Account Recovery
            </p>
            <p className="pfp-trust__note">
              Authorized provider access only. Recovery sessions are encrypted and logged.
            </p>
          </div>

          <footer className="pfp-footer">
            <span>&copy; {new Date().getFullYear()} ScholarBridge AI Inc. All rights reserved.</span>
            <span className="pfp-footer__links">
              <span>Provider Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Trust &amp; Security</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export { ProviderForgotPassword };
export default ProviderForgotPassword;