import React, { useEffect, useState } from "react";
import "./MyProfile.css";

interface ProfileData {
    id?: number;
    full_name: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    state: string;
    city: string;
    course: string;
    specialization: string;
    college: string;
    academic_score: string;
    family_income: string;
    category: string;
    profile_completion: number;
}

interface MyProfileProps {
    onBack?: () => void;
}

const MyProfile: React.FC<MyProfileProps> = ({ onBack }) => {
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        state: "",
        city: "",
        course: "",
        specialization: "",
        college: "",
        academic_score: "",
        family_income: "",
        category: "",
        profile_completion: 0,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("scholarbridge_token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/student/api/profile/",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.status === 404) {
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load profile."
                );
            }

            setProfile({
                id: data.id,
                full_name: data.full_name || "",
                date_of_birth: data.date_of_birth || "",
                gender: data.gender || "",
                phone: data.phone || "",
                state: data.state || "",
                city: data.city || "",
                course: data.course || "",
                specialization: data.specialization || "",
                college: data.college || "",
                academic_score:
                    data.academic_score?.toString() || "",
                family_income:
                    data.family_income?.toString() || "",
                category: data.category || "",
                profile_completion:
                    data.profile_completion || 0,
            });
        } catch (err) {
            console.error(err);
            setError("Unable to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("scholarbridge_token");

            if (!token) {
                setError("Please login again.");
                setSaving(false);
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/student/api/profile/",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        full_name: profile.full_name,
                        date_of_birth: profile.date_of_birth,
                        gender: profile.gender,
                        phone: profile.phone,
                        state: profile.state,
                        city: profile.city,
                        course: profile.course,
                        specialization: profile.specialization,
                        college: profile.college,
                        academic_score: profile.academic_score,
                        family_income: profile.family_income,
                        category: profile.category,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update profile."
                );
            }

            setMessage("Profile updated successfully.");

            setProfile((previous) => ({
                ...previous,
                ...data.profile,
                academic_score:
                    data.profile.academic_score?.toString() || "",
                family_income:
                    data.profile.family_income?.toString() || "",
                profile_completion:
                    data.profile_completion ||
                    previous.profile_completion,
            }));
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">

                <div>
                    <h1>My Profile</h1>

                    <p>
                        Complete your profile to get better
                        scholarship recommendations.
                    </p>
                </div>

                <button
                    type="button"
                    className="profile-back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

            </div>

            <div className="profile-container">

                <div className="profile-completion-card">

                    <div className="completion-top">

                        <div>
                            <h2>Profile Completion</h2>

                            <p>
                                Keep your profile complete for
                                better scholarship matching.
                            </p>
                        </div>

                        <strong>
                            {profile.profile_completion}%
                        </strong>

                    </div>

                    <div className="completion-bar">
                        <div
                            className="completion-progress"
                            style={{
                                width: `${profile.profile_completion}%`,
                            }}
                        />
                    </div>

                </div>

                {message && (
                    <div className="profile-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="profile-error">
                        {error}
                    </div>
                )}

                <form
                    className="profile-form"
                    onSubmit={handleSubmit}
                >

                    <div className="profile-section">

                        <div className="section-heading">
                            <h2>Personal Information</h2>
                            <p>
                                Enter your basic personal details.
                            </p>
                        </div>

                        <div className="form-grid">

                            <div className="form-group full-width">
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="full_name"
                                    value={profile.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date of Birth</label>

                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={profile.date_of_birth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Gender</label>

                                <select
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="MALE">
                                        Male
                                    </option>

                                    <option value="FEMALE">
                                        Female
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>

                        </div>

                    </div>

                    <div className="profile-section">

                        <div className="section-heading">
                            <h2>Location</h2>
                            <p>
                                Enter your current location details.
                            </p>
                        </div>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>State</label>

                                <input
                                    type="text"
                                    name="state"
                                    value={profile.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>City</label>

                                <input
                                    type="text"
                                    name="city"
                                    value={profile.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    required
                                />
                            </div>

                        </div>

                    </div>

                    <div className="profile-section">

                        <div className="section-heading">
                            <h2>Academic Information</h2>
                            <p>
                                Add your current academic details.
                            </p>
                        </div>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Course</label>

                                <input
                                    type="text"
                                    name="course"
                                    value={profile.course}
                                    onChange={handleChange}
                                    placeholder="Example: B.Sc IT"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Specialization</label>

                                <input
                                    type="text"
                                    name="specialization"
                                    value={profile.specialization}
                                    onChange={handleChange}
                                    placeholder="Example: Information Technology"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>College</label>

                                <input
                                    type="text"
                                    name="college"
                                    value={profile.college}
                                    onChange={handleChange}
                                    placeholder="Enter college name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Academic Score (%)</label>

                                <input
                                    type="number"
                                    name="academic_score"
                                    value={profile.academic_score}
                                    onChange={handleChange}
                                    placeholder="Enter percentage"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    required
                                />
                            </div>

                        </div>

                    </div>

                    <div className="profile-section">

                        <div className="section-heading">
                            <h2>Financial & Category</h2>
                            <p>
                                These details help us identify
                                suitable scholarships.
                            </p>
                        </div>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Annual Family Income</label>

                                <input
                                    type="number"
                                    name="family_income"
                                    value={profile.family_income}
                                    onChange={handleChange}
                                    placeholder="Enter annual family income"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>

                                <select
                                    name="category"
                                    value={profile.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="GENERAL">
                                        General
                                    </option>

                                    <option value="OBC">
                                        OBC
                                    </option>

                                    <option value="SC">
                                        SC
                                    </option>

                                    <option value="ST">
                                        ST
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>

                        </div>

                    </div>

                    <div className="profile-actions">

                        <button
                            type="submit"
                            className="save-profile-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Profile"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default MyProfile;