import React, { useEffect, useState } from "react";
import "./ProviderNotifications.css";

interface ProviderNotificationsProps {
  onBackToDashboard?: () => void;
  onScholarshipsClick?: () => void;
  onApplicationsClick?: () => void;
  onProfileClick?: () => void;
}

interface BackendNotification {
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
  notifications: BackendNotification[];
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "application" | "scholarship" | "system" | "deadline";
  time: string;
  isRead: boolean;
}

const ProviderNotifications: React.FC<
  ProviderNotificationsProps
> = ({
  onBackToDashboard,
  onScholarshipsClick,
  onApplicationsClick,
  onProfileClick,
}) => {
  const [activeNav, setActiveNav] =
    useState("notifications");

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [markAllLoading, setMarkAllLoading] =
    useState<boolean>(false);

  const API_BASE_URL =
    "http://127.0.0.1:8000";

  // =====================================================
  // GET PROVIDER TOKEN
  // =====================================================

  const getProviderToken = (): string | null => {
    return (
      localStorage.getItem("provider_token") ||
      sessionStorage.getItem("provider_token")
    );
  };

  // =====================================================
  // CONVERT BACKEND TYPE TO UI TYPE
  // =====================================================

  const convertNotificationType = (
    type: string
  ): NotificationItem["type"] => {
    const normalizedType =
      type.toLowerCase();

    if (
      normalizedType === "application"
    ) {
      return "application";
    }

    if (
      normalizedType === "scholarship"
    ) {
      return "scholarship";
    }

    if (
      normalizedType === "deadline"
    ) {
      return "deadline";
    }

    return "system";
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatNotificationTime = (
    createdAt: string
  ): string => {
    const notificationDate =
      new Date(createdAt);

    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minute${
        minutes > 1 ? "s" : ""
      } ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FETCH NOTIFICATIONS FROM BACKEND
  // =====================================================

  const fetchNotifications =
    async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const token =
          getProviderToken();

        if (!token) {
          setError(
            "Provider session not found. Please login again."
          );
          return;
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/notifications/`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Token ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data: NotificationsResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            "Unable to load notifications."
          );
        }

        const backendNotifications =
          data.notifications || [];

        const formattedNotifications:
          NotificationItem[] =
          backendNotifications.map(
            (notification) => ({
              id: notification.id,

              title:
                notification.title,

              message:
                notification.message,

              type:
                convertNotificationType(
                  notification.type
                ),

              time:
                formatNotificationTime(
                  notification.created_at
                ),

              isRead:
                notification.is_read,
            })
          );

        setNotifications(
          formattedNotifications
        );
      } catch (error) {
        console.error(
          "Provider notifications error:",
          error
        );

        setError(
          "Unable to load notifications."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  const handleBackToDashboard =
    (): void => {
      setActiveNav("dashboard");

      if (
        typeof onBackToDashboard ===
        "function"
      ) {
        onBackToDashboard();
      }
    };

  // =====================================================
  // SCHOLARSHIPS NAVIGATION
  // =====================================================

  const handleScholarshipsNavigation =
    (): void => {
      console.log(
        "Scholarships clicked from Provider Notifications"
      );

      setActiveNav("scholarships");

      if (
        typeof onScholarshipsClick ===
        "function"
      ) {
        onScholarshipsClick();
      }
    };

  // =====================================================
  // APPLICATIONS NAVIGATION
  // =====================================================

  const handleApplicationsNavigation =
    (): void => {
      console.log(
        "Applications clicked from Provider Notifications"
      );

      setActiveNav("applications");

      if (
        typeof onApplicationsClick ===
        "function"
      ) {
        onApplicationsClick();
      }
    };

  // =====================================================
  // PROFILE NAVIGATION
  // =====================================================

  const handleProfileNavigation =
    (): void => {
      console.log(
        "Provider Notifications → Profile"
      );

      setActiveNav("profile");

      if (
        typeof onProfileClick ===
        "function"
      ) {
        onProfileClick();
      }
    };

  // =====================================================
  // MARK ONE NOTIFICATION AS READ
  // =====================================================

  const handleMarkAsRead =
    async (
      id: number
    ): Promise<void> => {
      try {
        const token =
          getProviderToken();

        if (!token) {
          setError(
            "Provider session not found. Please login again."
          );
          return;
        }

        setActionLoading(id);

        const response =
          await fetch(
            `${API_BASE_URL}/api/notifications/${id}/read/`,
            {
              method: "PATCH",
              headers: {
                Authorization:
                  `Token ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to mark notification as read."
          );
        }

        setNotifications(
          (previousNotifications) =>
            previousNotifications.map(
              (notification) =>
                notification.id === id
                  ? {
                      ...notification,
                      isRead: true,
                    }
                  : notification
            )
        );
      } catch (error) {
        console.error(
          "Mark notification as read error:",
          error
        );

        setError(
          "Unable to mark notification as read."
        );
      } finally {
        setActionLoading(null);
      }
    };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const handleMarkAllAsRead =
    async (): Promise<void> => {
      try {
        const token =
          getProviderToken();

        if (!token) {
          setError(
            "Provider session not found. Please login again."
          );
          return;
        }

        setMarkAllLoading(true);

        const response =
          await fetch(
            `${API_BASE_URL}/api/notifications/mark-all-read/`,
            {
              method: "PATCH",
              headers: {
                Authorization:
                  `Token ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to mark all notifications as read."
          );
        }

        setNotifications(
          (previousNotifications) =>
            previousNotifications.map(
              (notification) => ({
                ...notification,
                isRead: true,
              })
            )
        );
      } catch (error) {
        console.error(
          "Mark all notifications error:",
          error
        );

        setError(
          "Unable to mark all notifications as read."
        );
      } finally {
        setMarkAllLoading(false);
      }
    };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const handleRemoveNotification =
    async (
      id: number
    ): Promise<void> => {
      try {
        const token =
          getProviderToken();

        if (!token) {
          setError(
            "Provider session not found. Please login again."
          );
          return;
        }

        setActionLoading(id);

        const response =
          await fetch(
            `${API_BASE_URL}/api/notifications/${id}/delete/`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Token ${token}`,
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to delete notification."
          );
        }

        setNotifications(
          (previousNotifications) =>
            previousNotifications.filter(
              (notification) =>
                notification.id !== id
            )
        );
      } catch (error) {
        console.error(
          "Delete notification error:",
          error
        );

        setError(
          "Unable to delete notification."
        );
      } finally {
        setActionLoading(null);
      }
    };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = (): void => {
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

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (
    type: NotificationItem["type"]
  ) => {
    if (type === "application") {
      return (
        <div className="pn-icon pn-icon-application">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

            <circle
              cx="9"
              cy="7"
              r="4"
            />

            <path d="M19 8v6" />

            <path d="M22 11h-6" />
          </svg>
        </div>
      );
    }

    if (type === "scholarship") {
      return (
        <div className="pn-icon pn-icon-scholarship">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 3L3 8l9 5 9-5-9-5Z" />

            <path d="M7 10v6c0 1.5 2.2 3 5 3s5-1.5 5-3v-6" />

            <path d="M21 8v6" />
          </svg>
        </div>
      );
    }

    if (type === "deadline") {
      return (
        <div className="pn-icon pn-icon-deadline">
          <svg
            width="20"
            height="20"
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

            <path d="M12 7v5l3 2" />
          </svg>
        </div>
      );
    }

    return (
      <div className="pn-icon pn-icon-system">
        <svg
          width="20"
          height="20"
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

          <path d="M12 8v4" />

          <circle
            cx="12"
            cy="16"
            r="1"
          />
        </svg>
      </div>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="pn-page">

        <aside className="pn-sidebar">

          <div className="pn-brand">

            <div className="pn-brand-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3L3 8l9 5 9-5-9-5Z" />

                <path d="M7 10v6c0 1.5 2.2 3 5 3s5-1.5 5-3v-6" />
              </svg>
            </div>

            <div>
              <div className="pn-brand-title">
                ScholarBridge
              </div>

              <div className="pn-brand-subtitle">
                PROVIDER PORTAL
              </div>
            </div>

          </div>

          <nav className="pn-navigation">

            <button
              type="button"
              className="pn-nav-item"
              onClick={handleBackToDashboard}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="pn-nav-item"
              onClick={handleScholarshipsNavigation}
            >
              Scholarships
            </button>

            <button
              type="button"
              className="pn-nav-item"
              onClick={handleApplicationsNavigation}
            >
              Applications
            </button>

            <button
              type="button"
              className="pn-nav-item pn-nav-active"
            >
              Notifications
            </button>

            {/* PROVIDER PROFILE */}

            <button
              type="button"
              className="pn-nav-item"
              onClick={handleProfileNavigation}
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

          </nav>

          <div className="pn-sidebar-bottom">

            <button
              type="button"
              className="pn-logout-button"
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

        <main className="pn-main">

          <div className="pn-empty-state">
            Loading notifications...
          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="pn-page">

      {/* SIDEBAR */}

      <aside className="pn-sidebar">

        <div className="pn-brand">

          <div className="pn-brand-icon">

            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3L3 8l9 5 9-5-9-5Z" />

              <path d="M7 10v6c0 1.5 2.2 3 5 3s5-1.5 5-3v-6" />
            </svg>

          </div>

          <div>

            <div className="pn-brand-title">
              ScholarBridge
            </div>

            <div className="pn-brand-subtitle">
              PROVIDER PORTAL
            </div>

          </div>

        </div>

        <nav className="pn-navigation">

          {/* DASHBOARD */}

          <button
            type="button"
            className={`pn-nav-item ${
              activeNav === "dashboard"
                ? "pn-nav-active"
                : ""
            }`}
            onClick={
              handleBackToDashboard
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
            className={`pn-nav-item ${
              activeNav === "scholarships"
                ? "pn-nav-active"
                : ""
            }`}
            onClick={
              handleScholarshipsNavigation
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
            className={`pn-nav-item ${
              activeNav === "applications"
                ? "pn-nav-active"
                : ""
            }`}
            onClick={
              handleApplicationsNavigation
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
            className={`pn-nav-item ${
              activeNav === "notifications"
                ? "pn-nav-active"
                : ""
            }`}
            onClick={() =>
              setActiveNav(
                "notifications"
              )
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

            {unreadCount > 0 && (
              <span className="pn-notification-badge">
                {unreadCount}
              </span>
            )}

          </button>

          {/* PROVIDER PROFILE */}

          <button
            type="button"
            className={`pn-nav-item ${
              activeNav === "profile"
                ? "pn-nav-active"
                : ""
            }`}
            onClick={
              handleProfileNavigation
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

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="pn-sidebar-bottom">

          {/* LOGOUT */}

          <button
            type="button"
            className="pn-logout-button"
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

      {/* MAIN CONTENT */}

      <main className="pn-main">

        <header className="pn-header">

          <div className="pn-title-section">

            <div className="pn-title-label">
              PROVIDER PORTAL
            </div>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated with your scholarship
              activities and applications.
            </p>

          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="pn-mark-all-button"
              onClick={
                handleMarkAllAsRead
              }
              disabled={
                markAllLoading
              }
            >
              {markAllLoading
                ? "Marking..."
                : "Mark all as read"}
            </button>
          )}

        </header>

        {/* ERROR */}

        {error && (
          <div className="pn-summary-card">

            <div className="pn-summary-content">

              <h2>
                Unable to load notifications
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="pn-read-button"
                onClick={
                  fetchNotifications
                }
              >
                Try Again
              </button>

            </div>

          </div>
        )}

        {/* NOTIFICATION SUMMARY */}

        {!error && (
          <section className="pn-summary-card">

            <div className="pn-summary-icon">

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                <path d="M10 21h4" />
              </svg>

            </div>

            <div className="pn-summary-content">

              <h2>

                {unreadCount === 0
                  ? "You're all caught up"
                  : `${unreadCount} unread notification${
                      unreadCount > 1
                        ? "s"
                        : ""
                    }`}

              </h2>

              <p>
                Review your latest scholarship
                and application updates.
              </p>

            </div>

          </section>
        )}

        {/* NOTIFICATIONS LIST */}

        {!error && (
          <section className="pn-notifications-section">

            <div className="pn-section-header">

              <div>

                <h2>
                  Recent Notifications
                </h2>

                <p>
                  Your latest provider activity
                </p>

              </div>

            </div>

            {notifications.length === 0 ? (

              <div className="pn-empty-state">

                <div className="pn-empty-icon">

                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                    <path d="M10 21h4" />
                  </svg>

                </div>

                <h3>
                  No notifications yet
                </h3>

                <p>
                  New scholarship and application
                  updates will appear here.
                </p>

              </div>

            ) : (

              <div className="pn-notification-list">

                {notifications.map(
                  (notification) => (

                    <div
                      key={
                        notification.id
                      }
                      className={`pn-notification-card ${
                        !notification.isRead
                          ? "pn-unread"
                          : ""
                      }`}
                    >

                      {getNotificationIcon(
                        notification.type
                      )}

                      <div className="pn-notification-content">

                        <div className="pn-notification-top">

                          <h3>
                            {notification.title}
                          </h3>

                          {!notification.isRead && (
                            <span className="pn-unread-dot" />
                          )}

                        </div>

                        <p>
                          {notification.message}
                        </p>

                        <div className="pn-notification-bottom">

                          <span className="pn-notification-time">
                            {notification.time}
                          </span>

                          {!notification.isRead && (

                            <button
                              type="button"
                              className="pn-read-button"
                              onClick={() =>
                                handleMarkAsRead(
                                  notification.id
                                )
                              }
                              disabled={
                                actionLoading ===
                                notification.id
                              }
                            >
                              {actionLoading ===
                              notification.id
                                ? "Updating..."
                                : "Mark as read"}
                            </button>

                          )}

                          <button
                            type="button"
                            className="pn-remove-button"
                            onClick={() =>
                              handleRemoveNotification(
                                notification.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              notification.id
                            }
                            aria-label="Remove notification"
                          >

                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18" />

                              <path d="M8 6V4h8v2" />

                              <path d="M19 6l-1 14H6L5 6" />
                            </svg>

                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>
        )}

      </main>

    </div>
  );
};

export default ProviderNotifications;