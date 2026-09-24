import React, { useEffect, useState } from "react";
import "./Notifications.css";

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: string;
    type_display?: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationsProps {
    onBack?: () => void;
}

interface NotificationsResponse {
    success: boolean;
    unread_count: number;
    notifications: NotificationItem[];
}

const Notifications: React.FC<NotificationsProps> = ({
    onBack,
}) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [markAllLoading, setMarkAllLoading] = useState<boolean>(false);

    const API_BASE_URL = "http://127.0.0.1:8000";

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getToken = () => {
        return (
            localStorage.getItem("provider_token") ||
            localStorage.getItem("scholarbridge_token")
        );
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                setError("Please login again.");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/notifications/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data: NotificationsResponse = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.success === false
                        ? "Unable to load notifications."
                        : "Failed to load notifications."
                );
            }

            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (err) {
            console.error("Notifications error:", err);
            setError("Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const token = getToken();

            if (!token) {
                setError("Please login again.");
                return;
            }

            setActionLoading(notificationId);

            const response = await fetch(
                `${API_BASE_URL}/api/notifications/${notificationId}/read/`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to mark notification as read."
                );
            }

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification.id === notificationId
                        ? {
                              ...notification,
                              is_read: true,
                          }
                        : notification
                )
            );

            setUnreadCount((currentCount) =>
                Math.max(currentCount - 1, 0)
            );
        } catch (err) {
            console.error("Mark as read error:", err);
            setError("Unable to mark notification as read.");
        } finally {
            setActionLoading(null);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = getToken();

            if (!token) {
                setError("Please login again.");
                return;
            }

            setMarkAllLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/notifications/mark-all-read/`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to mark all notifications as read."
                );
            }

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );

            setUnreadCount(0);
        } catch (err) {
            console.error("Mark all as read error:", err);
            setError("Unable to mark all notifications as read.");
        } finally {
            setMarkAllLoading(false);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            const token = getToken();

            if (!token) {
                setError("Please login again.");
                return;
            }

            setActionLoading(notificationId);

            const notificationToDelete = notifications.find(
                (notification) => notification.id === notificationId
            );

            const response = await fetch(
                `${API_BASE_URL}/api/notifications/${notificationId}/delete/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to delete notification."
                );
            }

            setNotifications((currentNotifications) =>
                currentNotifications.filter(
                    (notification) => notification.id !== notificationId
                )
            );

            if (notificationToDelete && !notificationToDelete.is_read) {
                setUnreadCount((currentCount) =>
                    Math.max(currentCount - 1, 0)
                );
            }
        } catch (err) {
            console.error("Delete notification error:", err);
            setError("Unable to delete notification.");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="notifications-page">
                <div className="notifications-loading">
                    Loading notifications...
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page">

            <div className="notifications-header">

                <div className="notifications-header-content">
                    <h1>Notifications</h1>

                    <p>
                        Stay updated with your scholarship activities.
                    </p>

                    {unreadCount > 0 && (
                        <span className="notifications-unread-count">
                            {unreadCount} unread
                        </span>
                    )}
                </div>

                <div className="notifications-header-actions">

                    {unreadCount > 0 && (
                        <button
                            className="notifications-mark-all-button"
                            onClick={markAllAsRead}
                            disabled={markAllLoading}
                        >
                            {markAllLoading
                                ? "Marking..."
                                : "Mark All as Read"}
                        </button>
                    )}

                    <button
                        className="notifications-back-button"
                        onClick={onBack}
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

            {error && (
                <div className="notifications-error">
                    {error}
                </div>
            )}

            {!error && notifications.length === 0 && (
                <div className="notifications-empty">

                    <div className="notifications-empty-icon">
                        🔔
                    </div>

                    <h2>No Notifications</h2>

                    <p>
                        You don't have any notifications yet.
                    </p>

                </div>
            )}

            {!error && notifications.length > 0 && (
                <div className="notifications-list">

                    {notifications.map((notification) => (

                        <div
                            key={notification.id}
                            className={`notification-card ${
                                notification.is_read
                                    ? "notification-read"
                                    : "notification-unread"
                            }`}
                        >

                            <div className="notification-icon">
                                🔔
                            </div>

                            <div className="notification-content">

                                <div className="notification-title-row">

                                    <h3>
                                        {notification.title}
                                    </h3>

                                    {!notification.is_read && (
                                        <span className="notification-new">
                                            NEW
                                        </span>
                                    )}

                                </div>

                                <p>
                                    {notification.message}
                                </p>

                                <span className="notification-date">
                                    {formatDate(notification.created_at)}
                                    {" • "}
                                    {formatTime(notification.created_at)}
                                </span>

                                <div className="notification-actions">

                                    {!notification.is_read && (
                                        <button
                                            className="notification-read-button"
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                            disabled={
                                                actionLoading ===
                                                notification.id
                                            }
                                        >
                                            {actionLoading ===
                                            notification.id
                                                ? "Updating..."
                                                : "Mark as Read"}
                                        </button>
                                    )}

                                    <button
                                        className="notification-delete-button"
                                        onClick={() =>
                                            deleteNotification(
                                                notification.id
                                            )
                                        }
                                        disabled={
                                            actionLoading ===
                                            notification.id
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default Notifications;