import React, { useEffect, useState } from "react";
import "./ProviderManagement.css";

interface Provider {
  id: number;
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone: string;
  registrationDate: string;
  verificationStatus: "Verified" | "Pending" | "Rejected";
  accountStatus: string;
}

interface ProviderManagementProps {
  providers?: Provider[];
}

interface BackendProvider {
  id: number;
  user_id: number;
  organization_name: string;
  organization_type: string;
  organization_type_code: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  verification_status: string;
  verification_status_display: string;
  registration_date: string;
  account_status: string;
}

interface ProviderApiResponse {
  success: boolean;
  count: number;
  providers: BackendProvider[];
  message?: string;
}

const ProviderManagement: React.FC<ProviderManagementProps> = ({
  providers: initialProviders = [],
}) => {
  const [providers, setProviders] =
    useState<Provider[]>(initialProviders);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // =====================================================
  // FETCH PROVIDERS FROM BACKEND
  // =====================================================

  const fetchProviders = async () => {
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
        "http://127.0.0.1:8000/provider/api/admin/providers/",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setError(
          "Your admin session has expired. Please login again."
        );
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have permission to view provider records."
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data: ProviderApiResponse =
        await response.json();

      if (!data.success) {
        setError(
          data.message ||
            "Unable to load provider records."
        );
        setLoading(false);
        return;
      }

      // =================================================
      // CONVERT BACKEND DATA TO FRONTEND FORMAT
      // =================================================

      const formattedProviders: Provider[] =
        data.providers.map((provider) => {
          let verificationStatus:
            | "Verified"
            | "Pending"
            | "Rejected" = "Pending";

          if (
            provider.verification_status ===
            "VERIFIED"
          ) {
            verificationStatus = "Verified";
          } else if (
            provider.verification_status ===
            "REJECTED"
          ) {
            verificationStatus = "Rejected";
          } else {
            verificationStatus = "Pending";
          }

          return {
            id: provider.id,

            organizationName:
              provider.organization_name ||
              "Not Provided",

            organizationType:
              provider.organization_type ||
              "Not Provided",

            contactPerson:
              provider.contact_person ||
              "Not Provided",

            email:
              provider.email ||
              "Not Provided",

            phone:
              provider.phone ||
              "Not Provided",

            registrationDate:
              provider.registration_date ||
              "Not Available",

            verificationStatus,

            accountStatus:
              provider.account_status ||
              "Active",
          };
        });

      setProviders(formattedProviders);

    } catch (err) {
      console.error(
        "Provider Management API Error:",
        err
      );

      setError(
        "Unable to load provider records. Please check that the Django server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY PROVIDER
  // =====================================================

  const verifyProvider = async (
    providerId: number
  ) => {
    try {
      setError("");

      const token =
        localStorage.getItem("admin_token") ||
        sessionStorage.getItem("admin_token");

      if (!token) {
        setError(
          "Admin authentication token not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/providers/${providerId}/verify/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to verify provider."
        );
        return;
      }

      // Refresh provider list after successful verification
      await fetchProviders();

    } catch (err) {
      console.error(
        "Verify Provider API Error:",
        err
      );

      setError(
        "Unable to verify provider. Please check that the Django server is running."
      );
    }
  };

  // =====================================================
  // LOAD PROVIDERS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchProviders();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalProviders = providers.length;

  const pendingProviders = providers.filter(
    (provider) =>
      provider.verificationStatus ===
      "Pending"
  ).length;

  const verifiedProviders = providers.filter(
    (provider) =>
      provider.verificationStatus ===
      "Verified"
  ).length;

  const rejectedProviders = providers.filter(
    (provider) =>
      provider.verificationStatus ===
      "Rejected"
  ).length;

  // =====================================================
  // GET INITIALS
  // =====================================================

  const getInitials = (
    name: string
  ): string => {
    const words = name
      .trim()
      .split(" ");

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${words[0][0] || ""}${
      words[1][0] || ""
    }`.toUpperCase();
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="provider-management-page">

        <div className="provider-management-header">

          <div className="provider-management-header-content">

            <h1 className="provider-management-title">
              Provider Management
            </h1>

            <p className="provider-management-subtitle">
              View and monitor all scholarship providers
              registered on ScholarBridge AI.
            </p>

          </div>

        </div>

        <div className="provider-management-panel">

          <div className="provider-management-empty">

            <div className="provider-management-empty-icon">
              ⏳
            </div>

            <h3 className="provider-management-empty-title">
              Loading Providers...
            </h3>

            <p className="provider-management-empty-text">
              Fetching provider information from the
              ScholarBridge AI backend.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="provider-management-page">

        <div className="provider-management-header">

          <div className="provider-management-header-content">

            <h1 className="provider-management-title">
              Provider Management
            </h1>

            <p className="provider-management-subtitle">
              View and monitor all scholarship providers
              registered on ScholarBridge AI.
            </p>

          </div>

        </div>

        <div className="provider-management-panel">

          <div className="provider-management-empty">

            <div className="provider-management-empty-icon">
              ⚠️
            </div>

            <h3 className="provider-management-empty-title">
              Unable to Load Providers
            </h3>

            <p className="provider-management-empty-text">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProviders}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Retry
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="provider-management-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="provider-management-header">

        <div className="provider-management-header-content">

          <h1 className="provider-management-title">
            Provider Management
          </h1>

          <p className="provider-management-subtitle">
            View and monitor all scholarship providers
            registered on ScholarBridge AI.
          </p>

        </div>

      </div>

      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div className="provider-management-stats">

        {/* Total Providers */}

        <div className="provider-management-stat-card">

          <div className="provider-management-stat-top">

            <div>

              <p className="provider-management-stat-label">
                Total Providers
              </p>

              <h2 className="provider-management-stat-value">
                {totalProviders}
              </h2>

            </div>

            <div className="provider-management-stat-icon">
              🏢
            </div>

          </div>

        </div>

        {/* Pending Providers */}

        <div className="provider-management-stat-card">

          <div className="provider-management-stat-top">

            <div>

              <p className="provider-management-stat-label">
                Pending Providers
              </p>

              <h2 className="provider-management-stat-value">
                {pendingProviders}
              </h2>

            </div>

            <div className="provider-management-stat-icon">
              ⏳
            </div>

          </div>

        </div>

        {/* Verified Providers */}

        <div className="provider-management-stat-card">

          <div className="provider-management-stat-top">

            <div>

              <p className="provider-management-stat-label">
                Verified Providers
              </p>

              <h2 className="provider-management-stat-value">
                {verifiedProviders}
              </h2>

            </div>

            <div className="provider-management-stat-icon">
              ✓
            </div>

          </div>

        </div>

        {/* Rejected Providers */}

        <div className="provider-management-stat-card">

          <div className="provider-management-stat-top">

            <div>

              <p className="provider-management-stat-label">
                Rejected Providers
              </p>

              <h2 className="provider-management-stat-value">
                {rejectedProviders}
              </h2>

            </div>

            <div className="provider-management-stat-icon">
              ✕
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PROVIDER INFORMATION
          ===================================================== */}

      <div className="provider-management-panel">

        <div className="provider-management-panel-header">

          <div>

            <h2 className="provider-management-panel-heading">
              Registered Providers
            </h2>

            <p className="provider-management-panel-description">
              Provider information registered with
              ScholarBridge AI
            </p>

          </div>

        </div>

        {/* ===================================================
            PROVIDER TABLE
            =================================================== */}

        {providers.length > 0 ? (

          <div className="provider-management-table-wrapper">

            <table className="provider-management-table">

              <thead>

                <tr>

                  <th>
                    Provider
                  </th>

                  <th>
                    Organization Type
                  </th>

                  <th>
                    Contact Person
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Registration Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {providers.map(
                  (provider) => (

                    <tr
                      key={provider.id}
                    >

                      {/* Provider */}

                      <td>

                        <div className="provider-management-provider-cell">

                          <div className="provider-management-avatar">

                            {getInitials(
                              provider.organizationName
                            )}

                          </div>

                          <div className="provider-management-provider-details">

                            <p className="provider-management-provider-name">

                              {provider.organizationName}

                            </p>

                            <p className="provider-management-provider-id">

                              Provider ID: #
                              {provider.id}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Organization Type */}

                      <td>

                        <span className="provider-management-type">

                          {provider.organizationType}

                        </span>

                      </td>

                      {/* Contact Person */}

                      <td>

                        <span className="provider-management-contact">

                          {provider.contactPerson}

                        </span>

                      </td>

                      {/* Email */}

                      <td>

                        <span className="provider-management-email">

                          {provider.email}

                        </span>

                      </td>

                      {/* Phone */}

                      <td>

                        <span className="provider-management-phone">

                          {provider.phone}

                        </span>

                      </td>

                      {/* Registration Date */}

                      <td>

                        <span className="provider-management-date">

                          {provider.registrationDate}

                        </span>

                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={`provider-management-status ${
                            provider.verificationStatus ===
                            "Verified"
                              ? "provider-management-status-verified"
                              : provider.verificationStatus ===
                                "Pending"
                              ? "provider-management-status-pending"
                              : "provider-management-status-rejected"
                          }`}
                        >

                          {provider.verificationStatus}

                        </span>

                      </td>

                      {/* Action */}

                      <td>

                        {provider.verificationStatus ===
                        "Pending" ? (

                          <button
                            type="button"
                            onClick={() =>
                              verifyProvider(
                                provider.id
                              )
                            }
                            style={{
                              padding:
                                "8px 14px",
                              border:
                                "none",
                              borderRadius:
                                "8px",
                              cursor:
                                "pointer",
                              fontWeight:
                                600,
                            }}
                          >
                            Verify
                          </button>

                        ) : (

                          <span>
                            —
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

          /* =================================================
             EMPTY STATE
             ================================================= */

          <div className="provider-management-empty">

            <div className="provider-management-empty-icon">
              🏢
            </div>

            <h3 className="provider-management-empty-title">
              No Providers Found
            </h3>

            <p className="provider-management-empty-text">
              No scholarship providers are currently
              available to display.
            </p>

          </div>

        )}

      </div>

      {/* =====================================================
          INFORMATION FOOTER
          ===================================================== */}

      <div className="provider-management-info-footer">

        <div className="provider-management-info-icon">
          ℹ
        </div>

        <span>
          Provider information displayed here is
          maintained by the ScholarBridge AI
          administration system.
        </span>

      </div>

    </div>
  );
};

export default ProviderManagement;