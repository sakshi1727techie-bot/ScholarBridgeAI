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

import ProviderLogin from "./Provider login";
import ProviderRegister from "./Provider Register";
import ProviderForgotPassword from "./Provider Forgot Password";
import ProviderDashboard from "./ProviderDashboard";
import ProviderCreateScholarship from "./ProviderCreateScholarship";
import ProviderScholarships from "./ProviderScholarships";
import ProviderApplications from "./ProviderApplications";
import ProviderNotifications from "./ProviderNotifications";
import ProviderProfile from "./ProviderProfile";
import ProviderHelpSupport from "./ProviderHelpSupport";

import AdminLogin from "./AdminLogin";
import AdminForgotPassword from "./AdminForgotPassword";
import AdminDashboard from "./AdminDashboard";

import FindScholarships from "./FindScholarships";
import ScholarshipDetails from "./ScholarshipDetails";
import AIRecommendations from "./AIRecommendations";
import MyApplications from "./MyApplications";
import SavedScholarships from "./SavedScholarships";
import Notifications from "./Notifications";
import MyDocuments from "./MyDocuments";
import MyProfile from "./MyProfile";

export default function App() {

  // =====================================================
  // HOME / MODAL STATES
  // =====================================================

  const [modalOpen, setModalOpen] =
    useState<boolean>(false);

  const [modalMode, setModalMode] =
    useState<"auth" | "explore" | "feature">("auth");

  const [featureTitle, setFeatureTitle] =
    useState<string>("");


  // =====================================================
  // ROLE STATE
  // =====================================================

  const [showChooseRole, setShowChooseRole] =
    useState<boolean>(false);


  // =====================================================
  // STUDENT AUTH STATES
  // =====================================================

  const [showStudentLogin, setShowStudentLogin] =
    useState<boolean>(false);

  const [showStudentRegister, setShowStudentRegister] =
    useState<boolean>(false);

  const [
    showStudentForgotPassword,
    setShowStudentForgotPassword
  ] = useState<boolean>(false);

  const [showStudentDashboard, setShowStudentDashboard] =
    useState<boolean>(false);


  // =====================================================
  // PROVIDER AUTH STATES
  // =====================================================

  const [showProviderLogin, setShowProviderLogin] =
    useState<boolean>(false);

  const [showProviderRegister, setShowProviderRegister] =
    useState<boolean>(false);

  const [
    showProviderForgotPassword,
    setShowProviderForgotPassword
  ] = useState<boolean>(false);


  // =====================================================
  // PROVIDER DASHBOARD STATES
  // =====================================================

  const [showProviderDashboard, setShowProviderDashboard] =
    useState<boolean>(false);

  const [
    showProviderCreateScholarship,
    setShowProviderCreateScholarship
  ] = useState<boolean>(false);

  const [
    showProviderScholarships,
    setShowProviderScholarships
  ] = useState<boolean>(false);

  const [
    showProviderApplications,
    setShowProviderApplications
  ] = useState<boolean>(false);

  const [
    showProviderNotifications,
    setShowProviderNotifications
  ] = useState<boolean>(false);


  // =====================================================
  // PROVIDER PROFILE STATE
  // =====================================================

  const [
    showProviderProfile,
    setShowProviderProfile
  ] = useState<boolean>(false);


  // =====================================================
  // PROVIDER HELP & SUPPORT STATE
  // =====================================================

  const [
    showProviderHelpSupport,
    setShowProviderHelpSupport
  ] = useState<boolean>(false);


  // =====================================================
  // ADMIN AUTH STATES
  // =====================================================

  const [showAdminLogin, setShowAdminLogin] =
    useState<boolean>(false);

  const [
    showAdminForgotPassword,
    setShowAdminForgotPassword
  ] = useState<boolean>(false);


  // =====================================================
  // ADMIN DASHBOARD STATE
  // =====================================================

  const [showAdminDashboard, setShowAdminDashboard] =
    useState<boolean>(false);


  // =====================================================
  // STUDENT DASHBOARD PAGE STATES
  // =====================================================

  const [
    showFindScholarships,
    setShowFindScholarships
  ] = useState<boolean>(false);

  const [
    showScholarshipDetails,
    setShowScholarshipDetails
  ] = useState<boolean>(false);

  const [
    showAIRecommendations,
    setShowAIRecommendations
  ] = useState<boolean>(false);

  const [
    showMyApplications,
    setShowMyApplications
  ] = useState<boolean>(false);

  const [
    showSavedScholarships,
    setShowSavedScholarships
  ] = useState<boolean>(false);

  const [
    showNotifications,
    setShowNotifications
  ] = useState<boolean>(false);

  const [
    showMyDocuments,
    setShowMyDocuments
  ] = useState<boolean>(false);

  const [
    showMyProfile,
    setShowMyProfile
  ] = useState<boolean>(false);


  // =====================================================
  // SELECTED SCHOLARSHIP
  // =====================================================

  const [
    selectedScholarshipId,
    setSelectedScholarshipId
  ] = useState<number | null>(null);


  // =====================================================
  // OPEN CHOOSE ROLE
  // =====================================================

  const openChooseRole = (): void => {

    setModalOpen(false);
    setShowChooseRole(true);

    // Student
    setShowStudentLogin(false);
    setShowStudentRegister(false);
    setShowStudentForgotPassword(false);
    setShowStudentDashboard(false);

    // Provider
    setShowProviderLogin(false);
    setShowProviderRegister(false);
    setShowProviderForgotPassword(false);
    setShowProviderDashboard(false);
    setShowProviderCreateScholarship(false);
    setShowProviderScholarships(false);
    setShowProviderApplications(false);
    setShowProviderNotifications(false);
    setShowProviderProfile(false);
    setShowProviderHelpSupport(false);

    // Admin
    setShowAdminLogin(false);
    setShowAdminForgotPassword(false);
    setShowAdminDashboard(false);

    // Student dashboard pages
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


  // =====================================================
  // EXPLORE MODAL
  // =====================================================

  const openExploreModal = (): void => {

    setModalMode("explore");
    setFeatureTitle("");
    setModalOpen(true);
  };


  // =====================================================
  // FEATURE MODAL
  // =====================================================

  const openFeatureModal = (
    title: string
  ): void => {

    setModalMode("feature");
    setFeatureTitle(title);
    setModalOpen(true);
  };


  // =====================================================
  // ROLE SELECT
  // =====================================================

  const handleRoleSelect = (
    role: Role
  ): void => {

    console.log("Selected role:", role);


    // =================================================
    // STUDENT ROLE
    // =================================================

    if (role === "student") {

      setShowChooseRole(false);

      setShowStudentLogin(true);
      setShowStudentRegister(false);
      setShowStudentForgotPassword(false);
      setShowStudentDashboard(false);

      // Close provider pages
      setShowProviderLogin(false);
      setShowProviderRegister(false);
      setShowProviderForgotPassword(false);
      setShowProviderDashboard(false);
      setShowProviderCreateScholarship(false);
      setShowProviderScholarships(false);
      setShowProviderApplications(false);
      setShowProviderNotifications(false);
      setShowProviderProfile(false);
      setShowProviderHelpSupport(false);

      // Close admin
      setShowAdminLogin(false);
      setShowAdminForgotPassword(false);
      setShowAdminDashboard(false);

      // Close student dashboard pages
      setShowFindScholarships(false);
      setShowScholarshipDetails(false);
      setShowAIRecommendations(false);
      setShowMyApplications(false);
      setShowSavedScholarships(false);
      setShowNotifications(false);
      setShowMyDocuments(false);
      setShowMyProfile(false);

      setSelectedScholarshipId(null);

      return;
    }


    // =================================================
    // PROVIDER ROLE
    // =================================================

    if (role === "provider") {

      setShowChooseRole(false);

      setShowProviderLogin(true);
      setShowProviderRegister(false);
      setShowProviderForgotPassword(false);

      setShowProviderDashboard(false);
      setShowProviderCreateScholarship(false);
      setShowProviderScholarships(false);
      setShowProviderApplications(false);
      setShowProviderNotifications(false);
      setShowProviderProfile(false);
      setShowProviderHelpSupport(false);

      // Close admin
      setShowAdminLogin(false);
      setShowAdminForgotPassword(false);
      setShowAdminDashboard(false);

      // Close student pages
      setShowStudentLogin(false);
      setShowStudentRegister(false);
      setShowStudentForgotPassword(false);
      setShowStudentDashboard(false);

      // Close student dashboard pages
      setShowFindScholarships(false);
      setShowScholarshipDetails(false);
      setShowAIRecommendations(false);
      setShowMyApplications(false);
      setShowSavedScholarships(false);
      setShowNotifications(false);
      setShowMyDocuments(false);
      setShowMyProfile(false);

      setSelectedScholarshipId(null);

      return;
    }


    // =================================================
    // ADMIN ROLE
    // =================================================

    if (role === "admin") {

      console.log(
        "Administrator role selected."
      );

      setShowChooseRole(false);

      setShowAdminLogin(true);
      setShowAdminForgotPassword(false);
      setShowAdminDashboard(false);

      // Close Student pages
      setShowStudentLogin(false);
      setShowStudentRegister(false);
      setShowStudentForgotPassword(false);
      setShowStudentDashboard(false);

      // Close Provider pages
      setShowProviderLogin(false);
      setShowProviderRegister(false);
      setShowProviderForgotPassword(false);
      setShowProviderDashboard(false);
      setShowProviderCreateScholarship(false);
      setShowProviderScholarships(false);
      setShowProviderApplications(false);
      setShowProviderNotifications(false);
      setShowProviderProfile(false);
      setShowProviderHelpSupport(false);

      // Close Student dashboard pages
      setShowFindScholarships(false);
      setShowScholarshipDetails(false);
      setShowAIRecommendations(false);
      setShowMyApplications(false);
      setShowSavedScholarships(false);
      setShowNotifications(false);
      setShowMyDocuments(false);
      setShowMyProfile(false);

      setSelectedScholarshipId(null);

      return;
    }
  };


  // =====================================================
  // ADMIN LOGOUT
  // =====================================================

  const handleAdminLogout = (): void => {

    console.log(
      "Admin logout successful"
    );

    // Close Admin Dashboard
    setShowAdminDashboard(false);

    // Open Admin Login
    setShowAdminLogin(true);

    // Close Admin Forgot Password
    setShowAdminForgotPassword(false);

    // Close Student pages
    setShowStudentLogin(false);
    setShowStudentRegister(false);
    setShowStudentForgotPassword(false);
    setShowStudentDashboard(false);

    // Close Provider pages
    setShowProviderLogin(false);
    setShowProviderRegister(false);
    setShowProviderForgotPassword(false);
    setShowProviderDashboard(false);
    setShowProviderCreateScholarship(false);
    setShowProviderScholarships(false);
    setShowProviderApplications(false);
    setShowProviderNotifications(false);
    setShowProviderProfile(false);
    setShowProviderHelpSupport(false);

    // Close Student dashboard pages
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


  // =====================================================
  // ADMIN FORGOT PASSWORD
  // =====================================================

  if (showAdminForgotPassword) {

    return (
      <AdminForgotPassword

        onBackToLogin={() => {

          console.log(
            "Admin Forgot Password → Admin Login"
          );

          setShowAdminForgotPassword(false);
          setShowAdminLogin(true);
          setShowAdminDashboard(false);
        }}

      />
    );
  }


  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  if (showAdminLogin) {

    return (
      <AdminLogin

        onLoginSuccess={() => {

          console.log(
            "Admin login successful"
          );

          setShowAdminLogin(false);
          setShowAdminForgotPassword(false);

          // Open Admin Dashboard
          setShowAdminDashboard(true);

          // Close Student pages
          setShowStudentLogin(false);
          setShowStudentRegister(false);
          setShowStudentForgotPassword(false);
          setShowStudentDashboard(false);

          // Close Provider pages
          setShowProviderLogin(false);
          setShowProviderRegister(false);
          setShowProviderForgotPassword(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          // Close Student dashboard pages
          setShowFindScholarships(false);
          setShowScholarshipDetails(false);
          setShowAIRecommendations(false);
          setShowMyApplications(false);
          setShowSavedScholarships(false);
          setShowNotifications(false);
          setShowMyDocuments(false);
          setShowMyProfile(false);

          setSelectedScholarshipId(null);
        }}

        onForgotPassword={() => {

          console.log(
            "Admin Forgot Password clicked"
          );

          setShowAdminLogin(false);
          setShowAdminForgotPassword(true);
          setShowAdminDashboard(false);
        }}

      />
    );
  }


  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  if (showAdminDashboard) {

    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
      />
    );
  }


  // =====================================================
  // PROVIDER FORGOT PASSWORD
  // =====================================================

  if (showProviderForgotPassword) {

    return (
      <ProviderForgotPassword

        onBackToLogin={() => {

          setShowProviderForgotPassword(false);
          setShowProviderLogin(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER REGISTER
  // =====================================================

  if (showProviderRegister) {

    return (
      <ProviderRegister

        onBackToLogin={() => {

          setShowProviderRegister(false);
          setShowProviderLogin(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER LOGIN
  // =====================================================

  if (showProviderLogin) {

    return (
      <ProviderLogin

        onCreateAccount={() => {

          setShowProviderLogin(false);
          setShowProviderRegister(true);
        }}

        onForgotPassword={() => {

          setShowProviderLogin(false);
          setShowProviderForgotPassword(true);
        }}

        onLoginSuccess={() => {

          console.log(
            "Provider login successful"
          );

          // Open dashboard
          setShowProviderLogin(false);
          setShowProviderRegister(false);
          setShowProviderForgotPassword(false);

          setShowProviderDashboard(true);

          // Close provider inner pages
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          // Close admin
          setShowAdminLogin(false);
          setShowAdminForgotPassword(false);
          setShowAdminDashboard(false);

          // Close student pages
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
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER CREATE SCHOLARSHIP
  // =====================================================

  if (showProviderCreateScholarship) {

    console.log(
      "Opening Provider Create Scholarship page"
    );

    return (
      <ProviderCreateScholarship

        // CREATE SCHOLARSHIP → DASHBOARD
        onBack={() => {

          console.log(
            "Provider Create Scholarship → Dashboard"
          );

          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderDashboard(true);
        }}

        // SUCCESS → DASHBOARD
        onSuccess={() => {

          console.log(
            "Scholarship created successfully"
          );

          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderDashboard(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER HELP & SUPPORT
  // =====================================================

  if (showProviderHelpSupport) {

    console.log(
      "Opening Provider Help & Support page"
    );

    return (
      <ProviderHelpSupport

        // HELP & SUPPORT → DASHBOARD

        onBackToDashboard={() => {

          console.log(
            "Provider Help & Support → Dashboard"
          );

          setShowProviderHelpSupport(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);

          setShowProviderDashboard(true);
        }}


        // HELP & SUPPORT → SCHOLARSHIPS

        onScholarshipsClick={() => {

          console.log(
            "Provider Help & Support → Scholarships"
          );

          setShowProviderHelpSupport(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);

          setShowProviderScholarships(true);
        }}


        // HELP & SUPPORT → APPLICATIONS

        onApplicationsClick={() => {

          console.log(
            "Provider Help & Support → Applications"
          );

          setShowProviderHelpSupport(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);

          setShowProviderApplications(true);
        }}


        // HELP & SUPPORT → NOTIFICATIONS

        onNotificationsClick={() => {

          console.log(
            "Provider Help & Support → Notifications"
          );

          setShowProviderHelpSupport(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderProfile(false);

          setShowProviderNotifications(true);
        }}


        // HELP & SUPPORT → PROFILE

        onProfileClick={() => {

          console.log(
            "Provider Help & Support → Provider Profile"
          );

          setShowProviderHelpSupport(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);

          setShowProviderProfile(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER PROFILE
  // =====================================================

  if (showProviderProfile) {

    console.log(
      "Opening Provider Profile page"
    );

    return (
      <ProviderProfile

        // PROFILE → DASHBOARD

        onBackToDashboard={() => {

          console.log(
            "Provider Profile → Dashboard"
          );

          setShowProviderProfile(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderHelpSupport(false);

          setShowProviderDashboard(true);
        }}


        // PROFILE → SCHOLARSHIPS

        onScholarshipsClick={() => {

          console.log(
            "Provider Profile → Scholarships"
          );

          setShowProviderProfile(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderHelpSupport(false);

          setShowProviderScholarships(true);
        }}


        // PROFILE → APPLICATIONS

        onApplicationsClick={() => {

          console.log(
            "Provider Profile → Applications"
          );

          setShowProviderProfile(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderNotifications(false);
          setShowProviderHelpSupport(false);

          setShowProviderApplications(true);
        }}


        // PROFILE → NOTIFICATIONS

        onNotificationsClick={() => {

          console.log(
            "Provider Profile → Notifications"
          );

          setShowProviderProfile(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderHelpSupport(false);

          setShowProviderNotifications(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER NOTIFICATIONS
  // =====================================================

  if (showProviderNotifications) {

    console.log(
      "Opening Provider Notifications page"
    );

    return (
      <ProviderNotifications

        onBackToDashboard={() => {

          console.log(
            "Back to Provider Dashboard"
          );

          setShowProviderNotifications(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderDashboard(true);
        }}


        // NOTIFICATIONS → SCHOLARSHIPS

        onScholarshipsClick={() => {

          console.log(
            "Notifications → Scholarships"
          );

          setShowProviderNotifications(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderScholarships(true);
        }}


        // NOTIFICATIONS → APPLICATIONS

        onApplicationsClick={() => {

          console.log(
            "Notifications → Applications"
          );

          setShowProviderNotifications(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderApplications(true);
        }}


        // NOTIFICATIONS → PROFILE

        onProfileClick={() => {

          console.log(
            "Notifications → Provider Profile"
          );

          setShowProviderNotifications(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderScholarships(false);
          setShowProviderHelpSupport(false);

          setShowProviderProfile(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER APPLICATIONS
  // =====================================================

  if (showProviderApplications) {

    console.log(
      "Opening Provider Applications page"
    );

    return (
      <ProviderApplications

        onBackToDashboard={() => {

          console.log(
            "Back to Provider Dashboard"
          );

          setShowProviderApplications(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderDashboard(true);
        }}


        // APPLICATIONS → SCHOLARSHIPS

        onScholarshipsClick={() => {

          console.log(
            "Applications → Scholarships"
          );

          setShowProviderApplications(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderScholarships(true);
        }}


        // APPLICATIONS → NOTIFICATIONS

        onNotificationsClick={() => {

          console.log(
            "Applications → Notifications"
          );

          setShowProviderApplications(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderNotifications(true);
        }}


        // APPLICATIONS → PROFILE

        onProfileClick={() => {

          console.log(
            "Applications → Provider Profile"
          );

          setShowProviderApplications(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderNotifications(false);
          setShowProviderHelpSupport(false);

          setShowProviderProfile(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER SCHOLARSHIPS
  // =====================================================

  if (showProviderScholarships) {

    return (
      <ProviderScholarships

        onBackToDashboard={() => {

          console.log(
            "Provider Scholarships → Dashboard"
          );

          setShowProviderScholarships(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderDashboard(true);
        }}


        // SCHOLARSHIPS → APPLICATIONS

        onApplicationsClick={() => {

          console.log(
            "Provider Scholarships → Applications"
          );

          setShowProviderScholarships(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderApplications(true);
        }}


        // SCHOLARSHIPS → NOTIFICATIONS

        onNotificationsClick={() => {

          console.log(
            "Provider Scholarships → Notifications"
          );

          setShowProviderScholarships(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderNotifications(true);
        }}


        // SCHOLARSHIPS → PROFILE

        onProfileClick={() => {

          console.log(
            "Provider Scholarships → Provider Profile"
          );

          setShowProviderScholarships(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderHelpSupport(false);

          setShowProviderProfile(true);
        }}

      />
    );
  }


  // =====================================================
  // PROVIDER DASHBOARD
  // =====================================================

  if (showProviderDashboard) {

    return (
      <ProviderDashboard

        // CREATE SCHOLARSHIP BUTTON

        onCreateScholarshipClick={() => {

          console.log(
            "Opening Provider Create Scholarship"
          );

          setShowProviderDashboard(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderCreateScholarship(true);
        }}


        // SCHOLARSHIPS BUTTON

        onScholarshipsClick={() => {

          console.log(
            "Opening Provider Scholarships"
          );

          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderScholarships(true);
        }}


        // APPLICATIONS BUTTON

        onApplicationsClick={() => {

          console.log(
            "Opening Provider Applications"
          );

          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderApplications(true);
        }}


        // NOTIFICATIONS BUTTON

        onNotificationsClick={() => {

          console.log(
            "Opening Provider Notifications"
          );

          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          setShowProviderNotifications(true);
        }}


        // PROFILE BUTTON

        onProfileClick={() => {

          console.log(
            "Opening Provider Profile from Dashboard"
          );

          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderHelpSupport(false);

          setShowProviderProfile(true);
        }}


        // HELP & SUPPORT BUTTON

        onHelpSupportClick={() => {

          console.log(
            "Opening Provider Help & Support"
          );

          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);

          setShowProviderHelpSupport(true);
        }}

      />
    );
  }


  // =====================================================
  // STUDENT FORGOT PASSWORD
  // =====================================================

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


  // =====================================================
  // STUDENT REGISTER
  // =====================================================

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


  // =====================================================
  // STUDENT LOGIN
  // =====================================================

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

          console.log(
            "Student login successful"
          );

          setShowStudentLogin(false);
          setShowStudentRegister(false);
          setShowStudentForgotPassword(false);

          setShowStudentDashboard(true);

          // Close student pages
          setShowFindScholarships(false);
          setShowScholarshipDetails(false);
          setShowAIRecommendations(false);
          setShowMyApplications(false);
          setShowSavedScholarships(false);
          setShowNotifications(false);
          setShowMyDocuments(false);
          setShowMyProfile(false);

          setSelectedScholarshipId(null);

          // Close provider pages
          setShowProviderLogin(false);
          setShowProviderRegister(false);
          setShowProviderForgotPassword(false);
          setShowProviderDashboard(false);
          setShowProviderCreateScholarship(false);
          setShowProviderScholarships(false);
          setShowProviderApplications(false);
          setShowProviderNotifications(false);
          setShowProviderProfile(false);
          setShowProviderHelpSupport(false);

          // Close admin
          setShowAdminLogin(false);
          setShowAdminForgotPassword(false);
          setShowAdminDashboard(false);
        }}

      />
    );
  }


  // =====================================================
  // SCHOLARSHIP DETAILS
  // =====================================================

  if (
    showScholarshipDetails &&
    selectedScholarshipId !== null
  ) {

    return (
      <ScholarshipDetails

        scholarshipId={
          selectedScholarshipId
        }

        onBack={() => {

          setShowScholarshipDetails(false);
          setShowFindScholarships(true);
        }}

      />
    );
  }


  // =====================================================
  // FIND SCHOLARSHIPS
  // =====================================================

  if (showFindScholarships) {

    return (
      <FindScholarships

        onBack={() => {

          setShowFindScholarships(false);
          setShowStudentDashboard(true);
        }}

        onViewDetails={(
          scholarshipId: number
        ) => {

          setSelectedScholarshipId(
            scholarshipId
          );

          setShowFindScholarships(false);
          setShowScholarshipDetails(true);
        }}

      />
    );
  }


  // =====================================================
  // AI RECOMMENDATIONS
  // =====================================================

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


  // =====================================================
  // MY APPLICATIONS
  // =====================================================

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


  // =====================================================
  // SAVED SCHOLARSHIPS
  // =====================================================

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


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

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


  // =====================================================
  // MY DOCUMENTS
  // =====================================================

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


  // =====================================================
  // MY PROFILE
  // =====================================================

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


  // =====================================================
  // STUDENT DASHBOARD
  // =====================================================

  if (showStudentDashboard) {

    return (
      <StudentDashboard

        // FIND SCHOLARSHIPS

        onFindScholarships={() => {

          setShowStudentDashboard(false);
          setShowFindScholarships(true);
        }}


        // AI RECOMMENDATIONS

        onAIRecommendations={() => {

          setShowStudentDashboard(false);
          setShowAIRecommendations(true);
        }}


        // MY APPLICATIONS

        onMyApplications={() => {

          setShowStudentDashboard(false);
          setShowMyApplications(true);
        }}


        // SAVED SCHOLARSHIPS

        onSavedScholarships={() => {

          setShowStudentDashboard(false);
          setShowSavedScholarships(true);
        }}


        // NOTIFICATIONS

        onNotifications={() => {

          setShowStudentDashboard(false);
          setShowNotifications(true);
        }}


        // MY DOCUMENTS

        onMyDocuments={() => {

          setShowStudentDashboard(false);
          setShowMyDocuments(true);
        }}


        // MY PROFILE

        onMyProfile={() => {

          setShowStudentDashboard(false);
          setShowMyProfile(true);
        }}


        // APPLY SCHOLARSHIP

        onApplyScholarship={(
          scholarshipId: number
        ) => {

          setSelectedScholarshipId(
            scholarshipId
          );

          setShowStudentDashboard(false);
          setShowScholarshipDetails(true);
        }}

      />
    );
  }


  // =====================================================
  // CHOOSE ROLE
  // =====================================================

  if (showChooseRole) {

    return (
      <ChooseRole
        onSelectRole={
          handleRoleSelect
        }
      />
    );
  }


  // =====================================================
  // HOME PAGE
  // =====================================================

  return (

    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">

      <Navbar
        onOpenAuthModal={
          openChooseRole
        }
      />

      <main className="flex-1">

        <Hero
          onOpenGetStarted={
            openChooseRole
          }

          onOpenExplore={
            openExploreModal
          }
        />

        <Statistics />

        <Features
          onFeatureSelect={
            openFeatureModal
          }
        />

        <WhyScholarBridge />

        <HowItWorks />

        <Testimonials />

        <CallToAction />

      </main>

      <Footer />

      <Modal

        isOpen={modalOpen}

        onClose={() =>
          setModalOpen(false)
        }

        initialMode={modalMode}

        featureTitle={featureTitle}

      />

    </div>
  );
}