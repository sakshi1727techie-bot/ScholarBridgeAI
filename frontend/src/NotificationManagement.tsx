import React, { useEffect, useState } from "react";
import "./NotificationManagement.css";

interface Notification {
  id: number;
  title: string;
  message: string;
  type:
    | "System"
    | "Scholarship"
    | "Application"
    | "Deadline"
    | "Other";
  recipient: string;
  createdDate: string;
  status: "Read" | "Unread";
}

interface BackendNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  type_display?: string;
  is_read: boolean;
  created_at: string;
  user?: number;
  user_email?: string;
  recipient?: string;
}

interface AdminNotificationResponse {
  success: boolean;
  count: number;

  statistics: {
    total_notifications: number;
    unread: number;
    read: number;
    system: number;
    scholarship: number;
    application: number;
    deadline: number;
    other: number;
  };

  notifications: BackendNotification[];
}

const NotificationManagement: React.FC = () => {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [statistics, setStatistics] = useState({
    total_notifications: 0,
    unread: 0,
    read: 0,
    system: 0,
    scholarship: 0,
    application: 0,
    deadline: 0,
    other: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");


  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = (): string | null => {

    return (
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token")
    );
  };


  // =====================================================
  // FETCH ADMIN NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {

    try {

      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {

        setError(
          "Admin authentication token not found. Please login again."
        );

        setLoading(false);

        return;
      }


      const response = await fetch(
        "http://127.0.0.1:8000/api/notifications/admin/",
        {
          method: "GET",

          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      const data: AdminNotificationResponse =
        await response.json();


      // =================================================
      // HANDLE API ERROR
      // =================================================

      if (!response.ok) {

        setError(
          data &&
          "success" in data &&
          data.success === false
            ? "Unable to load notifications."
            : `Failed to load notifications. Status: ${response.status}`
        );

        setLoading(false);

        return;
      }


      // =================================================
      // CHECK SUCCESS
      // =================================================

      if (!data.success) {

        setError("Unable to load notifications.");

        setLoading(false);

        return;
      }


      // =================================================
      // SET STATISTICS
      // =================================================

      setStatistics({
        total_notifications:
          data.statistics?.total_notifications || 0,

        unread:
          data.statistics?.unread || 0,

        read:
          data.statistics?.read || 0,

        system:
          data.statistics?.system || 0,

        scholarship:
          data.statistics?.scholarship || 0,

        application:
          data.statistics?.application || 0,

        deadline:
          data.statistics?.deadline || 0,

        other:
          data.statistics?.other || 0,
      });


      // =================================================
      // MAP BACKEND DATA TO EXISTING UI
      // =================================================

      const mappedNotifications: Notification[] =
        (data.notifications || []).map(
          (notification) => {

            const backendType =
              notification.type?.toUpperCase();


            let displayType: Notification["type"] =
              "Other";


            switch (backendType) {

              case "SYSTEM":
                displayType = "System";
                break;

              case "SCHOLARSHIP":
                displayType = "Scholarship";
                break;

              case "APPLICATION":
                displayType = "Application";
                break;

              case "DEADLINE":
                displayType = "Deadline";
                break;

              case "OTHER":
              default:
                displayType = "Other";
                break;
            }


            // ===========================================
            // RECIPIENT
            // ===========================================

            const recipient =
              notification.recipient ||
              notification.user_email ||
              (
                notification.user
                  ? `User #${notification.user}`
                  : "Unknown User"
              );


            // ===========================================
            // DATE
            // ===========================================

            let createdDate = "-";

            if (notification.created_at) {

              const date = new Date(
                notification.created_at
              );

              if (!isNaN(date.getTime())) {

                createdDate =
                  date.toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  );
              }
            }


            // ===========================================
            // STATUS
            // ===========================================

            const status: Notification["status"] =
              notification.is_read
                ? "Read"
                : "Unread";


            return {

              id: notification.id,

              title:
                notification.title || "Notification",

              message:
                notification.message || "",

              type: displayType,

              recipient,

              createdDate,

              status,
            };
          }
        );


      setNotifications(mappedNotifications);

    } catch (error) {

      console.error(
        "Admin Notifications API Error:",
        error
      );

      setError(
        "Unable to connect to the notification server."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    fetchNotifications();

  }, []);


  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (
    type: Notification["type"]
  ): string => {

    switch (type) {

      case "Scholarship":
        return "🎓";

      case "Application":
        return "📄";

      case "Deadline":
        return "⏰";

      case "System":
        return "🔔";

      case "Other":
      default:
        return "🔔";
    }
  };


  // =====================================================
  // NOTIFICATION TYPE CSS CLASS
  // =====================================================

  const getTypeClass = (
    type: Notification["type"]
  ): string => {

    switch (type) {

      case "Scholarship":
        return "notification-management-type-scholarship";

      case "Application":
        return "notification-management-type-application";

      case "Deadline":
        return "notification-management-type-reminder";

      case "System":
        return "notification-management-type-system";

      case "Other":
      default:
        return "notification-management-type-system";
    }
  };


  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {

    return (
      <div className="notification-management-page">

        <div className="notification-management-header">

          <div className="notification-management-header-content">

            <div className="notification-management-title-row">

              <div className="notification-management-title-icon">
                🔔
              </div>

              <div>

                <h1 className="notification-management-title">
                  Notifications
                </h1>

                <p className="notification-management-subtitle">
                  View and monitor notifications generated across
                  the ScholarBridge AI platform.
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="notification-management-empty">

          <div className="notification-management-empty-icon">
            🔄
          </div>

          <h3 className="notification-management-empty-title">
            Loading Notifications...
          </h3>

          <p className="notification-management-empty-text">
            Please wait while notification data is being loaded
            from the ScholarBridge AI backend.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="notification-management-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="notification-management-header">

        <div className="notification-management-header-content">

          <div className="notification-management-title-row">

            <div className="notification-management-title-icon">
              🔔
            </div>

            <div>

              <h1 className="notification-management-title">
                Notifications
              </h1>

              <p className="notification-management-subtitle">
                View and monitor notifications generated across
                the ScholarBridge AI platform.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR MESSAGE
          ===================================================== */}

      {error && (

        <div
          style={{
            margin: "20px",
            padding: "14px 18px",
            borderRadius: "10px",
            background: "#fff1f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >

          <strong>Error:</strong> {error}

        </div>

      )}


      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <div className="notification-management-stats">

        {/* Total */}

        <div className="notification-management-stat-card">

          <div className="notification-management-stat-top">

            <div>

              <p className="notification-management-stat-label">
                Total Notifications
              </p>

              <h2 className="notification-management-stat-value">
                {statistics.total_notifications}
              </h2>

            </div>

            <div className="notification-management-stat-icon">
              🔔
            </div>

          </div>

        </div>


        {/* Unread */}

        <div className="notification-management-stat-card">

          <div className="notification-management-stat-top">

            <div>

              <p className="notification-management-stat-label">
                Unread
              </p>

              <h2 className="notification-management-stat-value">
                {statistics.unread}
              </h2>

            </div>

            <div className="notification-management-stat-icon">
              ●
            </div>

          </div>

        </div>


        {/* Read */}

        <div className="notification-management-stat-card">

          <div className="notification-management-stat-top">

            <div>

              <p className="notification-management-stat-label">
                Read
              </p>

              <h2 className="notification-management-stat-value">
                {statistics.read}
              </h2>

            </div>

            <div className="notification-management-stat-icon">
              ✓
            </div>

          </div>

        </div>


        {/* System */}

        <div className="notification-management-stat-card">

          <div className="notification-management-stat-top">

            <div>

              <p className="notification-management-stat-label">
                System Notifications
              </p>

              <h2 className="notification-management-stat-value">
                {statistics.system}
              </h2>

            </div>

            <div className="notification-management-stat-icon">
              ⚙
            </div>

          </div>

        </div>


        {/* Scholarship */}

        <div className="notification-management-stat-card">

          <div className="notification-management-stat-top">

            <div>

              <p className="notification-management-stat-label">
                Scholarship Notifications
              </p>

              <h2 className="notification-management-stat-value">
                {statistics.scholarship}
              </h2>

            </div>

            <div className="notification-management-stat-icon">
              🎓
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          NOTIFICATION PANEL
          ===================================================== */}

      <div className="notification-management-panel">

        <div className="notification-management-panel-header">

          <div>

            <h2 className="notification-management-panel-heading">
              Platform Notifications
            </h2>

            <p className="notification-management-panel-description">
              Notifications generated for students, providers,
              and platform activities
            </p>

          </div>

        </div>


        {/* ===================================================
            NOTIFICATION TABLE
            =================================================== */}

        {notifications.length > 0 ? (

          <div className="notification-management-table-wrapper">

            <table className="notification-management-table">

              <thead>

                <tr>

                  <th>
                    Notification
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Recipient
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {notifications.map(
                  (notification) => (

                    <tr key={notification.id}>

                      {/* Notification */}

                      <td>

                        <div className="notification-management-notification-cell">

                          <div className="notification-management-notification-icon">

                            {getNotificationIcon(
                              notification.type
                            )}

                          </div>


                          <div className="notification-management-notification-details">

                            <p className="notification-management-notification-title">

                              {notification.title}

                            </p>


                            <p className="notification-management-notification-message">

                              {notification.message}

                            </p>


                            <p className="notification-management-notification-id">

                              Notification ID: #
                              {notification.id}

                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Type */}

                      <td>

                        <span
                          className={`notification-management-type ${getTypeClass(
                            notification.type
                          )}`}
                        >

                          {notification.type}

                        </span>

                      </td>


                      {/* Recipient */}

                      <td>

                        <span className="notification-management-recipient">

                          {notification.recipient}

                        </span>

                      </td>


                      {/* Date */}

                      <td>

                        <span className="notification-management-date">

                          {notification.createdDate}

                        </span>

                      </td>


                      {/* Status */}

                      <td>

                        <span
                          className={`notification-management-status ${
                            notification.status === "Read"
                              ? "notification-management-status-read"
                              : "notification-management-status-unread"
                          }`}
                        >

                          {notification.status}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
             ================================================= */

          <div className="notification-management-empty">

            <div className="notification-management-empty-icon">
              🔔
            </div>

            <h3 className="notification-management-empty-title">
              No Notifications Found
            </h3>

            <p className="notification-management-empty-text">

              No platform notifications are currently available
              to display. Notifications generated by ScholarBridge AI
              will appear here.

            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          INFORMATION FOOTER
          ===================================================== */}

      <div className="notification-management-info-footer">

        <div className="notification-management-info-icon">
          ℹ
        </div>

        <span>

          Notification information displayed here is maintained
          by the ScholarBridge AI administration system.

        </span>

      </div>

    </div>
  );
};


export default NotificationManagement;