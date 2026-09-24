import React from "react";
import "./ReportsAnalytics.css";

interface ReportsAnalyticsProps {
  totalStudents?: number;
  totalProviders?: number;
  totalScholarships?: number;
  totalApplications?: number;
  totalDocuments?: number;
  totalRecommendations?: number;
  approvedApplications?: number;
  pendingApplications?: number;
}

const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({
  totalStudents = 0,
  totalProviders = 0,
  totalScholarships = 0,
  totalApplications = 0,
  totalDocuments = 0,
  totalRecommendations = 0,
  approvedApplications = 0,
  pendingApplications = 0,
}) => {
  const applicationApprovalRate =
    totalApplications > 0
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

  const pendingApplicationRate =
    totalApplications > 0
      ? Math.round((pendingApplications / totalApplications) * 100)
      : 0;

  return (
    <div className="reports-analytics-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="reports-analytics-header">

        <div className="reports-analytics-header-content">

          <div className="reports-analytics-title-row">

            <div className="reports-analytics-title-icon">
              📊
            </div>

            <div>

              <h1 className="reports-analytics-title">
                Reports &amp; Analytics
              </h1>

              <p className="reports-analytics-subtitle">
                View platform statistics and performance information
                for the ScholarBridge AI administration system.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          OVERVIEW STATISTICS
          ===================================================== */}

      <div className="reports-analytics-stats">

        {/* Students */}
        <div className="reports-analytics-stat-card">

          <div className="reports-analytics-stat-icon">
            👨‍🎓
          </div>

          <div className="reports-analytics-stat-content">

            <p className="reports-analytics-stat-label">
              Total Students
            </p>

            <h2 className="reports-analytics-stat-value">
              {totalStudents}
            </h2>

            <p className="reports-analytics-stat-description">
              Registered students
            </p>

          </div>

        </div>

        {/* Providers */}
        <div className="reports-analytics-stat-card">

          <div className="reports-analytics-stat-icon">
            🏢
          </div>

          <div className="reports-analytics-stat-content">

            <p className="reports-analytics-stat-label">
              Total Providers
            </p>

            <h2 className="reports-analytics-stat-value">
              {totalProviders}
            </h2>

            <p className="reports-analytics-stat-description">
              Registered providers
            </p>

          </div>

        </div>

        {/* Scholarships */}
        <div className="reports-analytics-stat-card">

          <div className="reports-analytics-stat-icon">
            🎓
          </div>

          <div className="reports-analytics-stat-content">

            <p className="reports-analytics-stat-label">
              Total Scholarships
            </p>

            <h2 className="reports-analytics-stat-value">
              {totalScholarships}
            </h2>

            <p className="reports-analytics-stat-description">
              Scholarships available
            </p>

          </div>

        </div>

        {/* Applications */}
        <div className="reports-analytics-stat-card">

          <div className="reports-analytics-stat-icon">
            📄
          </div>

          <div className="reports-analytics-stat-content">

            <p className="reports-analytics-stat-label">
              Total Applications
            </p>

            <h2 className="reports-analytics-stat-value">
              {totalApplications}
            </h2>

            <p className="reports-analytics-stat-description">
              Student applications
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          PLATFORM ACTIVITY
          ===================================================== */}

      <div className="reports-analytics-main-grid">

        {/* Platform Overview */}
        <div className="reports-analytics-panel">

          <div className="reports-analytics-panel-header">

            <div>

              <h2 className="reports-analytics-panel-title">
                Platform Overview
              </h2>

              <p className="reports-analytics-panel-description">
                Overall ScholarBridge AI platform activity
              </p>

            </div>

          </div>

          <div className="reports-analytics-overview-list">

            {/* Students */}
            <div className="reports-analytics-overview-item">

              <div className="reports-analytics-overview-left">

                <div className="reports-analytics-overview-icon">
                  👨‍🎓
                </div>

                <div>

                  <p className="reports-analytics-overview-name">
                    Students
                  </p>

                  <p className="reports-analytics-overview-text">
                    Registered student accounts
                  </p>

                </div>

              </div>

              <strong className="reports-analytics-overview-value">
                {totalStudents}
              </strong>

            </div>

            {/* Providers */}
            <div className="reports-analytics-overview-item">

              <div className="reports-analytics-overview-left">

                <div className="reports-analytics-overview-icon">
                  🏢
                </div>

                <div>

                  <p className="reports-analytics-overview-name">
                    Providers
                  </p>

                  <p className="reports-analytics-overview-text">
                    Scholarship provider accounts
                  </p>

                </div>

              </div>

              <strong className="reports-analytics-overview-value">
                {totalProviders}
              </strong>

            </div>

            {/* Scholarships */}
            <div className="reports-analytics-overview-item">

              <div className="reports-analytics-overview-left">

                <div className="reports-analytics-overview-icon">
                  🎓
                </div>

                <div>

                  <p className="reports-analytics-overview-name">
                    Scholarships
                  </p>

                  <p className="reports-analytics-overview-text">
                    Scholarships registered on platform
                  </p>

                </div>

              </div>

              <strong className="reports-analytics-overview-value">
                {totalScholarships}
              </strong>

            </div>

            {/* Documents */}
            <div className="reports-analytics-overview-item">

              <div className="reports-analytics-overview-left">

                <div className="reports-analytics-overview-icon">
                  📁
                </div>

                <div>

                  <p className="reports-analytics-overview-name">
                    Documents
                  </p>

                  <p className="reports-analytics-overview-text">
                    Student documents uploaded
                  </p>

                </div>

              </div>

              <strong className="reports-analytics-overview-value">
                {totalDocuments}
              </strong>

            </div>

            {/* AI Recommendations */}
            <div className="reports-analytics-overview-item">

              <div className="reports-analytics-overview-left">

                <div className="reports-analytics-overview-icon">
                  🤖
                </div>

                <div>

                  <p className="reports-analytics-overview-name">
                    AI Recommendations
                  </p>

                  <p className="reports-analytics-overview-text">
                    Scholarship recommendations generated
                  </p>

                </div>

              </div>

              <strong className="reports-analytics-overview-value">
                {totalRecommendations}
              </strong>

            </div>

          </div>

        </div>

        {/* Application Performance */}
        <div className="reports-analytics-panel">

          <div className="reports-analytics-panel-header">

            <div>

              <h2 className="reports-analytics-panel-title">
                Application Performance
              </h2>

              <p className="reports-analytics-panel-description">
                Application status overview
              </p>

            </div>

          </div>

          <div className="reports-analytics-performance">

            {/* Total Applications */}
            <div className="reports-analytics-performance-card">

              <div className="reports-analytics-performance-top">

                <span className="reports-analytics-performance-label">
                  Total Applications
                </span>

                <span className="reports-analytics-performance-number">
                  {totalApplications}
                </span>

              </div>

              <div className="reports-analytics-progress">
                <div
                  className="reports-analytics-progress-fill"
                  style={{
                    width: totalApplications > 0 ? "100%" : "0%",
                  }}
                />
              </div>

            </div>

            {/* Approved */}
            <div className="reports-analytics-performance-card">

              <div className="reports-analytics-performance-top">

                <span className="reports-analytics-performance-label">
                  Approved Applications
                </span>

                <span className="reports-analytics-performance-number">
                  {approvedApplications}
                </span>

              </div>

              <div className="reports-analytics-progress">
                <div
                  className="reports-analytics-progress-fill reports-analytics-progress-approved"
                  style={{
                    width: `${applicationApprovalRate}%`,
                  }}
                />
              </div>

              <p className="reports-analytics-percentage">
                {applicationApprovalRate}% of total applications
              </p>

            </div>

            {/* Pending */}
            <div className="reports-analytics-performance-card">

              <div className="reports-analytics-performance-top">

                <span className="reports-analytics-performance-label">
                  Pending Applications
                </span>

                <span className="reports-analytics-performance-number">
                  {pendingApplications}
                </span>

              </div>

              <div className="reports-analytics-progress">
                <div
                  className="reports-analytics-progress-fill reports-analytics-progress-pending"
                  style={{
                    width: `${pendingApplicationRate}%`,
                  }}
                />
              </div>

              <p className="reports-analytics-percentage">
                {pendingApplicationRate}% of total applications
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SYSTEM SUMMARY
          ===================================================== */}

      <div className="reports-analytics-summary-panel">

        <div className="reports-analytics-summary-icon">
          ℹ
        </div>

        <div className="reports-analytics-summary-content">

          <h3 className="reports-analytics-summary-title">
            Analytics Summary
          </h3>

          <p className="reports-analytics-summary-text">
            The information displayed on this page represents
            the current statistics available in the ScholarBridge AI
            administration system. These values can be connected
            to the backend analytics APIs during final integration.
          </p>

        </div>

      </div>

    </div>
  );
};

export default ReportsAnalytics;