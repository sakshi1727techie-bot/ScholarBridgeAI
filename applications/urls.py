from django.urls import path

from .views import (
    apply_scholarship,
    application_success,
    my_applications,
    my_applications_api,
    provider_applications,
    update_application_status,
)


urlpatterns = [

    # =====================================================
    # STUDENT APPLY
    # =====================================================

    path(
        "<int:scholarship_id>/apply/",
        apply_scholarship,
        name="apply_scholarship"
    ),

    # =====================================================
    # APPLICATION SUCCESS
    # =====================================================

    path(
        "<int:scholarship_id>/success/",
        application_success,
        name="application_success"
    ),

    # =====================================================
    # STUDENT MY APPLICATIONS PAGE
    # =====================================================

    path(
        "my-applications/",
        my_applications,
        name="my_applications"
    ),

    # =====================================================
    # STUDENT MY APPLICATIONS API
    # =====================================================

    path(
        "api/",
        my_applications_api,
        name="my_applications_api"
    ),

    # =====================================================
    # PROVIDER APPLICATIONS
    # =====================================================

    path(
        "provider-applications/",
        provider_applications,
        name="provider_applications"
    ),

    # =====================================================
    # PROVIDER UPDATE APPLICATION STATUS
    # =====================================================

    path(
        "provider-applications/<int:application_id>/status/",
        update_application_status,
        name="update_application_status"
    ),
]