import React, { useEffect, useState } from "react";
import "./MyApplications.css";

interface Application {
    id: number;
    scholarship: number;
    scholarship_title: string;
    scholarship_amount: string;
    provider_name: string;
    deadline: string;
    status: string;
    status_display: string;
    applied_at: string;
    updated_at: string;
}

interface MyApplicationsProps {
    onBack?: () => void;
}

const MyApplications: React.FC<MyApplicationsProps> = ({
    onBack,
}) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("scholarbridge_token");

                if (!token) {
                    setError(
                        "Please login again to view your applications."
                    );
                    return;
                }

                const response = await fetch(
                    "http://127.0.0.1:8000/application/api/",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch applications"
                    );
                }

                const data = await response.json();

                setApplications(data);
            } catch (error) {
                console.error(
                    "Applications fetch error:",
                    error
                );

                setError(
                    "Unable to load your applications. Please make sure Django server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return "N/A";
        }

        const date = new Date(dateString);

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "application-status approved";

            case "REJECTED":
                return "application-status rejected";

            case "UNDER_REVIEW":
                return "application-status under-review";

            default:
                return "application-status pending";
        }
    };

    return (
        <div className="my-applications-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="my-applications-header">

                <div className="my-applications-heading">

                    <div className="my-applications-icon">
                        📋
                    </div>

                    <div>

                        <span className="my-applications-label">
                            APPLICATION TRACKER
                        </span>

                        <h1 className="my-applications-title">
                            My Applications
                        </h1>

                        <p className="my-applications-subtitle">
                            Track the scholarships you have applied
                            for and monitor their application status.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    className="back-dashboard-btn"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

            </div>


            {/* =====================================================
                LOADING
            ===================================================== */}

            {loading && (
                <div className="applications-loading">

                    <div className="applications-spinner"></div>

                    <p>
                        Loading your applications...
                    </p>

                </div>
            )}


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (
                <div className="applications-error">

                    <span>⚠️</span>

                    <p>
                        {error}
                    </p>

                </div>
            )}


            {/* =====================================================
                EMPTY STATE
            ===================================================== */}

            {!loading &&
                !error &&
                applications.length === 0 && (

                    <div className="applications-empty">

                        <div className="empty-applications-icon">
                            📋
                        </div>

                        <h2>
                            No Applications Yet
                        </h2>

                        <p>
                            You haven't applied for any scholarships
                            yet.
                        </p>

                    </div>
                )}


            {/* =====================================================
                APPLICATIONS
            ===================================================== */}

            {!loading &&
                !error &&
                applications.length > 0 && (

                    <div className="applications-content">

                        {/* Summary */}

                        <div className="applications-summary">

                            <div>

                                <span>
                                    TOTAL APPLICATIONS
                                </span>

                                <strong>
                                    {applications.length}
                                </strong>

                            </div>

                            <p>
                                Here you can track all your scholarship
                                applications.
                            </p>

                        </div>


                        {/* Application Cards */}

                        <div className="applications-grid">

                            {applications.map(
                                (application) => (

                                    <div
                                        className="application-card"
                                        key={application.id}
                                    >

                                        {/* Card Top */}

                                        <div className="application-card-top">

                                            <div className="application-card-icon">
                                                🎓
                                            </div>

                                            <span
                                                className={getStatusClass(
                                                    application.status
                                                )}
                                            >
                                                {application.status_display}
                                            </span>

                                        </div>


                                        {/* Scholarship */}

                                        <h2>
                                            {application.scholarship_title}
                                        </h2>


                                        {/* Provider */}

                                        <div className="application-provider">

                                            <span>
                                                🏢 Provider
                                            </span>

                                            <strong>
                                                {application.provider_name}
                                            </strong>

                                        </div>


                                        {/* Information */}

                                        <div className="application-info">

                                            <div className="application-info-item">

                                                <span>
                                                    💰 Amount
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        application.scholarship_amount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            <div className="application-info-item">

                                                <span>
                                                    ⏰ Deadline
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        application.deadline
                                                    )}
                                                </strong>

                                            </div>


                                            <div className="application-info-item">

                                                <span>
                                                    📅 Applied On
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        application.applied_at
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* Status */}

                                        <div className="application-status-section">

                                            <span>
                                                Application Status
                                            </span>

                                            <strong
                                                className={getStatusClass(
                                                    application.status
                                                )}
                                            >
                                                {application.status_display}
                                            </strong>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </div>
                )}

        </div>
    );
};

export default MyApplications;