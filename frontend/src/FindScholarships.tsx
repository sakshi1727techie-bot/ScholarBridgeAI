import React, { useEffect, useState } from "react";
import "./FindScholarships.css";

interface Scholarship {
    id: number;
    title: string;
    description: string;
    amount: string;
    application_start: string;
    deadline: string;
    status: string;
}

interface FindScholarshipsProps {
    onBack?: () => void;
    onViewDetails?: (scholarshipId: number) => void;
}

const FindScholarships: React.FC<FindScholarshipsProps> = ({
    onBack,
    onViewDetails,
}) => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://127.0.0.1:8000/api/scholarships/"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch scholarships");
                }

                const data = await response.json();

                setScholarships(data);
            } catch (error) {
                console.error(
                    "Scholarship fetch error:",
                    error
                );

                setError(
                    "Unable to load scholarships. Please make sure Django server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, []);

    const filteredScholarships = scholarships.filter(
        (scholarship) =>
            scholarship.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            scholarship.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="find-scholarships-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="find-scholarships-header">

                <div className="find-scholarships-heading">

                    <div className="find-scholarships-icon">
                        🎓
                    </div>

                    <div>
                        <span className="find-scholarships-label">
                            SCHOLARSHIP DISCOVERY
                        </span>

                        <h1 className="find-scholarships-title">
                            Find Your Perfect Scholarship
                        </h1>

                        <p className="find-scholarships-subtitle">
                            Discover opportunities that match your
                            education, interests, and eligibility.
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


            {/* =========================
                SEARCH
            ========================= */}

            <div className="scholarship-toolbar">

                <div className="search-box-wrapper">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        className="scholarship-search"
                        placeholder="Search scholarships..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>

            </div>


            {/* =========================
                LOADING
            ========================= */}

            {loading && (
                <div className="scholarship-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading scholarships...
                    </p>

                </div>
            )}


            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="scholarship-error">

                    <span className="error-icon">
                        ⚠️
                    </span>

                    {error}

                </div>
            )}


            {/* =========================
                NO SCHOLARSHIPS
            ========================= */}

            {!loading &&
                !error &&
                scholarships.length === 0 && (
                    <div className="scholarship-empty">

                        <div className="empty-icon">
                            🎓
                        </div>

                        <h3>
                            No Scholarships Available
                        </h3>

                        <p>
                            There are no approved scholarships
                            available right now.
                        </p>

                    </div>
                )}


            {/* =========================
                NO SEARCH RESULTS
            ========================= */}

            {!loading &&
                !error &&
                scholarships.length > 0 &&
                filteredScholarships.length === 0 && (
                    <div className="scholarship-empty">

                        <div className="empty-icon">
                            🔍
                        </div>

                        <h3>
                            No Matching Scholarships
                        </h3>

                        <p>
                            Try searching with a different
                            scholarship name or keyword.
                        </p>

                    </div>
                )}


            {/* =========================
                SCHOLARSHIP CARDS
            ========================= */}

            {!loading &&
                !error &&
                filteredScholarships.length > 0 && (
                    <div className="scholarship-grid">

                        {filteredScholarships.map(
                            (scholarship) => (
                                <div
                                    className="scholarship-card"
                                    key={scholarship.id}
                                >

                                    {/* Card Top */}
                                    <div className="scholarship-card-top">

                                        <div className="scholarship-card-icon">
                                            🎓
                                        </div>

                                        <span className="scholarship-status">
                                            {scholarship.status}
                                        </span>

                                    </div>


                                    {/* Title */}
                                    <h2 className="scholarship-card-title">
                                        {scholarship.title}
                                    </h2>


                                    {/* Description */}
                                    <p className="scholarship-description">
                                        {scholarship.description}
                                    </p>


                                    {/* Information */}
                                    <div className="scholarship-info">

                                        <div className="scholarship-info-item">

                                            <div className="info-left">
                                                <span className="info-icon">
                                                    💰
                                                </span>

                                                <span className="scholarship-info-label">
                                                    Amount
                                                </span>
                                            </div>

                                            <span className="scholarship-info-value">
                                                ₹
                                                {Number(
                                                    scholarship.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>

                                        </div>


                                        <div className="scholarship-info-item">

                                            <div className="info-left">
                                                <span className="info-icon">
                                                    📅
                                                </span>

                                                <span className="scholarship-info-label">
                                                    Application Start
                                                </span>
                                            </div>

                                            <span className="scholarship-info-value">
                                                {
                                                    scholarship.application_start
                                                }
                                            </span>

                                        </div>


                                        <div className="scholarship-info-item">

                                            <div className="info-left">
                                                <span className="info-icon">
                                                    ⏰
                                                </span>

                                                <span className="scholarship-info-label">
                                                    Deadline
                                                </span>
                                            </div>

                                            <span className="scholarship-info-value deadline-value">
                                                {
                                                    scholarship.deadline
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* View Details */}
                                    <button
                                        type="button"
                                        className="view-details-btn"
                                        onClick={() =>
                                            onViewDetails?.(
                                                scholarship.id
                                            )
                                        }
                                    >
                                        View Details

                                        <span>
                                            →
                                        </span>
                                    </button>

                                </div>
                            )
                        )}

                    </div>
                )}

        </div>
    );
};

export default FindScholarships;