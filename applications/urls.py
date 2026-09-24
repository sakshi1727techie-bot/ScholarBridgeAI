from django.urls import path

from .views import (
    apply_scholarship,
    apply_scholarship_api,
    application_success,
    my_applications,
    my_applications_api,
    provider_applications,
    update_application_status,
    provider_applications_api,
    provider_update_application_status_api,
    provider_application_student_details_api,
    admin_applications_api,
)


urlpatterns = [

    # ============================================================
    # STUDENT HTML APPLICATION
    # ============================================================

    path(
        "<int:scholarship_id>/apply/",
        apply_scholarship,
        name="apply_scholarship"
    ),

    # ============================================================
    # STUDENT APPLY API
    # ============================================================

    path(
        "api/apply/<int:scholarship_id>/",
        apply_scholarship_api,
        name="apply_scholarship_api"
    ),

    # ============================================================
    # APPLICATION SUCCESS
    # ============================================================

    path(
        "<int:scholarship_id>/success/",
        application_success,
        name="application_success"
    ),

    # ============================================================
    # STUDENT MY APPLICATIONS HTML
    # ============================================================

    path(
        "my-applications/",
        my_applications,
        name="my_applications"
    ),

    # ============================================================
    # STUDENT MY APPLICATIONS API
    # ============================================================

    path(
        "api/",
        my_applications_api,
        name="my_applications_api"
    ),

    # ============================================================
    # PROVIDER HTML APPLICATIONS
    # ============================================================

    path(
        "provider-applications/",
        provider_applications,
        name="provider_applications"
    ),

    # ============================================================
    # PROVIDER HTML STATUS UPDATE
    # ============================================================

    path(
        "provider-applications/<int:application_id>/status/",
        update_application_status,
        name="update_application_status"
    ),

    # ============================================================
    # PROVIDER REACT APPLICATION MANAGEMENT API
    # ============================================================

    path(
        "api/provider/",
        provider_applications_api,
        name="provider_applications_api"
    ),

    # ============================================================
    # PROVIDER STUDENT DETAILS API
    # ============================================================

    path(
        "api/provider/<int:application_id>/student-details/",
        provider_application_student_details_api,
        name="provider_application_student_details_api"
    ),

    # ============================================================
    # PROVIDER REACT STATUS UPDATE API
    # ============================================================

    path(
        "api/provider/<int:application_id>/status/",
        provider_update_application_status_api,
        name="provider_update_application_status_api"
    ),

    # ============================================================
    # ADMIN REACT APPLICATION MANAGEMENT API
    # ============================================================

    path(
        "api/admin/",
        admin_applications_api,
        name="admin_applications_api"
    ),
]