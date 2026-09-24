import React, { useEffect, useState } from "react";
import "./ApplicationManagement.css";

interface BackendApplication {
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

  provider: {
    id: number;
    organization_name: string;
  };

  applied_at: string;

  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

  status_display:
    | "Pending"
    | "Under Review"
    | "Approved"
    | "Rejected";
}

interface Application {
  id: number;
  studentName: string;
  studentEmail: string;
  scholarshipTitle: string;
  providerName: string;
  appliedDate: string;
  status:
    | "Pending"
    | "Under Review"
    | "Approved"
    | "Rejected";
}

const ApplicationManagement: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ============================================================
  // GET ADMIN TOKEN
  // ============================================================

  const getAdminToken = (): string | null => {
    return (
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token")
    );
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return "-";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // GET ADMIN APPLICATIONS
  // ============================================================

  const fetchApplications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      // --------------------------------------------------------
      // GET ADMIN TOKEN
      // --------------------------------------------------------

      const token = getAdminToken();

      if (!token) {
        setError(
          "Administrator authentication token not found. Please login again."
        );

        setLoading(false);
        return;
      }

      // --------------------------------------------------------
      // ADMIN APPLICATION API
      // --------------------------------------------------------

      const response = await fetch(
        "http://127.0.0.1:8000/application/api/admin/",
        {
          method: "GET",

          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // --------------------------------------------------------
      // HTTP ERROR
      // --------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            "Failed to fetch applications."
        );
      }

      // --------------------------------------------------------
      // BACKEND SUCCESS CHECK
      // --------------------------------------------------------

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load applications."
        );
      }

      // --------------------------------------------------------
      // FORMAT BACKEND APPLICATION DATA
      // --------------------------------------------------------

      const formattedApplications: Application[] = (
        data.applications || []
      ).map(
        (application: BackendApplication) => ({
          id: application.id,

          studentName:
            application.student?.name ||
            application.student?.email ||
            "Unknown Student",

          studentEmail:
            application.student?.email ||
            "-",

          scholarshipTitle:
            application.scholarship?.title ||
            "Unknown Scholarship",

          providerName:
            application.provider?.organization_name ||
            "-",

          appliedDate:
            formatDate(application.applied_at),

          status:
            application.status_display ||
            "Pending",
        })
      );

      setApplications(formattedApplications);
    } catch (err) {
      console.error(
        "Admin applications API error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD APPLICATIONS WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {
    fetchApplications();
  }, []);

  // ============================================================
  // APPLICATION STATISTICS
  // ============================================================

  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "Pending"
    ).length;

  const underReviewApplications =
    applications.filter(
      (application) =>
        application.status === "Under Review"
    ).length;

  const approvedApplications =
    applications.filter(
      (application) =>
        application.status === "Approved"
    ).length;

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

  // ============================================================
  // GET STUDENT INITIALS
  // ============================================================

  const getInitials = (
    name: string
  ): string => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "ST";
    }

    const words =
      trimmedName.split(/\s+/);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${words[0][0] || ""}${
      words[1][0] || ""
    }`.toUpperCase();
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="application-management-page">

        <div className="application-management-header">
          <div className="application-management-header-content">

            <h1 className="application-management-title">
              Application Management
            </h1>

            <p className="application-management-subtitle">
              View and monitor scholarship applications
              submitted by students on ScholarBridge AI.
            </p>

          </div>
        </div>

        <div className="application-management-panel">

          <div className="application-management-empty">

            <div className="application-management-empty-icon">
              ⏳
            </div>

            <h3 className="application-management-empty-title">
              Loading Applications...
            </h3>

            <p className="application-management-empty-text">
              Please wait while we fetch scholarship
              applications from the server.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <div className="application-management-page">

        <div className="application-management-header">
          <div className="application-management-header-content">

            <h1 className="application-management-title">
              Application Management
            </h1>

            <p className="application-management-subtitle">
              View and monitor scholarship applications
              submitted by students on ScholarBridge AI.
            </p>

          </div>
        </div>

        <div className="application-management-panel">

          <div className="application-management-empty">

            <div className="application-management-empty-icon">
              ⚠️
            </div>

            <h3 className="application-management-empty-title">
              Unable to Load Applications
            </h3>

            <p className="application-management-empty-text">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchApplications}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN APPLICATION MANAGEMENT PAGE
  // ============================================================

  return (
    <div className="application-management-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="application-management-header">

        <div className="application-management-header-content">

          <h1 className="application-management-title">
            Application Management
          </h1>

          <p className="application-management-subtitle">
            View and monitor scholarship applications
            submitted by students on ScholarBridge AI.
          </p>

        </div>

      </div>

      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div className="application-management-stats">

        {/* Total Applications */}

        <div className="application-management-stat-card">

          <div className="application-management-stat-top">

            <div>

              <p className="application-management-stat-label">
                Total Applications
              </p>

              <h2 className="application-management-stat-value">
                {totalApplications}
              </h2>

            </div>

            <div className="application-management-stat-icon">
              📄
            </div>

          </div>

        </div>

        {/* Pending */}

        <div className="application-management-stat-card">

          <div className="application-management-stat-top">

            <div>

              <p className="application-management-stat-label">
                Pending
              </p>

              <h2 className="application-management-stat-value">
                {pendingApplications}
              </h2>

            </div>

            <div className="application-management-stat-icon">
              ⏳
            </div>

          </div>

        </div>

        {/* Under Review */}

        <div className="application-management-stat-card">

          <div className="application-management-stat-top">

            <div>

              <p className="application-management-stat-label">
                Under Review
              </p>

              <h2 className="application-management-stat-value">
                {underReviewApplications}
              </h2>

            </div>

            <div className="application-management-stat-icon">
              🔍
            </div>

          </div>

        </div>

        {/* Approved */}

        <div className="application-management-stat-card">

          <div className="application-management-stat-top">

            <div>

              <p className="application-management-stat-label">
                Approved
              </p>

              <h2 className="application-management-stat-value">
                {approvedApplications}
              </h2>

            </div>

            <div className="application-management-stat-icon">
              ✓
            </div>

          </div>

        </div>

        {/* Rejected */}

        <div className="application-management-stat-card">

          <div className="application-management-stat-top">

            <div>

              <p className="application-management-stat-label">
                Rejected
              </p>

              <h2 className="application-management-stat-value">
                {rejectedApplications}
              </h2>

            </div>

            <div className="application-management-stat-icon">
              ✕
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          APPLICATION INFORMATION PANEL
          ===================================================== */}

      <div className="application-management-panel">

        <div className="application-management-panel-header">

          <div>

            <h2 className="application-management-panel-heading">
              Scholarship Applications
            </h2>

            <p className="application-management-panel-description">
              Application information submitted by registered students
            </p>

          </div>

        </div>

        {/* ===================================================
            APPLICATION TABLE
            =================================================== */}

        {applications.length > 0 ? (

          <div className="application-management-table-wrapper">

            <table className="application-management-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Scholarship
                  </th>

                  <th>
                    Provider
                  </th>

                  <th>
                    Applied Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {applications.map(
                  (application) => (

                    <tr
                      key={application.id}
                    >

                      {/* Student */}

                      <td>

                        <div className="application-management-student-cell">

                          <div className="application-management-avatar">

                            {getInitials(
                              application.studentName
                            )}

                          </div>

                          <div className="application-management-student-details">

                            <p className="application-management-student-name">

                              {application.studentName}

                            </p>

                            <p className="application-management-student-email">

                              {application.studentEmail}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Scholarship */}

                      <td>

                        <div className="application-management-scholarship-cell">

                          <p className="application-management-scholarship-name">

                            {application.scholarshipTitle}

                          </p>

                          <p className="application-management-application-id">

                            Application ID: #
                            {application.id}

                          </p>

                        </div>

                      </td>

                      {/* Provider */}

                      <td>

                        <span className="application-management-provider">

                          {application.providerName}

                        </span>

                      </td>

                      {/* Applied Date */}

                      <td>

                        <span className="application-management-date">

                          {application.appliedDate}

                        </span>

                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={`application-management-status ${
                            application.status ===
                            "Pending"
                              ? "application-management-status-pending"
                              : application.status ===
                                "Under Review"
                              ? "application-management-status-review"
                              : application.status ===
                                "Approved"
                              ? "application-management-status-approved"
                              : "application-management-status-rejected"
                          }`}
                        >

                          {application.status}

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

          <div className="application-management-empty">

            <div className="application-management-empty-icon">
              📄
            </div>

            <h3 className="application-management-empty-title">
              No Applications Found
            </h3>

            <p className="application-management-empty-text">
              No scholarship applications are currently
              available to display. Applications submitted
              by students will appear here.
            </p>

          </div>

        )}

      </div>

      {/* =====================================================
          INFORMATION FOOTER
          ===================================================== */}

      <div className="application-management-info-footer">

        <div className="application-management-info-icon">
          ℹ
        </div>

        <span>
          Application information displayed here is maintained
          by the ScholarBridge AI administration system.
        </span>

      </div>

    </div>
  );
};

export default ApplicationManagement;