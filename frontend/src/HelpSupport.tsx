import React from "react";
import "./HelpSupport.css";

interface HelpSupportProps {
  supportEmail?: string;
  supportPhone?: string;
  supportHours?: string;
}

const HelpSupport: React.FC<HelpSupportProps> = ({
  supportEmail = "support@scholarbridge.ai",
  supportPhone = "+91 00000 00000",
  supportHours = "Monday - Saturday, 10:00 AM - 6:00 PM",
}) => {
  return (
    <div className="help-support-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="help-support-header">

        <div className="help-support-header-content">

          <div className="help-support-title-row">

            <div className="help-support-title-icon">
              💬
            </div>

            <div>

              <h1 className="help-support-title">
                Help &amp; Support
              </h1>

              <p className="help-support-subtitle">
                Get assistance and find useful information for
                managing the ScholarBridge AI administration system.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SUPPORT OVERVIEW
          ===================================================== */}

      <div className="help-support-overview">

        <div className="help-support-overview-card">

          <div className="help-support-overview-icon">
            🎧
          </div>

          <div className="help-support-overview-content">

            <h2>
              Admin Support Center
            </h2>

            <p>
              Find information about the administration system,
              platform management and technical assistance.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          SUPPORT CONTACT CARDS
          ===================================================== */}

      <div className="help-support-contact-grid">

        {/* Email */}
        <div className="help-support-contact-card">

          <div className="help-support-contact-icon">
            ✉
          </div>

          <div className="help-support-contact-content">

            <p className="help-support-contact-label">
              Support Email
            </p>

            <h3 className="help-support-contact-value">
              {supportEmail}
            </h3>

            <p className="help-support-contact-description">
              Contact the ScholarBridge AI support team for
              technical or platform-related assistance.
            </p>

          </div>

        </div>

        {/* Phone */}
        <div className="help-support-contact-card">

          <div className="help-support-contact-icon">
            ☎
          </div>

          <div className="help-support-contact-content">

            <p className="help-support-contact-label">
              Support Phone
            </p>

            <h3 className="help-support-contact-value">
              {supportPhone}
            </h3>

            <p className="help-support-contact-description">
              Contact support during the official support
              working hours.
            </p>

          </div>

        </div>

        {/* Hours */}
        <div className="help-support-contact-card">

          <div className="help-support-contact-icon">
            🕐
          </div>

          <div className="help-support-contact-content">

            <p className="help-support-contact-label">
              Support Hours
            </p>

            <h3 className="help-support-contact-value">
              {supportHours}
            </h3>

            <p className="help-support-contact-description">
              Support requests are handled during the available
              administration support hours.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          COMMON ADMIN HELP
          ===================================================== */}

      <div className="help-support-panel">

        <div className="help-support-panel-header">

          <div>

            <h2 className="help-support-panel-title">
              Common Admin Help
            </h2>

            <p className="help-support-panel-description">
              Frequently used information for ScholarBridge AI
              administration.
            </p>

          </div>

        </div>

        <div className="help-support-help-list">

          {/* Student Management */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              👨‍🎓
            </div>

            <div className="help-support-help-content">

              <h3>
                Student Management
              </h3>

              <p>
                View registered student information including
                student profiles, courses, colleges and account
                status.
              </p>

            </div>

          </div>

          {/* Provider Management */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              🏢
            </div>

            <div className="help-support-help-content">

              <h3>
                Provider Management
              </h3>

              <p>
                View scholarship provider information including
                organization details and verification status.
              </p>

            </div>

          </div>

          {/* Scholarship Management */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              🎓
            </div>

            <div className="help-support-help-content">

              <h3>
                Scholarship Management
              </h3>

              <p>
                Monitor scholarships submitted by registered
                providers along with their application dates,
                deadlines and status.
              </p>

            </div>

          </div>

          {/* Application Management */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              📄
            </div>

            <div className="help-support-help-content">

              <h3>
                Application Management
              </h3>

              <p>
                Monitor scholarship applications submitted by
                students and view their current application status.
              </p>

            </div>

          </div>

          {/* Documents */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              📁
            </div>

            <div className="help-support-help-content">

              <h3>
                Document Management
              </h3>

              <p>
                View documents submitted by students and monitor
                their verification status.
              </p>

            </div>

          </div>

          {/* AI Recommendations */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              🤖
            </div>

            <div className="help-support-help-content">

              <h3>
                AI Recommendations
              </h3>

              <p>
                Monitor scholarship recommendations generated by
                the ScholarBridge AI recommendation system.
              </p>

            </div>

          </div>

          {/* Reports */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              📊
            </div>

            <div className="help-support-help-content">

              <h3>
                Reports &amp; Analytics
              </h3>

              <p>
                Review platform statistics and application
                performance information available to administrators.
              </p>

            </div>

          </div>

          {/* Notifications */}
          <div className="help-support-help-item">

            <div className="help-support-help-icon">
              🔔
            </div>

            <div className="help-support-help-content">

              <h3>
                Notifications
              </h3>

              <p>
                View notifications generated for students, providers
                and other platform activities.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          ADMIN GUIDELINES
          ===================================================== */}

      <div className="help-support-guidelines">

        <div className="help-support-guidelines-icon">
          ℹ
        </div>

        <div className="help-support-guidelines-content">

          <h3>
            Administration Guidelines
          </h3>

          <p>
            Use the administration dashboard to monitor platform
            activity and review information maintained by
            ScholarBridge AI. For technical issues or problems
            that cannot be resolved through the dashboard,
            contact the designated support team.
          </p>

        </div>

      </div>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div className="help-support-footer">

        <span>
          ScholarBridge AI Administration Support Center
        </span>

        <span>
          •
        </span>

        <span>
          Platform assistance and technical support
        </span>

      </div>

    </div>
  );
};

export default HelpSupport;