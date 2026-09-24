import React, { useEffect, useState } from "react";
import "./AdminSettings.css";

interface AdminSettingsData {
  id?: number;
  language: string;
  timezone: string;
  items_per_page: number;
  email_notifications: boolean;
  application_notifications: boolean;
  provider_notifications: boolean;
  scholarship_notifications: boolean;
  two_factor_auth: boolean;
  maintenance_mode: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SettingsResponse {
  success: boolean;
  settings?: AdminSettingsData;
  message?: string;
}

interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

const SETTINGS_API =
  "http://127.0.0.1:8000/api/admin/settings/";

const RESET_SETTINGS_API =
  "http://127.0.0.1:8000/api/admin/settings/reset/";

const CHANGE_PASSWORD_API =
  "http://127.0.0.1:8000/api/accounts/admin-change-password/";

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettingsData>({
    language: "English",
    timezone: "Asia/Kolkata",
    items_per_page: 10,
    email_notifications: true,
    application_notifications: true,
    provider_notifications: true,
    scholarship_notifications: true,
    two_factor_auth: false,
    maintenance_mode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("success");

  // =====================================================
  // CHANGE PASSWORD STATES
  // =====================================================

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = (): string | null => {
    return (
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token")
    );
  };

  // =====================================================
  // SHOW MESSAGE
  // =====================================================

  const showMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  const loadSettings = async () => {
    const token = getAdminToken();

    if (!token) {
      setLoading(false);
      showMessage(
        "Administrator authentication token was not found.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch(SETTINGS_API, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.success) {
        showMessage(
          data.message || "Unable to load administrator settings.",
          "error"
        );
        return;
      }

      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Admin settings load error:", error);

      showMessage(
        "Unable to connect to the server. Please make sure the Django backend is running.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // =====================================================
  // HANDLE SETTING CHANGE
  // =====================================================

  const updateSetting = <
    K extends keyof AdminSettingsData
  >(
    key: K,
    value: AdminSettingsData[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = async () => {
    const token = getAdminToken();

    if (!token) {
      showMessage(
        "Administrator authentication token was not found.",
        "error"
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(SETTINGS_API, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: settings.language,
          timezone: settings.timezone,
          items_per_page: settings.items_per_page,
          email_notifications:
            settings.email_notifications,
          application_notifications:
            settings.application_notifications,
          provider_notifications:
            settings.provider_notifications,
          scholarship_notifications:
            settings.scholarship_notifications,
          two_factor_auth: settings.two_factor_auth,
          maintenance_mode: settings.maintenance_mode,
        }),
      });

      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.success) {
        showMessage(
          data.message || "Unable to save settings.",
          "error"
        );
        return;
      }

      if (data.settings) {
        setSettings(data.settings);
      }

      showMessage(
        data.message ||
          "Administrator settings saved successfully.",
        "success"
      );
    } catch (error) {
      console.error("Admin settings save error:", error);

      showMessage(
        "Unable to connect to the server.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET SETTINGS
  // =====================================================

  const handleResetSettings = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all administrator settings to their default values?"
    );

    if (!confirmed) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      showMessage(
        "Administrator authentication token was not found.",
        "error"
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(RESET_SETTINGS_API, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.success) {
        showMessage(
          data.message || "Unable to reset settings.",
          "error"
        );
        return;
      }

      if (data.settings) {
        setSettings(data.settings);
      }

      showMessage(
        data.message ||
          "Administrator settings have been reset successfully.",
        "success"
      );
    } catch (error) {
      console.error("Admin settings reset error:", error);

      showMessage(
        "Unable to connect to the server.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD MODAL
  // =====================================================

  const openChangePasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setPasswordMessage("");
    setShowPasswordModal(true);
  };

  const closeChangePasswordModal = () => {
    if (passwordSaving) {
      return;
    }

    setShowPasswordModal(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordMessage("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // =====================================================
  // CHANGE PASSWORD API
  // =====================================================

  const handleChangePassword = async () => {
    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordMessage(
        "Current password is required."
      );
      return;
    }

    if (!newPassword) {
      setPasswordMessage(
        "New password is required."
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordMessage(
        "Confirm password is required."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage(
        "New password must be different from the current password."
      );
      return;
    }

    const token = getAdminToken();

    if (!token) {
      setPasswordMessage(
        "Administrator authentication token was not found."
      );
      return;
    }

    setPasswordSaving(true);

    try {
      const response = await fetch(
        CHANGE_PASSWORD_API,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data: PasswordChangeResponse =
        await response.json();

      if (!response.ok || !data.success) {
        setPasswordMessage(
          data.message ||
            "Unable to change administrator password."
        );
        return;
      }

      setShowPasswordModal(false);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      showMessage(
        data.message ||
          "Administrator password changed successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Admin password change error:",
        error
      );

      setPasswordMessage(
        "Unable to connect to the server. Please make sure the Django backend is running."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="admin-settings-page">
        <div className="admin-settings-loading">
          <div className="admin-settings-spinner" />
          <p>Loading administrator settings...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="admin-settings-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-settings-header">

        <div>
          <div className="admin-settings-eyebrow">
            ADMINISTRATION
          </div>

          <h1>Settings</h1>

          <p>
            Manage administrator preferences,
            notifications, security and platform settings.
          </p>
        </div>

        <div className="admin-settings-header-actions">

          <button
            type="button"
            className="admin-settings-reset-button"
            onClick={handleResetSettings}
            disabled={saving}
          >
            Reset to Defaults
          </button>

          <button
            type="button"
            className="admin-settings-save-button"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>

      {/* =====================================================
          GLOBAL MESSAGE
      ===================================================== */}

      {message && (
        <div
          className={`admin-settings-message ${
            messageType === "success"
              ? "admin-settings-message-success"
              : "admin-settings-message-error"
          }`}
        >
          <span>
            {messageType === "success"
              ? "✓"
              : "!"}
          </span>

          <span>{message}</span>
        </div>
      )}

      {/* =====================================================
          SETTINGS CONTENT
      ===================================================== */}

      <div className="admin-settings-content">

        {/* =====================================================
            GENERAL SETTINGS
        ===================================================== */}

        <section className="admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-card-icon">
              ⚙
            </div>

            <div>
              <h2>General Settings</h2>

              <p>
                Configure basic administrator and
                platform preferences.
              </p>
            </div>

          </div>

          <div className="admin-settings-grid">

            {/* LANGUAGE */}

            <div className="admin-settings-field">

              <label htmlFor="admin-language">
                Language
              </label>

              <select
                id="admin-language"
                value={settings.language}
                onChange={(event) =>
                  updateSetting(
                    "language",
                    event.target.value
                  )
                }
              >
                <option value="English">
                  English
                </option>

                <option value="Hindi">
                  Hindi
                </option>

                <option value="Marathi">
                  Marathi
                </option>
              </select>

            </div>

            {/* TIMEZONE */}

            <div className="admin-settings-field">

              <label htmlFor="admin-timezone">
                Timezone
              </label>

              <select
                id="admin-timezone"
                value={settings.timezone}
                onChange={(event) =>
                  updateSetting(
                    "timezone",
                    event.target.value
                  )
                }
              >
                <option value="Asia/Kolkata">
                  Asia/Kolkata (IST)
                </option>

                <option value="UTC">
                  UTC
                </option>

                <option value="Asia/Dubai">
                  Asia/Dubai
                </option>

                <option value="Asia/Singapore">
                  Asia/Singapore
                </option>
              </select>

            </div>

            {/* ITEMS PER PAGE */}

            <div className="admin-settings-field">

              <label htmlFor="admin-items-per-page">
                Items per page
              </label>

              <select
                id="admin-items-per-page"
                value={settings.items_per_page}
                onChange={(event) =>
                  updateSetting(
                    "items_per_page",
                    Number(event.target.value)
                  )
                }
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

            </div>

          </div>

        </section>

        {/* =====================================================
            NOTIFICATION SETTINGS
        ===================================================== */}

        <section className="admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-card-icon">
              🔔
            </div>

            <div>
              <h2>Notification Settings</h2>

              <p>
                Choose which administrator notifications
                should be enabled.
              </p>
            </div>

          </div>

          <div className="admin-settings-options">

            {/* EMAIL NOTIFICATIONS */}

            <label className="admin-settings-toggle-row">

              <div className="admin-settings-toggle-info">

                <strong>
                  Email Notifications
                </strong>

                <span>
                  Receive important platform
                  notifications by email.
                </span>

              </div>

              <span className="admin-settings-switch">

                <input
                  type="checkbox"
                  checked={
                    settings.email_notifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "email_notifications",
                      event.target.checked
                    )
                  }
                />

                <span className="admin-settings-slider" />

              </span>

            </label>

            {/* APPLICATION NOTIFICATIONS */}

            <label className="admin-settings-toggle-row">

              <div className="admin-settings-toggle-info">

                <strong>
                  Application Notifications
                </strong>

                <span>
                  Get notified about important
                  scholarship application activity.
                </span>

              </div>

              <span className="admin-settings-switch">

                <input
                  type="checkbox"
                  checked={
                    settings.application_notifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "application_notifications",
                      event.target.checked
                    )
                  }
                />

                <span className="admin-settings-slider" />

              </span>

            </label>

            {/* PROVIDER NOTIFICATIONS */}

            <label className="admin-settings-toggle-row">

              <div className="admin-settings-toggle-info">

                <strong>
                  Provider Notifications
                </strong>

                <span>
                  Receive notifications related
                  to scholarship providers.
                </span>

              </div>

              <span className="admin-settings-switch">

                <input
                  type="checkbox"
                  checked={
                    settings.provider_notifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "provider_notifications",
                      event.target.checked
                    )
                  }
                />

                <span className="admin-settings-slider" />

              </span>

            </label>

            {/* SCHOLARSHIP NOTIFICATIONS */}

            <label className="admin-settings-toggle-row">

              <div className="admin-settings-toggle-info">

                <strong>
                  Scholarship Notifications
                </strong>

                <span>
                  Receive notifications about
                  scholarship listing activity.
                </span>

              </div>

              <span className="admin-settings-switch">

                <input
                  type="checkbox"
                  checked={
                    settings.scholarship_notifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "scholarship_notifications",
                      event.target.checked
                    )
                  }
                />

                <span className="admin-settings-slider" />

              </span>

            </label>

          </div>

        </section>

        {/* =====================================================
            SECURITY SETTINGS
        ===================================================== */}

        <section className="admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-card-icon">
              🔐
            </div>

            <div>
              <h2>Security Settings</h2>

              <p>
                Manage administrator account security
                and authentication preferences.
              </p>
            </div>

          </div>

          <div className="admin-settings-security-list">

            {/* CHANGE PASSWORD */}

            <div className="admin-settings-security-row">

              <div className="admin-settings-security-info">

                <div className="admin-settings-security-title">
                  Change Password
                </div>

                <div className="admin-settings-security-description">
                  Update your administrator account
                  password securely.
                </div>

              </div>

              <button
                type="button"
                className="admin-settings-secondary-button"
                onClick={openChangePasswordModal}
              >
                Change Password
              </button>

            </div>

            {/* TWO FACTOR AUTHENTICATION */}

            <div className="admin-settings-security-row">

              <div className="admin-settings-security-info">

                <div className="admin-settings-security-title">
                  Two-Factor Authentication
                </div>

                <div className="admin-settings-security-description">
                  Add an additional authentication
                  layer to your administrator account.
                </div>

              </div>

              <label className="admin-settings-switch">

                <input
                  type="checkbox"
                  checked={settings.two_factor_auth}
                  onChange={(event) =>
                    updateSetting(
                      "two_factor_auth",
                      event.target.checked
                    )
                  }
                />

                <span className="admin-settings-slider" />

              </label>

            </div>

          </div>

        </section>

        {/* =====================================================
            PLATFORM SETTINGS
        ===================================================== */}

        <section className="admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-card-icon">
              🛠
            </div>

            <div>
              <h2>Platform Settings</h2>

              <p>
                Control important ScholarBridge AI
                platform operations.
              </p>
            </div>

          </div>

          <div className="admin-settings-security-list">

            <div className="admin-settings-security-row">

              <div className="admin-settings-security-info">

                <div className="admin-settings-security-title">
                  Maintenance Mode
                </div>

                <div className="admin-settings-security-description">
                  Temporarily restrict platform access
                  while maintenance is being performed.
                </div>

              </div>

              <label className="admin-settings-switch">

                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(event) =>
                    updateSetting(
                      "maintenance_mode",
                      event.target.checked
                    )
                  }
                />

                <span className="admin-settings-slider" />

              </label>

            </div>

          </div>

        </section>

      </div>

      {/* =====================================================
          CHANGE PASSWORD MODAL
      ===================================================== */}

      {showPasswordModal && (
        <div
          className="admin-password-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !passwordSaving
            ) {
              closeChangePasswordModal();
            }
          }}
        >

          <div
            className="admin-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
          >

            {/* MODAL HEADER */}

            <div className="admin-password-modal-header">

              <div>

                <h2 id="change-password-title">
                  Change Administrator Password
                </h2>

                <p>
                  Enter your current password and
                  choose a new secure password.
                </p>

              </div>

              <button
                type="button"
                className="admin-password-modal-close"
                onClick={closeChangePasswordModal}
                disabled={passwordSaving}
                aria-label="Close change password dialog"
              >
                ×
              </button>

            </div>

            {/* PASSWORD MESSAGE */}

            {passwordMessage && (
              <div
                className="admin-password-message"
                role="alert"
              >
                <span>!</span>

                <span>
                  {passwordMessage}
                </span>
              </div>
            )}

            {/* CURRENT PASSWORD */}

            <div className="admin-password-field">

              <label htmlFor="current-admin-password">
                Current Password
              </label>

              <div className="admin-password-input-wrapper">

                <input
                  id="current-admin-password"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(
                      event.target.value
                    );

                    if (passwordMessage) {
                      setPasswordMessage("");
                    }
                  }}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  disabled={passwordSaving}
                />

                <button
                  type="button"
                  className="admin-password-eye-button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={passwordSaving}
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>

            {/* NEW PASSWORD */}

            <div className="admin-password-field">

              <label htmlFor="new-admin-password">
                New Password
              </label>

              <div className="admin-password-input-wrapper">

                <input
                  id="new-admin-password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(
                      event.target.value
                    );

                    if (passwordMessage) {
                      setPasswordMessage("");
                    }
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={passwordSaving}
                />

                <button
                  type="button"
                  className="admin-password-eye-button"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={passwordSaving}
                  aria-label={
                    showNewPassword
                      ? "Hide new password"
                      : "Show new password"
                  }
                >
                  {showNewPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

              <span className="admin-password-help">
                Password must contain at least 6
                characters.
              </span>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="admin-password-field">

              <label htmlFor="confirm-admin-password">
                Confirm New Password
              </label>

              <div className="admin-password-input-wrapper">

                <input
                  id="confirm-admin-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(
                      event.target.value
                    );

                    if (passwordMessage) {
                      setPasswordMessage("");
                    }
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={passwordSaving}
                />

                <button
                  type="button"
                  className="admin-password-eye-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={passwordSaving}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="admin-password-modal-actions">

              <button
                type="button"
                className="admin-password-cancel-button"
                onClick={closeChangePasswordModal}
                disabled={passwordSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-password-save-button"
                onClick={handleChangePassword}
                disabled={passwordSaving}
              >
                {passwordSaving
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminSettings;