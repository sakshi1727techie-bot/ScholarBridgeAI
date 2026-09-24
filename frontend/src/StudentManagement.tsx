import React, { useEffect, useState } from "react";
import "./StudentManagement.css";

interface Student {
  id: number;
  fullName: string;
  email: string;
  course: string;
  college: string;
  category: string;
  registrationDate: string;
  accountStatus: "Active" | "Inactive" | "Pending";
}

interface BackendStudent {
  id: number;
  full_name: string;
  email: string;
  course: string;
  college: string;
  category: string;
  registration_date: string;
  account_status: "Active" | "Inactive" | "Pending";
  profile_completion: number;
  user_id: number;
}

interface StudentManagementApiResponse {
  count: number;
  students: BackendStudent[];
}

interface StudentManagementProps {
  students?: Student[];
}

const StudentManagement: React.FC<StudentManagementProps> = ({
  students: initialStudents = [],
}) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ==========================================
  // FETCH STUDENTS FROM BACKEND
  // ==========================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("admin_token") ||
        sessionStorage.getItem("admin_token");

      if (!token) {
        setError(
          "Admin authentication token not found. Please login again."
        );
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/student/api/admin/students/",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your admin session has expired. Please login again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You do not have permission to view student records."
          );
        }

        throw new Error(
          `Failed to load student records. Server returned ${response.status}.`
        );
      }

      const data: StudentManagementApiResponse =
        await response.json();

      if (!data || !Array.isArray(data.students)) {
        throw new Error(
          "Invalid student data received from the server."
        );
      }

      const formattedStudents: Student[] = data.students.map(
        (student) => ({
          id: student.id,
          fullName: student.full_name || "Not Provided",
          email: student.email || "Not Provided",
          course: student.course || "Not Provided",
          college: student.college || "Not Provided",
          category: student.category || "Not Provided",
          registrationDate:
            student.registration_date || "Not Available",
          accountStatus:
            student.account_status || "Pending",
        })
      );

      setStudents(formattedStudents);
    } catch (err) {
      console.error(
        "Student Management API Error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to load student records. Please try again."
        );
      }

      // Keep existing prop data if backend request fails
      if (initialStudents.length > 0) {
        setStudents(initialStudents);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD STUDENTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) =>
      student.accountStatus === "Active"
  ).length;

  const pendingStudents = students.filter(
    (student) =>
      student.accountStatus === "Pending"
  ).length;

  const inactiveStudents = students.filter(
    (student) =>
      student.accountStatus === "Inactive"
  ).length;

  // ==========================================
  // GET STUDENT INITIALS
  // ==========================================

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);

    if (words.length === 0 || !words[0]) {
      return "ST";
    }

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${words[0][0] || ""}${
      words[1][0] || ""
    }`.toUpperCase();
  };

  // ==========================================
  // STATUS CSS CLASS
  // ==========================================

  const getStatusClass = (
    status: Student["accountStatus"]
  ): string => {
    switch (status) {
      case "Active":
        return "student-status-active";

      case "Inactive":
        return "student-status-inactive";

      case "Pending":
        return "student-status-pending";

      default:
        return "";
    }
  };

  return (
    <div className="student-management-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="student-management-header">
        <div className="student-management-header-content">
          <div>
            <h1 className="student-management-title">
              Student Management
            </h1>

            <p className="student-management-subtitle">
              View and monitor all students registered
              on ScholarBridge AI.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          LOADING MESSAGE
      ========================================== */}

      {loading && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#eef4ff",
            color: "#3158a8",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Loading student records...
        </div>
      )}

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {!loading && error && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fff1f1",
            color: "#c62828",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchStudents}
            style={{
              border: "none",
              borderRadius: "7px",
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              background: "#c62828",
              color: "#ffffff",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ==========================================
          STATISTICS
      ========================================== */}

      <div className="student-management-stats">

        {/* Total Students */}

        <div className="student-stat-card">
          <div className="student-stat-icon student-stat-icon-total">
            👨‍🎓
          </div>

          <div className="student-stat-content">
            <span className="student-stat-label">
              Total Students
            </span>

            <strong className="student-stat-value">
              {totalStudents}
            </strong>

            <span className="student-stat-description">
              Registered students
            </span>
          </div>
        </div>

        {/* Active Students */}

        <div className="student-stat-card">
          <div className="student-stat-icon student-stat-icon-active">
            ✓
          </div>

          <div className="student-stat-content">
            <span className="student-stat-label">
              Active Students
            </span>

            <strong className="student-stat-value">
              {activeStudents}
            </strong>

            <span className="student-stat-description">
              Active accounts
            </span>
          </div>
        </div>

        {/* Pending Students */}

        <div className="student-stat-card">
          <div className="student-stat-icon student-stat-icon-pending">
            ⏳
          </div>

          <div className="student-stat-content">
            <span className="student-stat-label">
              Pending Profiles
            </span>

            <strong className="student-stat-value">
              {pendingStudents}
            </strong>

            <span className="student-stat-description">
              Incomplete profiles
            </span>
          </div>
        </div>

        {/* Inactive Students */}

        <div className="student-stat-card">
          <div className="student-stat-icon student-stat-icon-inactive">
            ●
          </div>

          <div className="student-stat-content">
            <span className="student-stat-label">
              Inactive Students
            </span>

            <strong className="student-stat-value">
              {inactiveStudents}
            </strong>

            <span className="student-stat-description">
              Inactive accounts
            </span>
          </div>
        </div>

      </div>

      {/* ==========================================
          STUDENTS TABLE
      ========================================== */}

      <div className="student-management-panel">

        <div className="student-management-panel-header">

          <div>
            <h2>Registered Students</h2>

            <p>
              Student information registered on the
              ScholarBridge AI platform.
            </p>
          </div>

          <div className="student-management-count">
            {totalStudents}{" "}
            {totalStudents === 1
              ? "Student"
              : "Students"}
          </div>

        </div>

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {!loading && students.length === 0 ? (
          <div className="student-management-empty">

            <div className="student-empty-icon">
              👨‍🎓
            </div>

            <h3>No Student Data Available</h3>

            <p>
              Student records will appear here when
              students register on the ScholarBridge AI
              platform.
            </p>

          </div>
        ) : (

          /* ==========================================
             TABLE
          ========================================== */

          <div className="student-table-wrapper">

            <table className="student-management-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>College</th>
                  <th>Category</th>
                  <th>Registration Date</th>
                  <th>Account Status</th>
                </tr>
              </thead>

              <tbody>

                {students.map((student) => (

                  <tr key={student.id}>

                    {/* Student */}

                    <td>

                      <div className="student-name-cell">

                        <div className="student-avatar">
                          {getInitials(
                            student.fullName
                          )}
                        </div>

                        <div className="student-name-details">

                          <strong>
                            {student.fullName}
                          </strong>

                          <span>
                            Student ID: #
                            {student.id}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* Email */}

                    <td>

                      <span className="student-email">
                        {student.email}
                      </span>

                    </td>

                    {/* Course */}

                    <td>

                      <span className="student-course">
                        {student.course}
                      </span>

                    </td>

                    {/* College */}

                    <td>

                      <span className="student-college">
                        {student.college}
                      </span>

                    </td>

                    {/* Category */}

                    <td>

                      <span className="student-category">
                        {student.category}
                      </span>

                    </td>

                    {/* Registration Date */}

                    <td>

                      <span className="student-registration-date">
                        {student.registrationDate}
                      </span>

                    </td>

                    {/* Account Status */}

                    <td>

                      <span
                        className={`student-status-badge ${getStatusClass(
                          student.accountStatus
                        )}`}
                      >

                        <span className="student-status-dot">
                          ●
                        </span>

                        {student.accountStatus}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ==========================================
          INFORMATION FOOTER
      ========================================== */}

      <div className="student-management-info-footer">

        <div className="student-management-info-icon">
          ℹ
        </div>

        <div>

          <strong>
            Student Information
          </strong>

          <span>
            Student information displayed here is
            maintained by the ScholarBridge AI
            administration system.
          </span>

        </div>

      </div>

    </div>
  );
};

export default StudentManagement;