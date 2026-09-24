import React, { useState } from "react";
import "./provider Register.css";

interface ProviderRegisterProps {
  onBackToLogin?: () => void;
  onSubmit?: (data: ProviderRegisterData) => void;
}

interface ProviderRegisterData {
  organization_name: string;
  organization_type: string;
  contact_person: string;
  phone: string;
  address: string;
  email: string;
  password1: string;
  password2: string;
}

type FieldName = keyof ProviderRegisterData;

type FormErrors = Partial<Record<FieldName, string>>;

const ORGANIZATION_TYPES = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE", label: "Private Organization" },
  { value: "NGO", label: "NGO" },
  { value: "TRUST", label: "Trust" },
  { value: "COLLEGE", label: "College / University" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "OTHER", label: "Other" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INITIAL_FORM: ProviderRegisterData = {
  organization_name: "",
  organization_type: "",
  contact_person: "",
  phone: "",
  address: "",
  email: "",
  password1: "",
  password2: "",
};

const ProviderRegister: React.FC<ProviderRegisterProps> = ({
  onBackToLogin,
  onSubmit,
}) => {
  const [form, setForm] =
    useState<ProviderRegisterData>(INITIAL_FORM);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [touched, setTouched] =
    useState<Partial<Record<FieldName, boolean>>>({});

  const [showPassword, setShowPassword] =
    useState<boolean>(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [submitting, setSubmitting] =
    useState<boolean>(false);

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  const [serverError, setServerError] =
    useState<string>("");

  /* =====================================================
     FIELD VALIDATION
     ===================================================== */

  const validateField = (
    field: FieldName,
    value: string
  ): string => {
    const trimmedValue = value.trim();

    switch (field) {
      case "organization_name":
        if (!trimmedValue) {
          return "Organization name is required.";
        }

        if (trimmedValue.length < 2) {
          return "Organization name must contain at least 2 characters.";
        }

        return "";

      case "organization_type":
        if (!value) {
          return "Organization type is required.";
        }

        return "";

      case "contact_person":
        if (!trimmedValue) {
          return "Contact person name is required.";
        }

        if (trimmedValue.length < 2) {
          return "Contact person name must contain at least 2 characters.";
        }

        return "";

      case "phone": {
        if (!trimmedValue) {
          return "";
        }

        const phoneDigits = value.replace(/\D/g, "");

        if (!/^[0-9+\-\s()]+$/.test(value)) {
          return "Please enter a valid phone number.";
        }

        if (
          phoneDigits.length < 10 ||
          phoneDigits.length > 15
        ) {
          return "Phone number must contain 10 to 15 digits.";
        }

        return "";
      }

      case "address":
        if (!trimmedValue) {
          return "";
        }

        if (trimmedValue.length < 10) {
          return "Address must contain at least 10 characters.";
        }

        return "";

      case "email":
        if (!trimmedValue) {
          return "Email address is required.";
        }

        if (!EMAIL_PATTERN.test(trimmedValue)) {
          return "Please enter a valid email address.";
        }

        return "";

      case "password1":
        if (!value) {
          return "Password is required.";
        }

        if (value.length < 8) {
          return "Password must contain at least 8 characters.";
        }

        if (/^\d+$/.test(value)) {
          return "Password cannot contain numbers only.";
        }

        if (/^[A-Za-z]+$/.test(value)) {
          return "Password cannot contain letters only.";
        }

        return "";

      case "password2":
        if (!value) {
          return "Please confirm your password.";
        }

        if (value !== form.password1) {
          return "Passwords do not match.";
        }

        return "";

      default:
        return "";
    }
  };

  /* =====================================================
     HANDLE CHANGE
     ===================================================== */

  const handleChange = (
    field: FieldName,
    value: string
  ): void => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccessMessage("");
    setServerError("");

    if (touched[field]) {
      const fieldError = validateField(field, value);

      setErrors((previous) => ({
        ...previous,
        [field]: fieldError,
      }));
    }
  };

  /* =====================================================
     HANDLE BLUR
     ===================================================== */

  const handleBlur = (
    field: FieldName
  ): void => {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));

    const fieldError = validateField(
      field,
      form[field]
    );

    setErrors((previous) => ({
      ...previous,
      [field]: fieldError,
    }));
  };

  /* =====================================================
     FORM VALIDATION
     ===================================================== */

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    const fields: FieldName[] = [
      "organization_name",
      "organization_type",
      "contact_person",
      "phone",
      "address",
      "email",
      "password1",
      "password2",
    ];

    fields.forEach((field) => {
      const error = validateField(
        field,
        form[field]
      );

      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  /* =====================================================
     HANDLE SUBMIT
     ===================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    console.log(
      "PROVIDER REGISTER SUBMIT CLICKED"
    );

    if (submitting) {
      return;
    }

    setSuccessMessage("");
    setServerError("");

    const newErrors = validateForm();

    setErrors(newErrors);

    setTouched({
      organization_name: true,
      organization_type: true,
      contact_person: true,
      phone: true,
      address: true,
      email: true,
      password1: true,
      password2: true,
    });

    /* =====================================================
       STOP IF FORM HAS ERRORS
       ===================================================== */

    if (Object.keys(newErrors).length > 0) {
      const firstInvalidField =
        Object.keys(newErrors)[0] as FieldName;

      const element = document.querySelector(
        `[name="${firstInvalidField}"]`
      ) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null;

      if (element) {
        element.focus();
      }

      return;
    }

    /* =====================================================
       CLEAN DATA
       ===================================================== */

    const cleanedData: ProviderRegisterData = {
      organization_name:
        form.organization_name.trim(),

      organization_type:
        form.organization_type,

      contact_person:
        form.contact_person.trim(),

      phone:
        form.phone.trim(),

      address:
        form.address.trim(),

      email:
        form.email.trim().toLowerCase(),

      password1:
        form.password1,

      password2:
        form.password2,
    };

    setSubmitting(true);

    try {
      /* =====================================================
         REGISTER API
         ===================================================== */

      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/register/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: cleanedData.email,

            password: cleanedData.password1,

            role: "PROVIDER",

            organization_name:
              cleanedData.organization_name,

            organization_type:
              cleanedData.organization_type,

            contact_person:
              cleanedData.contact_person,

            phone:
              cleanedData.phone,

            address:
              cleanedData.address,
          }),
        }
      );

      /* =====================================================
         READ RESPONSE
         ===================================================== */

      let data: Record<string, unknown> = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /* =====================================================
         REGISTRATION FAILED
         ===================================================== */

      if (!response.ok) {
        let message =
          "Registration failed. Please try again.";

        if (
          typeof data.message === "string"
        ) {
          message = data.message;
        } else if (
          typeof data.detail === "string"
        ) {
          message = data.detail;
        } else {
          const backendMessages =
            Object.values(data)
              .flat()
              .filter(Boolean)
              .join(" ");

          if (backendMessages) {
            message = backendMessages;
          }
        }

        setServerError(message);

        return;
      }

      /* =====================================================
         REGISTRATION SUCCESS
         ===================================================== */

      console.log(
        "PROVIDER REGISTRATION SUCCESS",
        data
      );

      setSuccessMessage(
        "Provider account created successfully. Redirecting to login..."
      );

      setForm((previous) => ({
        ...previous,
        password1: "",
        password2: "",
      }));

      setTouched({});
      setErrors({});

      /* =====================================================
         OPTIONAL CALLBACK
         ===================================================== */

      if (onSubmit) {
        onSubmit(cleanedData);
      }

      /* =====================================================
         DIRECTLY GO TO LOGIN PAGE
         ===================================================== */

      setTimeout(() => {
        if (onBackToLogin) {
          onBackToLogin();
        }
      }, 1000);

    } catch (error) {
      console.error(
        "Provider registration error:",
        error
      );

      setServerError(
        "Unable to connect to the server. Please make sure Django backend is running."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pr-page">

      {/* =====================================================
          LEFT VISUAL PANEL
          ===================================================== */}

      <section className="pr-visual">

        <div className="pr-visual__top">

          <div className="pr-chip">
            <span>✦</span>
            Secure Provider Registration
          </div>

          <div className="pr-chip">
            ScholarBridge AI
          </div>

        </div>

        <div className="pr-visual__content">

          <div className="pr-visual__badge">
            SCHOLARSHIP PROVIDER
          </div>

          <h1 className="pr-visual__title">
            Connect opportunities
            <br />
            with deserving students.
          </h1>

          <p className="pr-visual__text">
            Create your provider account and publish
            scholarship opportunities through
            ScholarBridge AI.
          </p>

          <ul className="pr-visual__list">

            <li>
              <span className="pr-visual__tick">
                ✓
              </span>
              Publish scholarship opportunities
            </li>

            <li>
              <span className="pr-visual__tick">
                ✓
              </span>
              Manage student applications
            </li>

            <li>
              <span className="pr-visual__tick">
                ✓
              </span>
              Connect with eligible students
            </li>

          </ul>

        </div>

      </section>


      {/* =====================================================
          RIGHT FORM PANEL
          ===================================================== */}

      <section className="pr-panel">

        <div className="pr-panel__inner">

          {/* TOP BAR */}

          <div className="pr-topbar">

            <div className="pr-brand">

              <span className="pr-brand__dot" />

              <span className="pr-brand__name">
                ScholarBridge AI
              </span>

            </div>

            <p className="pr-topbar__help">
              Provider registration
            </p>

          </div>


          {/* HEADING */}

          <div className="pr-heading">

            <div className="pr-pill">
              PROVIDER ACCOUNT
            </div>

            <h2 className="pr-heading__title">
              Create Provider Account
            </h2>

            <p className="pr-heading__sub">
              Register your organization to manage
              scholarships and applications.
            </p>

          </div>


          {/* SUCCESS MESSAGE */}

          {successMessage && (
            <div
              className="pr-alert pr-alert--success"
              role="alert"
            >
              ✓ {successMessage}
            </div>
          )}


          {/* SERVER ERROR */}

          {serverError && (
            <div
              className="pr-alert pr-alert--error"
              role="alert"
            >
              {serverError}
            </div>
          )}


          {/* FORM */}

          <form
            className="pr-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* =================================================
                ORGANIZATION DETAILS
                ================================================= */}

            <div className="pr-section">

              <div className="pr-section__title">
                Organization Details
              </div>


              {/* ORGANIZATION NAME */}

              <div
                className={`pr-field ${
                  errors.organization_name
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="organization_name"
                >
                  Organization Name{" "}
                  <span className="pr-req">
                    *
                  </span>
                </label>

                <div className="pr-control">

                  <span className="pr-control__icon">
                    🏢
                  </span>

                  <input
                    id="organization_name"
                    name="organization_name"
                    type="text"
                    value={
                      form.organization_name
                    }
                    onChange={(e) =>
                      handleChange(
                        "organization_name",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(
                        "organization_name"
                      )
                    }
                    placeholder="Enter organization name"
                    autoComplete="organization"
                    aria-invalid={
                      !!errors.organization_name
                    }
                  />

                </div>

                {errors.organization_name && (
                  <div className="pr-error">
                    {errors.organization_name}
                  </div>
                )}

              </div>


              {/* ORGANIZATION TYPE */}

              <div
                className={`pr-field ${
                  errors.organization_type
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="organization_type"
                >
                  Organization Type{" "}
                  <span className="pr-req">
                    *
                  </span>
                </label>

                <div className="pr-control pr-control--select">

                  <span className="pr-control__icon">
                    ▣
                  </span>

                  <select
                    id="organization_type"
                    name="organization_type"
                    value={
                      form.organization_type
                    }
                    onChange={(e) =>
                      handleChange(
                        "organization_type",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(
                        "organization_type"
                      )
                    }
                    aria-invalid={
                      !!errors.organization_type
                    }
                  >

                    <option value="">
                      Select organization type
                    </option>

                    {ORGANIZATION_TYPES.map(
                      (item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </option>
                      )
                    )}

                  </select>

                  <span className="pr-control__chevron">
                    ▼
                  </span>

                </div>

                {errors.organization_type && (
                  <div className="pr-error">
                    {errors.organization_type}
                  </div>
                )}

              </div>


              {/* CONTACT PERSON */}

              <div
                className={`pr-field ${
                  errors.contact_person
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="contact_person"
                >
                  Contact Person{" "}
                  <span className="pr-req">
                    *
                  </span>
                </label>

                <div className="pr-control">

                  <span className="pr-control__icon">
                    👤
                  </span>

                  <input
                    id="contact_person"
                    name="contact_person"
                    type="text"
                    value={
                      form.contact_person
                    }
                    onChange={(e) =>
                      handleChange(
                        "contact_person",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(
                        "contact_person"
                      )
                    }
                    placeholder="Enter contact person name"
                    autoComplete="name"
                    aria-invalid={
                      !!errors.contact_person
                    }
                  />

                </div>

                {errors.contact_person && (
                  <div className="pr-error">
                    {errors.contact_person}
                  </div>
                )}

              </div>


              {/* PHONE */}

              <div
                className={`pr-field ${
                  errors.phone
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="phone"
                >
                  Phone Number
                </label>

                <div className="pr-control">

                  <span className="pr-control__icon">
                    ☎
                  </span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      handleChange(
                        "phone",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur("phone")
                    }
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    aria-invalid={
                      !!errors.phone
                    }
                  />

                </div>

                {errors.phone && (
                  <div className="pr-error">
                    {errors.phone}
                  </div>
                )}

              </div>


              {/* ADDRESS */}

              <div
                className={`pr-field ${
                  errors.address
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="address"
                >
                  Organization Address
                </label>

                <div className="pr-control pr-control--textarea">

                  <span className="pr-control__icon">
                    ⌖
                  </span>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={(e) =>
                      handleChange(
                        "address",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur("address")
                    }
                    placeholder="Enter organization address"
                    rows={4}
                    aria-invalid={
                      !!errors.address
                    }
                  />

                </div>

                {errors.address && (
                  <div className="pr-error">
                    {errors.address}
                  </div>
                )}

              </div>

            </div>


            {/* =================================================
                ACCOUNT DETAILS
                ================================================= */}

            <div className="pr-section">

              <div className="pr-section__title">
                Account Details
              </div>


              {/* EMAIL */}

              <div
                className={`pr-field ${
                  errors.email
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="email"
                >
                  Email Address{" "}
                  <span className="pr-req">
                    *
                  </span>
                </label>

                <div className="pr-control">

                  <span className="pr-control__icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      handleChange(
                        "email",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur("email")
                    }
                    placeholder="name@organization.org"
                    autoComplete="email"
                    aria-invalid={
                      !!errors.email
                    }
                  />

                </div>

                {errors.email && (
                  <div className="pr-error">
                    {errors.email}
                  </div>
                )}

              </div>


              {/* PASSWORD */}

              <div
                className={`pr-field ${
                  errors.password1
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="password1"
                >
                  Password{" "}
                  <span className="pr-req">
                    *
                  </span>
                </label>

                <div className="pr-control">

                  <span className="pr-control__icon">
                    🔒
                  </span>

                  <input
                    id="password1"
                    name="password1"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password1}
                    onChange={(e) =>
                      handleChange(
                        "password1",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur("password1")
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    aria-invalid={
                      !!errors.password1
                    }
                  />

                  <button
                    type="button"
                    className="pr-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "🙈"
                      : "👁"}
                  </button>

                </div>

                {errors.password1 && (
                  <div className="pr-error">
                    {errors.password1}
                  </div>
                )}

                <div className="pr-hint">
                  Minimum 8 characters. Use a
                  combination of letters and numbers.
                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div
                className={`pr-field ${
                  errors.password2
                    ? "pr-field--error"
                    : ""
                }`}
              >

                <label
                  className="pr-label"
                  htmlFor="password2"
                >
                  Confirm Password{" "}
                  <span className="pr-req">
                    *
                  </span>
                </label>

                <div className="pr-control">

                  <span className="pr-control__icon">
                    🔒
                  </span>

                  <input
                    id="password2"
                    name="password2"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password2}
                    onChange={(e) =>
                      handleChange(
                        "password2",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur("password2")
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    aria-invalid={
                      !!errors.password2
                    }
                  />

                  <button
                    type="button"
                    className="pr-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword
                      ? "🙈"
                      : "👁"}
                  </button>

                </div>

                {errors.password2 && (
                  <div className="pr-error">
                    {errors.password2}
                  </div>
                )}

              </div>

            </div>


            {/* =================================================
                SUBMIT
                ================================================= */}

            <button
              type="submit"
              className="pr-submit"
              disabled={submitting}
            >

              {submitting ? (
                <>
                  <span className="pr-spinner" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Provider Account
                  <span>→</span>
                </>
              )}

            </button>


            {/* =================================================
                BACK TO SIGN IN
                ================================================= */}

            <div className="pr-signin">

              <span>
                Already have a provider account?{" "}
              </span>

              <button
                type="button"
                className="pr-signin__btn"
                onClick={onBackToLogin}
              >
                Back to Sign In
              </button>

            </div>


            {/* =================================================
                TRUST
                ================================================= */}

            <div className="pr-trust">

              <div className="pr-trust__rule" />

              <span className="pr-trust__label">
                Secure Registration
              </span>

              <div className="pr-trust__rule" />

            </div>

            <div className="pr-trust__chip">
              🔒 Your information is securely protected
            </div>


            {/* =================================================
                FOOTER
                ================================================= */}

            <div className="pr-footer">
              ScholarBridge AI • Scholarship Provider Portal
            </div>

          </form>

        </div>

      </section>

    </div>
  );
};

export default ProviderRegister;