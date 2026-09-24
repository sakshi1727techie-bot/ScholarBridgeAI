import React, { useEffect, useState } from "react";
import "./ProviderDashboard.css";

interface ProviderDashboardProps {
  onScholarshipsClick?: () => void;
  onCreateScholarshipClick?: () => void;
  onApplicationsClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onHelpSupportClick?: () => void;
}

interface ProviderData {
  user_id: number;
  email: string;
  organization_name: string;
  organization_type: string;
  contact_person: string;
  phone: string;
  address: string;
  verification_status: string;
}

interface ScholarshipStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface ApplicationStats {
  total: number;
  pending: number;
  under_review: number;
  approved: number;
}

interface RecentScholarship {
  id: number;
  title: string;
  amount: string;
  deadline: string;
  status: string;
}

interface UpcomingDeadline {
  id: number;
  title: string;
  deadline: string;
  status: string;
}

interface RecentApplication {
  id: number;
  student_id: number;
  student_email: string;
  scholarship_id: number;
  scholarship_title: string;
  status: string;
  status_display: string;
  applied_at: string;
}

interface DashboardData {
  success: boolean;
  provider: ProviderData;
  scholarship_stats: ScholarshipStats;
  application_stats: ApplicationStats;
  recent_scholarships: RecentScholarship[];
  upcoming_deadlines: UpcomingDeadline[];
  recent_applications: RecentApplication[];
}

interface NotificationsResponse {
  success: boolean;
  unread_count: number;
  notifications: unknown[];
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  onScholarshipsClick,
  onCreateScholarshipClick,
  onApplicationsClick,
  onNotificationsClick,
  onProfileClick,
  onHelpSupportClick,
}) => {
  const [activeNav, setActiveNav] = useState<string>("dashboard");

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState<number>(0);

  // =====================================================
  // LOGOUT POPUP STATE
  // =====================================================

  const [showLogoutPopup, setShowLogoutPopup] =
    useState<boolean>(false);

  // =====================================================
  // GET PROVIDER TOKEN
  // =====================================================

  const getProviderToken = () => {
    return (
      localStorage.getItem("provider_token") ||
      sessionStorage.getItem("provider_token")
    );
  };

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getProviderToken();

      if (!token) {
        setError(
          "Provider session not found. Please login again."
        );
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/provider/api/dashboard/",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load provider dashboard."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load provider dashboard."
        );
      }

      setDashboardData(data);
    } catch (err) {
      console.error(
        "Provider Dashboard API Error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong while loading dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH NOTIFICATION UNREAD COUNT
  // =====================================================

  const fetchNotificationCount = async () => {
    try {
      const token = getProviderToken();

      if (!token) {
        setUnreadNotificationCount(0);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/notifications/",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: NotificationsResponse =
        await response.json();

      if (!response.ok || !data.success) {
        console.error(
          "Unable to fetch notification count:",
          data
        );

        setUnreadNotificationCount(0);
        return;
      }

      setUnreadNotificationCount(
        Number(data.unread_count) || 0
      );
    } catch (err) {
      console.error(
        "Notification Count API Error:",
        err
      );

      setUnreadNotificationCount(0);
    }
  };

  // =====================================================
  // INITIAL DATA LOAD
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
    fetchNotificationCount();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  // =====================================================
  // CONFIRM LOGOUT
  // =====================================================

  const confirmLogout = () => {
    localStorage.removeItem("provider_token");
    localStorage.removeItem("provider_user_id");
    localStorage.removeItem("provider_email");
    localStorage.removeItem("provider_role");

    sessionStorage.removeItem("provider_token");
    sessionStorage.removeItem("provider_user_id");
    sessionStorage.removeItem("provider_email");
    sessionStorage.removeItem("provider_role");

    setShowLogoutPopup(false);

    window.location.reload();
  };

  // =====================================================
  // CANCEL LOGOUT
  // =====================================================

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  // =====================================================
  // SCHOLARSHIPS NAVIGATION
  // =====================================================

  const handleScholarshipsNavigation = () => {
    console.log("Scholarships button clicked");

    setActiveNav("scholarships");

    if (
      typeof onScholarshipsClick === "function"
    ) {
      console.log("Calling onScholarshipsClick");
      onScholarshipsClick();
    } else {
      console.error(
        "onScholarshipsClick prop is not connected in App.tsx"
      );
    }
  };

  // =====================================================
  // CREATE SCHOLARSHIP NAVIGATION
  // =====================================================

  const handleCreateScholarshipNavigation = () => {
    console.log("=================================");
    console.log(
      "Create Scholarship button clicked"
    );
    console.log(
      "onCreateScholarshipClick:",
      onCreateScholarshipClick
    );
    console.log("=================================");

    if (
      typeof onCreateScholarshipClick === "function"
    ) {
      console.log(
        "Calling onCreateScholarshipClick"
      );
      onCreateScholarshipClick();
    } else {
      console.error(
        "onCreateScholarshipClick prop is NOT connected in App.tsx"
      );
    }
  };

  // =====================================================
  // APPLICATIONS NAVIGATION
  // =====================================================

  const handleApplicationsNavigation = () => {
    console.log("=================================");
    console.log("Applications button clicked");
    console.log(
      "onApplicationsClick:",
      onApplicationsClick
    );
    console.log("=================================");

    setActiveNav("applications");

    if (
      typeof onApplicationsClick === "function"
    ) {
      console.log("Calling onApplicationsClick");
      onApplicationsClick();
    } else {
      console.error(
        "onApplicationsClick prop is NOT connected in App.tsx"
      );
    }
  };

  // =====================================================
  // NOTIFICATIONS NAVIGATION
  // =====================================================

  const handleNotificationsNavigation = () => {
    console.log("=================================");
    console.log("Notifications button clicked");
    console.log(
      "onNotificationsClick:",
      onNotificationsClick
    );
    console.log("=================================");

    setActiveNav("notifications");

    if (
      typeof onNotificationsClick === "function"
    ) {
      console.log("Calling onNotificationsClick");
      onNotificationsClick();
    } else {
      console.error(
        "onNotificationsClick prop is NOT connected in App.tsx"
      );
    }
  };

  // =====================================================
  // HELP & SUPPORT NAVIGATION
  // =====================================================

  const handleHelpSupportNavigation = () => {
    console.log("=================================");
    console.log(
      "Help & Support button clicked"
    );
    console.log(
      "onHelpSupportClick:",
      onHelpSupportClick
    );
    console.log("=================================");

    setActiveNav("help-support");

    if (
      typeof onHelpSupportClick === "function"
    ) {
      console.log("Calling onHelpSupportClick");
      onHelpSupportClick();
    } else {
      console.error(
        "onHelpSupportClick prop is NOT connected in App.tsx"
      );
    }
  };

  // =====================================================
  // DASHBOARD NAVIGATION
  // =====================================================

  const handleDashboardNavigation = () => {
    console.log("Dashboard button clicked");
    setActiveNav("dashboard");
  };

  // =====================================================
  // PROFILE NAVIGATION
  // =====================================================

  const handleProfileNavigation = () => {
    console.log("=================================");
    console.log(
      "Provider Profile button clicked"
    );
    console.log(
      "onProfileClick:",
      onProfileClick
    );
    console.log("=================================");

    setActiveNav("profile");

    if (
      typeof onProfileClick === "function"
    ) {
      console.log("Calling onProfileClick");
      onProfileClick();
    } else {
      console.error(
        "onProfileClick prop is NOT connected in App.tsx"
      );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT AMOUNT
  // =====================================================

  const formatAmount = (amount: string) => {
    if (!amount) {
      return "₹0";
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return `₹${amount}`;
    }

    return `₹${numericAmount.toLocaleString(
      "en-IN"
    )}`;
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "approved";

      case "PENDING":
        return "pending";

      case "REJECTED":
        return "rejected";

      case "UNDER_REVIEW":
        return "review";

      default:
        return "pending";
    }
  };

  // =====================================================
  // DEADLINE LABEL
  // =====================================================

  const getDeadlineLabel = (deadline: string) => {
    if (!deadline) {
      return "No deadline";
    }

    const today = new Date();
    const deadlineDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const difference =
      deadlineDate.getTime() -
      today.getTime();

    const days = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

    if (days < 0) {
      return "Expired";
    }

    if (days === 0) {
      return "Today";
    }

    if (days === 1) {
      return "1 day left";
    }

    return `${days} days left`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="pd-loading-screen">
        <div className="pd-loading-card">

          <div className="pd-loading-spinner"></div>

          <h3>
            Loading Provider Dashboard...
          </h3>

          <p>
            Please wait while we fetch your
            dashboard data.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="pd-error-screen">

        <div className="pd-error-card">

          <div className="pd-error-icon">
            !
          </div>

          <h2>
            Unable to Load Dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="pd-retry-btn"
            onClick={fetchDashboardData}
          >
            Try Again
          </button>

          <button
            type="button"
            className="pd-login-btn"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
          >
            Login Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // NO DATA
  // =====================================================

  if (!dashboardData) {
    return (
      <div className="pd-error-screen">

        <div className="pd-error-card">

          <h2>
            No Dashboard Data
          </h2>

          <p>
            Provider dashboard data is
            currently unavailable.
          </p>

          <button
            type="button"
            className="pd-retry-btn"
            onClick={fetchDashboardData}
          >
            Refresh
          </button>

        </div>

      </div>
    );
  }

  const provider =
    dashboardData.provider;

  const scholarshipStats =
    dashboardData.scholarship_stats;

  const applicationStats =
    dashboardData.application_stats;

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="pd-shell">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="pd-sidebar">

        {/* BRAND */}

        <div className="pd-brand">

          <div className="pd-brand-icon">
            🎓
          </div>

          <div>

            <h2>
              ScholarBridge AI
            </h2>

            <span>
              Provider Portal
            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="pd-nav">

          {/* DASHBOARD */}

          <button
            type="button"
            className={`pd-nav-item ${
              activeNav === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={handleDashboardNavigation}
          >

            <span className="pd-nav-icon">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >

                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />

              </svg>

            </span>

            Dashboard

          </button>

          {/* SCHOLARSHIPS */}

          <button
            type="button"
            className={`pd-nav-item ${
              activeNav === "scholarships"
                ? "active"
                : ""
            }`}
            onClick={
              handleScholarshipsNavigation
            }
          >

            <span className="pd-nav-icon">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >

                <path
                  d="M12 3L20 7L12 11L4 7L12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                <path
                  d="M6 9.5V14C6 16.2 8.7 18 12 18C15.3 18 18 16.2 18 14V9.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M20 7V14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

              </svg>

            </span>

            Scholarships

          </button>

          {/* APPLICATIONS */}

          <button
            type="button"
            className={`pd-nav-item ${
              activeNav === "applications"
                ? "active"
                : ""
            }`}
            onClick={
              handleApplicationsNavigation
            }
          >

            <span className="pd-nav-icon">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >

                <rect
                  x="4"
                  y="3"
                  width="16"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M8 8H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M8 16H13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

              </svg>

            </span>

            Applications

          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className={`pd-nav-item ${
              activeNav === "notifications"
                ? "active"
                : ""
            }`}
            onClick={
              handleNotificationsNavigation
            }
          >

            <span className="pd-nav-icon">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >

                <path
                  d="M18 9C18 5.7 15.8 3 12 3C8.2 3 6 5.7 6 9C6 14 4 15 4 17H20C20 15 18 14 18 9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M10 20H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

              </svg>

            </span>

            Notifications

            {unreadNotificationCount > 0 && (
              <span className="pd-nav-badge">
                {unreadNotificationCount}
              </span>
            )}

          </button>

          {/* PROFILE */}

          <button
            type="button"
            className={`pd-nav-item ${
              activeNav === "profile"
                ? "active"
                : ""
            }`}
            onClick={handleProfileNavigation}
          >

            <span className="pd-nav-icon">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M4 21C4.7 16.9 7.4 15 12 15C16.6 15 19.3 16.9 20 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

              </svg>

            </span>

            Provider Profile

          </button>

        </nav>

        <div className="pd-spacer"></div>

        {/* PROVIDER CARD */}

        <div className="pd-provider-card">

          <div className="pd-provider-avatar">

            {provider.organization_name
              ? provider.organization_name
                  .charAt(0)
                  .toUpperCase()
              : "P"}

          </div>

          <div className="pd-provider-info">

            <strong>
              {provider.organization_name ||
                "Provider"}
            </strong>

            <span>

              {provider.verification_status ===
              "VERIFIED"
                ? "Verified Provider"
                : provider.verification_status ||
                  "Pending Verification"}

            </span>

          </div>

          <span className="pd-verified-icon">
            ✓
          </span>

        </div>

        {/* LOGOUT */}

        <div className="pd-logout-wrap">

          <button
            type="button"
            className="pd-logout"
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

            Logout

          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="pd-main">

        {/* HEADER */}

        <header className="pd-header">

          <div>

            <p className="pd-eyebrow">
              PROVIDER DASHBOARD
            </p>

            <h1>
              Welcome back,{" "}
              {provider.contact_person ||
                provider.organization_name ||
                "Provider"}{" "}
              👋
            </h1>

            <p className="pd-header-subtitle">
              Manage your scholarships and
              applications from one place.
            </p>

          </div>

          <div className="pd-header-right">

            <div className="pd-header-org">

              <span className="pd-org-label">
                Organization
              </span>

              <strong>
                {provider.organization_name}
              </strong>

            </div>

            <div className="pd-header-avatar">

              {provider.organization_name
                ? provider.organization_name
                    .charAt(0)
                    .toUpperCase()
                : "P"}

            </div>

          </div>

        </header>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="pd-quick-section">

          <div className="pd-section-heading">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your scholarship activities
                quickly.
              </p>

            </div>

          </div>

          <div className="pd-quick-grid">

            {/* CREATE SCHOLARSHIP */}

            <button
              type="button"
              className="pd-quick-card"
              onClick={
                handleCreateScholarshipNavigation
              }
            >

              <div className="pd-quick-icon create">
                +
              </div>

              <div>

                <strong>
                  Create Scholarship
                </strong>

                <span>
                  Publish a new scholarship
                </span>

              </div>

              <span className="pd-arrow">
                →
              </span>

            </button>

            {/* APPLICATIONS */}

            <button
              type="button"
              className="pd-quick-card"
              onClick={
                handleApplicationsNavigation
              }
            >

              <div className="pd-quick-icon applications">

                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <rect
                    x="4"
                    y="3"
                    width="16"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M8 8H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 12H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 16H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                </svg>

              </div>

              <div>

                <strong>
                  View Applications
                </strong>

                <span>
                  Review student applications
                </span>

              </div>

              <span className="pd-arrow">
                →
              </span>

            </button>

            {/* HELP & SUPPORT */}

            <button
              type="button"
              className="pd-quick-card"
              onClick={
                handleHelpSupportNavigation
              }
            >

              <div className="pd-quick-icon help">
                ?
              </div>

              <div>

                <strong>
                  Help & Support
                </strong>

                <span>
                  Get assistance
                </span>

              </div>

              <span className="pd-arrow">
                →
              </span>

            </button>

          </div>

        </section>

        {/* =================================================
            SCHOLARSHIP STATISTICS
        ================================================= */}

        <section className="pd-stats-section">

          <div className="pd-section-heading">

            <div>

              <h2>
                Scholarship Overview
              </h2>

              <p>
                Track your scholarship performance.
              </p>

            </div>

          </div>

          <div className="pd-stats-grid">

            {/* TOTAL */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon total">
                  🎓
                </div>

                <span className="pd-stat-label">
                  Total Scholarships
                </span>

              </div>

              <strong className="pd-stat-number">
                {scholarshipStats.total}
              </strong>

              <span className="pd-stat-description">
                All scholarships created
              </span>

            </div>

            {/* APPROVED */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon approved">
                  ✓
                </div>

                <span className="pd-stat-label">
                  Approved
                </span>

              </div>

              <strong className="pd-stat-number">
                {scholarshipStats.approved}
              </strong>

              <span className="pd-stat-description">
                Approved scholarships
              </span>

            </div>

            {/* PENDING */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon pending">
                  ⏳
                </div>

                <span className="pd-stat-label">
                  Pending
                </span>

              </div>

              <strong className="pd-stat-number">
                {scholarshipStats.pending}
              </strong>

              <span className="pd-stat-description">
                Awaiting approval
              </span>

            </div>

            {/* REJECTED */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon rejected">
                  ×
                </div>

                <span className="pd-stat-label">
                  Rejected
                </span>

              </div>

              <strong className="pd-stat-number">
                {scholarshipStats.rejected}
              </strong>

              <span className="pd-stat-description">
                Rejected scholarships
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            APPLICATION STATISTICS
        ================================================= */}

        <section className="pd-stats-section">

          <div className="pd-section-heading">

            <div>

              <h2>
                Application Overview
              </h2>

              <p>
                Track student applications.
              </p>

            </div>

          </div>

          <div className="pd-stats-grid">

            {/* TOTAL APPLICATIONS */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon total">
                  👥
                </div>

                <span className="pd-stat-label">
                  Total Applications
                </span>

              </div>

              <strong className="pd-stat-number">
                {applicationStats.total}
              </strong>

              <span className="pd-stat-description">
                Applications received
              </span>

            </div>

            {/* PENDING */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon pending">
                  ⏳
                </div>

                <span className="pd-stat-label">
                  Pending
                </span>

              </div>

              <strong className="pd-stat-number">
                {applicationStats.pending}
              </strong>

              <span className="pd-stat-description">
                Waiting for review
              </span>

            </div>

            {/* UNDER REVIEW */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon review">
                  🔍
                </div>

                <span className="pd-stat-label">
                  Under Review
                </span>

              </div>

              <strong className="pd-stat-number">
                {applicationStats.under_review}
              </strong>

              <span className="pd-stat-description">
                Currently reviewing
              </span>

            </div>

            {/* APPROVED */}

            <div className="pd-stat-card">

              <div className="pd-stat-top">

                <div className="pd-stat-icon approved">
                  ✓
                </div>

                <span className="pd-stat-label">
                  Approved
                </span>

              </div>

              <strong className="pd-stat-number">
                {applicationStats.approved}
              </strong>

              <span className="pd-stat-description">
                Approved applications
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            RECENT SCHOLARSHIPS + DEADLINES
        ================================================= */}

        <section className="pd-dashboard-grid">

          {/* RECENT SCHOLARSHIPS */}

          <div className="pd-panel">

            <div className="pd-panel-header">

              <div>

                <h2>
                  Recent Scholarships
                </h2>

                <p>
                  Your latest scholarship listings.
                </p>

              </div>

              <button
                type="button"
                className="pd-view-all"
                onClick={
                  handleScholarshipsNavigation
                }
              >
                View All →
              </button>

            </div>

            <div className="pd-panel-content">

              {dashboardData.recent_scholarships
                .length === 0 ? (

                <div className="pd-empty-state">

                  <div className="pd-empty-icon">
                    🎓
                  </div>

                  <h3>
                    No scholarships available yet
                  </h3>

                  <p>
                    Create your first scholarship
                    to see it here.
                  </p>

                </div>

              ) : (

                dashboardData.recent_scholarships.map(
                  (scholarship) => (

                    <div
                      className="pd-list-item"
                      key={scholarship.id}
                    >

                      <div className="pd-list-icon">
                        🎓
                      </div>

                      <div className="pd-list-info">

                        <strong>
                          {scholarship.title}
                        </strong>

                        <span>
                          {formatAmount(
                            scholarship.amount
                          )}
                        </span>

                      </div>

                      <div className="pd-list-right">

                        <span
                          className={`pd-status ${getStatusClass(
                            scholarship.status
                          )}`}
                        >
                          {scholarship.status}
                        </span>

                        <small>
                          Deadline:{" "}
                          {formatDate(
                            scholarship.deadline
                          )}
                        </small>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

          {/* UPCOMING DEADLINES */}

          <div className="pd-panel">

            <div className="pd-panel-header">

              <div>

                <h2>
                  Upcoming Deadlines
                </h2>

                <p>
                  Keep track of scholarship deadlines.
                </p>

              </div>

            </div>

            <div className="pd-panel-content">

              {dashboardData.upcoming_deadlines
                .length === 0 ? (

                <div className="pd-empty-state">

                  <div className="pd-empty-icon">
                    📅
                  </div>

                  <h3>
                    No upcoming deadlines
                  </h3>

                  <p>
                    Approved scholarships with
                    deadlines will appear here.
                  </p>

                </div>

              ) : (

                dashboardData.upcoming_deadlines.map(
                  (scholarship) => (

                    <div
                      className="pd-deadline-item"
                      key={scholarship.id}
                    >

                      <div className="pd-calendar-icon">
                        📅
                      </div>

                      <div className="pd-deadline-info">

                        <strong>
                          {scholarship.title}
                        </strong>

                        <span>
                          {formatDate(
                            scholarship.deadline
                          )}
                        </span>

                      </div>

                      <span className="pd-deadline-badge">
                        {getDeadlineLabel(
                          scholarship.deadline
                        )}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* =================================================
            RECENT APPLICATIONS
        ================================================= */}

        <section className="pd-panel pd-applications-panel">

          <div className="pd-panel-header">

            <div>

              <h2>
                Recent Applications
              </h2>

              <p>
                Latest applications received from
                students.
              </p>

            </div>

            <button
              type="button"
              className="pd-view-all"
              onClick={
                handleApplicationsNavigation
              }
            >
              View All →
            </button>

          </div>

          <div className="pd-panel-content">

            {dashboardData.recent_applications
              .length === 0 ? (

              <div className="pd-empty-state">

                <div className="pd-empty-icon">
                  👥
                </div>

                <h3>
                  No applications received yet
                </h3>

                <p>
                  Student applications will appear
                  here when they apply to your
                  scholarships.
                </p>

              </div>

            ) : (

              <div className="pd-application-list">

                {dashboardData.recent_applications.map(
                  (application) => (

                    <div
                      className="pd-application-row"
                      key={application.id}
                    >

                      <div className="pd-student-avatar">

                        {application.student_email
                          ? application.student_email
                              .charAt(0)
                              .toUpperCase()
                          : "S"}

                      </div>

                      <div className="pd-application-info">

                        <strong>
                          {application.student_email}
                        </strong>

                        <span>
                          {application.scholarship_title}
                        </span>

                      </div>

                      <div className="pd-application-date">

                        <small>
                          Applied On
                        </small>

                        <span>
                          {formatDate(
                            application.applied_at
                          )}
                        </span>

                      </div>

                      <span
                        className={`pd-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status_display ||
                          application.status}
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

        {/* =================================================
            PROVIDER PROFILE SUMMARY
        ================================================= */}

        <section className="pd-profile-summary">

          <div className="pd-profile-summary-left">

            <div className="pd-profile-summary-avatar">

              {provider.organization_name
                ? provider.organization_name
                    .charAt(0)
                    .toUpperCase()
                : "P"}

            </div>

            <div>

              <span className="pd-profile-summary-label">
                PROVIDER PROFILE
              </span>

              <h2>
                {provider.organization_name}
              </h2>

              <p>
                {provider.organization_type}
              </p>

            </div>

          </div>

          <div className="pd-profile-details">

            <div>

              <span>
                Contact Person
              </span>

              <strong>
                {provider.contact_person ||
                  "Not provided"}
              </strong>

            </div>

            <div>

              <span>
                Email
              </span>

              <strong>
                {provider.email}
              </strong>

            </div>

            <div>

              <span>
                Verification
              </span>

              <strong
                className={
                  provider.verification_status ===
                  "VERIFIED"
                    ? "pd-profile-verified"
                    : "pd-profile-pending"
                }
              >
                {provider.verification_status}
              </strong>

            </div>

          </div>

        </section>

      </main>

      {/* =================================================
          LOGOUT CONFIRMATION POPUP
      ================================================= */}

      {showLogoutPopup && (
        <div
          className="pd-logout-modal-overlay"
          onClick={cancelLogout}
        >

          <div
            className="pd-logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pd-logout-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="pd-logout-modal-icon">

              <svg
                width="28"
                height="28"
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

            </div>

            <h2 id="pd-logout-title">
              Are you sure you want to exit?
            </h2>

            <p>
              You will be logged out of your
              Provider account.
            </p>

            <div className="pd-logout-modal-actions">

              <button
                type="button"
                className="pd-logout-cancel-btn"
                onClick={cancelLogout}
              >
                Cancel
              </button>

              <button
                type="button"
                className="pd-logout-confirm-btn"
                onClick={confirmLogout}
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ProviderDashboard;