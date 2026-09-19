import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";

/* ---------- Props ---------- */

interface StudentDashboardProps {
    onFindScholarships?: () => void;
    onAIRecommendations?: () => void;
    onMyApplications?: () => void;
    onSavedScholarships?: () => void;
    onNotifications?: () => void;
    onMyDocuments?: () => void;
    onMyProfile?: () => void;
}

/* ---------- Inline SVG Icon Components ---------- */

const IconDashboard = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
);

const IconSearch = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconSpark = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </svg>
);

const IconApplications = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
);

const IconBookmark = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const IconBell = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconFolder = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const IconUser = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconLogout = () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const IconCap = () => (
    <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
    >
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
        <path d="M22 10v6" />
    </svg>
);

const IconTrophy = () => (
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
        <path d="M7 5H4a3 3 0 0 0 3 4" />
        <path d="M17 5h3a3 3 0 0 1-3 4" />
    </svg>
);

const IconDocument = () => (
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
    </svg>
);

const IconWallet = () => (
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M21 7H5a2 2 0 0 1-2-2 2 2 0 0 1 2-2h13v4" />
        <path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z" />
        <circle cx="17" cy="14" r="1.3" />
    </svg>
);

const IconClock = () => (
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
    </svg>
);

const IconCheck = () => (
    <svg
        viewBox="0 0 24 24"
        width="13"
        height="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconArrowRight = () => (
    <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconChat = () => (
    <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
);

/* ---------- Data ---------- */

const navItems = [
    {
        label: "Dashboard",
        icon: <IconDashboard />,
        active: true,
    },
    {
        label: "Find Scholarships",
        icon: <IconSearch />,
        active: false,
    },
    {
        label: "AI Recommendations",
        icon: <IconSpark />,
        active: false,
        badge: "New",
    },
    {
        label: "My Applications",
        icon: <IconApplications />,
        active: false,
    },
    {
        label: "Saved Scholarships",
        icon: <IconBookmark />,
        active: false,
    },
    {
        label: "Notifications",
        icon: <IconBell />,
        active: false,
        dot: true,
    },
    {
        label: "My Documents",
        icon: <IconFolder />,
        active: false,
    },
    {
        label: "My Profile",
        icon: <IconUser />,
        active: false,
    },
];

const statCards = [
    {
        icon: <IconSpark />,
        value: "12",
        label: "AI Matches",
        trend: "+3 this wk",
        sub: "Filtered to your engineering criteria",
        accent: "purple",
    },
    {
        icon: <IconDocument />,
        value: "4",
        label: "Applications",
        trend: "Active",
        sub: "1 awaiting online interview",
        accent: "blue",
    },
    {
        icon: <IconWallet />,
        value: "7",
        label: "Saved Opportunities",
        trend: "₹4.85L",
        sub: "Total cumulative grant valuation",
        accent: "amber",
    },
    {
        icon: <IconClock />,
        value: "3",
        label: "Closing Soon",
        trend: "+5 days left",
        sub: "Earliest submission due on 18 Sep",
        accent: "red",
    },
];

const profileChecklist = [
    {
        label: "Academic Transcripts",
        status: "Verified",
        done: true,
    },
    {
        label: "Income & Financial Docs",
        status: "Verified",
        done: true,
    },
    {
        label: "Statement of Purpose",
        status: "Pending Draft",
        done: false,
    },
];

const deadlines = [
    {
        title: "L'Oréal India For Young Women In Science",
        tag: "Action Needed",
        detail: "Resume Draft",
        closes: "18 Sep 2026",
        days: "5 days left",
        urgent: true,
    },
    {
        title: "Tata Scholarship for Higher Education",
        tag: "",
        detail: "Review Form",
        closes: "30 Sep 2026",
        days: "17 days left",
        urgent: false,
    },
    {
        title: "K.C. Mahindra All India Scholarship",
        tag: "",
        detail: "Start App",
        closes: "10 Oct 2026",
        days: "",
        urgent: false,
    },
];

const filterTabs = [
    "All Matches (12)",
    "Merit-Based",
    "Need-Based",
    "STEM & Tech",
];

const scholarship = {
    title: "Tata Scholarship for Higher Education",
    org: "Tata Trusts Foundation | Mumbai, India",
    tags: [
        "Merit-cum-Means",
        "STEM & Engg",
        "Undergraduate",
    ],
    amount: "₹50,000 / year",
    deadline: "Deadline: 30 Sep 2026",
    match: "96% AI Match",
};

/* ---------- Component ---------- */

const StudentDashboard: React.FC<StudentDashboardProps> = ({
    onFindScholarships,
    onAIRecommendations,
    onMyApplications,
    onSavedScholarships,
    onNotifications,
    onMyDocuments,
    onMyProfile,
}) => {
    const [studentName, setStudentName] = useState("Student");
    const [studentEmail, setStudentEmail] = useState("");

    useEffect(() => {
        const savedUser =
            localStorage.getItem("scholarbridge_user");

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);

                if (user.full_name) {
                    setStudentName(user.full_name);
                } else if (user.name) {
                    setStudentName(user.name);
                } else if (user.email) {
                    setStudentName(
                        user.email
                            .split("@")[0]
                            .replace(/[._-]/g, " ")
                            .replace(
                                /\b\w/g,
                                (letter: string) =>
                                    letter.toUpperCase()
                            )
                    );
                }

                if (user.email) {
                    setStudentEmail(user.email);
                }
            } catch (error) {
                console.error(
                    "Unable to read saved user:",
                    error
                );
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("scholarbridge_token");
        localStorage.removeItem("scholarbridge_user");

        window.location.reload();
    };

    return (
        <div className="sb-app">

            {/* Sidebar */}

            <aside className="sb-sidebar">

                <div className="sb-brand">

                    <div className="sb-brand-mark">
                        SB
                    </div>

                    <span className="sb-brand-name">
                        ScholarBridge AI
                    </span>

                </div>

                <nav className="sb-nav">

                    {navItems.map((item) => (

                        <button
                            key={item.label}
                            className={`sb-nav-item${item.active
                                    ? " active"
                                    : ""
                                }`}
                            type="button"
                            onClick={() => {

                                if (
                                    item.label ===
                                    "Find Scholarships"
                                ) {
                                    onFindScholarships?.();
                                }

                                if (
                                    item.label ===
                                    "AI Recommendations"
                                ) {
                                    onAIRecommendations?.();
                                }

                                if (
                                    item.label ===
                                    "My Applications"
                                ) {
                                    onMyApplications?.();
                                }

                                if (
                                    item.label ===
                                    "Saved Scholarships"
                                ) {
                                    onSavedScholarships?.();
                                }

                                if (
                                    item.label ===
                                    "Notifications"
                                ) {
                                    onNotifications?.();
                                }

                                if (
                                    item.label ===
                                    "My Documents"
                                ) {
                                    onMyDocuments?.();
                                }

                                /* My Profile */

                                if (
                                    item.label ===
                                    "My Profile"
                                ) {
                                    onMyProfile?.();
                                }

                            }}
                        >

                            <span className="sb-nav-icon">
                                {item.icon}
                            </span>

                            <span className="sb-nav-label">
                                {item.label}
                            </span>

                            {item.badge && (
                                <span className="sb-nav-badge">
                                    {item.badge}
                                </span>
                            )}

                            {item.dot && (
                                <span className="sb-nav-dot" />
                            )}

                        </button>

                    ))}

                </nav>

                <div className="sb-sidebar-promo">

                    <div className="sb-promo-icon">
                        <IconCap />
                    </div>

                    <h4>
                        Empowering Your Education Journey
                    </h4>

                    <p>
                        Intelligent algorithm matching for
                        national &amp; global scholarship
                        programs.
                    </p>

                    <button
                        className="sb-promo-btn"
                        type="button"
                        onClick={onFindScholarships}
                    >
                        Explore All Matches
                    </button>

                </div>

                <div className="sb-sidebar-footer">

                    <div className="sb-standing">

                        <span className="sb-standing-dot" />

                        Academic Standing

                        <div className="sb-standing-sub">
                            Final Review Cycle · 2025
                        </div>

                    </div>

                    <button
                        className="sb-logout"
                        type="button"
                        onClick={handleLogout}
                    >

                        <IconLogout />

                        <span>
                            Sign Out
                        </span>

                    </button>

                </div>

            </aside>

            {/* Main */}

            <div className="sb-main">

                {/* Top header */}

                <header className="sb-topbar">

                    <div className="sb-topbar-left">

                        <div className="sb-brand-mark small">
                            SB
                        </div>

                        <span className="sb-topbar-title">
                            ScholarBridge AI
                        </span>

                    </div>

                    <div className="sb-topbar-center">
                        Connecting Students to the Right
                        Scholarship Opportunities
                    </div>

                    <div className="sb-topbar-right">

                        <button
                            className="sb-icon-btn"
                            type="button"
                            aria-label="Search"
                            onClick={onFindScholarships}
                        >
                            <IconSearch />
                        </button>

                        <div className="sb-ai-optimal">

                            <IconSpark />

                            <span>
                                AI Match: Optimal
                            </span>

                        </div>

                        <button
                            className="sb-icon-btn"
                            type="button"
                            aria-label="Notifications"
                            onClick={onNotifications}
                        >

                            <IconBell />

                            <span className="sb-icon-dot" />

                        </button>

                        <div
                            className="sb-user-chip"
                            onClick={onMyProfile}
                            role="button"
                            tabIndex={0}
                            title="Open My Profile"
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    onMyProfile?.();
                                }
                            }}
                        >

                            <div className="sb-avatar">

                                {studentName
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                            <div className="sb-user-meta">

                                <span className="sb-user-name">
                                    {studentName}
                                </span>

                                <span className="sb-user-role">
                                    {studentEmail || "Student"}
                                </span>

                            </div>

                        </div>

                    </div>

                </header>

                <div className="sb-content">

                    {/* Welcome hero */}

                    <section className="sb-hero">

                        <div className="sb-hero-text">

                            <span className="sb-hero-year">
                                Academic Year 2025–27
                            </span>

                            <h1>
                                Welcome back, {studentName}!{" "}
                                <span className="sb-hero-wave">
                                    👋
                                </span>
                            </h1>

                            <p>
                                Find scholarships tailored to
                                your academic profile to
                                accelerate your higher
                                education ambitions.
                            </p>

                            <div className="sb-hero-actions">

                                <button
                                    className="sb-btn-white"
                                    type="button"
                                    onClick={
                                        onFindScholarships
                                    }
                                >

                                    <IconSearch />

                                    Find Scholarships

                                </button>

                                <button
                                    className="sb-btn-ghost"
                                    type="button"
                                    onClick={
                                        onAIRecommendations
                                    }
                                >

                                    <IconSpark />

                                    AI Recommendations{" "}

                                    <span className="sb-pill">
                                        13 New
                                    </span>

                                </button>

                            </div>

                        </div>

                        <div className="sb-hero-badge">

                            <div className="sb-hero-badge-ring">
                                <IconCap />
                            </div>

                        </div>

                    </section>

                    {/* Two column layout */}

                    <div className="sb-layout">

                        <div className="sb-left-col">

                            {/* Stat cards */}

                            <section className="sb-stats-grid">

                                {statCards.map((card) => (

                                    <div
                                        className={`sb-stat-card accent-${card.accent}`}
                                        key={card.label}
                                    >

                                        <div className="sb-stat-top">

                                            <span className="sb-stat-icon">
                                                {card.icon}
                                            </span>

                                            <span className="sb-stat-trend">
                                                {card.trend}
                                            </span>

                                        </div>

                                        <div className="sb-stat-value">
                                            {card.value}
                                        </div>

                                        <div className="sb-stat-label">
                                            {card.label}
                                        </div>

                                        <div className="sb-stat-sub">
                                            {card.sub}
                                        </div>

                                    </div>

                                ))}

                            </section>

                            {/* Recommended */}

                            <section className="sb-panel">

                                <div className="sb-panel-header">

                                    <div className="sb-panel-title">

                                        <IconSpark />

                                        <div>

                                            <h3>
                                                Recommended For You
                                            </h3>

                                            <p>
                                                Curated scholarship
                                                matches based on
                                                your academic
                                                credentials
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        className="sb-view-all"
                                        type="button"
                                        onClick={
                                            onAIRecommendations
                                        }
                                    >

                                        View All (12)

                                        <IconArrowRight />

                                    </button>

                                </div>

                                <div className="sb-filter-tabs">

                                    {filterTabs.map(
                                        (tab, i) => (

                                            <button
                                                key={tab}
                                                className={`sb-filter-tab${i === 0
                                                        ? " active"
                                                        : ""
                                                    }`}
                                                type="button"
                                            >
                                                {tab}
                                            </button>

                                        )
                                    )}

                                </div>

                                <div className="sb-scholarship-card">

                                    <div className="sb-scholarship-main">

                                        <div className="sb-scholarship-icon">
                                            <IconTrophy />
                                        </div>

                                        <div className="sb-scholarship-info">

                                            <div className="sb-scholarship-title-row">

                                                <h4>
                                                    {
                                                        scholarship.title
                                                    }
                                                </h4>

                                                <span className="sb-match-badge">
                                                    {
                                                        scholarship.match
                                                    }
                                                </span>

                                            </div>

                                            <p className="sb-scholarship-org">
                                                {scholarship.org}
                                            </p>

                                            <div className="sb-scholarship-tags">

                                                {scholarship.tags.map(
                                                    (tag) => (

                                                        <span
                                                            className="sb-tag"
                                                            key={tag}
                                                        >
                                                            {tag}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                    <div className="sb-scholarship-side">

                                        <div className="sb-scholarship-amount">
                                            {
                                                scholarship.amount
                                            }
                                        </div>

                                        <div className="sb-scholarship-deadline">

                                            <IconClock />

                                            {
                                                scholarship.deadline
                                            }

                                        </div>

                                        <button
                                            className="sb-apply-btn"
                                            type="button"
                                        >
                                            Apply Now
                                        </button>

                                    </div>

                                </div>

                            </section>

                        </div>

                        <div className="sb-right-col">

                            {/* Profile strength */}

                            <section className="sb-panel sb-profile-panel">

                                <div className="sb-profile-header">

                                    <IconUser />

                                    <h3>
                                        Profile Strength
                                    </h3>

                                </div>

                                <p className="sb-profile-sub">

                                    Complete remaining sections
                                    to unlock top-tier
                                    institutional grant
                                    matches.

                                </p>

                                <div className="sb-progress-row">

                                    <div className="sb-progress-track">

                                        <div
                                            className="sb-progress-fill"
                                            style={{
                                                width: "85%",
                                            }}
                                        />

                                    </div>

                                    <span className="sb-progress-value">
                                        85%
                                    </span>

                                </div>

                                <ul className="sb-checklist">

                                    {profileChecklist.map(
                                        (item) => (

                                            <li
                                                className="sb-checklist-item"
                                                key={item.label}
                                            >

                                                <span
                                                    className={`sb-check-icon${item.done
                                                            ? " done"
                                                            : ""
                                                        }`}
                                                >

                                                    {item.done ? (
                                                        <IconCheck />
                                                    ) : (
                                                        <IconClock />
                                                    )}

                                                </span>

                                                <span className="sb-check-label">
                                                    {item.label}
                                                </span>

                                                <span
                                                    className={`sb-check-status${item.done
                                                            ? " verified"
                                                            : " pending"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>

                                            </li>

                                        )
                                    )}

                                </ul>

                                <button
                                    className="sb-complete-btn"
                                    type="button"
                                    onClick={onMyProfile}
                                >
                                    Complete Profile
                                    <IconArrowRight />
                                </button>

                            </section>

                        </div>

                    </div>

                    {/* Upcoming deadlines */}

                    <section className="sb-panel sb-deadlines-panel">

                        <div className="sb-panel-header">

                            <div className="sb-panel-title">

                                <IconClock />

                                <div>
                                    <h3>
                                        Upcoming Deadlines
                                    </h3>
                                </div>

                            </div>

                            <span className="sb-action-needed">
                                Action Needed
                            </span>

                        </div>

                        <ul className="sb-deadline-list">

                            {deadlines.map((d) => (

                                <li
                                    className={`sb-deadline-item${d.urgent
                                            ? " urgent"
                                            : ""
                                        }`}
                                    key={d.title}
                                >

                                    <div className="sb-deadline-info">

                                        <div className="sb-deadline-title-row">

                                            <span className="sb-deadline-title">
                                                {d.title}
                                            </span>

                                            {d.urgent && (
                                                <span className="sb-deadline-flag">
                                                    {d.days}
                                                </span>
                                            )}

                                        </div>

                                        <span className="sb-deadline-detail">
                                            {d.detail}
                                        </span>

                                    </div>

                                    <div className="sb-deadline-right">

                                        <span className="sb-deadline-closes">
                                            Closes: {d.closes}
                                        </span>

                                        {!d.urgent &&
                                            d.days && (
                                                <span className="sb-deadline-days">
                                                    {d.days}
                                                </span>
                                            )}

                                    </div>

                                </li>

                            ))}

                        </ul>

                    </section>

                </div>

            </div>

            {/* Floating assistant */}

            <button
                className="sb-fab"
                type="button"
            >

                <IconChat />

                <span>
                    Ask ScholarBridge AI

                    <small>
                        Instant Eligibility Advisor
                    </small>
                </span>

            </button>

        </div>
    );
};

export default StudentDashboard;