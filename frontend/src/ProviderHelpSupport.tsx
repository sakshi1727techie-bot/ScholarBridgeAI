import React, { useState } from "react";
import "./ProviderHelpSupport.css";

interface ProviderHelpSupportProps {
  onBackToDashboard?: () => void;
  onScholarshipsClick?: () => void;
  onApplicationsClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

const ProviderHelpSupport: React.FC<
  ProviderHelpSupportProps
> = ({
  onBackToDashboard,
  onScholarshipsClick,
  onApplicationsClick,
  onNotificationsClick,
  onProfileClick,
}) => {
  const [activeNav, setActiveNav] =
    useState("help");

  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [supportSubject, setSupportSubject] =
    useState("");

  const [supportCategory, setSupportCategory] =
    useState("General Support");

  const [supportMessage, setSupportMessage] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleDashboardClick = () => {
    setActiveNav("dashboard");

    if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  const handleScholarshipsClick = () => {
    setActiveNav("scholarships");

    if (onScholarshipsClick) {
      onScholarshipsClick();
    }
  };

  const handleApplicationsClick = () => {
    setActiveNav("applications");

    if (onApplicationsClick) {
      onApplicationsClick();
    }
  };

  const handleNotificationsClick = () => {
    setActiveNav("notifications");

    if (onNotificationsClick) {
      onNotificationsClick();
    }
  };

  const handleProfileClick = () => {
    setActiveNav("profile");

    if (onProfileClick) {
      onProfileClick();
    }
  };

  // =====================================================
  // FAQ DATA
  // =====================================================

  const faqs = [
    {
      question:
        "How can I create a scholarship?",
      answer:
        "Open the Scholarships section from the provider dashboard and select the option to create a new scholarship. Add the scholarship title, description, eligibility criteria, amount, application dates, deadline, and required documents before submitting it.",
    },
    {
      question:
        "How can I review student applications?",
      answer:
        "Go to the Applications section from the provider portal. You can view submitted applications, student information, uploaded documents, and application status from there.",
    },
    {
      question:
        "How can I approve or reject an application?",
      answer:
        "Open the required application from the Applications section. Review the student's information and documents, then use the available application status actions to update the application.",
    },
    {
      question:
        "How can I manage scholarship documents?",
      answer:
        "Documents submitted by students can be reviewed from the relevant application. Make sure the required documents are complete and readable before processing the application.",
    },
    {
      question:
        "How can I update my provider profile?",
      answer:
        "Open Provider Profile from the sidebar. Your organization information, contact details, address, and verification information are displayed there.",
    },
    {
      question:
        "Why is my scholarship not visible to students?",
      answer:
        "A scholarship may need to be reviewed or approved before it becomes available to students. Check the scholarship status in the Scholarships section.",
    },
    {
      question:
        "How do notifications work?",
      answer:
        "Notifications keep you updated about scholarship applications, scholarship updates, deadlines, and system-related information. Unread notifications are displayed with a notification count.",
    },
    {
      question:
        "What should I do if I find a technical problem?",
      answer:
        "Use the Submit a Support Request section on this page and provide a clear description of the issue. Include the relevant page or feature and what happened so the support team can understand the problem.",
    },
  ];

  // =====================================================
  // FAQ FILTER
  // =====================================================

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      faq.answer
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // =====================================================
  // FAQ TOGGLE
  // =====================================================

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  // =====================================================
  // SUPPORT FORM
  // =====================================================

  const handleSupportSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !supportSubject.trim() ||
      !supportMessage.trim()
    ) {
      return;
    }

    console.log("Support Request:", {
      subject: supportSubject,
      category: supportCategory,
      message: supportMessage,
    });

    setSubmitted(true);

    setSupportSubject("");
    setSupportMessage("");
    setSupportCategory("General Support");

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "provider_token"
    );

    localStorage.removeItem(
      "provider_user"
    );

    localStorage.removeItem(
      "provider_user_id"
    );

    localStorage.removeItem(
      "provider_email"
    );

    localStorage.removeItem(
      "provider_role"
    );

    sessionStorage.removeItem(
      "provider_token"
    );

    sessionStorage.removeItem(
      "provider_user"
    );

    sessionStorage.removeItem(
      "provider_user_id"
    );

    sessionStorage.removeItem(
      "provider_email"
    );

    sessionStorage.removeItem(
      "provider_role"
    );

    window.location.reload();
  };

  return (
    <div className="phs-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="phs-sidebar">

        {/* BRAND */}

        <div className="phs-brand">

          <div className="phs-brand-icon">
            SB
          </div>

          <div>
            <div className="phs-brand-title">
              ScholarBridge
            </div>

            <div className="phs-brand-subtitle">
              PROVIDER PORTAL
            </div>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="phs-navigation">

          {/* DASHBOARD */}

          <button
            type="button"
            className={`phs-nav-item ${
              activeNav === "dashboard"
                ? "phs-nav-active"
                : ""
            }`}
            onClick={handleDashboardClick}
          >

            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
              />
            </svg>

            <span>
              Dashboard
            </span>

          </button>

          {/* SCHOLARSHIPS */}

          <button
            type="button"
            className={`phs-nav-item ${
              activeNav === "scholarships"
                ? "phs-nav-active"
                : ""
            }`}
            onClick={
              handleScholarshipsClick
            }
          >

            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3L3 8l9 5 9-5-9-5Z" />

              <path d="M7 10v6c0 1.5 2.2 3 5 3s5-1.5 5-3v-6" />

              <path d="M21 8v6" />
            </svg>

            <span>
              Scholarships
            </span>

          </button>

          {/* APPLICATIONS */}

          <button
            type="button"
            className={`phs-nav-item ${
              activeNav === "applications"
                ? "phs-nav-active"
                : ""
            }`}
            onClick={
              handleApplicationsClick
            }
          >

            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16v16H4z" />

              <path d="M8 8h8" />

              <path d="M8 12h8" />

              <path d="M8 16h5" />
            </svg>

            <span>
              Applications
            </span>

          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className={`phs-nav-item ${
              activeNav === "notifications"
                ? "phs-nav-active"
                : ""
            }`}
            onClick={
              handleNotificationsClick
            }
          >

            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

              <path d="M10 21h4" />
            </svg>

            <span>
              Notifications
            </span>

          </button>

          {/* PROVIDER PROFILE */}

          <button
            type="button"
            className={`phs-nav-item ${
              activeNav === "profile"
                ? "phs-nav-active"
                : ""
            }`}
            onClick={handleProfileClick}
          >

            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
              />

              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>

            <span>
              Provider Profile
            </span>

          </button>

          {/* HELP & SUPPORT */}

          <button
            type="button"
            className={`phs-nav-item ${
              activeNav === "help"
                ? "phs-nav-active"
                : ""
            }`}
          >

            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />

              <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.2-1.7 2.7" />

              <circle
                cx="12"
                cy="17"
                r="0.8"
                fill="currentColor"
              />
            </svg>

            <span>
              Help & Support
            </span>

          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="phs-sidebar-bottom">

          <button
            type="button"
            className="phs-logout-button"
            onClick={handleLogout}
          >

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M10 17L15 12L10 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M15 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M21 19V5C21 3.9 20.1 3 19 3H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="phs-main">

        {/* HEADER */}

        <header className="phs-header">

          <div>

            <div className="phs-header-label">
              PROVIDER PORTAL
            </div>

            <h1>
              Help & Support
            </h1>

            <p>
              Find answers, get guidance, and
              contact support whenever you need
              assistance.
            </p>

          </div>

        </header>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <section className="phs-search-section">

          <div className="phs-search-icon">

            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="M20 20l-4-4" />
            </svg>

          </div>

          <input
            type="text"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </section>

        {/* =====================================================
            QUICK HELP CARDS
        ===================================================== */}

        <section className="phs-quick-section">

          <div className="phs-section-heading">
            <div>
              <h2>
                How can we help?
              </h2>

              <p>
                Quick access to the most
                common provider support topics.
              </p>
            </div>
          </div>

          <div className="phs-quick-grid">

            <div className="phs-quick-card">

              <div className="phs-quick-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3L3 8l9 5 9-5-9-5Z" />

                  <path d="M7 10v6c0 1.5 2.2 3 5 3s5-1.5 5-3v-6" />
                </svg>
              </div>

              <h3>
                Scholarships
              </h3>

              <p>
                Learn how to create, manage,
                update, and publish scholarships.
              </p>

            </div>

            <div className="phs-quick-card">

              <div className="phs-quick-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16v16H4z" />

                  <path d="M8 8h8" />

                  <path d="M8 12h8" />

                  <path d="M8 16h5" />
                </svg>
              </div>

              <h3>
                Applications
              </h3>

              <p>
                Get help with reviewing and
                processing student applications.
              </p>

            </div>

            <div className="phs-quick-card">

              <div className="phs-quick-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3L4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />

                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>

              <h3>
                Account & Profile
              </h3>

              <p>
                Learn how to manage your provider
                profile and account information.
              </p>

            </div>

            <div className="phs-quick-card">

              <div className="phs-quick-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3a9 9 0 1 0 9 9" />

                  <path d="M12 7v5l3 2" />
                </svg>
              </div>

              <h3>
                Notifications
              </h3>

              <p>
                Understand application, deadline,
                scholarship, and system updates.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}

        <section className="phs-faq-section">

          <div className="phs-section-heading">

            <div>

              <h2>
                Frequently Asked Questions
              </h2>

              <p>
                Find quick answers to common
                provider questions.
              </p>

            </div>

          </div>

          <div className="phs-faq-list">

            {filteredFaqs.length === 0 ? (

              <div className="phs-no-results">
                No help articles found for your
                search.
              </div>

            ) : (

              filteredFaqs.map(
                (faq, index) => (

                  <div
                    key={index}
                    className={`phs-faq-item ${
                      openFaq === index
                        ? "phs-faq-open"
                        : ""
                    }`}
                  >

                    <button
                      type="button"
                      className="phs-faq-question"
                      onClick={() =>
                        toggleFaq(index)
                      }
                    >

                      <span>
                        {faq.question}
                      </span>

                      <span className="phs-faq-plus">
                        {openFaq === index
                          ? "−"
                          : "+"}
                      </span>

                    </button>

                    {openFaq === index && (
                      <div className="phs-faq-answer">
                        <p>
                          {faq.answer}
                        </p>
                      </div>
                    )}

                  </div>

                )
              )

            )}

          </div>

        </section>

        {/* =====================================================
            CONTACT SUPPORT
        ===================================================== */}

        <section className="phs-contact-section">

          <div className="phs-contact-card">

            <div className="phs-contact-icon">

              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />

                <path d="M8 9h8" />

                <path d="M8 13h5" />
              </svg>

            </div>

            <div>

              <h2>
                Still need help?
              </h2>

              <p>
                Our support team can help you
                with technical issues and portal
                related questions.
              </p>

            </div>

          </div>

          <div className="phs-support-options">

            <div className="phs-support-option">

              <div className="phs-support-option-icon">
                ✉
              </div>

              <div>
                <h3>
                  Email Support
                </h3>

                <p>
                  Send us your question or issue
                  through email support.
                </p>

                <span>
                  support@scholarbridge.ai
                </span>
              </div>

            </div>

            <div className="phs-support-option">

              <div className="phs-support-option-icon">
                ?
              </div>

              <div>
                <h3>
                  Technical Support
                </h3>

                <p>
                  Report a technical problem with
                  the provider portal.
                </p>

                <span>
                  Available through support request
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            SUPPORT REQUEST
        ===================================================== */}

        <section className="phs-request-section">

          <div className="phs-section-heading">

            <div>

              <h2>
                Submit a Support Request
              </h2>

              <p>
                Tell us what you need help with
                and provide as much detail as
                possible.
              </p>

            </div>

          </div>

          {submitted && (
            <div className="phs-success-message">

              <div className="phs-success-icon">
                ✓
              </div>

              <div>
                <strong>
                  Support request submitted
                </strong>

                <p>
                  Your request has been recorded.
                  Our support team will review it.
                </p>
              </div>

            </div>
          )}

          <form
            className="phs-support-form"
            onSubmit={handleSupportSubmit}
          >

            <div className="phs-form-row">

              <div className="phs-form-group">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter your issue"
                  value={supportSubject}
                  onChange={(event) =>
                    setSupportSubject(
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="phs-form-group">

                <label>
                  Category
                </label>

                <select
                  value={supportCategory}
                  onChange={(event) =>
                    setSupportCategory(
                      event.target.value
                    )
                  }
                >

                  <option>
                    General Support
                  </option>

                  <option>
                    Scholarship Management
                  </option>

                  <option>
                    Application Management
                  </option>

                  <option>
                    Account & Profile
                  </option>

                  <option>
                    Technical Issue
                  </option>

                  <option>
                    Notifications
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>

            </div>

            <div className="phs-form-group">

              <label>
                Message
              </label>

              <textarea
                rows={6}
                placeholder="Describe your issue or question..."
                value={supportMessage}
                onChange={(event) =>
                  setSupportMessage(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="phs-form-footer">

              <p>
                Please do not include sensitive
                passwords or authentication
                information in your message.
              </p>

              <button
                type="submit"
                className="phs-submit-button"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13" />

                  <path d="M22 2l-7 20-4-9-9-4 20-7Z" />
                </svg>

                Submit Request

              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
};

export default ProviderHelpSupport;