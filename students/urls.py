from django.urls import path

from .views import (
    student_dashboard,
    student_profile,
    student_profile_api,
    admin_student_list_api,
)


urlpatterns = [

    # ==========================================
    # STUDENT DASHBOARD
    # ==========================================

    path(
        "dashboard/",
        student_dashboard,
        name="student_dashboard"
    ),

    # ==========================================
    # STUDENT PROFILE
    # ==========================================

    path(
        "profile/",
        student_profile,
        name="student_profile"
    ),

    # ==========================================
    # STUDENT PROFILE API
    # ==========================================

    path(
        "api/profile/",
        student_profile_api,
        name="student_profile_api"
    ),

    # ==========================================
    # ADMIN - STUDENT LIST API
    # ==========================================

    path(
        "api/admin/students/",
        admin_student_list_api,
        name="admin_student_list_api"
    ),

]