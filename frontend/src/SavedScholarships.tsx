import React, { useEffect, useState } from "react";
import "./SavedScholarships.css";

interface SavedScholarship {
    id: number;
    scholarship: number;
    scholarship_title: string;
    scholarship_amount: string;
    provider_name: string;
    deadline: string;
    saved_at: string;
}

interface SavedScholarshipsProps {
    onBack?: () => void;
}

const SavedScholarships: React.FC<SavedScholarshipsProps> = ({
    onBack,
}) => {
    const [scholarships, setScholarships] = useState<SavedScholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSavedScholarships();
    }, []);

    const fetchSavedScholarships = async () => {
        try {
            const token = localStorage.getItem("scholarbridge_token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/api/scholarships/saved/",
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
                    "Failed to load saved scholarships."
                );
            }

            const data = await response.json();

            setScholarships(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load saved scholarships.");
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
            <div className="saved-page">
                <div className="saved-loading">
                    Loading saved scholarships...
                </div>
            </div>
        );
    }

    return (
        <div className="saved-page">

            {/* Header */}

            <div className="saved-header">

                <div className="saved-header-content">

                    <h1>Saved Scholarships</h1>

                    <p>
                        View and manage the scholarships you have saved
                        for later.
                    </p>

                </div>

                <button
                    className="saved-back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

            </div>

            {error && (
                <div className="saved-error">
                    {error}
                </div>
            )}

            {!error && scholarships.length === 0 && (
                <div className="saved-empty">

                    <div className="saved-empty-icon">
                        ♡
                    </div>

                    <h2>No Saved Scholarships</h2>

                    <p>
                        You haven't saved any scholarships yet.
                        Explore scholarships and save the ones
                        you're interested in.
                    </p>

                </div>
            )}

            {!error && scholarships.length > 0 && (

                <div className="saved-layout">

                    {/* LEFT SIDE */}

                    <div className="saved-main">

                        <div className="saved-section-header">

                            <div>
                                <h2>Your Saved Opportunities</h2>

                                <p>
                                    {scholarships.length} scholarship
                                    {scholarships.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    saved
                                </p>
                            </div>

                        </div>

                        <div className="saved-grid">

                            {scholarships.map((item) => (

                                <div
                                    className="saved-card"
                                    key={item.id}
                                >

                                    <div className="saved-card-top">

                                        <div className="saved-icon">
                                            🎓
                                        </div>

                                        <span className="saved-label">
                                            SAVED
                                        </span>

                                    </div>

                                    <h3>
                                        {item.scholarship_title}
                                    </h3>

                                    <p className="saved-provider">
                                        {item.provider_name}
                                    </p>

                                    <div className="saved-info">

                                        <div className="saved-info-item">

                                            <span>
                                                Scholarship Amount
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    item.scholarship_amount
                                                ).toLocaleString("en-IN")}
                                            </strong>

                                        </div>

                                        <div className="saved-info-item">

                                            <span>
                                                Application Deadline
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    item.deadline
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    <div className="saved-date">

                                        Saved on{" "}
                                        {formatDate(item.saved_at)}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="saved-sidebar">

                        {/* Recently Saved */}

                        <div className="saved-side-card">

                            <div className="saved-side-title">

                                <div className="saved-side-icon">
                                    🕒
                                </div>

                                <div>
                                    <h3>Recently Saved</h3>

                                    <p>
                                        Your latest saved scholarship
                                    </p>
                                </div>

                            </div>

                            <div className="recently-saved-list">

                                {scholarships
                                    .slice(0, 3)
                                    .map((item) => (

                                        <div
                                            className="recently-saved-item"
                                            key={item.id}
                                        >

                                            <div>
                                                <strong>
                                                    {item.scholarship_title}
                                                </strong>

                                                <span>
                                                    Saved{" "}
                                                    {formatDate(
                                                        item.saved_at
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    ))}

                            </div>

                        </div>


                        {/* Quick Actions */}

                        <div className="saved-side-card">

                            <div className="saved-side-title">

                                <div className="saved-side-icon">
                                    ⚡
                                </div>

                                <div>
                                    <h3>Quick Actions</h3>

                                    <p>
                                        Manage your scholarship search
                                    </p>
                                </div>

                            </div>

                            <div className="quick-actions">

                                <button
                                    className="quick-action-button"
                                    onClick={onBack}
                                >
                                    <span>←</span>

                                    <div>
                                        <strong>
                                            Back to Dashboard
                                        </strong>

                                        <small>
                                            Return to your dashboard
                                        </small>
                                    </div>
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default SavedScholarships;