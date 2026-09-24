import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

import StudentManagement from "./StudentManagement";
import ProviderManagement from "./ProviderManagement";
import ScholarshipManagement from "./ScholarshipManagement";
import ApplicationManagement from "./ApplicationManagement";
import DocumentManagement from "./DocumentManagement";
import AIRecommendationManagement from "./AIRecommendationManagement";
import ReportsAnalytics from "./ReportsAnalytics";
import NotificationManagement from "./NotificationManagement";
import HelpSupport from "./HelpSupport";
import AdminSettings from "./AdminSettings";

interface AdminDashboardProps {
  onLogout?: () => void;
}

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: string;
}

interface PendingItem {
  title: string;
  value: string;
  type: string;
}

interface Activity {
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
}

interface DashboardResponse {
  message: string;

  admin: {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };

  stats: {
    total_students: number;
    total_providers: number;
    total_scholarships: number;
    total_applications: number;
  };

  providers: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  };

  scholarships: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    closed: number;
  };

  applications: {
    total: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
  };

  documents: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  };

  pending_approvals: {
    scholarships: number;
    providers: number;
    documents: number;
  };

  recent_activity: {
    type: string;
    title: string;
    description: string;
    time: string;
  }[];
}

/*
 * --------------------------------------------------
 * ADMIN NOTIFICATION TYPE
 * --------------------------------------------------
 */

interface AdminNotification {
  id?: number | string;
  title?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
}) => {
  /*
   * --------------------------------------------------
   * ACTIVE MENU
   * --------------------------------------------------
   */

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  /*
   * --------------------------------------------------
   * MOBILE SIDEBAR
   * --------------------------------------------------
   */

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /*
   * --------------------------------------------------
   * DASHBOARD DATA
   * --------------------------------------------------
   */

  const [dashboardData, setDashboardData] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * --------------------------------------------------
   * LOGOUT MODAL STATE
   * --------------------------------------------------
   */

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  /*
   * --------------------------------------------------
   * REAL NOTIFICATION COUNT
   * --------------------------------------------------
   */

  const [notificationCount, setNotificationCount] =
    useState(0);

  /*
   * --------------------------------------------------
   * FETCH ADMIN NOTIFICATION COUNT
   * --------------------------------------------------
   */

  const fetchNotificationCount = async () => {
    try {
      /*
       * Get admin authentication token.
       */

      const token =
        localStorage.getItem("admin_token") ||
        sessionStorage.getItem("admin_token");

      /*
       * If admin is not authenticated,
       * do not show notification count.
       */

      if (!token) {
        setNotificationCount(0);
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

      /*
       * If notification API fails,
       * keep badge hidden instead of showing fake data.
       */

      if (!response.ok) {
        setNotificationCount(0);
        return;
      }

      const data = await response.json();

      /*
       * Different API response formats are handled here.
       *
       * Possible formats:
       *
       * 1. [
       *      { is_read: false },
       *      { is_read: true }
       *    ]
       *
       * 2. {
       *      notifications: [...]
       *    }
       *
       * 3. {
       *      results: [...]
       *    }
       *
       * 4. {
       *      data: [...]
       *    }
       */

      let notifications: AdminNotification[] = [];

      if (Array.isArray(data)) {
        notifications = data;
      } else if (
        Array.isArray(data?.notifications)
      ) {
        notifications = data.notifications;
      } else if (
        Array.isArray(data?.results)
      ) {
        notifications = data.results;
      } else if (
        Array.isArray(data?.data)
      ) {
        notifications = data.data;
      }

      /*
       * Count ONLY unread notifications.
       *
       * is_read === false
       */

      const unreadCount =
        notifications.filter(
          (notification) =>
            notification.is_read === false
        ).length;

      setNotificationCount(unreadCount);
    } catch (err) {
      console.error(
        "Admin notification count API error:",
        err
      );

      /*
       * Never show fake notification numbers
       * when the API cannot be reached.
       */

      setNotificationCount(0);
    }
  };

  /*
   * --------------------------------------------------
   * NOTIFICATION COUNT API
   * --------------------------------------------------
   */

  useEffect(() => {
    /*
     * Fetch immediately when dashboard loads.
     */

    fetchNotificationCount();

    /*
     * Refresh notification count every 30 seconds.
     *
     * This allows newly created notifications
     * to appear without refreshing the whole page.
     */

    const notificationInterval =
      window.setInterval(() => {
        fetchNotificationCount();
      }, 30000);

    /*
     * Cleanup interval when component unmounts.
     */

    return () => {
      window.clearInterval(
        notificationInterval
      );
    };
  }, []);

  /*
   * --------------------------------------------------
   * ADMIN DASHBOARD API
   * --------------------------------------------------
   */

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * AdminLogin.tsx stores authentication token
         * using the key "admin_token".
         *
         * Remember Me checked:
         * localStorage
         *
         * Remember Me unchecked:
         * sessionStorage
         */

        const token =
          localStorage.getItem("admin_token") ||
          sessionStorage.getItem("admin_token");

        if (!token) {
          setError(
            "Admin authentication token not found. Please login again."
          );

          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/admin/dashboard/",
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
          if (response.status === 401) {
            setError(
              "Your admin session has expired. Please login again."
            );
          } else if (response.status === 403) {
            setError(
              "Admin access is required to view this dashboard."
            );
          } else {
            setError(
              data.message ||
                data.detail ||
                "Failed to load admin dashboard."
            );
          }

          setLoading(false);
          return;
        }

        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Admin dashboard API error:",
          err
        );

        setError(
          "Unable to connect to ScholarBridge AI backend."
        );

        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  /*
   * --------------------------------------------------
   * ADMIN INFORMATION
   * --------------------------------------------------
   */

  const adminName =
    dashboardData?.admin?.name?.trim() ||
    "Administrator";

  const adminFirstName =
    dashboardData?.admin?.first_name?.trim() ||
    "";

  const adminEmail =
    dashboardData?.admin?.email?.trim() ||
    "";

  const adminRole =
    dashboardData?.admin?.role?.trim() ||
    "ADMIN";

  /*
   * --------------------------------------------------
   * ADMIN AVATAR
   * --------------------------------------------------
   */

  const adminAvatarLetter =
    adminFirstName.charAt(0).toUpperCase() ||
    adminName.charAt(0).toUpperCase() ||
    "A";

  /*
   * --------------------------------------------------
   * ADMIN ROLE LABEL
   * --------------------------------------------------
   */

  const adminRoleLabel =
    adminRole.toUpperCase() === "ADMIN"
      ? "Platform Admin"
      : adminRole;

  /*
   * --------------------------------------------------
   * LOGOUT
   * --------------------------------------------------
   */

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  /*
   * --------------------------------------------------
   * CANCEL LOGOUT
   * --------------------------------------------------
   */

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  /*
   * --------------------------------------------------
   * CONFIRM LOGOUT
   * --------------------------------------------------
   */

  const confirmLogout = () => {
    /*
     * Remove admin authentication information
     * from localStorage.
     */

    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user_id");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_role");

    /*
     * Remove admin authentication information
     * from sessionStorage.
     */

    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user_id");
    sessionStorage.removeItem("admin_email");
    sessionStorage.removeItem("admin_role");

    /*
     * Close logout popup.
     */

    setShowLogoutModal(false);

    /*
     * Notify App.tsx.
     */

    if (onLogout) {
      onLogout();
    }
  };

  /*
   * --------------------------------------------------
   * STAT CARDS
   * --------------------------------------------------
   */

  const stats: StatCard[] = [
    {
      title: "Total Students",
      value: loading
        ? "..."
        : String(
            dashboardData?.stats.total_students ?? 0
          ),
      description: "Registered students",
      icon: "👨‍🎓",
    },
    {
      title: "Total Providers",
      value: loading
        ? "..."
        : String(
            dashboardData?.stats.total_providers ?? 0
          ),
      description: "Registered organizations",
      icon: "🏢",
    },
    {
      title: "Scholarships",
      value: loading
        ? "..."
        : String(
            dashboardData?.stats.total_scholarships ?? 0
          ),
      description: "Available scholarships",
      icon: "🎓",
    },
    {
      title: "Applications",
      value: loading
        ? "..."
        : String(
            dashboardData?.stats.total_applications ?? 0
          ),
      description: "Total applications",
      icon: "📄",
    },
  ];

  /*
   * --------------------------------------------------
   * PENDING APPROVALS
   * --------------------------------------------------
   */

  const pendingItems: PendingItem[] = [
    {
      title: "Scholarships awaiting approval",
      value: loading
        ? "..."
        : String(
            dashboardData?.pending_approvals
              .scholarships ?? 0
          ),
      type: "Scholarships",
    },
    {
      title: "Providers awaiting verification",
      value: loading
        ? "..."
        : String(
            dashboardData?.pending_approvals
              .providers ?? 0
          ),
      type: "Providers",
    },
    {
      title: "Documents requiring review",
      value: loading
        ? "..."
        : String(
            dashboardData?.pending_approvals
              .documents ?? 0
          ),
      type: "Documents",
    },
  ];

  /*
   * --------------------------------------------------
   * ACTIVITY ICON
   * --------------------------------------------------
   */

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "STUDENT":
        return "👨‍🎓";

      case "PROVIDER":
        return "🏢";

      case "SCHOLARSHIP":
        return "🎓";

      case "APPLICATION":
        return "📄";

      default:
        return "🔔";
    }
  };

  /*
   * --------------------------------------------------
   * ACTIVITY TIME FORMAT
   * --------------------------------------------------
   */

  const formatActivityTime = (time: string) => {
    const activityDate = new Date(time);

    if (Number.isNaN(activityDate.getTime())) {
      return "";
    }

    const now = new Date();

    const difference =
      now.getTime() -
      activityDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minute${
        minutes === 1 ? "" : "s"
      } ago`;
    }

    if (hours < 24) {
      return `${hours} hour${
        hours === 1 ? "" : "s"
      } ago`;
    }

    if (days < 7) {
      return `${days} day${
        days === 1 ? "" : "s"
      } ago`;
    }

    return activityDate.toLocaleDateString();
  };

  /*
   * --------------------------------------------------
   * RECENT ACTIVITIES
   * --------------------------------------------------
   */

  const activities: Activity[] =
    dashboardData?.recent_activity.map(
      (activity) => ({
        title: activity.title,
        description: activity.description,
        time: formatActivityTime(
          activity.time
        ),
        icon: getActivityIcon(
          activity.type
        ),
        type: activity.type,
      })
    ) || [];

  /*
   * --------------------------------------------------
   * SIDEBAR MENU
   * --------------------------------------------------
   */

  const menuItems = [
    {
      label: "Dashboard",
      icon: "▦",
    },
    {
      label: "Student Management",
      icon: "👨‍🎓",
    },
    {
      label: "Provider Management",
      icon: "🏢",
    },
    {
      label: "Scholarship Management",
      icon: "🎓",
    },
    {
      label: "Application Management",
      icon: "📄",
    },
    {
      label: "Document Management",
      icon: "📁",
    },
    {
      label: "AI Recommendations",
      icon: "🤖",
    },
    {
      label: "Reports & Analytics",
      icon: "📊",
    },
    {
      label: "Notifications",
      icon: "🔔",
    },
    {
      label: "Help & Support",
      icon: "💬",
    },
  ];

  /*
   * --------------------------------------------------
   * ACCOUNT MENU
   * --------------------------------------------------
   */

  const bottomMenuItems = [
    {
      label: "Admin Profile",
      icon: "👤",
    },
    {
      label: "Settings",
      icon: "⚙",
    },
  ];

  /*
   * --------------------------------------------------
   * MENU CLICK
   * --------------------------------------------------
   */

  const handleMenuClick = (label: string) => {
    setActiveMenu(label);
    setSidebarOpen(false);

    /*
     * Whenever Notifications page is opened,
     * refresh the unread notification count.
     */

    if (label === "Notifications") {
      fetchNotificationCount();
    }
  };

  /*
   * --------------------------------------------------
   * RENDER ACTIVE PAGE
   * --------------------------------------------------
   */

  const renderActivePage = () => {
    switch (activeMenu) {
      /*
       * ----------------------------------------------
       * DASHBOARD
       * ----------------------------------------------
       */

      case "Dashboard":
        return (
          <>
            {/* ERROR MESSAGE */}

            {error && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  background: "#fff1f2",
                  border: "1px solid #fecdd3",
                  color: "#be123c",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            {/* WELCOME */}

            <section className="admin-welcome-section">
              <div>
                <span className="admin-welcome-badge">
                  Platform Overview
                </span>

                <h2>
                  Welcome to ScholarBridge AI
                </h2>

                <p>
                  Monitor scholarships,
                  users, applications and
                  platform activity from one
                  centralized dashboard.
                </p>
              </div>

              <div className="admin-welcome-date">
                <span>
                  Today
                </span>

                <strong>
                  Platform Overview
                </strong>
              </div>
            </section>

            {/* STAT CARDS */}

            <section className="admin-stat-grid">
              {stats.map((stat) => (
                <div
                  className="admin-stat-card"
                  key={stat.title}
                >
                  <div className="admin-stat-card-top">
                    <div className="admin-stat-icon">
                      {stat.icon}
                    </div>

                    <span className="admin-stat-more">
                      ⋮
                    </span>
                  </div>

                  <div className="admin-stat-value">
                    {stat.value}
                  </div>

                  <h3>
                    {stat.title}
                  </h3>

                  <p>
                    {stat.description}
                  </p>
                </div>
              ))}
            </section>

            {/* SECOND ROW */}

            <section className="admin-dashboard-grid">

              {/* PENDING APPROVALS */}

              <div className="admin-panel">

                <div className="admin-panel-header">

                  <div>

                    <span className="admin-panel-label">
                      ACTION REQUIRED
                    </span>

                    <h3>
                      Pending Approvals
                    </h3>

                  </div>

                  <button
                    type="button"
                    className="admin-panel-link"
                    onClick={() =>
                      handleMenuClick(
                        "Scholarship Management"
                      )
                    }
                  >
                    View all →
                  </button>

                </div>

                <div className="admin-pending-list">

                  {pendingItems.map(
                    (item) => (

                      <button
                        type="button"
                        className="admin-pending-item"
                        key={item.title}
                        onClick={() =>
                          handleMenuClick(
                            item.type ===
                              "Providers"
                              ? "Provider Management"
                              : item.type ===
                                "Documents"
                              ? "Document Management"
                              : "Scholarship Management"
                          )
                        }
                      >

                        <div className="admin-pending-icon">
                          !
                        </div>

                        <div className="admin-pending-content">

                          <strong>
                            {item.title}
                          </strong>

                          <span>
                            Requires administrator
                            attention
                          </span>

                        </div>

                        <div className="admin-pending-value">
                          {item.value}
                        </div>

                        <span className="admin-pending-arrow">
                          →
                        </span>

                      </button>

                    )
                  )}

                </div>

              </div>

              {/* QUICK ACTIONS */}

              <div className="admin-panel">

                <div className="admin-panel-header">

                  <div>

                    <span className="admin-panel-label">
                      SHORTCUTS
                    </span>

                    <h3>
                      Quick Actions
                    </h3>

                  </div>

                </div>

                <div className="admin-quick-actions">

                  <button
                    type="button"
                    onClick={() =>
                      handleMenuClick(
                        "Provider Management"
                      )
                    }
                  >

                    <span>
                      🏢
                    </span>

                    <div>

                      <strong>
                        Verify Providers
                      </strong>

                      <small>
                        Review organizations
                      </small>

                    </div>

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleMenuClick(
                        "Scholarship Management"
                      )
                    }
                  >

                    <span>
                      🎓
                    </span>

                    <div>

                      <strong>
                        Review Scholarships
                      </strong>

                      <small>
                        Approve submitted
                        scholarships
                      </small>

                    </div>

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleMenuClick(
                        "Reports & Analytics"
                      )
                    }
                  >

                    <span>
                      📊
                    </span>

                    <div>

                      <strong>
                        View Analytics
                      </strong>

                      <small>
                        Monitor platform
                        performance
                      </small>

                    </div>

                  </button>

                </div>

              </div>

            </section>

            {/* RECENT ACTIVITY */}

            <section className="admin-panel admin-activity-panel">

              <div className="admin-panel-header">

                <div>

                  <span className="admin-panel-label">
                    PLATFORM ACTIVITY
                  </span>

                  <h3>
                    Recent Activity
                  </h3>

                </div>

                <button
                  type="button"
                  className="admin-panel-link"
                  onClick={() =>
                    handleMenuClick(
                      "Reports & Analytics"
                    )
                  }
                >
                  View analytics →
                </button>

              </div>

              <div className="admin-activity-list">

                {loading ? (

                  <div
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    Loading recent activity...
                  </div>

                ) : activities.length ===
                  0 ? (

                  <div
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    No recent activity
                    available.
                  </div>

                ) : (

                  activities.map(
                    (
                      activity,
                      index
                    ) => (

                      <div
                        className="admin-activity-item"
                        key={`${activity.type}-${activity.title}-${index}`}
                      >

                        <div className="admin-activity-icon">
                          {activity.icon}
                        </div>

                        <div className="admin-activity-content">

                          <strong>
                            {activity.title}
                          </strong>

                          <p>
                            {activity.description}
                          </p>

                        </div>

                        <span className="admin-activity-time">
                          {activity.time}
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </section>

            {/* DASHBOARD FOOTER */}

            <footer className="admin-dashboard-footer">

              <span>
                © 2026 ScholarBridge AI
              </span>

              <span>
                Administrator Portal
              </span>

            </footer>
          </>
        );

      /*
       * ----------------------------------------------
       * STUDENT MANAGEMENT
       * ----------------------------------------------
       */

      case "Student Management":
        return <StudentManagement />;

      /*
       * ----------------------------------------------
       * PROVIDER MANAGEMENT
       * ----------------------------------------------
       */

      case "Provider Management":
        return <ProviderManagement />;

      /*
       * ----------------------------------------------
       * SCHOLARSHIP MANAGEMENT
       * ----------------------------------------------
       */

      case "Scholarship Management":
        return <ScholarshipManagement />;

      /*
       * ----------------------------------------------
       * APPLICATION MANAGEMENT
       * ----------------------------------------------
       */

      case "Application Management":
        return <ApplicationManagement />;

      /*
       * ----------------------------------------------
       * DOCUMENT MANAGEMENT
       * ----------------------------------------------
       */

      case "Document Management":
        return <DocumentManagement />;

      /*
       * ----------------------------------------------
       * AI RECOMMENDATIONS
       * ----------------------------------------------
       */

      case "AI Recommendations":
        return <AIRecommendationManagement />;

      /*
       * ----------------------------------------------
       * REPORTS & ANALYTICS
       * ----------------------------------------------
       */

      case "Reports & Analytics":
        return (
          <ReportsAnalytics
            totalStudents={
              dashboardData?.stats
                .total_students ?? 0
            }
            totalProviders={
              dashboardData?.stats
                .total_providers ?? 0
            }
            totalScholarships={
              dashboardData?.stats
                .total_scholarships ?? 0
            }
            totalApplications={
              dashboardData?.stats
                .total_applications ?? 0
            }
            totalDocuments={
              dashboardData?.documents
                .total ?? 0
            }
            totalRecommendations={0}
            approvedApplications={
              dashboardData?.applications
                .approved ?? 0
            }
            pendingApplications={
              dashboardData?.applications
                .pending ?? 0
            }
          />
        );

      /*
       * ----------------------------------------------
       * NOTIFICATIONS
       * ----------------------------------------------
       */

      case "Notifications":
        return <NotificationManagement />;

      /*
       * ----------------------------------------------
       * HELP & SUPPORT
       * ----------------------------------------------
       */

      case "Help & Support":
        return <HelpSupport />;

      /*
       * ----------------------------------------------
       * ADMIN PROFILE
       * ----------------------------------------------
       */

      case "Admin Profile":
        return (
          <div
            style={{
              padding: "32px",
              background: "#ffffff",
              borderRadius: "18px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 18px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#eef2ff",
                  color: "#4338ca",
                  fontSize: "25px",
                  fontWeight: 700,
                }}
              >
                {adminAvatarLetter}
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#111827",
                    fontSize: "24px",
                  }}
                >
                  Admin Profile
                </h2>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Administrator account information
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              <div
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Name
                </span>

                <strong
                  style={{
                    color: "#111827",
                    fontSize: "15px",
                  }}
                >
                  {loading
                    ? "Administrator"
                    : adminName}
                </strong>
              </div>

              <div
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Email
                </span>

                <strong
                  style={{
                    color: "#111827",
                    fontSize: "15px",
                    wordBreak: "break-word",
                  }}
                >
                  {loading
                    ? "Loading..."
                    : adminEmail || "Not available"}
                </strong>
              </div>

              <div
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Role
                </span>

                <strong
                  style={{
                    color: "#111827",
                    fontSize: "15px",
                  }}
                >
                  {loading
                    ? "Platform Admin"
                    : adminRoleLabel}
                </strong>
              </div>

              <div
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Account Type
                </span>

                <strong
                  style={{
                    color: "#111827",
                    fontSize: "15px",
                  }}
                >
                  Administrator
                </strong>
              </div>
            </div>
          </div>
        );

      /*
       * ----------------------------------------------
       * SETTINGS
       * ----------------------------------------------
       */

      case "Settings":
        return <AdminSettings />;

      /*
       * ----------------------------------------------
       * DEFAULT
       * ----------------------------------------------
       */

      default:
        return null;
    }
  };

  /*
   * --------------------------------------------------
   * RETURN UI
   * --------------------------------------------------
   */

  return (
    <div className="admin-dashboard">

      {/* ==================================================
          CUSTOM LOGOUT CONFIRMATION MODAL
          ================================================== */}

      {showLogoutModal && (
        <div
          className="admin-logout-modal-overlay"
          onClick={cancelLogout}
        >
          <div
            className="admin-logout-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-logout-modal-icon">
              ↪
            </div>

            <h3>
              Are you sure you want to exit?
            </h3>

            <div className="admin-logout-modal-actions">

              <button
                type="button"
                className="admin-logout-cancel"
                onClick={cancelLogout}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-logout-confirm"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ==================================================
          MOBILE OVERLAY
          ================================================== */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        ></div>
      )}

      {/* ==================================================
          SIDEBAR
          ================================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="admin-sidebar-brand">

          <div className="admin-brand-mark">
            SB
          </div>

          <div className="admin-brand-text">

            <h2>
              ScholarBridge
            </h2>

            <span>
              AI Administration
            </span>

          </div>

        </div>

        {/* SIDEBAR MENU */}

        <nav className="admin-sidebar-nav">

          <div className="admin-menu-section-title">
            MAIN MENU
          </div>

          {menuItems.map((item) => (

            <button
              key={item.label}
              type="button"
              className={`admin-menu-item ${
                activeMenu === item.label
                  ? "admin-menu-item-active"
                  : ""
              }`}
              onClick={() =>
                handleMenuClick(
                  item.label
                )
              }
            >

              <span className="admin-menu-icon">
                {item.icon}
              </span>

              <span className="admin-menu-label">
                {item.label}
              </span>

              {/* 
               * REAL NOTIFICATION BADGE
               *
               * Badge is rendered ONLY when
               * unread notification count is greater than 0.
               */}

              {item.label ===
                "Notifications" &&
                notificationCount > 0 && (
                  <span className="admin-notification-count">
                    {notificationCount}
                  </span>
                )}

            </button>

          ))}

          <div className="admin-menu-section-title admin-menu-section-bottom">
            ACCOUNT
          </div>

          {bottomMenuItems.map((item) => (

            <button
              key={item.label}
              type="button"
              className={`admin-menu-item ${
                activeMenu === item.label
                  ? "admin-menu-item-active"
                  : ""
              }`}
              onClick={() =>
                handleMenuClick(
                  item.label
                )
              }
            >

              <span className="admin-menu-icon">
                {item.icon}
              </span>

              <span className="admin-menu-label">
                {item.label}
              </span>

            </button>

          ))}

        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="admin-sidebar-footer">

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >

            <span className="admin-menu-icon">
              ↪
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN AREA
          ================================================== */}

      <main className="admin-main">

        {/* ==================================================
            TOP HEADER
            ================================================== */}

        <header className="admin-header">

          <div className="admin-header-left">

            <button
              type="button"
              className="admin-mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>

              <p className="admin-header-label">
                ADMINISTRATOR PORTAL
              </p>

              <h1>
                {activeMenu ===
                "Dashboard"
                  ? "Dashboard"
                  : activeMenu}
              </h1>

            </div>

          </div>

          <div className="admin-header-right">

            {/* NOTIFICATION */}

            <button
              type="button"
              className="admin-header-icon-button"
              onClick={() =>
                handleMenuClick(
                  "Notifications"
                )
              }
              aria-label="Notifications"
            >

              🔔

              {/* 
               * REAL HEADER NOTIFICATION BADGE
               *
               * It appears only when unread
               * notifications actually exist.
               */}

              {notificationCount > 0 && (
                <span className="admin-header-notification-dot">
                  {notificationCount}
                </span>
              )}

            </button>

            {/* ADMIN PROFILE */}

            <button
              type="button"
              className="admin-profile-button"
              onClick={() =>
                handleMenuClick(
                  "Admin Profile"
                )
              }
              title={
                adminEmail
                  ? adminEmail
                  : adminName
              }
            >

              <div className="admin-avatar">
                {loading
                  ? "A"
                  : adminAvatarLetter}
              </div>

              <div className="admin-profile-info">

                <strong>
                  {loading
                    ? "Administrator"
                    : adminName}
                </strong>

                <span>
                  {loading
                    ? "Platform Admin"
                    : adminRoleLabel}
                </span>

              </div>

              <span className="admin-profile-arrow">
                ▾
              </span>

            </button>

          </div>

        </header>

        {/* ==================================================
            CONTENT
            ================================================== */}

        <div className="admin-content">

          {renderActivePage()}

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;