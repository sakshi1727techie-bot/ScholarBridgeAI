import React, { useEffect, useState } from "react";
import "./Notifications.css";

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationsProps {
    onBack?: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({
    onBack,
}) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("scholarbridge_token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
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
                throw new Error("Failed to load notifications.");
            }

            const data = await response.json();

            setNotifications(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
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
                </div>

                <button
                    className="notifications-back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

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
                            className={`notification-card ${notification.is_read
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
                                    {formatDate(
                                        notification.created_at
                                    )}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default Notifications;