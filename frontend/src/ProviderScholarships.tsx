import React, { useEffect, useState } from "react";
import "./ProviderScholarships.css";

interface ProviderScholarshipsProps {
  onBackToDashboard?: () => void;
  onApplicationsClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  type_display?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsResponse {
  success: boolean;
  unread_count: number;
  notifications: NotificationItem[];
}

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: string;
  application_start: string;
  deadline: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
  status_display: string;
  created_at: string;
  provider?: {
    id: number;
    organization_name: string;
  };
}

interface ScholarshipsResponse {
  success: boolean;
  count: number;
  scholarships: Scholarship[];
}

const ProviderScholarships: React.FC<
  ProviderScholarshipsProps
> = ({
  onBackToDashboard,
  onApplicationsClick,
  onNotificationsClick,
  onProfileClick,
}) => {
  const [activeNav, setActiveNav] =
    useState<string>("scholarships");

  const [notificationCount, setNotificationCount] =
    useState<number>(0);

  const [scholarships, setScholarships] =
    useState<Scholarship[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [statusFilter, setStatusFilter] =
    useState<string>("ALL");

  /*
   * =====================================================
   * FETCH PROVIDER SCHOLARSHIPS
   * =====================================================
   */

  const fetchProviderScholarships = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("provider_token") ||
        sessionStorage.getItem("provider_token");

      if (!token) {
        setError(
          "Provider authentication token not found. Please login again."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/scholarships/provider/",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: ScholarshipsResponse =
        await response.json();

      if (!response.ok || !data.success) {
        setError(
          (data as any).message ||
            "Unable to fetch scholarships."
        );

        setLoading(false);
        return;
      }

      setScholarships(
        data.scholarships || []
      );

      setLoading(false);

    } catch (err) {
      console.error(
        "Provider Scholarships API Error:",
        err
      );

      setError(
        "Unable to connect to the scholarship server. Please make sure Django server is running."
      );

      setLoading(false);
    }
  };

  /*
   * =====================================================
   * FETCH NOTIFICATION COUNT
   * =====================================================
   */

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token =
          localStorage.getItem("provider_token") ||
          sessionStorage.getItem("provider_token");

        if (!token) {
          console.warn(
            "Provider token not found."
          );
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

        if (!response.ok) {
          console.error(
            "Failed to fetch notifications:",
            response.status
          );
          return;
        }

        const data: NotificationsResponse =
          await response.json();

        if (data.success) {
          setNotificationCount(
            data.unread_count ?? 0
          );
        }
      } catch (error) {
        console.error(
          "Notification count error:",
          error
        );
      }
    };

    fetchNotificationCount();
  }, []);

  /*
   * =====================================================
   * LOAD SCHOLARSHIPS
   * =====================================================
   */

  useEffect(() => {
    fetchProviderScholarships();
  }, []);

  /*
   * =====================================================
   * DASHBOARD NAVIGATION
   * =====================================================
   */

  const handleBackToDashboard = () => {
    console.log(
      "Dashboard clicked from Provider Scholarships"
    );

    setActiveNav("dashboard");

    if (
      typeof onBackToDashboard ===
      "function"
    ) {
      onBackToDashboard();
    } else {
      console.error(
        "onBackToDashboard prop is NOT connected in App.tsx"
      );
    }
  };

  /*
   * =====================================================
   * APPLICATIONS NAVIGATION
   * =====================================================
   */

  const handleApplicationsNavigation = () => {
    console.log(
      "Applications clicked from Provider Scholarships"
    );

    setActiveNav("applications");

    if (
      typeof onApplicationsClick ===
      "function"
    ) {
      onApplicationsClick();
    } else {
      console.error(
        "onApplicationsClick prop is NOT connected in App.tsx"
      );
    }
  };

  /*
   * =====================================================
   * NOTIFICATIONS NAVIGATION
   * =====================================================
   */

  const handleNotificationsNavigation = () => {
    console.log(
      "Notifications clicked from Provider Scholarships"
    );

    setActiveNav("notifications");

    if (
      typeof onNotificationsClick ===
      "function"
    ) {
      onNotificationsClick();
    } else {
      console.error(
        "onNotificationsClick prop is NOT connected in App.tsx"
      );
    }
  };

  /*
   * =====================================================
   * PROFILE NAVIGATION
   * =====================================================
   */

  const handleProfileNavigation = () => {
    console.log(
      "Provider Profile clicked from Provider Scholarships"
    );

    setActiveNav("profile");

    if (
      typeof onProfileClick ===
      "function"
    ) {
      onProfileClick();
    } else {
      console.error(
        "onProfileClick prop is NOT connected in App.tsx"
      );
    }
  };

  /*
   * =====================================================
   * FILTER SCHOLARSHIPS
   * =====================================================
   */

  const filteredScholarships =
    scholarships.filter(
      (scholarship) => {

        const matchesSearch =
          scholarship.title
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "ALL" ||
          scholarship.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  /*
   * =====================================================
   * STATISTICS
   * =====================================================
   */

  const totalScholarships =
    scholarships.length;

  const approvedScholarships =
    scholarships.filter(
      (scholarship) =>
        scholarship.status ===
        "APPROVED"
    ).length;

  const pendingScholarships =
    scholarships.filter(
      (scholarship) =>
        scholarship.status ===
        "PENDING"
    ).length;

  const rejectedScholarships =
    scholarships.filter(
      (scholarship) =>
        scholarship.status ===
        "REJECTED"
    ).length;

  /*
   * =====================================================
   * FORMAT DATE
   * =====================================================
   */

  const formatDate = (
    dateString: string
  ) => {
    if (!dateString) {
      return "—";
    }

    const date =
      new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * =====================================================
   * STATUS CLASS
   * =====================================================
   */

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "APPROVED":
        return "approved";

      case "PENDING":
        return "pending";

      case "REJECTED":
        return "rejected";

      case "CLOSED":
        return "closed";

      default:
        return "";
    }
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="ps-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="ps-sidebar">

        <div className="ps-brand">

          <div className="ps-brand-icon">
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

        <nav className="ps-navigation">

          {/* DASHBOARD */}

          <button
            type="button"
            className={`ps-nav-item ${
              activeNav === "dashboard"
                ? "ps-active"
                : ""
            }`}
            onClick={
              handleBackToDashboard
            }
          >

            <span className="ps-nav-icon">

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

            <span>
              Dashboard
            </span>

          </button>

          {/* SCHOLARSHIPS */}

          <button
            type="button"
            className={`ps-nav-item ${
              activeNav === "scholarships"
                ? "ps-active"
                : ""
            }`}
            onClick={() =>
              setActiveNav(
                "scholarships"
              )
            }
          >

            <span className="ps-nav-icon">

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

            <span>
              Scholarships
            </span>

          </button>

          {/* APPLICATIONS */}

          <button
            type="button"
            className={`ps-nav-item ${
              activeNav === "applications"
                ? "ps-active"
                : ""
            }`}
            onClick={
              handleApplicationsNavigation
            }
          >

            <span className="ps-nav-icon">

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

            <span>
              Applications
            </span>

          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className={`ps-nav-item ${
              activeNav === "notifications"
                ? "ps-active"
                : ""
            }`}
            onClick={
              handleNotificationsNavigation
            }
          >

            <span className="ps-nav-icon">

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

            <span>
              Notifications
            </span>

            {notificationCount > 0 && (
              <span className="ps-nav-badge">
                {notificationCount}
              </span>
            )}

          </button>

          {/* PROVIDER PROFILE */}

          <button
            type="button"
            className={`ps-nav-item ${
              activeNav === "profile"
                ? "ps-active"
                : ""
            }`}
            onClick={
              handleProfileNavigation
            }
          >

            <span className="ps-nav-icon">

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

            <span>
              Provider Profile
            </span>

          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="ps-sidebar-bottom">

          <div className="ps-provider-mini">

            <div className="ps-provider-avatar">
              P
            </div>

            <div>

              <strong>
                Provider Account
              </strong>

              <span>
                Provider Portal
              </span>

            </div>

          </div>

          <button
            type="button"
            className="ps-logout"
            onClick={() => {

              const confirmLogout =
                window.confirm(
                  "Are you sure you want to logout?"
                );

              if (!confirmLogout) {
                return;
              }

              localStorage.removeItem(
                "provider_token"
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
                "provider_user_id"
              );

              sessionStorage.removeItem(
                "provider_email"
              );

              sessionStorage.removeItem(
                "provider_role"
              );

              window.location.reload();
            }}
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="ps-main">

        {/* HEADER */}

        <header className="ps-header">

          <div className="ps-header-left">

            <div className="ps-title-section">

              <div className="ps-title-label">
                PROVIDER PORTAL
              </div>

              <h1>
                Scholarships
              </h1>

              <p>
                Create, manage and monitor your
                scholarship programs.
              </p>

            </div>

          </div>

          <button
            type="button"
            className="ps-create-button"
          >

            <span className="ps-create-plus">
              +
            </span>

            Create Scholarship

          </button>

        </header>

        {/* ===================================================
            STATISTICS
            =================================================== */}

        <section className="ps-stats">

          {/* TOTAL */}

          <div className="ps-stat-card">

            <div className="ps-stat-icon total">
              🎓
            </div>

            <div>

              <span>
                Total Scholarships
              </span>

              <h2>
                {totalScholarships}
              </h2>

              <small>
                All scholarships
              </small>

            </div>

          </div>

          {/* APPROVED */}

          <div className="ps-stat-card">

            <div className="ps-stat-icon approved">
              ✓
            </div>

            <div>

              <span>
                Approved
              </span>

              <h2>
                {approvedScholarships}
              </h2>

              <small>
                Active scholarships
              </small>

            </div>

          </div>

          {/* PENDING */}

          <div className="ps-stat-card">

            <div className="ps-stat-icon pending">
              ⏳
            </div>

            <div>

              <span>
                Pending
              </span>

              <h2>
                {pendingScholarships}
              </h2>

              <small>
                Awaiting approval
              </small>

            </div>

          </div>

          {/* REJECTED */}

          <div className="ps-stat-card">

            <div className="ps-stat-icon rejected">
              !
            </div>

            <div>

              <span>
                Rejected
              </span>

              <h2>
                {rejectedScholarships}
              </h2>

              <small>
                Requires attention
              </small>

            </div>

          </div>

        </section>

        {/* ===================================================
            SCHOLARSHIP MANAGEMENT
            =================================================== */}

        <section className="ps-content-card">

          <div className="ps-toolbar">

            <div>

              <h2>
                Manage Scholarships
              </h2>

              <p>
                View and manage all scholarships
                created by your organization.
              </p>

            </div>

            <div className="ps-filters">

              {/* SEARCH */}

              <div className="ps-search">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search scholarships..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* STATUS */}

              <select
                className="ps-status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="ALL">
                  All Status
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="CLOSED">
                  Closed
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              LOADING
              ================================================= */}

          {loading && (

            <div className="ps-empty-state">

              <div className="ps-empty-icon">
                ⏳
              </div>

              <h3>
                Loading Scholarships...
              </h3>

              <p>
                Please wait while we fetch your
                scholarship programs.
              </p>

            </div>

          )}

          {/* =================================================
              ERROR
              ================================================= */}

          {!loading && error && (

            <div className="ps-empty-state">

              <div className="ps-empty-icon">
                ⚠️
              </div>

              <h3>
                Unable to Load Scholarships
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="ps-empty-create"
                onClick={
                  fetchProviderScholarships
                }
              >
                Try Again
              </button>

            </div>

          )}

          {/* =================================================
              EMPTY STATE
              ================================================= */}

          {!loading &&
            !error &&
            scholarships.length === 0 && (

              <div className="ps-empty-state">

                <div className="ps-empty-icon">
                  🎓
                </div>

                <h3>
                  No Scholarships Yet
                </h3>

                <p>
                  You haven't created any
                  scholarships yet. Create your
                  first scholarship to start
                  receiving applications.
                </p>

                <button
                  type="button"
                  className="ps-empty-create"
                >

                  <span>
                    +
                  </span>

                  Create Your First Scholarship

                </button>

              </div>

            )}

          {/* =================================================
              NO FILTER RESULTS
              ================================================= */}

          {!loading &&
            !error &&
            scholarships.length > 0 &&
            filteredScholarships.length === 0 && (

              <div className="ps-empty-state">

                <div className="ps-empty-icon">
                  🔍
                </div>

                <h3>
                  No Matching Scholarships
                </h3>

                <p>
                  No scholarship matches your
                  current search or status filter.
                </p>

              </div>

            )}

          {/* =================================================
              SCHOLARSHIP LIST
              ================================================= */}

          {!loading &&
            !error &&
            filteredScholarships.length > 0 && (

              <div
                className="ps-scholarship-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  padding: "24px",
                }}
              >

                {filteredScholarships.map(
                  (scholarship) => (

                    <div
                      key={scholarship.id}
                      className="ps-scholarship-item"
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "14px",
                        padding: "20px",
                        background: "#ffffff",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: "20px",
                        }}
                      >

                        <div
                          style={{
                            flex: 1,
                          }}
                        >

                          <h3
                            style={{
                              margin:
                                "0 0 8px",
                              fontSize:
                                "20px",
                              fontWeight:
                                700,
                            }}
                          >
                            {scholarship.title}
                          </h3>

                          <p
                            style={{
                              margin:
                                "0 0 14px",
                              color:
                                "#64748b",
                              lineHeight:
                                1.6,
                            }}
                          >
                            {scholarship.description}
                          </p>

                          <div
                            style={{
                              display:
                                "flex",
                              flexWrap:
                                "wrap",
                              gap:
                                "18px",
                              fontSize:
                                "14px",
                              color:
                                "#475569",
                            }}
                          >

                            <span>
                              💰 ₹
                              {Number(
                                scholarship.amount
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <span>
                              📅 Start:{" "}
                              {formatDate(
                                scholarship.application_start
                              )}
                            </span>

                            <span>
                              ⏰ Deadline:{" "}
                              {formatDate(
                                scholarship.deadline
                              )}
                            </span>

                          </div>

                        </div>

                        <div>
                          <span
                            className={`ps-status-badge ${getStatusClass(
                              scholarship.status
                            )}`}
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "7px 13px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "13px",
                              fontWeight:
                                700,
                              background:
                                scholarship.status ===
                                "APPROVED"
                                  ? "#dcfce7"
                                  : scholarship.status ===
                                    "PENDING"
                                  ? "#fef3c7"
                                  : scholarship.status ===
                                    "REJECTED"
                                  ? "#fee2e2"
                                  : "#e2e8f0",
                              color:
                                scholarship.status ===
                                "APPROVED"
                                  ? "#166534"
                                  : scholarship.status ===
                                    "PENDING"
                                  ? "#92400e"
                                  : scholarship.status ===
                                    "REJECTED"
                                  ? "#991b1b"
                                  : "#475569",
                            }}
                          >
                            {scholarship.status_display}
                          </span>
                        </div>

                      </div>

                      <div
                        style={{
                          marginTop:
                            "16px",
                          paddingTop:
                            "14px",
                          borderTop:
                            "1px solid #f1f5f9",
                          fontSize:
                            "13px",
                          color:
                            "#64748b",
                        }}
                      >
                        Created on{" "}
                        {formatDate(
                          scholarship.created_at
                        )}
                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

        {/* ===================================================
            BOTTOM INFORMATION CARD
            =================================================== */}

        <section className="ps-info-card">

          <div className="ps-info-icon">
            💡
          </div>

          <div>

            <h3>
              Manage your scholarship
              opportunities
            </h3>

            <p>
              Create scholarships with eligibility
              criteria, required documents,
              deadlines and funding details.
            </p>

          </div>

          <button
            type="button"
            className="ps-info-button"
          >
            Create Scholarship →
          </button>

        </section>

      </main>

    </div>
  );
};

export default ProviderScholarships;