import React, { useEffect, useState } from "react";
import "./ScholarshipManagement.css";

interface Scholarship {
  id: number;
  title: string;
  providerName: string;
  amount: string;
  applicationStart: string;
  deadline: string;
  status: "Approved" | "Pending" | "Rejected" | "Closed";
}

interface BackendProvider {
  id: number | null;
  organization_name: string;
  email: string;
}

interface BackendScholarship {
  id: number;
  title: string;
  description: string;
  amount: string;
  application_start: string;
  deadline: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "CLOSED";
  status_display: string;
  created_at: string;
  provider: BackendProvider;
  eligibility: unknown;
  required_documents: unknown[];
}

interface AdminScholarshipResponse {
  success: boolean;
  count: number;
  scholarships: BackendScholarship[];
  message?: string;
}

interface UpdateStatusResponse {
  success: boolean;
  message?: string;
  scholarship?: {
    id: number;
    title: string;
    status: "APPROVED" | "REJECTED" | "CLOSED";
    status_display: string;
  };
}

interface ScholarshipManagementProps {
  scholarships?: Scholarship[];
}

const ScholarshipManagement: React.FC<
  ScholarshipManagementProps
> = ({
  scholarships: initialScholarships,
}) => {

  const [scholarships, setScholarships] = useState<Scholarship[]>(
    initialScholarships ?? []
  );

  const [loading, setLoading] = useState<boolean>(
    initialScholarships === undefined
  );

  const [error, setError] = useState<string>("");

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = (): string | null => {

    const localToken: string | null =
      localStorage.getItem("admin_token");

    const sessionToken: string | null =
      sessionStorage.getItem("admin_token");

    return localToken || sessionToken;
  };

  // =====================================================
  // LOAD SCHOLARSHIPS FROM DJANGO BACKEND
  // =====================================================

  useEffect(() => {

    if (initialScholarships !== undefined) {
      return;
    }

    const fetchScholarships = async (): Promise<void> => {

      try {

        setLoading(true);
        setError("");

        const token: string | null =
          getAdminToken();

        if (!token) {

          setError(
            "Admin authentication token not found. Please login again."
          );

          return;
        }

        const response: Response = await fetch(
          "http://127.0.0.1:8000/api/scholarships/admin/",
          {
            method: "GET",

            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let data: AdminScholarshipResponse | null = null;

        try {

          data =
            (await response.json()) as AdminScholarshipResponse;

        } catch {

          data = null;
        }

        if (response.status === 401) {

          throw new Error(
            "Authentication failed. Please login again."
          );
        }

        if (response.status === 403) {

          throw new Error(
            "You do not have permission to access scholarship records."
          );
        }

        if (!response.ok) {

          throw new Error(
            data?.message ??
              `Failed to load scholarships. Server returned ${response.status}.`
          );
        }

        if (!data?.success) {

          throw new Error(
            data?.message ??
              "Unable to load scholarship records."
          );
        }

        const backendScholarships: BackendScholarship[] =
          data.scholarships ?? [];

        const formattedScholarships: Scholarship[] =
          backendScholarships.map(
            (
              scholarship: BackendScholarship
            ): Scholarship => ({

              id: scholarship.id,

              title: scholarship.title,

              providerName:
                scholarship.provider?.organization_name ??
                "Not Provided",

              amount: scholarship.amount,

              applicationStart:
                scholarship.application_start,

              deadline:
                scholarship.deadline,

              status:
                scholarship.status === "APPROVED"
                  ? "Approved"
                  : scholarship.status === "PENDING"
                  ? "Pending"
                  : scholarship.status === "REJECTED"
                  ? "Rejected"
                  : "Closed",
            })
          );

        setScholarships(
          formattedScholarships
        );

        console.log(
          "Scholarships loaded:",
          formattedScholarships
        );

      } catch (err: unknown) {

        console.error(
          "Scholarship API Error:",
          err
        );

        if (err instanceof Error) {

          setError(
            err.message
          );

        } else {

          setError(
            "Something went wrong while loading scholarships."
          );
        }

      } finally {

        setLoading(false);
      }
    };

    fetchScholarships();

  }, [initialScholarships]);

  // =====================================================
  // APPROVE / REJECT SCHOLARSHIP
  // =====================================================

  const updateScholarshipStatus = async (
    scholarshipId: number,
    newStatus: "APPROVED" | "REJECTED"
  ): Promise<void> => {

    try {

      setActionLoading(scholarshipId);
      setError("");
      setSuccessMessage("");

      const token: string | null =
        getAdminToken();

      if (!token) {

        setError(
          "Admin authentication token not found. Please login again."
        );

        return;
      }

      const response: Response = await fetch(
        `http://127.0.0.1:8000/api/scholarships/admin/${scholarshipId}/status/`,
        {
          method: "PUT",

          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      let data: UpdateStatusResponse | null = null;

      try {

        data =
          (await response.json()) as UpdateStatusResponse;

      } catch {

        data = null;
      }

      if (response.status === 401) {

        throw new Error(
          "Authentication failed. Please login again."
        );
      }

      if (response.status === 403) {

        throw new Error(
          "You do not have permission to update scholarships."
        );
      }

      if (response.status === 404) {

        throw new Error(
          "Scholarship not found."
        );
      }

      if (!response.ok) {

        throw new Error(
          data?.message ??
            `Failed to update scholarship. Server returned ${response.status}.`
        );
      }

      if (!data?.success) {

        throw new Error(
          data?.message ??
            "Unable to update scholarship status."
        );
      }

      // ---------------------------------------------------
      // UPDATE FRONTEND STATUS IMMEDIATELY
      // ---------------------------------------------------

      const formattedStatus: Scholarship["status"] =
        newStatus === "APPROVED"
          ? "Approved"
          : "Rejected";

      setScholarships(
        (currentScholarships) =>
          currentScholarships.map(
            (scholarship) =>
              scholarship.id === scholarshipId
                ? {
                    ...scholarship,
                    status: formattedStatus,
                  }
                : scholarship
          )
      );

      setSuccessMessage(
        data.message ??
          `Scholarship ${formattedStatus.toLowerCase()} successfully.`
      );

    } catch (err: unknown) {

      console.error(
        "Update Scholarship Status Error:",
        err
      );

      if (err instanceof Error) {

        setError(
          err.message
        );

      } else {

        setError(
          "Something went wrong while updating scholarship status."
        );
      }

    } finally {

      setActionLoading(null);
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalScholarships: number =
    scholarships.length;

  const approvedScholarships: number =
    scholarships.filter(
      (scholarship: Scholarship) =>
        scholarship.status === "Approved"
    ).length;

  const pendingScholarships: number =
    scholarships.filter(
      (scholarship: Scholarship) =>
        scholarship.status === "Pending"
    ).length;

  const rejectedScholarships: number =
    scholarships.filter(
      (scholarship: Scholarship) =>
        scholarship.status === "Rejected"
    ).length;

  const closedScholarships: number =
    scholarships.filter(
      (scholarship: Scholarship) =>
        scholarship.status === "Closed"
    ).length;

  // =====================================================
  // GET INITIALS
  // =====================================================

  const getInitials = (
    title: string
  ): string => {

    const words: string[] =
      title
        .trim()
        .split(/\s+/);

    if (words.length === 0) {
      return "SC";
    }

    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${words[0][0] ?? ""}${
      words[1][0] ?? ""
    }`.toUpperCase();
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {

    return (
      <div className="scholarship-management-page">

        <div className="scholarship-management-header">

          <div className="scholarship-management-header-content">

            <h1 className="scholarship-management-title">
              Scholarship Management
            </h1>

            <p className="scholarship-management-subtitle">
              View and monitor all scholarships submitted
              by providers on ScholarBridge AI.
            </p>

          </div>

        </div>

        <div className="scholarship-management-panel">

          <div className="scholarship-management-empty">

            <div className="scholarship-management-empty-icon">
              🎓
            </div>

            <h3 className="scholarship-management-empty-title">
              Loading Scholarships...
            </h3>

            <p className="scholarship-management-empty-text">
              Please wait while scholarship information
              is being loaded from the ScholarBridge AI
              administration system.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="scholarship-management-page">

      {/* PAGE HEADER */}

      <div className="scholarship-management-header">

        <div className="scholarship-management-header-content">

          <h1 className="scholarship-management-title">
            Scholarship Management
          </h1>

          <p className="scholarship-management-subtitle">
            View and monitor all scholarships submitted by providers
            on ScholarBridge AI.
          </p>

        </div>

      </div>

      {/* ERROR MESSAGE */}

      {error && (

        <div
          style={{
            margin: "20px",
            padding: "15px 18px",
            borderRadius: "10px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>

      )}

      {/* SUCCESS MESSAGE */}

      {successMessage && (

        <div
          style={{
            margin: "20px",
            padding: "15px 18px",
            borderRadius: "10px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#047857",
            fontSize: "14px",
          }}
        >
          {successMessage}
        </div>

      )}

      {/* SUMMARY CARDS */}

      <div className="scholarship-management-stats">

        {/* Total */}

        <div className="scholarship-management-stat-card">

          <div className="scholarship-management-stat-top">

            <div>

              <p className="scholarship-management-stat-label">
                Total Scholarships
              </p>

              <h2 className="scholarship-management-stat-value">
                {totalScholarships}
              </h2>

            </div>

            <div className="scholarship-management-stat-icon">
              🎓
            </div>

          </div>

        </div>

        {/* Approved */}

        <div className="scholarship-management-stat-card">

          <div className="scholarship-management-stat-top">

            <div>

              <p className="scholarship-management-stat-label">
                Approved
              </p>

              <h2 className="scholarship-management-stat-value">
                {approvedScholarships}
              </h2>

            </div>

            <div className="scholarship-management-stat-icon">
              ✓
            </div>

          </div>

        </div>

        {/* Pending */}

        <div className="scholarship-management-stat-card">

          <div className="scholarship-management-stat-top">

            <div>

              <p className="scholarship-management-stat-label">
                Pending Review
              </p>

              <h2 className="scholarship-management-stat-value">
                {pendingScholarships}
              </h2>

            </div>

            <div className="scholarship-management-stat-icon">
              ⏳
            </div>

          </div>

        </div>

        {/* Rejected */}

        <div className="scholarship-management-stat-card">

          <div className="scholarship-management-stat-top">

            <div>

              <p className="scholarship-management-stat-label">
                Rejected
              </p>

              <h2 className="scholarship-management-stat-value">
                {rejectedScholarships}
              </h2>

            </div>

            <div className="scholarship-management-stat-icon">
              ✕
            </div>

          </div>

        </div>

        {/* Closed */}

        <div className="scholarship-management-stat-card">

          <div className="scholarship-management-stat-top">

            <div>

              <p className="scholarship-management-stat-label">
                Closed
              </p>

              <h2 className="scholarship-management-stat-value">
                {closedScholarships}
              </h2>

            </div>

            <div className="scholarship-management-stat-icon">
              🔒
            </div>

          </div>

        </div>

      </div>

      {/* SCHOLARSHIP INFORMATION PANEL */}

      <div className="scholarship-management-panel">

        <div className="scholarship-management-panel-header">

          <div>

            <h2 className="scholarship-management-panel-heading">
              Registered Scholarships
            </h2>

            <p className="scholarship-management-panel-description">
              Scholarship information submitted by registered providers
            </p>

          </div>

        </div>

        {/* SCHOLARSHIP TABLE */}

        {scholarships.length > 0 ? (

          <div className="scholarship-management-table-wrapper">

            <table className="scholarship-management-table">

              <thead>

                <tr>

                  <th>Scholarship</th>

                  <th>Provider</th>

                  <th>Amount</th>

                  <th>Application Start</th>

                  <th>Deadline</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {scholarships.map(
                  (
                    scholarship: Scholarship
                  ) => (

                    <tr
                      key={scholarship.id}
                    >

                      {/* Scholarship */}

                      <td>

                        <div className="scholarship-management-scholarship-cell">

                          <div className="scholarship-management-avatar">

                            {getInitials(
                              scholarship.title
                            )}

                          </div>

                          <div className="scholarship-management-scholarship-details">

                            <p className="scholarship-management-scholarship-name">
                              {scholarship.title}
                            </p>

                            <p className="scholarship-management-scholarship-id">
                              Scholarship ID: #
                              {scholarship.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Provider */}

                      <td>

                        <span className="scholarship-management-provider">
                          {scholarship.providerName}
                        </span>

                      </td>

                      {/* Amount */}

                      <td>

                        <span className="scholarship-management-amount">
                          {scholarship.amount}
                        </span>

                      </td>

                      {/* Application Start */}

                      <td>

                        <span className="scholarship-management-date">
                          {scholarship.applicationStart}
                        </span>

                      </td>

                      {/* Deadline */}

                      <td>

                        <span className="scholarship-management-date scholarship-management-deadline">
                          {scholarship.deadline}
                        </span>

                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={`scholarship-management-status ${
                            scholarship.status ===
                            "Approved"
                              ? "scholarship-management-status-approved"
                              : scholarship.status ===
                                "Pending"
                              ? "scholarship-management-status-pending"
                              : scholarship.status ===
                                "Rejected"
                              ? "scholarship-management-status-rejected"
                              : "scholarship-management-status-closed"
                          }`}
                        >
                          {scholarship.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        {scholarship.status ===
                        "Pending" ? (

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >

                            {/* APPROVE */}

                            <button
                              type="button"
                              disabled={
                                actionLoading ===
                                scholarship.id
                              }
                              onClick={() =>
                                updateScholarshipStatus(
                                  scholarship.id,
                                  "APPROVED"
                                )
                              }
                              style={{
                                border: "none",
                                borderRadius: "8px",
                                padding:
                                  "8px 12px",
                                background:
                                  "#16a34a",
                                color: "#ffffff",
                                cursor:
                                  actionLoading ===
                                  scholarship.id
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize:
                                  "13px",
                                fontWeight: 600,
                                opacity:
                                  actionLoading ===
                                  scholarship.id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {actionLoading ===
                              scholarship.id
                                ? "Updating..."
                                : "Approve"}
                            </button>

                            {/* REJECT */}

                            <button
                              type="button"
                              disabled={
                                actionLoading ===
                                scholarship.id
                              }
                              onClick={() =>
                                updateScholarshipStatus(
                                  scholarship.id,
                                  "REJECTED"
                                )
                              }
                              style={{
                                border: "none",
                                borderRadius: "8px",
                                padding:
                                  "8px 12px",
                                background:
                                  "#dc2626",
                                color: "#ffffff",
                                cursor:
                                  actionLoading ===
                                  scholarship.id
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize:
                                  "13px",
                                fontWeight: 600,
                                opacity:
                                  actionLoading ===
                                  scholarship.id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {actionLoading ===
                              scholarship.id
                                ? "Updating..."
                                : "Reject"}
                            </button>

                          </div>

                        ) : (

                          <span
                            style={{
                              color: "#64748b",
                              fontSize: "13px",
                            }}
                          >
                            No action
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          /* EMPTY STATE */

          <div className="scholarship-management-empty">

            <div className="scholarship-management-empty-icon">
              🎓
            </div>

            <h3 className="scholarship-management-empty-title">
              No Scholarships Found
            </h3>

            <p className="scholarship-management-empty-text">
              No scholarships are currently available to
              display. Scholarships submitted by providers
              will appear here.
            </p>

          </div>

        )}

      </div>

      {/* INFORMATION FOOTER */}

      <div className="scholarship-management-info-footer">

        <div className="scholarship-management-info-icon">
          ℹ
        </div>

        <span>
          Scholarship information displayed here is maintained
          by the ScholarBridge AI administration system.
        </span>

      </div>

    </div>
  );
};

export default ScholarshipManagement;