import React, { useEffect, useState } from "react";
import "./ProviderProfile.css";

interface ProviderProfileProps {
    onBackToDashboard?: () => void;
    onScholarshipsClick?: () => void;
    onApplicationsClick?: () => void;
    onNotificationsClick?: () => void;
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

interface ProfileResponse {
    success: boolean;
    provider?: ProviderData;
    message?: string;
}

interface NotificationsResponse {
    success: boolean;
    unread_count: number;
    notifications?: unknown[];
    message?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const ProviderProfile: React.FC<ProviderProfileProps> = ({
    onBackToDashboard,
    onScholarshipsClick,
    onApplicationsClick,
    onNotificationsClick,
}) => {

    const [provider, setProvider] =
        useState<ProviderData | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>("");

    const [activeNav, setActiveNav] =
        useState<string>("profile");

    // =====================================================
    // NOTIFICATION COUNT
    // =====================================================

    const [notificationCount, setNotificationCount] =
        useState<number>(0);


    // =====================================================
    // LOAD PROFILE + NOTIFICATIONS
    // =====================================================

    useEffect(() => {
        fetchProviderProfile();
        fetchNotificationCount();
    }, []);


    // =====================================================
    // FETCH PROVIDER PROFILE
    // =====================================================

    const fetchProviderProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("provider_token") ||
                sessionStorage.getItem("provider_token");

            if (!token) {

                setError(
                    "Provider authentication token not found."
                );

                setLoading(false);

                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/provider/api/profile/`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data: ProfileResponse =
                await response.json();

            if (!response.ok || !data.success) {

                setError(
                    data.message ||
                    "Unable to load provider profile."
                );

                setLoading(false);

                return;
            }

            setProvider(
                data.provider || null
            );

            setLoading(false);

        } catch (err) {

            console.error(
                "Provider profile error:",
                err
            );

            setError(
                "Unable to connect to the server."
            );

            setLoading(false);
        }
    };


    // =====================================================
    // FETCH NOTIFICATION COUNT
    // =====================================================

    const fetchNotificationCount = async () => {

        try {

            const token =
                localStorage.getItem("provider_token") ||
                sessionStorage.getItem("provider_token");

            if (!token) {
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

            if (!response.ok) {

                console.error(
                    "Unable to fetch notification count."
                );

                return;
            }

            const data: NotificationsResponse =
                await response.json();

            if (data.success) {

                setNotificationCount(
                    Number(data.unread_count || 0)
                );

            } else {

                setNotificationCount(0);
            }

        } catch (error) {

            console.error(
                "Notification count error:",
                error
            );

            setNotificationCount(0);
        }
    };


    // =====================================================
    // DASHBOARD
    // =====================================================

    const handleDashboardClick = () => {

        setActiveNav("dashboard");

        if (onBackToDashboard) {

            onBackToDashboard();
        }
    };


    // =====================================================
    // SCHOLARSHIPS
    // =====================================================

    const handleScholarshipsClick = () => {

        setActiveNav("scholarships");

        if (onScholarshipsClick) {

            onScholarshipsClick();
        }
    };


    // =====================================================
    // APPLICATIONS
    // =====================================================

    const handleApplicationsClick = () => {

        setActiveNav("applications");

        if (onApplicationsClick) {

            onApplicationsClick();
        }
    };


    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    const handleNotificationsClick = () => {

        setActiveNav("notifications");

        if (onNotificationsClick) {

            onNotificationsClick();
        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("provider_token");
        localStorage.removeItem("provider_user");
        localStorage.removeItem("provider_user_id");
        localStorage.removeItem("provider_email");
        localStorage.removeItem("provider_role");

        sessionStorage.removeItem("provider_token");
        sessionStorage.removeItem("provider_user");
        sessionStorage.removeItem("provider_user_id");
        sessionStorage.removeItem("provider_email");
        sessionStorage.removeItem("provider_role");

        window.location.reload();
    };


    // =====================================================
    // VERIFICATION CLASS
    // =====================================================

    const getVerificationClass = (
        status: string
    ) => {

        switch (status?.toUpperCase()) {

            case "VERIFIED":
                return "pp-status verified";

            case "REJECTED":
                return "pp-status rejected";

            default:
                return "pp-status pending";
        }
    };


    // =====================================================
    // VERIFICATION LABEL
    // =====================================================

    const getVerificationLabel = (
        status: string
    ) => {

        switch (status?.toUpperCase()) {

            case "VERIFIED":
                return "Verified";

            case "REJECTED":
                return "Rejected";

            default:
                return "Pending Verification";
        }
    };


    // =====================================================
    // SIDEBAR
    // =====================================================

    const renderSidebar = () => (

        <aside className="pp-sidebar">

            {/* ================= BRAND ================= */}

            <div className="pp-brand">

                <div className="pp-brand-icon">
                    SB
                </div>

                <div className="pp-brand-text">

                    <div className="pp-brand-name">
                        ScholarBridge
                    </div>

                    <div className="pp-brand-ai">
                        AI
                    </div>

                </div>

            </div>


            {/* ================= NAVIGATION ================= */}

            <nav className="pp-navigation">


                {/* ================= DASHBOARD ================= */}

                <button
                    type="button"
                    className={`pp-nav-item ${
                        activeNav === "dashboard"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleDashboardClick}
                >

                    <span className="pp-nav-icon">

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


                {/* ================= SCHOLARSHIPS ================= */}

                <button
                    type="button"
                    className={`pp-nav-item ${
                        activeNav === "scholarships"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleScholarshipsClick}
                >

                    <span className="pp-nav-icon">

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


                {/* ================= APPLICATIONS ================= */}

                <button
                    type="button"
                    className={`pp-nav-item ${
                        activeNav === "applications"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleApplicationsClick}
                >

                    <span className="pp-nav-icon">

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


                {/* ================= NOTIFICATIONS ================= */}

                <button
                    type="button"
                    className={`pp-nav-item ${
                        activeNav === "notifications"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleNotificationsClick}
                >

                    <span className="pp-nav-icon">

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


                    {/* ================= NOTIFICATION BADGE ================= */}

                    {notificationCount > 0 && (

                        <span className="pp-notification-badge">

                            {notificationCount}

                        </span>

                    )}

                </button>


                {/* ================= PROVIDER PROFILE ================= */}

                <button
                    type="button"
                    className={`pp-nav-item ${
                        activeNav === "profile"
                            ? "active"
                            : ""
                    }`}
                >

                    <span className="pp-nav-icon">

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


            {/* ================= SIDEBAR BOTTOM ================= */}

            <div className="pp-sidebar-bottom">


                {/* ================= PROVIDER MINI PROFILE ================= */}

                <div className="pp-provider-mini">

                    <div className="pp-provider-avatar">
                        P
                    </div>

                    <div className="pp-provider-info">

                        <strong>
                            Provider
                        </strong>

                        <span>
                            Provider Portal
                        </span>

                    </div>

                </div>


                {/* ================= LOGOUT ================= */}

                <button
                    type="button"
                    className="pp-logout"
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
    );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="pp-page">

                {renderSidebar()}

                <main className="pp-main">

                    <div className="pp-loading">

                        <div className="pp-spinner"></div>

                        <p>
                            Loading provider profile...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="pp-page">

                {renderSidebar()}

                <main className="pp-main">

                    <div className="pp-error-card">

                        <div className="pp-error-icon">
                            !
                        </div>

                        <h2>
                            Unable to Load Profile
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="pp-retry-button"
                            onClick={fetchProviderProfile}
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="pp-page">


            {/* ================= SIDEBAR ================= */}

            {renderSidebar()}


            {/* ================= MAIN CONTENT ================= */}

            <main className="pp-main">


                {/* ================= HEADER ================= */}

                <header className="pp-header">

                    <div>

                        <p className="pp-eyebrow">
                            ACCOUNT
                        </p>

                        <h1>
                            Provider Profile
                        </h1>

                        <p className="pp-subtitle">
                            Manage and view your organization
                            information.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="pp-back-button"
                        onClick={handleDashboardClick}
                    >

                        ← Dashboard

                    </button>

                </header>


                {/* ================= PROFILE CONTENT ================= */}

                {provider && (

                    <div className="pp-content">


                        {/* ================= PROFILE HEADER ================= */}

                        <section className="pp-profile-card">

                            <div className="pp-profile-avatar">

                                {provider.organization_name
                                    ? provider.organization_name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "P"}

                            </div>


                            <div className="pp-profile-main">

                                <h2>
                                    {
                                        provider.organization_name ||
                                        "Provider Organization"
                                    }
                                </h2>

                                <p>
                                    {
                                        provider.organization_type ||
                                        "Scholarship Provider"
                                    }
                                </p>


                                <span
                                    className={getVerificationClass(
                                        provider.verification_status
                                    )}
                                >

                                    <span className="pp-status-dot"></span>

                                    {
                                        getVerificationLabel(
                                            provider.verification_status
                                        )
                                    }

                                </span>

                            </div>

                        </section>


                        {/* ================= ORGANIZATION INFORMATION ================= */}

                        <section className="pp-section">

                            <div className="pp-section-header">

                                <div>

                                    <h3>
                                        Organization Information
                                    </h3>

                                    <p>
                                        Registered organization
                                        details
                                    </p>

                                </div>

                            </div>


                            <div className="pp-info-grid">


                                {/* ORGANIZATION NAME */}

                                <div className="pp-info-item">

                                    <span className="pp-info-label">
                                        Organization Name
                                    </span>

                                    <span className="pp-info-value">

                                        {
                                            provider.organization_name ||
                                            "Not provided"
                                        }

                                    </span>

                                </div>


                                {/* ORGANIZATION TYPE */}

                                <div className="pp-info-item">

                                    <span className="pp-info-label">
                                        Organization Type
                                    </span>

                                    <span className="pp-info-value">

                                        {
                                            provider.organization_type ||
                                            "Not provided"
                                        }

                                    </span>

                                </div>


                                {/* CONTACT PERSON */}

                                <div className="pp-info-item">

                                    <span className="pp-info-label">
                                        Contact Person
                                    </span>

                                    <span className="pp-info-value">

                                        {
                                            provider.contact_person ||
                                            "Not provided"
                                        }

                                    </span>

                                </div>


                                {/* EMAIL */}

                                <div className="pp-info-item">

                                    <span className="pp-info-label">
                                        Email Address
                                    </span>

                                    <span className="pp-info-value">

                                        {
                                            provider.email ||
                                            "Not provided"
                                        }

                                    </span>

                                </div>


                                {/* PHONE */}

                                <div className="pp-info-item">

                                    <span className="pp-info-label">
                                        Phone Number
                                    </span>

                                    <span className="pp-info-value">

                                        {
                                            provider.phone ||
                                            "Not provided"
                                        }

                                    </span>

                                </div>


                                {/* ADDRESS */}

                                <div className="pp-info-item pp-full-width">

                                    <span className="pp-info-label">
                                        Address
                                    </span>

                                    <span className="pp-info-value">

                                        {
                                            provider.address ||
                                            "Not provided"
                                        }

                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* ================= VERIFICATION ================= */}

                        <section className="pp-verification-card">

                            <div className="pp-verification-icon">
                                ✓
                            </div>

                            <div className="pp-verification-content">

                                <h3>
                                    Verification Status
                                </h3>

                                <p>

                                    Your provider account is currently{" "}

                                    <strong>

                                        {
                                            getVerificationLabel(
                                                provider.verification_status
                                            )
                                        }

                                    </strong>.

                                </p>

                            </div>

                        </section>

                    </div>

                )}

            </main>

        </div>
    );
};

export default ProviderProfile;