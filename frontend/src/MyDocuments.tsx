import React, { useEffect, useState } from "react";
import "./MyDocuments.css";

interface DocumentItem {
    id: number;
    document_type?: string;
    title?: string;
    file?: string;
    uploaded_at?: string;
}

interface MyDocumentsProps {
    onBack?: () => void;
}

const MyDocuments: React.FC<MyDocumentsProps> = ({
    onBack,
}) => {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem("scholarbridge_token");

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
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load documents.");
            }

            const data = await response.json();

            setDocuments(
                Array.isArray(data)
                    ? data
                    : data.documents || []
            );

        } catch (err) {
            console.error(err);
            setError("Unable to load documents.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getDocumentName = (document: DocumentItem) => {
        return (
            document.document_type ||
            document.title ||
            "Uploaded Document"
        );
    };

    if (loading) {
        return (
            <div className="documents-page">
                <div className="documents-loading">
                    Loading documents...
                </div>
            </div>
        );
    }

    return (
        <div className="documents-page">

            {/* Header */}

            <div className="documents-header">

                <div className="documents-header-content">

                    <h1>My Documents</h1>

                    <p>
                        View and manage your uploaded scholarship
                        documents.
                    </p>

                </div>

                <button
                    className="documents-back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

            </div>


            {/* Error */}

            {error && (
                <div className="documents-error">
                    {error}
                </div>
            )}


            {/* Empty State */}

            {!error && documents.length === 0 && (
                <div className="documents-empty">

                    <div className="documents-empty-icon">
                        📄
                    </div>

                    <h2>No Documents Uploaded</h2>

                    <p>
                        You haven't uploaded any documents yet.
                        Your scholarship documents will appear here.
                    </p>

                </div>
            )}


            {/* Documents */}

            {!error && documents.length > 0 && (

                <div className="documents-content">

                    <div className="documents-section-header">

                        <div>
                            <h2>Your Documents</h2>

                            <p>
                                {documents.length} document
                                {documents.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                uploaded
                            </p>
                        </div>

                    </div>


                    <div className="documents-grid">

                        {documents.map((document) => (

                            <div
                                className="document-card"
                                key={document.id}
                            >

                                <div className="document-card-top">

                                    <div className="document-icon">
                                        📄
                                    </div>

                                    <span className="document-status">
                                        UPLOADED
                                    </span>

                                </div>


                                <h3>
                                    {getDocumentName(document)}
                                </h3>


                                <div className="document-details">

                                    <div className="document-detail">

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


                                {document.file && (
                                    <a
                                        href={document.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="document-view-button"
                                    >
                                        View Document
                                    </a>
                                )}

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
};

export default MyDocuments;