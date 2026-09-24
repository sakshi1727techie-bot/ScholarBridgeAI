import React, { useEffect, useState } from "react";
import "./AIRecommendationManagement.css";

interface AIRecommendation {
  id: number;
  studentName: string;
  studentEmail: string;
  scholarshipTitle: string;
  matchPercentage: number;
  recommendationDate: string;
  status: "Recommended" | "Viewed" | "Applied";
}

interface AdminRecommendationApiItem {
  id: number;

  student: {
    id: number;
    name: string;
    email: string;
  };

  scholarship: {
    id: number;
    title: string;
  };

  match_score: number;
  reason: string;
  recommendation_date: string;
  status: "Recommended" | "Viewed" | "Applied";
}

interface AdminRecommendationApiResponse {
  success: boolean;
  count: number;

  statistics?: {
    total_recommendations: number;
    recommended: number;
    viewed: number;
    applied: number;
    average_match_score: number;
  };

  recommendations: AdminRecommendationApiItem[];

  message?: string;
}

interface AIRecommendationManagementProps {
  recommendations?: AIRecommendation[];
}

const AIRecommendationManagement: React.FC<
  AIRecommendationManagementProps
> = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [recommendations, setRecommendations] = useState<
    AIRecommendation[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ADMIN AI RECOMMENDATIONS
  // =====================================================

  useEffect(() => {

    const fetchAdminRecommendations = async () => {

      try {

        setLoading(true);
        setError("");

        // -------------------------------------------------
        // GET ADMIN TOKEN
        // -------------------------------------------------

        const token =
          localStorage.getItem("admin_token") ||
          sessionStorage.getItem("admin_token");

        if (!token) {

          setError(
            "Admin session not found. Please login again."
          );

          setLoading(false);

          return;
        }

        // -------------------------------------------------
        // ADMIN AI RECOMMENDATIONS API
        // -------------------------------------------------

        const response = await fetch(
          "http://127.0.0.1:8000/recommendations/api/admin/",
          {
            method: "GET",

            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // -------------------------------------------------
        // READ RESPONSE
        // -------------------------------------------------

        const data: AdminRecommendationApiResponse =
          await response.json();

        console.log(
          "Admin AI Recommendations API Response:",
          data
        );

        // -------------------------------------------------
        // HTTP ERROR
        // -------------------------------------------------

        if (!response.ok) {

          throw new Error(
            data?.message ||
              "Failed to fetch admin AI recommendations."
          );
        }

        // -------------------------------------------------
        // API ERROR
        // -------------------------------------------------

        if (!data.success) {

          throw new Error(
            data?.message ||
              "Unable to load admin AI recommendations."
          );
        }

        // -------------------------------------------------
        // MAP BACKEND DATA TO EXISTING UI STRUCTURE
        // -------------------------------------------------

        const formattedRecommendations: AIRecommendation[] =
          Array.isArray(data.recommendations)
            ? data.recommendations.map(
                (recommendation) => ({
                  id: recommendation.id,

                  studentName:
                    recommendation.student.name,

                  studentEmail:
                    recommendation.student.email,

                  scholarshipTitle:
                    recommendation.scholarship.title,

                  matchPercentage:
                    Number(
                      recommendation.match_score
                    ),

                  recommendationDate:
                    recommendation.recommendation_date,

                  status:
                    recommendation.status,
                })
              )
            : [];

        // -------------------------------------------------
        // SAVE DATA
        // -------------------------------------------------

        setRecommendations(
          formattedRecommendations
        );

      } catch (error) {

        console.error(
          "Admin AI Recommendations fetch error:",
          error
        );

        setRecommendations([]);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load AI recommendations. Please make sure Django server is running."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchAdminRecommendations();

  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalRecommendations =
    recommendations.length;

  const recommendedCount =
    recommendations.filter(
      (recommendation) =>
        recommendation.status === "Recommended"
    ).length;

  const viewedCount =
    recommendations.filter(
      (recommendation) =>
        recommendation.status === "Viewed"
    ).length;

  const appliedCount =
    recommendations.filter(
      (recommendation) =>
        recommendation.status === "Applied"
    ).length;

  // =====================================================
  // GET INITIALS
  // =====================================================

  const getInitials = (
    name: string
  ): string => {

    const words = name
      .trim()
      .split(" ");

    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();

    }

    return `${words[0][0] || ""}${
      words[1][0] || ""
    }`.toUpperCase();
  };

  // =====================================================
  // MATCH CLASS
  // =====================================================

  const getMatchClass = (
    percentage: number
  ): string => {

    if (percentage >= 80) {

      return "ai-recommendation-match-high";

    }

    if (percentage >= 60) {

      return "ai-recommendation-match-medium";

    }

    return "ai-recommendation-match-low";
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="ai-recommendation-management-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="ai-recommendation-management-header">

        <div className="ai-recommendation-management-header-content">

          <div className="ai-recommendation-management-title-row">

            <div className="ai-recommendation-management-title-icon">
              🤖
            </div>

            <div>

              <h1 className="ai-recommendation-management-title">
                AI Recommendations
              </h1>

              <p className="ai-recommendation-management-subtitle">
                View and monitor scholarship recommendations
                generated by the ScholarBridge AI recommendation
                system.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          LOADING
          ===================================================== */}

      {loading && (

        <div className="ai-recommendation-management-empty">

          <div className="ai-recommendation-management-empty-icon">
            🤖
          </div>

          <h3 className="ai-recommendation-management-empty-title">
            Loading AI Recommendations...
          </h3>

          <p className="ai-recommendation-management-empty-text">
            Fetching recommendation data from the ScholarBridge
            AI backend.
          </p>

        </div>

      )}

      {/* =====================================================
          ERROR
          ===================================================== */}

      {!loading && error && (

        <div className="ai-recommendation-management-empty">

          <div className="ai-recommendation-management-empty-icon">
            ⚠️
          </div>

          <h3 className="ai-recommendation-management-empty-title">
            Unable to Load Recommendations
          </h3>

          <p className="ai-recommendation-management-empty-text">
            {error}
          </p>

        </div>

      )}

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      {!loading && !error && (

        <>

          {/* =====================================================
              STATISTICS
              ===================================================== */}

          <div className="ai-recommendation-management-stats">

            {/* Total */}

            <div className="ai-recommendation-management-stat-card">

              <div className="ai-recommendation-management-stat-top">

                <div>

                  <p className="ai-recommendation-management-stat-label">
                    Total Recommendations
                  </p>

                  <h2 className="ai-recommendation-management-stat-value">
                    {totalRecommendations}
                  </h2>

                </div>

                <div className="ai-recommendation-management-stat-icon">
                  🤖
                </div>

              </div>

            </div>

            {/* Recommended */}

            <div className="ai-recommendation-management-stat-card">

              <div className="ai-recommendation-management-stat-top">

                <div>

                  <p className="ai-recommendation-management-stat-label">
                    Recommended
                  </p>

                  <h2 className="ai-recommendation-management-stat-value">
                    {recommendedCount}
                  </h2>

                </div>

                <div className="ai-recommendation-management-stat-icon">
                  ✨
                </div>

              </div>

            </div>

            {/* Viewed */}

            <div className="ai-recommendation-management-stat-card">

              <div className="ai-recommendation-management-stat-top">

                <div>

                  <p className="ai-recommendation-management-stat-label">
                    Viewed
                  </p>

                  <h2 className="ai-recommendation-management-stat-value">
                    {viewedCount}
                  </h2>

                </div>

                <div className="ai-recommendation-management-stat-icon">
                  👁
                </div>

              </div>

            </div>

            {/* Applied */}

            <div className="ai-recommendation-management-stat-card">

              <div className="ai-recommendation-management-stat-top">

                <div>

                  <p className="ai-recommendation-management-stat-label">
                    Applied
                  </p>

                  <h2 className="ai-recommendation-management-stat-value">
                    {appliedCount}
                  </h2>

                </div>

                <div className="ai-recommendation-management-stat-icon">
                  ✓
                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              RECOMMENDATIONS PANEL
              ===================================================== */}

          <div className="ai-recommendation-management-panel">

            <div className="ai-recommendation-management-panel-header">

              <div>

                <h2 className="ai-recommendation-management-panel-heading">
                  AI Generated Recommendations
                </h2>

                <p className="ai-recommendation-management-panel-description">
                  Scholarship recommendations generated for
                  registered students
                </p>

              </div>

            </div>

            {/* ===================================================
                TABLE
                =================================================== */}

            {recommendations.length > 0 ? (

              <div className="ai-recommendation-management-table-wrapper">

                <table className="ai-recommendation-management-table">

                  <thead>

                    <tr>

                      <th>
                        Student
                      </th>

                      <th>
                        Scholarship
                      </th>

                      <th>
                        AI Match
                      </th>

                      <th>
                        Recommendation Date
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {recommendations.map(
                      (recommendation) => (

                        <tr
                          key={
                            recommendation.id
                          }
                        >

                          {/* Student */}

                          <td>

                            <div className="ai-recommendation-management-student-cell">

                              <div className="ai-recommendation-management-avatar">

                                {getInitials(
                                  recommendation.studentName
                                )}

                              </div>

                              <div className="ai-recommendation-management-student-details">

                                <p className="ai-recommendation-management-student-name">

                                  {
                                    recommendation.studentName
                                  }

                                </p>

                                <p className="ai-recommendation-management-student-email">

                                  {
                                    recommendation.studentEmail
                                  }

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Scholarship */}

                          <td>

                            <div className="ai-recommendation-management-scholarship-cell">

                              <div className="ai-recommendation-management-scholarship-icon">
                                🎓
                              </div>

                              <div className="ai-recommendation-management-scholarship-details">

                                <p className="ai-recommendation-management-scholarship-name">

                                  {
                                    recommendation.scholarshipTitle
                                  }

                                </p>

                                <p className="ai-recommendation-management-recommendation-id">

                                  Recommendation ID: #
                                  {
                                    recommendation.id
                                  }

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* AI Match */}

                          <td>

                            <div className="ai-recommendation-management-match-wrapper">

                              <div
                                className={`ai-recommendation-management-match ${getMatchClass(
                                  recommendation.matchPercentage
                                )}`}
                              >

                                {
                                  recommendation.matchPercentage
                                }%

                              </div>

                              <span className="ai-recommendation-management-match-label">
                                Match
                              </span>

                            </div>

                          </td>

                          {/* Date */}

                          <td>

                            <span className="ai-recommendation-management-date">

                              {
                                recommendation.recommendationDate
                              }

                            </span>

                          </td>

                          {/* Status */}

                          <td>

                            <span
                              className={`ai-recommendation-management-status ${
                                recommendation.status ===
                                "Recommended"
                                  ? "ai-recommendation-management-status-recommended"
                                  : recommendation.status ===
                                    "Viewed"
                                  ? "ai-recommendation-management-status-viewed"
                                  : "ai-recommendation-management-status-applied"
                              }`}
                            >

                              {
                                recommendation.status
                              }

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

              <div className="ai-recommendation-management-empty">

                <div className="ai-recommendation-management-empty-icon">
                  🤖
                </div>

                <h3 className="ai-recommendation-management-empty-title">
                  No AI Recommendations Found
                </h3>

                <p className="ai-recommendation-management-empty-text">
                  No AI scholarship recommendations are currently
                  available to display. Recommendations generated
                  for students will appear here.
                </p>

              </div>

            )}

          </div>

          {/* =====================================================
              INFORMATION FOOTER
              ===================================================== */}

          <div className="ai-recommendation-management-info-footer">

            <div className="ai-recommendation-management-info-icon">
              ℹ
            </div>

            <span>
              AI recommendation information displayed here is
              maintained by the ScholarBridge AI administration
              system.
            </span>

          </div>

        </>

      )}

    </div>
  );
};

export default AIRecommendationManagement;