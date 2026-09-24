import React, { useEffect, useMemo, useState } from "react";
import "./ProviderApplications.css";
import ProviderStudentDetails from "./ProviderStudentDetails";

interface ProviderApplicationsProps {
  onBackToDashboard?: () => void;
  onScholarshipsClick?: () => void;
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

interface StudentInfo {
  id: number;
  name: string;
  email: string;
}

interface ScholarshipInfo {
  id: number;
  title: string;
}

interface ProviderInfo {
  id: number;
  organization_name: string;
}

interface ApplicationItem {
  id: number;
  student: StudentInfo;
  scholarship: ScholarshipInfo;
  provider: ProviderInfo;
  applied_at: string;
  status: string;
  status_display: string;
}

interface ApplicationsResponse {
  success: boolean;
  count: number;
  applications: ApplicationItem[];
}

const ProviderApplications: React.FC<
  ProviderApplicationsProps
> = ({
  onBackToDashboard,
  onScholarshipsClick,
  onNotificationsClick,
  onProfileClick,
}) => {
  const [activeNav, setActiveNav] =
    useState("applications");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [notificationCount, setNotificationCount] =
    useState<number>(0);

  const [applications, setApplications] =
    useState<ApplicationItem[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [
    updatingApplicationId,
    setUpdatingApplicationId,
  ] = useState<number | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  /*
   * ============================================================
   * STUDENT DETAILS PAGE
   * ============================================================
   */

  const [
    selectedApplicationId,
    setSelectedApplicationId,
  ] = useState<number | null>(null);

  /*
   * ============================================================
   * GET PROVIDER TOKEN
   * ============================================================
   */

  const getProviderToken = () => {
    return (
      localStorage.getItem("provider_token") ||
      sessionStorage.getItem("provider_token")
    );
  };

  /*
   * ============================================================
   * FETCH NOTIFICATION COUNT
   * ============================================================
   */

  useEffect(() => {
    const fetchNotificationCount =
      async () => {
        try {
          const token =
            getProviderToken();

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
                "Content-Type":
                  "application/json",
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
   * ============================================================
   * FETCH PROVIDER APPLICATIONS
   * ============================================================
   */

  const fetchApplications =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          getProviderToken();

        if (!token) {
          setError(
            "Provider session not found. Please login again."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/application/api/provider/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        const data: ApplicationsResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            (data as any)?.message ||
              "Failed to fetch applications."
          );
        }

        if (data.success) {
          setApplications(
            Array.isArray(
              data.applications
            )
              ? data.applications
              : []
          );
        } else {
          setApplications([]);
          setError(
            "Unable to load applications."
          );
        }
      } catch (error) {
        console.error(
          "Provider applications error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading applications."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchApplications();
  }, []);

  /*
   * ============================================================
   * OPEN STUDENT DETAILS PAGE
   * ============================================================
   */

  const openStudentDetails = (
    applicationId: number
  ) => {
    setSelectedApplicationId(
      applicationId
    );
  };

  /*
   * ============================================================
   * BACK FROM STUDENT DETAILS PAGE
   * ============================================================
   */

  const handleBackFromStudentDetails =
    () => {
      setSelectedApplicationId(null);
    };

  /*
   * ============================================================
   * UPDATE APPLICATION STATUS
   * ============================================================
   */

  const updateApplicationStatus =
    async (
      applicationId: number,
      newStatus: string
    ) => {
      try {
        setUpdatingApplicationId(
          applicationId
        );

        setError("");
        setSuccessMessage("");

        const token =
          getProviderToken();

        if (!token) {
          setError(
            "Provider session not found. Please login again."
          );
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:8000/application/api/provider/${applicationId}/status/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to update application status."
          );
        }

        if (data.success) {
          /*
           * ====================================================
           * UPDATE APPLICATION LIST
           * ====================================================
           */

          setApplications(
            (previousApplications) =>
              previousApplications.map(
                (application) =>
                  application.id ===
                  applicationId
                    ? {
                        ...application,
                        status:
                          data
                            .application
                            ?.status ||
                          newStatus,
                        status_display:
                          data
                            .application
                            ?.status_display ||
                          getStatusDisplay(
                            newStatus
                          ),
                      }
                    : application
              )
          );

          /*
           * ====================================================
           * SUCCESS MESSAGE
           * ====================================================
           */

          const statusText =
            getStatusDisplay(
              newStatus
            );

          setSuccessMessage(
            `Application status updated to ${statusText}. Student notification has been sent.`
          );

          /*
           * ====================================================
           * REFRESH PROVIDER NOTIFICATION COUNT
           * ====================================================
           */

          const notificationResponse =
            await fetch(
              "http://127.0.0.1:8000/api/notifications/",
              {
                method: "GET",
                headers: {
                  Authorization: `Token ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );

          if (
            notificationResponse.ok
          ) {
            const notificationData: NotificationsResponse =
              await notificationResponse.json();

            if (
              notificationData.success
            ) {
              setNotificationCount(
                notificationData.unread_count ??
                  0
              );
            }
          }

          /*
           * ====================================================
           * AUTO REFRESH APPLICATION LIST
           * ====================================================
           */

          await fetchApplications();

          /*
           * ====================================================
           * REMOVE SUCCESS MESSAGE
           * ====================================================
           */

          setTimeout(() => {
            setSuccessMessage("");
          }, 4000);
        } else {
          setError(
            data?.message ||
              "Application status could not be updated."
          );
        }
      } catch (error) {
        console.error(
          "Update application status error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while updating application status."
        );
      } finally {
        setUpdatingApplicationId(
          null
        );
      }
    };

  /*
   * ============================================================
   * STATUS DISPLAY HELPER
   * ============================================================
   */

  const getStatusDisplay = (
    status: string
  ): string => {
    switch (status) {
      case "PENDING":
        return "Pending";

      case "UNDER_REVIEW":
        return "Under Review";

      case "APPROVED":
        return "Approved";

      case "REJECTED":
        return "Rejected";

      default:
        return status;
    }
  };

  /*
   * ============================================================
   * STATUS CLASS HELPER
   * ============================================================
   */

  const getStatusClass = (
    status: string
  ): string => {
    switch (status) {
      case "PENDING":
        return "pending";

      case "UNDER_REVIEW":
        return "under-review";

      case "APPROVED":
        return "approved";

      case "REJECTED":
        return "rejected";

      default:
        return "";
    }
  };

  /*
   * ============================================================
   * FILTER APPLICATIONS
   * ============================================================
   */

  const filteredApplications =
    useMemo(() => {
      return applications.filter(
        (application) => {
          const search =
            searchTerm
              .trim()
              .toLowerCase();

          const matchesSearch =
            !search ||
            application.student.name
              .toLowerCase()
              .includes(search) ||
            application.student.email
              .toLowerCase()
              .includes(search) ||
            application.scholarship.title
              .toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter === "All" ||
            application.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      applications,
      searchTerm,
      statusFilter,
    ]);

  /*
   * ============================================================
   * STATISTICS
   * ============================================================
   */

  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status ===
        "PENDING"
    ).length;

  const underReviewApplications =
    applications.filter(
      (application) =>
        application.status ===
        "UNDER_REVIEW"
    ).length;

  const approvedApplications =
    applications.filter(
      (application) =>
        application.status ===
        "APPROVED"
    ).length;

  /*
   * ============================================================
   * DATE FORMAT
   * ============================================================
   */

  const formatDate = (
    dateString: string
  ) => {
    try {
      return new Date(
        dateString
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return dateString;
    }
  };

  /*
   * ============================================================
   * DASHBOARD
   * ============================================================
   */

  const handleBackToDashboard =
    () => {
      if (onBackToDashboard) {
        onBackToDashboard();
      }
    };

  /*
   * ============================================================
   * SCHOLARSHIPS
   * ============================================================
   */

  const handleScholarships = () => {
    setActiveNav("scholarships");

    if (
      typeof onScholarshipsClick ===
      "function"
    ) {
      onScholarshipsClick();
    } else {
      console.error(
        "onScholarshipsClick prop is NOT connected in App.tsx"
      );
    }
  };

  /*
   * ============================================================
   * NOTIFICATIONS
   * ============================================================
   */

  const handleNotifications =
    () => {
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
   * ============================================================
   * PROFILE
   * ============================================================
   */

  const handleProfile = () => {
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
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const handleLogout = () => {
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
  };

  /*
   * ============================================================
   * SHOW STUDENT DETAILS AS NORMAL PAGE
   * ============================================================
   */

  if (
    selectedApplicationId !== null
  ) {
    return (
      <ProviderStudentDetails
        applicationId={
          selectedApplicationId
        }
        onBackToApplications={
          handleBackFromStudentDetails
        }
      />
    );
  }

  /*
   * ============================================================
   * MAIN APPLICATIONS PAGE
   * ============================================================
   */

  return (
    <div className="pa-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="pa-sidebar">

        {/* BRAND */}

        <div className="pa-brand">

          <div className="pa-brand-icon">
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

        <nav className="pa-navigation">

          {/* DASHBOARD */}

          <button
            type="button"
            className="pa-nav-item"
            onClick={
              handleBackToDashboard
            }
          >

            <span className="pa-nav-icon">

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
            className="pa-nav-item"
            onClick={
              handleScholarships
            }
          >

            <span className="pa-nav-icon">

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
            className={`pa-nav-item ${
              activeNav ===
              "applications"
                ? "pa-active"
                : ""
            }`}
            onClick={() =>
              setActiveNav(
                "applications"
              )
            }
          >

            <span className="pa-nav-icon">

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
            className={`pa-nav-item ${
              activeNav ===
              "notifications"
                ? "pa-active"
                : ""
            }`}
            onClick={
              handleNotifications
            }
          >

            <span className="pa-nav-icon">

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

            {notificationCount > 0 && (
              <span className="pa-nav-badge">
                {notificationCount}
              </span>
            )}

          </button>

          {/* PROVIDER PROFILE */}

          <button
            type="button"
            className={`pa-nav-item ${
              activeNav ===
              "profile"
                ? "pa-active"
                : ""
            }`}
            onClick={handleProfile}
          >

            <span className="pa-nav-icon">

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

        {/* SIDEBAR BOTTOM */}

        <div className="pa-sidebar-bottom">

          <div className="pa-provider-mini">

            <div className="pa-provider-avatar">
              P
            </div>

            <div className="pa-provider-info">

              <strong>
                Provider
              </strong>

              <span>
                Provider Portal
              </span>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            type="button"
            className="pa-logout"
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

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="pa-main">

        {/* HEADER */}

        <header className="pa-header">

          <div className="pa-title-section">

            <span className="pa-eyebrow">
              PROVIDER PORTAL
            </span>

            <h1>
              Applications
            </h1>

            <p>
              Review and manage student scholarship
              applications.
            </p>

          </div>

        </header>

        {/* SUCCESS */}

        {successMessage && (
          <div className="pa-success-message">
            ✓ {successMessage}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="pa-error-message">
            ⚠ {error}
          </div>
        )}

        {/* =====================================================
            STATISTICS
            ===================================================== */}

        <section className="pa-stats">

          {/* TOTAL */}

          <div className="pa-stat-card">

            <div className="pa-stat-icon">
              📄
            </div>

            <div>

              <span>
                Total Applications
              </span>

              <strong>
                {totalApplications}
              </strong>

            </div>

          </div>

          {/* PENDING */}

          <div className="pa-stat-card">

            <div className="pa-stat-icon">
              ⏳
            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {pendingApplications}
              </strong>

            </div>

          </div>

          {/* UNDER REVIEW */}

          <div className="pa-stat-card">

            <div className="pa-stat-icon">
              🔍
            </div>

            <div>

              <span>
                Under Review
              </span>

              <strong>
                {underReviewApplications}
              </strong>

            </div>

          </div>

          {/* APPROVED */}

          <div className="pa-stat-card">

            <div className="pa-stat-icon">
              ✓
            </div>

            <div>

              <span>
                Approved
              </span>

              <strong>
                {approvedApplications}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================================
            APPLICATION CONTENT
            ===================================================== */}

        <section className="pa-content-card">

          {/* TOOLBAR */}

          <div className="pa-toolbar">

            <div>

              <h2>
                Student Applications
              </h2>

              <p>
                Review applications submitted for
                your scholarships.
              </p>

            </div>

            <div className="pa-filters">

              {/* SEARCH */}

              <div className="pa-search">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M16 16L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                </svg>

                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* STATUS */}

              <select
                className="pa-status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="UNDER_REVIEW">
                  Under Review
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

              </select>

            </div>

          </div>

          {/* =====================================================
              LOADING
              ===================================================== */}

          {loading && (
            <div className="pa-empty-state">

              <div className="pa-empty-icon">
                ⏳
              </div>

              <h3>
                Loading applications...
              </h3>

              <p>
                Please wait while we fetch student
                applications.
              </p>

            </div>
          )}

          {/* =====================================================
              APPLICATIONS
              ===================================================== */}

          {!loading &&
            filteredApplications.length >
              0 && (

              <div className="pa-applications-list">

                {filteredApplications.map(
                  (application) => {

                    const isUpdating =
                      updatingApplicationId ===
                      application.id;

                    return (
                      <article
                        key={
                          application.id
                        }
                        className="pa-application-card"
                      >

                        {/* =================================================
                            APPLICATION TOP
                            STUDENT AREA
                            ================================================= */}

                        <div className="pa-application-top">

                          <button
                            type="button"
                            className="pa-student-section pa-student-clickable"
                            onClick={() =>
                              openStudentDetails(
                                application.id
                              )
                            }
                          >

                            <div className="pa-student-avatar">

                              {application.student.name
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <h3>
                                {
                                  application
                                    .student
                                    .name
                                }
                              </h3>

                              <p>
                                {
                                  application
                                    .student
                                    .email
                                }
                              </p>

                              <small className="pa-view-details-text">
                                Click to view student details
                              </small>

                            </div>

                          </button>

                          <span
                            className={`pa-status-badge ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {getStatusDisplay(
                              application.status
                            )}
                          </span>

                        </div>

                        {/* =================================================
                            APPLICATION DETAILS
                            ================================================= */}

                        <div className="pa-application-details">

                          <div className="pa-detail-item">

                            <span>
                              Scholarship
                            </span>

                            <strong>
                              {
                                application
                                  .scholarship
                                  .title
                              }
                            </strong>

                          </div>

                          <div className="pa-detail-item">

                            <span>
                              Application ID
                            </span>

                            <strong>
                              #
                              {
                                application.id
                              }
                            </strong>

                          </div>

                          <div className="pa-detail-item">

                            <span>
                              Applied On
                            </span>

                            <strong>
                              {formatDate(
                                application.applied_at
                              )}
                            </strong>

                          </div>

                        </div>

                        {/* =================================================
                            ACTIONS
                            ================================================= */}

                        <div className="pa-application-actions">

                          {application.status !==
                            "APPROVED" &&
                            application.status !==
                              "REJECTED" && (
                              <>

                                <button
                                  type="button"
                                  className="pa-action-button pa-review-button"
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    updateApplicationStatus(
                                      application.id,
                                      "UNDER_REVIEW"
                                    )
                                  }
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : "Under Review"}
                                </button>

                                <button
                                  type="button"
                                  className="pa-action-button pa-approve-button"
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    updateApplicationStatus(
                                      application.id,
                                      "APPROVED"
                                    )
                                  }
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  className="pa-action-button pa-reject-button"
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    updateApplicationStatus(
                                      application.id,
                                      "REJECTED"
                                    )
                                  }
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : "Reject"}
                                </button>

                              </>
                            )}

                          {application.status ===
                            "APPROVED" && (
                            <span className="pa-final-status approved">
                              ✓ Application Approved
                            </span>
                          )}

                          {application.status ===
                            "REJECTED" && (
                            <span className="pa-final-status rejected">
                              ✕ Application Rejected
                            </span>
                          )}

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          {/* =====================================================
              NO RESULTS
              ===================================================== */}

          {!loading &&
            filteredApplications.length ===
              0 && (

              <div className="pa-empty-state">

                <div className="pa-empty-icon">
                  📄
                </div>

                <h3>
                  {applications.length ===
                  0
                    ? "No applications found"
                    : "No matching applications"}
                </h3>

                <p>
                  {applications.length ===
                  0
                    ? "There are no student applications available for your scholarships yet."
                    : "Try changing your search or status filter."}
                </p>

              </div>
            )}

        </section>

        {/* =====================================================
            INFORMATION CARD
            ===================================================== */}

        <section className="pa-info-card">

          <div>

            <h3>
              Application review process
            </h3>

            <p>
              Review student information and uploaded
              documents before changing the application
              status.
            </p>

          </div>

          <button
            type="button"
            className="pa-info-button"
          >
            Review Guidelines →
          </button>

        </section>

      </main>

    </div>
  );
};

export default ProviderApplications;