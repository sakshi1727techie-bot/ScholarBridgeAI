import React, { useEffect, useState } from "react";
import "./DocumentManagement.css";

interface BackendDocument {
  id: number;

  student: {
    id: number;
    name: string;
    email: string;
  };

  document_type: string;
  document_type_display: string;

  document: string | null;
  document_url: string | null;

  verification_status: "PENDING" | "VERIFIED" | "REJECTED";
  verification_status_display:
    | "Pending"
    | "Verified"
    | "Rejected";

  uploaded_at: string;
}

interface StudentDocument {
  id: number;
  studentName: string;
  studentEmail: string;
  documentName: string;
  documentType: string;
  uploadDate: string;
  verificationStatus:
    | "Pending"
    | "Verified"
    | "Rejected";
  documentUrl: string | null;
}

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
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
  // GET DOCUMENT FILE NAME
  // ============================================================

  const getDocumentName = (
    document: BackendDocument
  ): string => {
    if (document.document) {
      const parts = document.document.split("/");

      return (
        parts[parts.length - 1] ||
        document.document_type_display ||
        "Document"
      );
    }

    return (
      document.document_type_display ||
      "Document"
    );
  };

  // ============================================================
  // GET ADMIN DOCUMENTS
  // ============================================================

  const fetchDocuments = async (): Promise<void> => {
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
      // ADMIN DOCUMENT API
      // --------------------------------------------------------

      const response = await fetch(
        "http://127.0.0.1:8000/documents/api/admin/",
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
            "Failed to fetch documents."
        );
      }

      // --------------------------------------------------------
      // BACKEND SUCCESS CHECK
      // --------------------------------------------------------

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load documents."
        );
      }

      // --------------------------------------------------------
      // FORMAT BACKEND DATA
      // --------------------------------------------------------

      const formattedDocuments: StudentDocument[] = (
        data.documents || []
      ).map(
        (document: BackendDocument) => ({
          id: document.id,

          studentName:
            document.student?.name ||
            document.student?.email ||
            "Unknown Student",

          studentEmail:
            document.student?.email ||
            "-",

          documentName:
            getDocumentName(document),

          documentType:
            document.document_type_display ||
            document.document_type ||
            "Other",

          uploadDate:
            formatDate(document.uploaded_at),

          verificationStatus:
            document.verification_status_display ||
            "Pending",

          documentUrl:
            document.document_url || null,
        })
      );

      setDocuments(formattedDocuments);
    } catch (err) {
      console.error(
        "Admin documents API error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading documents."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD DOCUMENTS WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ============================================================
  // DOCUMENT STATISTICS
  // ============================================================

  const totalDocuments =
    documents.length;

  const pendingDocuments =
    documents.filter(
      (document) =>
        document.verificationStatus === "Pending"
    ).length;

  const verifiedDocuments =
    documents.filter(
      (document) =>
        document.verificationStatus === "Verified"
    ).length;

  const rejectedDocuments =
    documents.filter(
      (document) =>
        document.verificationStatus === "Rejected"
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
      <div className="document-management-page">

        <div className="document-management-header">
          <div className="document-management-header-content">

            <h1 className="document-management-title">
              Document Management
            </h1>

            <p className="document-management-subtitle">
              View and monitor documents submitted by students
              for scholarship applications on ScholarBridge AI.
            </p>

          </div>
        </div>

        <div className="document-management-panel">

          <div className="document-management-empty">

            <div className="document-management-empty-icon">
              ⏳
            </div>

            <h3 className="document-management-empty-title">
              Loading Documents...
            </h3>

            <p className="document-management-empty-text">
              Please wait while we fetch student documents
              from the server.
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
      <div className="document-management-page">

        <div className="document-management-header">
          <div className="document-management-header-content">

            <h1 className="document-management-title">
              Document Management
            </h1>

            <p className="document-management-subtitle">
              View and monitor documents submitted by students
              for scholarship applications on ScholarBridge AI.
            </p>

          </div>
        </div>

        <div className="document-management-panel">

          <div className="document-management-empty">

            <div className="document-management-empty-icon">
              ⚠️
            </div>

            <h3 className="document-management-empty-title">
              Unable to Load Documents
            </h3>

            <p className="document-management-empty-text">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDocuments}
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
  // MAIN DOCUMENT MANAGEMENT PAGE
  // ============================================================

  return (
    <div className="document-management-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="document-management-header">

        <div className="document-management-header-content">

          <h1 className="document-management-title">
            Document Management
          </h1>

          <p className="document-management-subtitle">
            View and monitor documents submitted by students
            for scholarship applications on ScholarBridge AI.
          </p>

        </div>

      </div>

      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div className="document-management-stats">

        {/* Total Documents */}

        <div className="document-management-stat-card">

          <div className="document-management-stat-top">

            <div>

              <p className="document-management-stat-label">
                Total Documents
              </p>

              <h2 className="document-management-stat-value">
                {totalDocuments}
              </h2>

            </div>

            <div className="document-management-stat-icon">
              📁
            </div>

          </div>

        </div>

        {/* Pending */}

        <div className="document-management-stat-card">

          <div className="document-management-stat-top">

            <div>

              <p className="document-management-stat-label">
                Pending Verification
              </p>

              <h2 className="document-management-stat-value">
                {pendingDocuments}
              </h2>

            </div>

            <div className="document-management-stat-icon">
              ⏳
            </div>

          </div>

        </div>

        {/* Verified */}

        <div className="document-management-stat-card">

          <div className="document-management-stat-top">

            <div>

              <p className="document-management-stat-label">
                Verified
              </p>

              <h2 className="document-management-stat-value">
                {verifiedDocuments}
              </h2>

            </div>

            <div className="document-management-stat-icon">
              ✓
            </div>

          </div>

        </div>

        {/* Rejected */}

        <div className="document-management-stat-card">

          <div className="document-management-stat-top">

            <div>

              <p className="document-management-stat-label">
                Rejected
              </p>

              <h2 className="document-management-stat-value">
                {rejectedDocuments}
              </h2>

            </div>

            <div className="document-management-stat-icon">
              ✕
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          DOCUMENT INFORMATION PANEL
          ===================================================== */}

      <div className="document-management-panel">

        <div className="document-management-panel-header">

          <div>

            <h2 className="document-management-panel-heading">
              Student Documents
            </h2>

            <p className="document-management-panel-description">
              Documents uploaded by students through ScholarBridge AI
            </p>

          </div>

        </div>

        {/* ===================================================
            DOCUMENT TABLE
            =================================================== */}

        {documents.length > 0 ? (

          <div className="document-management-table-wrapper">

            <table className="document-management-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Document
                  </th>

                  <th>
                    Document Type
                  </th>

                  <th>
                    Upload Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {documents.map(
                  (document) => (

                    <tr
                      key={document.id}
                    >

                      {/* Student */}

                      <td>

                        <div className="document-management-student-cell">

                          <div className="document-management-avatar">

                            {getInitials(
                              document.studentName
                            )}

                          </div>

                          <div className="document-management-student-details">

                            <p className="document-management-student-name">

                              {document.studentName}

                            </p>

                            <p className="document-management-student-email">

                              {document.studentEmail}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Document */}

                      <td>

                        <div className="document-management-document-cell">

                          <div className="document-management-file-icon">
                            📄
                          </div>

                          <div className="document-management-document-details">

                            <p className="document-management-document-name">

                              {document.documentName}

                            </p>

                            <p className="document-management-document-id">

                              Document ID: #
                              {document.id}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Document Type */}

                      <td>

                        <span className="document-management-type">

                          {document.documentType}

                        </span>

                      </td>

                      {/* Upload Date */}

                      <td>

                        <span className="document-management-date">

                          {document.uploadDate}

                        </span>

                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={`document-management-status ${
                            document.verificationStatus ===
                            "Pending"
                              ? "document-management-status-pending"
                              : document.verificationStatus ===
                                "Verified"
                              ? "document-management-status-verified"
                              : "document-management-status-rejected"
                          }`}
                        >

                          {document.verificationStatus}

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

          <div className="document-management-empty">

            <div className="document-management-empty-icon">
              📁
            </div>

            <h3 className="document-management-empty-title">
              No Documents Found
            </h3>

            <p className="document-management-empty-text">
              No student documents are currently available to
              display. Documents uploaded by students will appear here.
            </p>

          </div>

        )}

      </div>

      {/* =====================================================
          INFORMATION FOOTER
          ===================================================== */}

      <div className="document-management-info-footer">

        <div className="document-management-info-icon">
          ℹ
        </div>

        <span>
          Document information displayed here is maintained by
          the ScholarBridge AI administration system.
        </span>

      </div>

    </div>
  );
};

export default DocumentManagement;