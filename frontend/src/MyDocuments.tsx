import React, {
    ChangeEvent,
    useEffect,
    useState,
} from "react";

import "./MyDocuments.css";

interface DocumentItem {
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
}

interface ApplicationItem {
    id: number;
    status?: string;
    status_display?: string;
    applied_at?: string;

    scholarship?: {
        id?: number;
        title?: string;
        description?: string;
        amount?: string | number;
    };

    scholarship_title?: string;
}

interface MyDocumentsProps {
    onBack?: () => void;
}

const DOCUMENT_TYPES = [
    {
        value: "AADHAAR",
        label: "Aadhaar Card",
    },
    {
        value: "PAN",
        label: "PAN Card",
    },
    {
        value: "MARKSHEET",
        label: "Marksheet",
    },
    {
        value: "INCOME_CERTIFICATE",
        label: "Income Certificate",
    },
    {
        value: "CASTE_CERTIFICATE",
        label: "Caste Certificate",
    },
    {
        value: "ADMISSION_PROOF",
        label: "Admission Proof",
    },
    {
        value: "FEE_RECEIPT",
        label: "Fee Receipt",
    },
    {
        value: "BANK_PROOF",
        label: "Bank Account Proof",
    },
    {
        value: "OTHER",
        label: "Other",
    },
];

const MyDocuments: React.FC<MyDocumentsProps> = ({
    onBack,
}) => {
    const [documents, setDocuments] = useState<DocumentItem[]>(
        []
    );

    const [applications, setApplications] = useState<
        ApplicationItem[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] =
        useState(true);

    const [uploading, setUploading] = useState(false);

    const [selectedApplication, setSelectedApplication] =
        useState("");

    const [selectedType, setSelectedType] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] =
        useState("");

    useEffect(() => {
        fetchDocuments();
        fetchApplications();
    }, []);

    // ========================================================
    // FETCH DOCUMENTS
    // ========================================================

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem(
                    "scholarbridge_token"
                );

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/documents/api/",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load documents."
                );
            }

            const data = await response.json();

            setDocuments(
                Array.isArray(data)
                    ? data
                    : data.documents || []
            );
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load documents."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // FETCH STUDENT APPLICATIONS
    // ========================================================

    const fetchApplications = async () => {
        try {
            setApplicationsLoading(true);

            const token =
                localStorage.getItem(
                    "scholarbridge_token"
                );

            if (!token) {
                setApplicationsLoading(false);
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/application/api/",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load applications."
                );
            }

            const data = await response.json();

            /*
             * Different API response formats are handled here.
             */

            if (Array.isArray(data)) {
                setApplications(data);
            } else if (
                Array.isArray(data.applications)
            ) {
                setApplications(
                    data.applications
                );
            } else if (
                Array.isArray(data.results)
            ) {
                setApplications(data.results);
            } else {
                setApplications([]);
            }
        } catch (err) {
            console.error(
                "Application fetch error:",
                err
            );

            setApplications([]);
        } finally {
            setApplicationsLoading(false);
        }
    };

    // ========================================================
    // FILE CHANGE
    // ========================================================

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0] || null;

        setSelectedFile(file);

        setError("");
        setSuccessMessage("");
    };

    // ========================================================
    // UPLOAD DOCUMENT
    // ========================================================

    const handleUpload = async () => {
        setError("");
        setSuccessMessage("");

        // ----------------------------------------------------
        // APPLICATION VALIDATION
        // ----------------------------------------------------

        if (!selectedApplication) {
            setError(
                "Please select a scholarship application."
            );
            return;
        }

        // ----------------------------------------------------
        // DOCUMENT TYPE VALIDATION
        // ----------------------------------------------------

        if (!selectedType) {
            setError(
                "Please select a document type."
            );
            return;
        }

        // ----------------------------------------------------
        // FILE VALIDATION
        // ----------------------------------------------------

        if (!selectedFile) {
            setError(
                "Please select a document file."
            );
            return;
        }

        // ----------------------------------------------------
        // TOKEN
        // ----------------------------------------------------

        const token =
            localStorage.getItem(
                "scholarbridge_token"
            );

        if (!token) {
            setError(
                "Please login again."
            );
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();

            // ------------------------------------------------
            // APPLICATION ID
            // ------------------------------------------------

            formData.append(
                "application_id",
                selectedApplication
            );

            // ------------------------------------------------
            // DOCUMENT TYPE
            // ------------------------------------------------

            formData.append(
                "document_type",
                selectedType
            );

            // ------------------------------------------------
            // FILE
            // ------------------------------------------------

            formData.append(
                "document",
                selectedFile
            );

            const response = await fetch(
                "http://127.0.0.1:8000/documents/api/upload/",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Token ${token}`,
                    },

                    body: formData,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Document upload failed."
                );
            }

            setSuccessMessage(
                "Document uploaded successfully."
            );

            // ------------------------------------------------
            // RESET FORM
            // ------------------------------------------------

            setSelectedApplication("");
            setSelectedType("");
            setSelectedFile(null);

            const fileInput =
                document.getElementById(
                    "document-file"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }

            // ------------------------------------------------
            // REFRESH DOCUMENTS
            // ------------------------------------------------

            await fetchDocuments();
        } catch (err) {
            console.error(err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(
                    "Unable to upload document."
                );
            }
        } finally {
            setUploading(false);
        }
    };

    // ========================================================
    // FORMAT DATE
    // ========================================================

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

    // ========================================================
    // DOCUMENT NAME
    // ========================================================

    const getDocumentName = (
        documentItem: DocumentItem
    ) => {
        return (
            documentItem.document_type_display ||
            documentItem.document_type ||
            "Uploaded Document"
        );
    };

    // ========================================================
    // APPLICATION NAME
    // ========================================================

    const getApplicationName = (
        application: ApplicationItem
    ) => {
        if (
            application.scholarship?.title
        ) {
            return application.scholarship.title;
        }

        if (
            application.scholarship_title
        ) {
            return application.scholarship_title;
        }

        return `Scholarship Application #${application.id}`;
    };

    // ========================================================
    // STATUS CLASS
    // ========================================================

    const getStatusClass = (
        status?: string
    ) => {
        switch (status) {
            case "VERIFIED":
                return "document-status verified";

            case "REJECTED":
                return "document-status rejected";

            case "PENDING":
            default:
                return "document-status pending";
        }
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="documents-page">
                <div className="documents-loading">
                    Loading documents...
                </div>
            </div>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="documents-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="documents-header">

                <div className="documents-header-content">

                    <h1>
                        My Documents
                    </h1>

                    <p>
                        View and manage your uploaded
                        scholarship documents.
                    </p>

                </div>

                <button
                    className="documents-back-button"
                    onClick={onBack}
                    type="button"
                >
                    ← Back to Dashboard
                </button>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="documents-error">
                    {error}
                </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
                <div className="documents-success">
                    {successMessage}
                </div>
            )}

            {/* ==================================================
                UPLOAD SECTION
            ================================================== */}

            <div className="documents-upload-section">

                <div className="documents-section-header">

                    <div>

                        <h2>
                            Upload New Document
                        </h2>

                        <p>
                            Select the scholarship
                            application for which
                            this document is required.
                        </p>

                    </div>

                </div>

                <div className="documents-upload-form">

                    {/* ==================================================
                        APPLICATION SELECT
                    ================================================== */}

                    <div className="document-form-group">

                        <label htmlFor="application-select">
                            Scholarship Application
                        </label>

                        <select
                            id="application-select"
                            value={
                                selectedApplication
                            }
                            onChange={(event) => {
                                setSelectedApplication(
                                    event.target.value
                                );

                                setError("");
                                setSuccessMessage("");
                            }}
                            disabled={
                                applicationsLoading ||
                                applications.length === 0
                            }
                        >

                            <option value="">
                                {applicationsLoading
                                    ? "Loading applications..."
                                    : applications.length === 0
                                    ? "No scholarship applications found"
                                    : "Select scholarship application"}
                            </option>

                            {applications.map(
                                (application) => (
                                    <option
                                        key={
                                            application.id
                                        }
                                        value={
                                            application.id
                                        }
                                    >
                                        {getApplicationName(
                                            application
                                        )}
                                        {application.status
                                            ? ` — ${application.status.replace(
                                                  "_",
                                                  " "
                                              )}`
                                            : ""}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                    {/* ==================================================
                        DOCUMENT TYPE
                    ================================================== */}

                    <div className="document-form-group">

                        <label htmlFor="document-type">
                            Document Type
                        </label>

                        <select
                            id="document-type"
                            value={selectedType}
                            onChange={(event) => {
                                setSelectedType(
                                    event.target.value
                                );

                                setError("");
                                setSuccessMessage("");
                            }}
                        >

                            <option value="">
                                Select document type
                            </option>

                            {DOCUMENT_TYPES.map(
                                (type) => (
                                    <option
                                        key={
                                            type.value
                                        }
                                        value={
                                            type.value
                                        }
                                    >
                                        {type.label}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                    {/* ==================================================
                        FILE
                    ================================================== */}

                    <div className="document-form-group">

                        <label htmlFor="document-file">
                            Choose File
                        </label>

                        <input
                            id="document-file"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={
                                handleFileChange
                            }
                        />

                        {selectedFile && (
                            <span className="selected-file-name">
                                Selected:{" "}
                                {selectedFile.name}
                            </span>
                        )}

                    </div>

                    {/* ==================================================
                        UPLOAD BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        className="document-upload-button"
                        onClick={handleUpload}
                        disabled={
                            uploading ||
                            applications.length === 0
                        }
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload Document"}
                    </button>

                </div>

            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!error &&
                documents.length === 0 && (
                    <div className="documents-empty">

                        <div className="documents-empty-icon">
                            📄
                        </div>

                        <h2>
                            No Documents Uploaded
                        </h2>

                        <p>
                            You haven't uploaded any
                            documents yet. Upload your
                            scholarship documents using
                            the section above.
                        </p>

                    </div>
                )}

            {/* ==================================================
                DOCUMENT LIST
            ================================================== */}

            {!error &&
                documents.length > 0 && (
                    <div className="documents-content">

                        <div className="documents-section-header">

                            <div>

                                <h2>
                                    Your Documents
                                </h2>

                                <p>
                                    {documents.length}{" "}
                                    document
                                    {documents.length !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    uploaded
                                </p>

                            </div>

                        </div>

                        <div className="documents-grid">

                            {documents.map(
                                (
                                    documentItem
                                ) => (
                                    <div
                                        className="document-card"
                                        key={
                                            documentItem.id
                                        }
                                    >

                                        <div className="document-card-top">

                                            <div className="document-icon">
                                                📄
                                            </div>

                                            <span
                                                className={getStatusClass(
                                                    documentItem.verification_status
                                                )}
                                            >
                                                {documentItem.verification_status_display ||
                                                    documentItem.verification_status ||
                                                    "Pending"}
                                            </span>

                                        </div>

                                        <h3>
                                            {getDocumentName(
                                                documentItem
                                            )}
                                        </h3>

                                        {/* ==================================================
                                            SCHOLARSHIP
                                        ================================================== */}

                                        {documentItem.scholarship_title && (
                                            <div className="document-details">

                                                <div className="document-detail">

                                                    <span>
                                                        Scholarship
                                                    </span>

                                                    <strong>
                                                        {
                                                            documentItem.scholarship_title
                                                        }
                                                    </strong>

                                                </div>

                                            </div>
                                        )}

                                        {/* ==================================================
                                            APPLICATION ID
                                        ================================================== */}

                                        {documentItem.application_id && (
                                            <div className="document-details">

                                                <div className="document-detail">

                                                    <span>
                                                        Application ID
                                                    </span>

                                                    <strong>
                                                        #
                                                        {
                                                            documentItem.application_id
                                                        }
                                                    </strong>

                                                </div>

                                            </div>
                                        )}

                                        {/* ==================================================
                                            UPLOADED DATE
                                        ================================================== */}

                                        <div className="document-details">

                                            <div className="document-detail">

                                                <span>
                                                    Uploaded On
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        documentItem.uploaded_at
                                                    )}
                                                </strong>

                                            </div>

                                        </div>

                                        {/* ==================================================
                                            VIEW DOCUMENT
                                        ================================================== */}

                                        {documentItem.document_url && (
                                            <a
                                                href={
                                                    documentItem.document_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="document-view-button"
                                            >
                                                View Document
                                            </a>
                                        )}

                                    </div>
                                )
                            )}

                        </div>

                    </div>
                )}

        </div>
    );
};

export default MyDocuments;