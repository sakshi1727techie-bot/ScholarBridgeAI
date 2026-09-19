import React, { useState } from "react";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Statistics } from "./components/Statistics";
import { Features } from "./components/Features";
import { WhyScholarBridge } from "./components/WhyScholarBridge";
import { HowItWorks } from "./components/HowItWorks";
import { Testimonials } from "./components/Testimonials";
import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import { Modal } from "./components/Modal";

import ChooseRole, { type Role } from "./ChooseRole";
import StudentLogin from "./StudentLogin";
import StudentRegister from "./StudentRegister";
import StudentForgotPassword from "./StudentForgotPassword";
import StudentDashboard from "./StudentDashboard";
import FindScholarships from "./FindScholarships";
import ScholarshipDetails from "./ScholarshipDetails";
import AIRecommendations from "./AIRecommendations";
import MyApplications from "./MyApplications";
import SavedScholarships from "./SavedScholarships";
import Notifications from "./Notifications";
import MyDocuments from "./MyDocuments";
import MyProfile from "./MyProfile";

export default function App() {

  const [modalOpen, setModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<
    "auth" | "explore" | "feature"
  >("auth");

  const [featureTitle, setFeatureTitle] = useState("");

  const [showChooseRole, setShowChooseRole] = useState(false);

  const [showStudentLogin, setShowStudentLogin] =
    useState(false);

  const [showStudentRegister, setShowStudentRegister] =
    useState(false);

  const [showStudentForgotPassword, setShowStudentForgotPassword] =
    useState(false);

  const [showStudentDashboard, setShowStudentDashboard] =
    useState(false);

  const [showFindScholarships, setShowFindScholarships] =
    useState(false);

  const [showScholarshipDetails, setShowScholarshipDetails] =
    useState(false);

  const [showAIRecommendations, setShowAIRecommendations] =
    useState(false);

  const [showMyApplications, setShowMyApplications] =
    useState(false);

  const [showSavedScholarships, setShowSavedScholarships] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showMyDocuments, setShowMyDocuments] =
    useState(false);

  const [showMyProfile, setShowMyProfile] =
    useState(false);

  const [selectedScholarshipId, setSelectedScholarshipId] =
    useState<number | null>(null);


  // =========================
  // OPEN CHOOSE ROLE
  // =========================

  const openChooseRole = () => {

    setModalOpen(false);

    setShowChooseRole(true);

    setShowStudentLogin(false);
    setShowStudentRegister(false);
    setShowStudentForgotPassword(false);
    setShowStudentDashboard(false);
    setShowFindScholarships(false);
    setShowScholarshipDetails(false);
    setShowAIRecommendations(false);
    setShowMyApplications(false);
    setShowSavedScholarships(false);
    setShowNotifications(false);
    setShowMyDocuments(false);
    setShowMyProfile(false);

    setSelectedScholarshipId(null);
  };


  // =========================
  // EXPLORE MODAL
  // =========================

  const openExploreModal = () => {

    setModalMode("explore");

    setFeatureTitle("");

    setModalOpen(true);
  };


  // =========================
  // FEATURE MODAL
  // =========================

  const openFeatureModal = (title: string) => {

    setModalMode("feature");

    setFeatureTitle(title);

    setModalOpen(true);
  };


  // =========================
  // ROLE SELECT
  // =========================

  const handleRoleSelect = (role: Role) => {

    console.log("Selected role:", role);

    if (role === "student") {

      setShowChooseRole(false);

      setShowStudentLogin(true);

      setShowStudentRegister(false);
      setShowStudentForgotPassword(false);
      setShowStudentDashboard(false);
      setShowFindScholarships(false);
      setShowScholarshipDetails(false);
      setShowAIRecommendations(false);
      setShowMyApplications(false);
      setShowSavedScholarships(false);
      setShowNotifications(false);
      setShowMyDocuments(false);
      setShowMyProfile(false);

      setSelectedScholarshipId(null);
    }
  };


  // =========================
  // FORGOT PASSWORD
  // =========================

  if (showStudentForgotPassword) {

    return (
      <StudentForgotPassword
        onBackToLogin={() => {

          setShowStudentForgotPassword(false);

          setShowStudentLogin(true);
        }}
      />
    );
  }


  // =========================
  // STUDENT REGISTER
  // =========================

  if (showStudentRegister) {

    return (
      <StudentRegister
        onBackToLogin={() => {

          setShowStudentRegister(false);

          setShowStudentLogin(true);
        }}
      />
    );
  }


  // =========================
  // STUDENT LOGIN
  // =========================

  if (showStudentLogin) {

    return (
      <StudentLogin

        onCreateAccount={() => {

          setShowStudentLogin(false);

          setShowStudentRegister(true);
        }}

        onForgotPassword={() => {

          setShowStudentLogin(false);

          setShowStudentForgotPassword(true);
        }}

        onLoginSuccess={() => {

          setShowStudentLogin(false);

          setShowStudentDashboard(true);

          setShowFindScholarships(false);
          setShowScholarshipDetails(false);
          setShowAIRecommendations(false);
          setShowMyApplications(false);
          setShowSavedScholarships(false);
          setShowNotifications(false);
          setShowMyDocuments(false);
          setShowMyProfile(false);
        }}

      />
    );
  }


  // =========================
  // SCHOLARSHIP DETAILS
  // =========================

  if (
    showScholarshipDetails &&
    selectedScholarshipId !== null
  ) {

    return (
      <ScholarshipDetails

        scholarshipId={selectedScholarshipId}

        onBack={() => {

          setShowScholarshipDetails(false);

          setShowFindScholarships(true);
        }}

      />
    );
  }


  // =========================
  // FIND SCHOLARSHIPS
  // =========================

  if (showFindScholarships) {

    return (
      <FindScholarships

        onBack={() => {

          setShowFindScholarships(false);

          setShowStudentDashboard(true);
        }}

        onViewDetails={(scholarshipId) => {

          setSelectedScholarshipId(scholarshipId);

          setShowFindScholarships(false);

          setShowScholarshipDetails(true);
        }}

      />
    );
  }


  // =========================
  // AI RECOMMENDATIONS
  // =========================

  if (showAIRecommendations) {

    return (
      <AIRecommendations

        onBack={() => {

          setShowAIRecommendations(false);

          setShowStudentDashboard(true);
        }}

      />
    );
  }


  // =========================
  // MY APPLICATIONS
  // =========================

  if (showMyApplications) {

    return (
      <MyApplications

        onBack={() => {

          setShowMyApplications(false);

          setShowStudentDashboard(true);
        }}

      />
    );
  }


  // =========================
  // SAVED SCHOLARSHIPS
  // =========================

  if (showSavedScholarships) {

    return (
      <SavedScholarships

        onBack={() => {

          setShowSavedScholarships(false);

          setShowStudentDashboard(true);
        }}

      />
    );
  }


  // =========================
  // NOTIFICATIONS
  // =========================

  if (showNotifications) {

    return (
      <Notifications

        onBack={() => {

          setShowNotifications(false);

          setShowStudentDashboard(true);
        }}

      />
    );
  }


  // =========================
  // MY DOCUMENTS
  // =========================

  if (showMyDocuments) {

    return (
      <MyDocuments

        onBack={() => {

          setShowMyDocuments(false);

          setShowStudentDashboard(true);
        }}

      />
    );
  }


  // =========================
  // MY PROFILE
  // =========================

  if (showMyProfile) {

    return (
      <MyProfile

        onBack={() => {

          setShowMyProfile(false);

          setShowStudentDashboard(true);
        }}

      />
    );
  }


  // =========================
  // STUDENT DASHBOARD
  // =========================

  if (showStudentDashboard) {

    return (
      <StudentDashboard

        onFindScholarships={() => {

          setShowStudentDashboard(false);

          setShowFindScholarships(true);
        }}

        onAIRecommendations={() => {

          setShowStudentDashboard(false);

          setShowAIRecommendations(true);
        }}

        onMyApplications={() => {

          setShowStudentDashboard(false);

          setShowMyApplications(true);
        }}

        onSavedScholarships={() => {

          setShowStudentDashboard(false);

          setShowSavedScholarships(true);
        }}

        onNotifications={() => {

          setShowStudentDashboard(false);

          setShowNotifications(true);
        }}

        onMyDocuments={() => {

          setShowStudentDashboard(false);

          setShowMyDocuments(true);
        }}

        onMyProfile={() => {

          setShowStudentDashboard(false);

          setShowMyProfile(true);
        }}

      />
    );
  }


  // =========================
  // CHOOSE ROLE
  // =========================

  if (showChooseRole) {

    return (
      <ChooseRole
        onSelectRole={handleRoleSelect}
      />
    );
  }


  // =========================
  // HOME PAGE
  // =========================

  return (

    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">

      <Navbar
        onOpenAuthModal={openChooseRole}
      />

      <main className="flex-1">

        <Hero
          onOpenGetStarted={openChooseRole}
          onOpenExplore={openExploreModal}
        />

        <Statistics />

        <Features
          onFeatureSelect={openFeatureModal}
        />

        <WhyScholarBridge />

        <HowItWorks />

        <Testimonials />

        <CallToAction />

      </main>

      <Footer />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
        featureTitle={featureTitle}
      />

    </div>
  );
}