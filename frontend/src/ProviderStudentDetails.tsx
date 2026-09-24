import React, { useEffect, useState } from "react";
import "./ProviderStudentDetails.css";

interface ProviderStudentDetailsProps {
    applicationId: number;
    onBackToApplications?: () => void;
}

interface StudentDetails {
    id?: number;
    email?: string;
    full_name?: string;
    date_of_birth?: string;
    gender?: string;
    phone?: string;
    state?: string;
    city?: string;
    course?: string;
    specialization?: string;
    college?: string;
    academic_score?: string | number;
    family_income?: string | number;
    category?: string;
    profile_completion?: number;
}

interface ApplicationDetails {
    id?: number;
    status?: string;
    status_display?: string;
    applied_at?: string;
    updated_at?: string;
}

interface ScholarshipDetails {
    id?: number;
    title?: string;
    description?: string;
    amount?: string | number;
    application_start?: string;
    deadline?: string;
}

interface StudentDetailsResponse {
    success: boolean;

    application?: ApplicationDetails;

    scholarship?: ScholarshipDetails;

    student?: StudentDetails;

    application_data?: {
        reason?: string;
        purpose?: string;
        statement?: string;
        remarks?: string;
        [key: string]: unknown;
    };

    form_data?: {
        reason?: string;
        purpose?: string;
        statement?: string;
        remarks?: string;
        [key: string]: unknown;
    };

    message?: string;
}

interface SubmittedDocument {
    id: number;

    document_type?: string;
    document_type_display?: string;

    document?: string;
    document_url?: string;

    application_id?: number;
    scholarship_title?: string;
    application_status?: string;

    verification_status?: string;
    verification_status_display?: string;

    uploaded_at?: string;
    updated_at?: string;
}

interface SubmittedDocumentsResponse {
    success: boolean;

    application?: {
        id: number;
        status: string;
        status_display: string;
    };

    scholarship?: {
        id: number;
        title: string;
    };

    student?: {
        id: number;
        email: string;
    };

    count?: number;

    documents?: SubmittedDocument[];

    message?: string;
}

const ProviderStudentDetails: React.FC<
    ProviderStudentDetailsProps
> = ({
    applicationId,
    onBackToApplications,
}) => {
    const [student, setStudent] =
        useState<StudentDetails | null>(null);

    const [application, setApplication] =
        useState<ApplicationDetails | null>(null);

    const [scholarship, setScholarship] =
        useState<ScholarshipDetails | null>(null);

    const [applicationData, setApplicationData] =
        useState<
            StudentDetailsResponse["application_data"]
        >(undefined);

    const [formData, setFormData] =
        useState<StudentDetailsResponse["form_data"]>(
            undefined
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>("");

    // ============================================================
    // SUBMITTED DOCUMENTS
    // ============================================================

    const [documents, setDocuments] =
        useState<SubmittedDocument[]>([]);

    const [documentsLoading, setDocumentsLoading] =
        useState<boolean>(true);

    const [documentsError, setDocumentsError] =
        useState<string>("");

    // ============================================================
    // DOCUMENT UPDATE STATE
    // ============================================================

    const [documentUpdatingId, setDocumentUpdatingId] =
        useState<number | null>(null);

    // ============================================================
    // PROVIDER TOKEN
    // ============================================================

    const getProviderToken = () => {
        return (
            localStorage.getItem("provider_token") ||
            sessionStorage.getItem("provider_token")
        );
    };

    // ============================================================
    // FETCH STUDENT DETAILS
    // ============================================================

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const token = getProviderToken();

                if (!token) {
                    setError(
                        "Provider session not found. Please login again."
                    );
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/application/api/provider/${applicationId}/student-details/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );

                const data: StudentDetailsResponse =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                            "Unable to load student details."
                    );
                }

                if (!data.success) {
                    throw new Error(
                        data?.message ||
                            "Unable to load student details."
                    );
                }

                setStudent(
                    data.student || null
                );

                setApplication(
                    data.application || null
                );

                setScholarship(
                    data.scholarship || null
                );

                setApplicationData(
                    data.application_data
                );

                setFormData(
                    data.form_data
                );
            } catch (err) {
                console.error(
                    "Student details error:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load student details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [applicationId]);

    // ============================================================
    // FETCH SUBMITTED DOCUMENTS
    // ============================================================

    useEffect(() => {
        const fetchSubmittedDocuments =
            async () => {
                try {
                    setDocumentsLoading(true);
                    setDocumentsError("");

                    const token =
                        getProviderToken();

                    if (!token) {
                        setDocumentsError(
                            "Provider session not found. Please login again."
                        );
                        return;
                    }

                    const response =
                        await fetch(
                            `http://127.0.0.1:8000/documents/api/provider/application/${applicationId}/documents/`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `Token ${token}`,
                                    "Content-Type":
                                        "application/json",
                                },
                            }
                        );

                    const data: SubmittedDocumentsResponse =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data?.message ||
                                "Unable to load submitted documents."
                        );
                    }

                    if (!data.success) {
                        throw new Error(
                            data?.message ||
                                "Unable to load submitted documents."
                        );
                    }

                    setDocuments(
                        Array.isArray(
                            data.documents
                        )
                            ? data.documents
                            : []
                    );
                } catch (err) {
                    console.error(
                        "Submitted documents error:",
                        err
                    );

                    setDocumentsError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load submitted documents."
                    );
                } finally {
                    setDocumentsLoading(
                        false
                    );
                }
            };

        fetchSubmittedDocuments();
    }, [applicationId]);

    // ============================================================
    // VERIFY / REJECT DOCUMENT
    // ============================================================

    const updateDocumentVerification =
        async (
            documentId: number,
            verificationStatus:
                | "VERIFIED"
                | "REJECTED"
        ) => {
            try {
                setDocumentUpdatingId(
                    documentId
                );

                setDocumentsError("");

                const token =
                    getProviderToken();

                if (!token) {
                    setDocumentsError(
                        "Provider session not found. Please login again."
                    );
                    return;
                }

                const response =
                    await fetch(
                        `http://127.0.0.1:8000/documents/api/provider/document/${documentId}/verify/`,
                        {
                            method: "PATCH",
                            headers: {
                                Authorization: `Token ${token}`,
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify({
                                verification_status:
                                    verificationStatus,
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                            "Unable to update document status."
                    );
                }

                if (!data.success) {
                    throw new Error(
                        data?.message ||
                            "Unable to update document status."
                    );
                }

                setDocuments(
                    (previousDocuments) =>
                        previousDocuments.map(
                            (document) =>
                                document.id ===
                                documentId
                                    ? {
                                          ...document,

                                          verification_status:
                                              data
                                                  .document
                                                  ?.verification_status ||
                                              verificationStatus,

                                          verification_status_display:
                                              data
                                                  .document
                                                  ?.verification_status_display ||
                                              (verificationStatus ===
                                              "VERIFIED"
                                                  ? "Verified"
                                                  : "Rejected"),
                                      }
                                    : document
                        )
                );
            } catch (err) {
                console.error(
                    "Document verification error:",
                    err
                );

                setDocumentsError(
                    err instanceof Error
                        ? err.message
                        : "Unable to update document status."
                );
            } finally {
                setDocumentUpdatingId(
                    null
                );
            }
        };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (
        date?: string
    ) => {
        if (!date) {
            return "Not available";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ============================================================
    // FORMAT DATE + TIME
    // ============================================================

    const formatDateTime = (
        date?: string
    ) => {
        if (!date) {
            return "Not available";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Not available";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    // ============================================================
    // STATUS CLASS
    // ============================================================

    const getStatusClass = (
        status?: string
    ) => {
        switch (status) {
            case "PENDING":
                return "psd-status-badge psd-status-pending";

            case "UNDER_REVIEW":
                return "psd-status-badge psd-status-review";

            case "APPROVED":
                return "psd-status-badge psd-status-approved";

            case "REJECTED":
                return "psd-status-badge psd-status-rejected";

            default:
                return "psd-status-badge";
        }
    };

    // ============================================================
    // DOCUMENT STATUS CLASS
    // ============================================================

    const getDocumentStatusClass = (
        status?: string
    ) => {
        switch (status) {
            case "VERIFIED":
                return "psd-document-status verified";

            case "REJECTED":
                return "psd-document-status rejected";

            case "PENDING":
            default:
                return "psd-document-status pending";
        }
    };

    // ============================================================
    // DOCUMENT NAME
    // ============================================================

    const getDocumentName = (
        document: SubmittedDocument
    ) => {
        return (
            document.document_type_display ||
            document.document_type ||
            "Uploaded Document"
        );
    };

    // ============================================================
    // GET STUDENT INITIALS
    // ============================================================

    const getStudentInitials = () => {
        const name =
            student?.full_name?.trim();

        if (!name) {
            return "S";
        }

        const parts =
            name.split(" ");

        if (parts.length === 1) {
            return parts[0]
                .charAt(0)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[
                parts.length - 1
            ].charAt(0)
        ).toUpperCase();
    };

    // ============================================================
    // GET APPLICATION TEXT
    // ============================================================

    const getApplicationText = (
        key:
            | "reason"
            | "purpose"
            | "statement"
            | "remarks"
    ) => {
        return (
            applicationData?.[key] ||
            formData?.[key] ||
            ""
        );
    };

    // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading) {
        return (
            <div className="psd-page">
                <div className="psd-loading">
                    <div className="psd-spinner"></div>

                    <h3>
                        Loading Student Details
                    </h3>

                    <p>
                        Please wait while we
                        retrieve the application
                        information.
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================
    // ERROR STATE
    // ============================================================

    if (error) {
        return (
            <div className="psd-page">
                <div className="psd-error">
                    <div className="psd-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Load Details
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="psd-back-button"
                        onClick={
                            onBackToApplications
                        }
                    >
                        ← Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="psd-page">

            {/* =====================================================
                HEADER
                ===================================================== */}

            <header className="psd-header">

                <div className="psd-header-left">

                    <button
                        type="button"
                        className="psd-header-back"
                        onClick={
                            onBackToApplications
                        }
                        aria-label="Back to applications"
                    >
                        ←
                    </button>

                    <div>

                        <div className="psd-breadcrumb">
                            Provider Dashboard
                            <span>›</span>
                            Applications
                            <span>›</span>
                            Student Details
                        </div>

                        <h1>
                            Student Application Review
                        </h1>

                    </div>

                </div>

                <div className="psd-header-right">

                    <span
                        className={getStatusClass(
                            application?.status
                        )}
                    >
                        {application?.status_display ||
                            application?.status ||
                            "Pending"}
                    </span>

                </div>

            </header>


            {/* =====================================================
                CONTENT
                ===================================================== */}

            <main className="psd-content">

                {/* =================================================
                    PROFILE HERO
                    ================================================= */}

                <section className="psd-profile-card">

                    <div className="psd-avatar">
                        {getStudentInitials()}
                    </div>

                    <div className="psd-profile-main">

                        <h2>
                            {student?.full_name ||
                                "Student"}
                        </h2>

                        <p className="psd-email">
                            {student?.email ||
                                "Email not available"}
                        </p>

                        <div className="psd-profile-meta">

                            {student?.course && (
                                <span>
                                    🎓{" "}
                                    {student.course}
                                </span>
                            )}

                            {student?.specialization && (
                                <span>
                                    💻{" "}
                                    {
                                        student.specialization
                                    }
                                </span>
                            )}

                            {student?.college && (
                                <span>
                                    🏫{" "}
                                    {student.college}
                                </span>
                            )}

                            {student?.city && (
                                <span>
                                    📍{" "}
                                    {student.city}
                                    {student.state
                                        ? `, ${student.state}`
                                        : ""}
                                </span>
                            )}

                        </div>

                    </div>

                    <div className="psd-profile-completion">

                        <span>
                            Profile Completion
                        </span>

                        <strong>
                            {student?.profile_completion ??
                                0}
                            %
                        </strong>

                        <div className="psd-progress">
                            <div
                                className="psd-progress-fill"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            Number(
                                                student?.profile_completion ||
                                                    0
                                            )
                                        )
                                    )}%`,
                                }}
                            />
                        </div>

                    </div>

                </section>


                {/* =================================================
                    SUMMARY
                    ================================================= */}

                <section className="psd-summary-grid">

                    <div className="psd-summary-card">

                        <span>
                            Course
                        </span>

                        <strong>
                            {student?.course ||
                                "Not available"}
                        </strong>

                    </div>

                    <div className="psd-summary-card">

                        <span>
                            Academic Score
                        </span>

                        <strong>
                            {student?.academic_score !==
                            undefined &&
                            student?.academic_score !==
                            null &&
                            student?.academic_score !==
                            ""
                                ? `${student.academic_score}`
                                : "Not available"}
                        </strong>

                    </div>

                    <div className="psd-summary-card">

                        <span>
                            Family Income
                        </span>

                        <strong>
                            {student?.family_income !==
                                undefined &&
                            student?.family_income !==
                                null &&
                            student?.family_income !==
                                ""
                                ? `₹${student.family_income}`
                                : "Not available"}
                        </strong>

                    </div>

                    <div className="psd-summary-card">

                        <span>
                            Category
                        </span>

                        <strong>
                            {student?.category ||
                                "Not available"}
                        </strong>

                    </div>

                </section>


                {/* =================================================
                    PERSONAL INFORMATION
                    ================================================= */}

                <section className="psd-section">

                    <div className="psd-section-header">

                        <div>

                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Basic personal and
                                contact details of
                                the applicant.
                            </p>

                        </div>

                    </div>

                    <div className="psd-details-grid">

                        <div className="psd-detail-item">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {student?.full_name ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {student?.email ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {student?.phone ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Date of Birth
                            </span>

                            <strong>
                                {formatDate(
                                    student?.date_of_birth
                                )}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Gender
                            </span>

                            <strong>
                                {student?.gender ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Category
                            </span>

                            <strong>
                                {student?.category ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                State
                            </span>

                            <strong>
                                {student?.state ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                City
                            </span>

                            <strong>
                                {student?.city ||
                                    "Not available"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ACADEMIC INFORMATION
                    ================================================= */}

                <section className="psd-section">

                    <div className="psd-section-header">

                        <div>

                            <h2>
                                Academic Information
                            </h2>

                            <p>
                                Educational background
                                and academic details.
                            </p>

                        </div>

                    </div>

                    <div className="psd-details-grid">

                        <div className="psd-detail-item">

                            <span>
                                Course
                            </span>

                            <strong>
                                {student?.course ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Specialization
                            </span>

                            <strong>
                                {student?.specialization ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item psd-detail-wide">

                            <span>
                                College / Institution
                            </span>

                            <strong>
                                {student?.college ||
                                    "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Academic Score
                            </span>

                            <strong>
                                {student?.academic_score !==
                                    undefined &&
                                student?.academic_score !==
                                    null &&
                                student?.academic_score !==
                                    ""
                                    ? student.academic_score
                                    : "Not available"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Family Income
                            </span>

                            <strong>
                                {student?.family_income !==
                                    undefined &&
                                student?.family_income !==
                                    null &&
                                student?.family_income !==
                                    ""
                                    ? `₹${student.family_income}`
                                    : "Not available"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    SCHOLARSHIP INFORMATION
                    ================================================= */}

                <section className="psd-section">

                    <div className="psd-section-header">

                        <div>

                            <h2>
                                Scholarship Information
                            </h2>

                            <p>
                                Scholarship selected by
                                the student.
                            </p>

                        </div>

                    </div>

                    <div className="psd-scholarship-card">

                        <h3>
                            {scholarship?.title ||
                                "Scholarship"}
                        </h3>

                        <p>
                            {scholarship?.description ||
                                "No scholarship description available."}
                        </p>

                        <div className="psd-scholarship-meta">

                            <div>

                                <span>
                                    Scholarship Amount
                                </span>

                                <strong>
                                    {scholarship?.amount !==
                                        undefined &&
                                    scholarship?.amount !==
                                        null &&
                                    scholarship?.amount !==
                                        ""
                                        ? `₹${scholarship.amount}`
                                        : "Not available"}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Application Deadline
                                </span>

                                <strong>
                                    {formatDate(
                                        scholarship?.deadline
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Application Start
                                </span>

                                <strong>
                                    {formatDate(
                                        scholarship?.application_start
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Application ID
                                </span>

                                <strong>
                                    #
                                    {application?.id ||
                                        applicationId}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    APPLICATION INFORMATION
                    ================================================= */}

                <section className="psd-section">

                    <div className="psd-section-header">

                        <div>

                            <h2>
                                Application Information
                            </h2>

                            <p>
                                Application submission
                                and review details.
                            </p>

                        </div>

                    </div>

                    <div className="psd-details-grid">

                        <div className="psd-detail-item">

                            <span>
                                Application ID
                            </span>

                            <strong>
                                #
                                {application?.id ||
                                    applicationId}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Application Status
                            </span>

                            <strong>
                                {application?.status_display ||
                                    application?.status ||
                                    "Pending"}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Applied On
                            </span>

                            <strong>
                                {formatDateTime(
                                    application?.applied_at
                                )}
                            </strong>

                        </div>

                        <div className="psd-detail-item">

                            <span>
                                Last Updated
                            </span>

                            <strong>
                                {formatDateTime(
                                    application?.updated_at
                                )}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    SUBMITTED DOCUMENTS
                    ================================================= */}

                <section className="psd-section">

                    <div className="psd-section-header">

                        <div>

                            <h2>
                                Submitted Documents
                            </h2>

                            <p>
                                Documents submitted by the
                                student for this scholarship
                                application.
                            </p>

                        </div>

                        {!documentsLoading &&
                            !documentsError && (
                                <span className="psd-documents-count">
                                    {documents.length}{" "}
                                    document
                                    {documents.length !==
                                    1
                                        ? "s"
                                        : ""}
                                </span>
                            )}

                    </div>


                    {/* DOCUMENT ERROR */}

                    {documentsError && (
                        <div className="psd-documents-error">
                            {documentsError}
                        </div>
                    )}


                    {/* DOCUMENT LOADING */}

                    {documentsLoading && (
                        <div className="psd-documents-loading">

                            <div className="psd-documents-loading-spinner"></div>

                            Loading submitted
                            documents...

                        </div>
                    )}


                    {/* NO DOCUMENTS */}

                    {!documentsLoading &&
                        !documentsError &&
                        documents.length ===
                            0 && (
                            <div className="psd-document-empty">

                                <div className="psd-document-empty-icon">
                                    📄
                                </div>

                                <h3>
                                    No Documents Submitted
                                </h3>

                                <p>
                                    The student has not
                                    uploaded any
                                    documents for this
                                    scholarship
                                    application yet.
                                </p>

                            </div>
                        )}


                    {/* DOCUMENT CARDS */}

                    {!documentsLoading &&
                        !documentsError &&
                        documents.length >
                            0 && (
                            <div className="psd-documents-grid">

                                {documents.map(
                                    (document) => {

                                        const isUpdating =
                                            documentUpdatingId ===
                                            document.id;

                                        const isVerified =
                                            document.verification_status ===
                                            "VERIFIED";

                                        const isRejected =
                                            document.verification_status ===
                                            "REJECTED";

                                        return (
                                            <div
                                                className="psd-document-card"
                                                key={
                                                    document.id
                                                }
                                            >

                                                {/* CARD TOP */}

                                                <div className="psd-document-card-top">

                                                    <div className="psd-document-icon">
                                                        📄
                                                    </div>

                                                    <span
                                                        className={getDocumentStatusClass(
                                                            document.verification_status
                                                        )}
                                                    >
                                                        {document.verification_status_display ||
                                                            document.verification_status ||
                                                            "Pending"}
                                                    </span>

                                                </div>


                                                {/* DOCUMENT NAME */}

                                                <h3>
                                                    {getDocumentName(
                                                        document
                                                    )}
                                                </h3>


                                                {/* DOCUMENT DETAILS */}

                                                <div className="psd-document-details">

                                                    <div className="psd-document-detail">

                                                        <span>
                                                            Application ID
                                                        </span>

                                                        <strong>
                                                            #
                                                            {document.application_id ||
                                                                applicationId}
                                                        </strong>

                                                    </div>


                                                    <div className="psd-document-detail">

                                                        <span>
                                                            Uploaded On
                                                        </span>

                                                        <strong>
                                                            {formatDate(
                                                                document.uploaded_at
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="psd-document-actions">

                                                    {document.document_url && (
                                                        <a
                                                            href={
                                                                document.document_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="psd-document-view-button"
                                                        >
                                                            View Document
                                                        </a>
                                                    )}


                                                    {/* VERIFY BUTTON */}

                                                    {!isVerified &&
                                                        !isUpdating && (
                                                            <button
                                                                type="button"
                                                                className="psd-document-verify-button"
                                                                onClick={() =>
                                                                    updateDocumentVerification(
                                                                        document.id,
                                                                        "VERIFIED"
                                                                    )
                                                                }
                                                            >
                                                                ✓ Verify
                                                            </button>
                                                        )}


                                                    {/* REJECT BUTTON */}

                                                    {!isRejected &&
                                                        !isUpdating && (
                                                            <button
                                                                type="button"
                                                                className="psd-document-reject-button"
                                                                onClick={() =>
                                                                    updateDocumentVerification(
                                                                        document.id,
                                                                        "REJECTED"
                                                                    )
                                                                }
                                                            >
                                                                ✕ Reject
                                                            </button>
                                                        )}


                                                    {/* UPDATING */}

                                                    {isUpdating && (
                                                        <button
                                                            type="button"
                                                            className="psd-document-updating-button"
                                                            disabled
                                                        >
                                                            Updating...
                                                        </button>
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                </section>


                {/* =================================================
                    APPLICATION TEXT
                    ================================================= */}

                {(getApplicationText("reason") ||
                    getApplicationText("purpose") ||
                    getApplicationText("statement") ||
                    getApplicationText("remarks")) && (
                    <section className="psd-section">

                        <div className="psd-section-header">

                            <div>

                                <h2>
                                    Application Details
                                </h2>

                                <p>
                                    Additional information
                                    submitted by the
                                    student.
                                </p>

                            </div>

                        </div>

                        <div className="psd-application-text">

                            {getApplicationText(
                                "reason"
                            ) && (
                                <div>

                                    <span>
                                        Reason
                                    </span>

                                    <p>
                                        {getApplicationText(
                                            "reason"
                                        )}
                                    </p>

                                </div>
                            )}

                            {getApplicationText(
                                "purpose"
                            ) && (
                                <div>

                                    <span>
                                        Purpose
                                    </span>

                                    <p>
                                        {getApplicationText(
                                            "purpose"
                                        )}
                                    </p>

                                </div>
                            )}

                            {getApplicationText(
                                "statement"
                            ) && (
                                <div>

                                    <span>
                                        Statement
                                    </span>

                                    <p>
                                        {getApplicationText(
                                            "statement"
                                        )}
                                    </p>

                                </div>
                            )}

                            {getApplicationText(
                                "remarks"
                            ) && (
                                <div>

                                    <span>
                                        Remarks
                                    </span>

                                    <p>
                                        {getApplicationText(
                                            "remarks"
                                        )}
                                    </p>

                                </div>
                            )}

                        </div>

                    </section>
                )}


                {/* =================================================
                    FOOTER
                    ================================================= */}

                <footer className="psd-footer">

                    <button
                        type="button"
                        className="psd-footer-back"
                        onClick={
                            onBackToApplications
                        }
                    >
                        ← Back to Applications
                    </button>

                    <span>
                        Application ID #
                        {application?.id ||
                            applicationId}
                    </span>

                </footer>

            </main>

        </div>
    );
};

export default ProviderStudentDetails;