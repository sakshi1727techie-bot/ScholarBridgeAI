import React, { useEffect, useState } from "react";
import "./AIRecommendations.css";

interface Recommendation {
    id: number;
    scholarship: number;
    scholarship_title: string;
    scholarship_amount: string;
    match_score: string;
    reason: string;
    deadline: string;
}

interface AIRecommendationsProps {
    onBack?: () => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
    onBack,
}) => {
    const [recommendations, setRecommendations] = useState<
        Recommendation[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("scholarbridge_token");

                if (!token) {
                    setError(
                        "Please login again to view your AI recommendations."
                    );
                    return;
                }

                const response = await fetch(
                    "http://127.0.0.1:8000/recommendations/api/",
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
                        "Failed to fetch recommendations"
                    );
                }

                const data = await response.json();

                setRecommendations(data);
            } catch (error) {
                console.error(
                    "Recommendation fetch error:",
                    error
                );

                setError(
                    "Unable to load AI recommendations. Please make sure Django server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div className="ai-recommendations-page">

            <div className="ai-recommendations-header">

                <div className="ai-recommendations-heading">

                    <div className="ai-recommendations-icon">
                        🤖
                    </div>

                    <div>
                        <span className="ai-recommendations-label">
                            AI-POWERED RECOMMENDATIONS
                        </span>

                        <h1 className="ai-recommendations-title">
                            Scholarships Recommended for You
                        </h1>

                        <p className="ai-recommendations-subtitle">
                            Discover scholarships matched with your
                            academic profile and eligibility.
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

            {loading && (
                <div className="recommendation-loading">
                    <div className="recommendation-spinner"></div>

                    <p>
                        Analyzing your profile and finding matching
                        scholarships...
                    </p>
                </div>
            )}

            {error && (
                <div className="recommendation-error">
                    <span>⚠️</span>

                    <p>{error}</p>
                </div>
            )}

            {!loading &&
                !error &&
                recommendations.length === 0 && (
                    <div className="recommendation-empty">

                        <div className="empty-recommendation-icon">
                            🤖
                        </div>

                        <h2>
                            No Recommendations Yet
                        </h2>

                        <p>
                            We could not find any scholarships
                            matching your current profile.
                        </p>

                    </div>
                )}

            {!loading &&
                !error &&
                recommendations.length > 0 && (
                    <div className="recommendation-content">

                        <div className="recommendation-summary">
                            <div>
                                <span>
                                    AI MATCHES
                                </span>

                                <strong>
                                    {recommendations.length}
                                </strong>
                            </div>

                            <p>
                                These scholarships were matched
                                using your eligibility information.
                            </p>
                        </div>

                        <div className="recommendation-grid">

                            {recommendations.map(
                                (recommendation) => (
                                    <div
                                        className="recommendation-card"
                                        key={recommendation.id}
                                    >

                                        <div className="recommendation-card-top">

                                            <div className="recommendation-card-icon">
                                                🎓
                                            </div>

                                            <div className="match-score">
                                                <strong>
                                                    {Number(
                                                        recommendation.match_score
                                                    )}%
                                                </strong>

                                                <span>
                                                    Match
                                                </span>
                                            </div>

                                        </div>

                                        <h2>
                                            {
                                                recommendation.scholarship_title
                                            }
                                        </h2>

                                        <div className="recommendation-info">

                                            <div className="recommendation-info-item">
                                                <span>
                                                    💰 Amount
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        recommendation.scholarship_amount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="recommendation-info-item">
                                                <span>
                                                    ⏰ Deadline
                                                </span>

                                                <strong>
                                                    {
                                                        recommendation.deadline
                                                    }
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="recommendation-reason">

                                            <span>
                                                ✨ Why this matches you
                                            </span>

                                            <p>
                                                {
                                                    recommendation.reason
                                                }
                                            </p>

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

export default AIRecommendations;