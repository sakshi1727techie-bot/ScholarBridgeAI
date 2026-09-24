import React, { useState } from "react";
import "./ProviderCreateScholarship.css";

interface ProviderCreateScholarshipProps {
    onBack?: () => void;
    onSuccess?: () => void;
}

interface RequiredDocument {
    document_type: string;
    is_mandatory: boolean;
    description: string;
}

const ProviderCreateScholarship: React.FC<ProviderCreateScholarshipProps> = ({
    onBack,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: "",
        application_start: "",
        deadline: "",

        eligible_courses: "",
        specialization: "",
        minimum_percentage: "",
        maximum_income: "",
        category: "",
        gender: "",
        state: "",
        other_criteria: "",
    });

    const [documents, setDocuments] = useState<RequiredDocument[]>([
        {
            document_type: "AADHAAR",
            is_mandatory: true,
            description: "",
        },
    ]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDocumentChange = (
        index: number,
        field: keyof RequiredDocument,
        value: string | boolean
    ) => {
        setDocuments((prev) =>
            prev.map((doc, i) =>
                i === index
                    ? {
                          ...doc,
                          [field]: value,
                      }
                    : doc
            )
        );
    };

    const addDocument = () => {
        setDocuments((prev) => [
            ...prev,
            {
                document_type: "MARKSHEET",
                is_mandatory: true,
                description: "",
            },
        ]);
    };

    const removeDocument = (index: number) => {
        if (documents.length === 1) {
            return;
        }

        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    const getProviderToken = () => {
        return (
            localStorage.getItem("provider_token") ||
            sessionStorage.getItem("provider_token")
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!formData.title.trim()) {
            setError("Please enter scholarship title.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Please enter scholarship description.");
            return;
        }

        if (!formData.amount) {
            setError("Please enter scholarship amount.");
            return;
        }

        if (!formData.application_start) {
            setError("Please select application start date.");
            return;
        }

        if (!formData.deadline) {
            setError("Please select application deadline.");
            return;
        }

        if (
            new Date(formData.deadline) <
            new Date(formData.application_start)
        ) {
            setError(
                "Application deadline cannot be earlier than application start date."
            );
            return;
        }

        const token = getProviderToken();

        if (!token) {
            setError("Provider session expired. Please login again.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                amount: formData.amount,
                application_start: formData.application_start,
                deadline: formData.deadline,

                eligibility: {
                    eligible_courses: formData.eligible_courses.trim(),
                    specialization: formData.specialization.trim(),
                    minimum_percentage:
                        formData.minimum_percentage || null,
                    maximum_income: formData.maximum_income || null,
                    category: formData.category.trim(),
                    gender: formData.gender,
                    state: formData.state.trim(),
                    other_criteria: formData.other_criteria.trim(),
                },

                required_documents: documents,
            };

            const response = await fetch(
                "http://127.0.0.1:8000/api/scholarships/provider/create/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        data?.message ||
                        "Failed to create scholarship."
                );
            }

            setMessage(
                "Scholarship created successfully. It is now pending admin approval."
            );

            setFormData({
                title: "",
                description: "",
                amount: "",
                application_start: "",
                deadline: "",

                eligible_courses: "",
                specialization: "",
                minimum_percentage: "",
                maximum_income: "",
                category: "",
                gender: "",
                state: "",
                other_criteria: "",
            });

            setDocuments([
                {
                    document_type: "AADHAAR",
                    is_mandatory: true,
                    description: "",
                },
            ]);

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (err: any) {
            setError(
                err?.message ||
                    "Something went wrong while creating scholarship."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="provider-create-scholarship-page">

            <div className="create-scholarship-header">

                <div>
                    <button
                        type="button"
                        className="back-button"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <h1>Create Scholarship</h1>

                    <p>
                        Create and publish a new scholarship opportunity for
                        eligible students.
                    </p>
                </div>

                <div className="approval-info">
                    <span className="approval-icon">✓</span>
                    <div>
                        <strong>Admin Approval Required</strong>
                        <small>
                            Your scholarship will be visible to students
                            after approval.
                        </small>
                    </div>
                </div>

            </div>

            {message && (
                <div className="success-message">
                    ✓ {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    ⚠ {error}
                </div>
            )}

            <form
                className="create-scholarship-form"
                onSubmit={handleSubmit}
            >

                {/* SCHOLARSHIP DETAILS */}

                <section className="form-section">

                    <div className="section-heading">
                        <div className="section-number">1</div>

                        <div>
                            <h2>Scholarship Details</h2>
                            <p>
                                Provide the basic information about your
                                scholarship.
                            </p>
                        </div>
                    </div>

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label>
                                Scholarship Title
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Merit Scholarship 2026"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>
                                Description
                                <span>*</span>
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the scholarship, benefits and purpose..."
                                rows={5}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Scholarship Amount
                                <span>*</span>
                            </label>

                            <div className="input-with-symbol">
                                <span>₹</span>

                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="50000"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                Application Start Date
                                <span>*</span>
                            </label>

                            <input
                                type="date"
                                name="application_start"
                                value={formData.application_start}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Application Deadline
                                <span>*</span>
                            </label>

                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                </section>


                {/* ELIGIBILITY */}

                <section className="form-section">

                    <div className="section-heading">
                        <div className="section-number">2</div>

                        <div>
                            <h2>Eligibility Criteria</h2>
                            <p>
                                Define which students can apply for this
                                scholarship.
                            </p>
                        </div>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Eligible Courses</label>

                            <input
                                type="text"
                                name="eligible_courses"
                                value={formData.eligible_courses}
                                onChange={handleChange}
                                placeholder="B.Sc. IT, BCA, B.Tech"
                            />
                        </div>

                        <div className="form-group">
                            <label>Specialization</label>

                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="IT, Computer Science, AI"
                            />
                        </div>

                        <div className="form-group">
                            <label>Minimum Percentage</label>

                            <input
                                type="number"
                                name="minimum_percentage"
                                value={formData.minimum_percentage}
                                onChange={handleChange}
                                placeholder="60"
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label>Maximum Family Income</label>

                            <div className="input-with-symbol">
                                <span>₹</span>

                                <input
                                    type="number"
                                    name="maximum_income"
                                    value={formData.maximum_income}
                                    onChange={handleChange}
                                    placeholder="500000"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Category</label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Category
                                </option>
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                                <option value="Minority">Minority</option>
                                <option value="All">All Categories</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Gender</label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Gender
                                </option>
                                <option value="All">All</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>State</label>

                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="e.g. Maharashtra"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Other Criteria</label>

                            <textarea
                                name="other_criteria"
                                value={formData.other_criteria}
                                onChange={handleChange}
                                placeholder="Any additional eligibility requirements..."
                                rows={4}
                            />
                        </div>

                    </div>

                </section>


                {/* REQUIRED DOCUMENTS */}

                <section className="form-section">

                    <div className="section-heading">
                        <div className="section-number">3</div>

                        <div>
                            <h2>Required Documents</h2>
                            <p>
                                Select the documents students need to submit.
                            </p>
                        </div>
                    </div>

                    <div className="documents-list">

                        {documents.map((document, index) => (
                            <div
                                className="document-row"
                                key={index}
                            >

                                <div className="document-number">
                                    {index + 1}
                                </div>

                                <div className="form-group">
                                    <label>Document Type</label>

                                    <select
                                        value={document.document_type}
                                        onChange={(e) =>
                                            handleDocumentChange(
                                                index,
                                                "document_type",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="AADHAAR">
                                            Aadhaar Card
                                        </option>

                                        <option value="PAN">
                                            PAN Card
                                        </option>

                                        <option value="MARKSHEET">
                                            Marksheet
                                        </option>

                                        <option value="INCOME_CERTIFICATE">
                                            Income Certificate
                                        </option>

                                        <option value="CASTE_CERTIFICATE">
                                            Caste Certificate
                                        </option>

                                        <option value="ADMISSION_PROOF">
                                            Admission Proof
                                        </option>

                                        <option value="FEE_RECEIPT">
                                            Fee Receipt
                                        </option>

                                        <option value="BANK_PROOF">
                                            Bank Account Proof
                                        </option>

                                        <option value="OTHER">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>

                                    <input
                                        type="text"
                                        value={document.description}
                                        onChange={(e) =>
                                            handleDocumentChange(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Document details"
                                    />
                                </div>

                                <div className="mandatory-box">

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={document.is_mandatory}
                                            onChange={(e) =>
                                                handleDocumentChange(
                                                    index,
                                                    "is_mandatory",
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        Mandatory
                                    </label>

                                </div>

                                <button
                                    type="button"
                                    className="remove-document"
                                    onClick={() =>
                                        removeDocument(index)
                                    }
                                    disabled={documents.length === 1}
                                >
                                    ×
                                </button>

                            </div>
                        ))}

                    </div>

                    <button
                        type="button"
                        className="add-document-button"
                        onClick={addDocument}
                    >
                        + Add Another Document
                    </button>

                </section>


                {/* FORM ACTIONS */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onBack}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Scholarship..."
                            : "Create Scholarship"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default ProviderCreateScholarship;