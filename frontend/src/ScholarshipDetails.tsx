import React, { useEffect, useState } from "react";
import "./ScholarshipDetails.css";

interface Eligibility {
    eligible_courses: string;
    specialization: string;
    minimum_percentage: string | null;
    maximum_income: string | null;
    category: string;
    gender: string;
    state: string;
    other_criteria: string;
}

interface RequiredDocument {
    id: number;
    document_type: string;
    document_type_display: string;
    is_mandatory: boolean;
    description: string;
}

interface Scholarship {
    id: number;
    title: string;
    description: string;
    amount: string;
    application_start: string;
    deadline: string;
    status: string;
    provider_name: string;
    eligibility: Eligibility | null;
    required_documents: RequiredDocument[];
}

interface ScholarshipDetailsProps {
    scholarshipId: number;
    onBack?: () => void;
}

const ScholarshipDetails: React.FC<ScholarshipDetailsProps> = ({
    scholarshipId,
    onBack,
}) => {
    const [scholarship, setScholarship] =
        useState<Scholarship | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [applying, setApplying] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState("");
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [applicationSuccess, setApplicationSuccess] = useState(false);

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://127.0.0.1:8000/api/scholarships/${scholarshipId}/details/`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch scholarship details"
                    );
                }

                const data = await response.json();

                setScholarship(data);
            } catch (error) {
                console.error(
                    "Scholarship details error:",
                    error
                );

                setError(
                    "Unable to load scholarship details. Please make sure Django server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipDetails();
    }, [scholarshipId]);

    const handleApply = async () => {
        const token = localStorage.getItem(
            "scholarbridge_token"
        );

        if (!token) {
            setApplicationMessage(
                "Please login again before applying."
            );

            setApplicationSuccess(false);

            return;
        }

        try {
            setApplying(true);
            setApplicationMessage("");
            setApplicationSuccess(false);

            const response = await fetch(
                `http://127.0.0.1:8000/application/api/apply/${scholarshipId}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setApplicationMessage(
                    data.message ||
                        "Your application has been submitted successfully."
                );

                setApplicationSuccess(true);
                setAlreadyApplied(true);
            } else {
                setApplicationMessage(
                    data.message ||
                        "Unable to submit application."
                );

                setApplicationSuccess(false);

                if (
                    response.status === 400 &&
                    data.message
                        ?.toLowerCase()
                        .includes("already applied")
                ) {
                    setAlreadyApplied(true);
                }
            }
        } catch (error) {
            console.error(
                "Application submission error:",
                error
            );

            setApplicationMessage(
                "Unable to submit application. Please make sure Django server is running."
            );

            setApplicationSuccess(false);
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="scholarship-details-page">
                <div className="details-loading">
                    <div className="details-spinner"></div>

                    <p>
                        Loading scholarship details...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="scholarship-details-page">
                <div className="details-error">
                    <span>⚠️</span>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={onBack}
                        className="details-back-btn"
                    >
                        ← Back to Scholarships
                    </button>
                </div>
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="scholarship-details-page">
                <div className="details-error">
                    <span>🎓</span>

                    <p>
                        Scholarship details not found.
                    </p>

                    <button
                        type="button"
                        onClick={onBack}
                        className="details-back-btn"
                    >
                        ← Back to Scholarships
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="scholarship-details-page">

            {/* Header */}

            <div className="details-header">

                <button
                    type="button"
                    className="details-back-btn"
                    onClick={onBack}
                >
                    ← Back to Scholarships
                </button>

                <div className="details-heading">

                    <span className="details-label">
                        SCHOLARSHIP DETAILS
                    </span>

                    <h1>
                        {scholarship.title}
                    </h1>

                    <p>
                        Explore complete scholarship
                        information, eligibility criteria,
                        and required documents.
                    </p>

                </div>

            </div>

            {/* Main Content */}

            <div className="details-container">

                {/* Overview Card */}

                <section className="details-card overview-card">

                    <div className="details-card-heading">

                        <div className="details-section-icon">
                            🎓
                        </div>

                        <div>
                            <h2>
                                Scholarship Overview
                            </h2>

                            <p>
                                Important information about
                                this scholarship opportunity.
                            </p>
                        </div>

                    </div>

                    <div className="overview-description">
                        {scholarship.description}
                    </div>

                    <div className="overview-grid">

                        <div className="overview-item">

                            <span className="overview-icon">
                                🏢
                            </span>

                            <div>
                                <span className="overview-label">
                                    Provider
                                </span>

                                <strong>
                                    {scholarship.provider_name}
                                </strong>
                            </div>

                        </div>

                        <div className="overview-item">

                            <span className="overview-icon">
                                💰
                            </span>

                            <div>
                                <span className="overview-label">
                                    Scholarship Amount
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        scholarship.amount
                                    ).toLocaleString("en-IN")}
                                </strong>
                            </div>

                        </div>

                        <div className="overview-item">

                            <span className="overview-icon">
                                📅
                            </span>

                            <div>
                                <span className="overview-label">
                                    Application Start
                                </span>

                                <strong>
                                    {
                                        scholarship.application_start
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="overview-item">

                            <span className="overview-icon">
                                ⏰
                            </span>

                            <div>
                                <span className="overview-label">
                                    Application Deadline
                                </span>

                                <strong className="deadline-text">
                                    {scholarship.deadline}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Eligibility */}

                <section className="details-card">

                    <div className="details-card-heading">

                        <div className="details-section-icon">
                            ✅
                        </div>

                        <div>
                            <h2>
                                Eligibility Criteria
                            </h2>

                            <p>
                                Check whether you meet the
                                scholarship requirements.
                            </p>
                        </div>

                    </div>

                    {scholarship.eligibility ? (

                        <div className="eligibility-grid">

                            <div className="eligibility-item">

                                <span>
                                    Eligible Courses
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .eligible_courses ||
                                        "Not specified"
                                    }
                                </strong>

                            </div>

                            <div className="eligibility-item">

                                <span>
                                    Specialization
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .specialization ||
                                        "Not specified"
                                    }
                                </strong>

                            </div>

                            <div className="eligibility-item">

                                <span>
                                    Minimum Percentage
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .minimum_percentage
                                            ? `${scholarship.eligibility.minimum_percentage}%`
                                            : "Not specified"
                                    }
                                </strong>

                            </div>

                            <div className="eligibility-item">

                                <span>
                                    Maximum Family Income
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .maximum_income
                                            ? `₹${Number(
                                                scholarship
                                                    .eligibility
                                                    .maximum_income
                                            ).toLocaleString(
                                                "en-IN"
                                            )}`
                                            : "Not specified"
                                    }
                                </strong>

                            </div>

                            <div className="eligibility-item">

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .category ||
                                        "Not specified"
                                    }
                                </strong>

                            </div>

                            <div className="eligibility-item">

                                <span>
                                    Gender
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .gender ||
                                        "Not specified"
                                    }
                                </strong>

                            </div>

                            <div className="eligibility-item">

                                <span>
                                    State
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .state ||
                                        "Not specified"
                                    }
                                </strong>

                            </div>

                            <div className="eligibility-item full-width">

                                <span>
                                    Other Criteria
                                </span>

                                <strong>
                                    {
                                        scholarship
                                            .eligibility
                                            .other_criteria ||
                                        "No additional criteria specified"
                                    }
                                </strong>

                            </div>

                        </div>

                    ) : (

                        <div className="no-details">
                            Eligibility criteria not available.
                        </div>

                    )}

                </section>

                {/* Required Documents */}

                <section className="details-card">

                    <div className="details-card-heading">

                        <div className="details-section-icon">
                            📄
                        </div>

                        <div>
                            <h2>
                                Required Documents
                            </h2>

                            <p>
                                Documents required for the
                                scholarship application.
                            </p>
                        </div>

                    </div>

                    {scholarship.required_documents.length > 0 ? (

                        <div className="documents-list">

                            {scholarship.required_documents.map(
                                (document) => (

                                    <div
                                        className="document-item"
                                        key={document.id}
                                    >

                                        <div className="document-icon">
                                            📄
                                        </div>

                                        <div className="document-content">

                                            <h3>
                                                {
                                                    document.document_type_display
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    document.description
                                                }
                                            </p>

                                        </div>

                                        <span
                                            className={
                                                document.is_mandatory
                                                    ? "mandatory-badge"
                                                    : "optional-badge"
                                            }
                                        >
                                            {
                                                document.is_mandatory
                                                    ? "Mandatory"
                                                    : "Optional"
                                            }
                                        </span>

                                    </div>
                                )
                            )}

                        </div>

                    ) : (

                        <div className="no-details">
                            No required documents specified.
                        </div>

                    )}

                </section>

                {/* Apply Scholarship */}

                <section className="details-apply-section">

                    <div className="apply-content">

                        <div className="apply-icon">
                            🎓
                        </div>

                        <div className="apply-text">

                            <h2>
                                Ready to Apply?
                            </h2>

                            <p>
                                Submit your application for this
                                scholarship opportunity.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className={`details-apply-btn ${
                            alreadyApplied
                                ? "application-submitted-btn"
                                : ""
                        }`}
                        onClick={handleApply}
                        disabled={
                            applying ||
                            alreadyApplied
                        }
                    >

                        {applying ? (
                            <>
                                <span className="apply-spinner"></span>

                                Submitting Application...
                            </>
                        ) : alreadyApplied ? (
                            <>
                                <span className="apply-check-icon">
                                    ✓
                                </span>

                                Application Submitted
                            </>
                        ) : (
                            <>
                                Apply Now

                                <span className="apply-arrow">
                                    →
                                </span>
                            </>
                        )}

                    </button>

                    {applicationMessage && (

                        <div
                            className={
                                applicationSuccess
                                    ? "application-success-card"
                                    : "application-error-card"
                            }
                        >

                            <div
                                className={
                                    applicationSuccess
                                        ? "application-status-icon success-icon"
                                        : "application-status-icon error-icon"
                                }
                            >
                                {applicationSuccess
                                    ? "✓"
                                    : "!"}
                            </div>

                            <div className="application-status-content">

                                <h3>
                                    {applicationSuccess
                                        ? "Application Submitted Successfully"
                                        : "Application Could Not Be Submitted"}
                                </h3>

                                <p>
                                    {applicationMessage}
                                </p>

                                {applicationSuccess && (
                                    <span className="application-next-step">
                                        You can track your application status from
                                        <strong> My Applications </strong>
                                        in your dashboard.
                                    </span>
                                )}

                            </div>

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
};

export default ScholarshipDetails;