from django.urls import path

from .views import (
    provider_register,
    provider_profile,
    provider_dashboard,
    provider_dashboard_api,
    provider_profile_api,
    admin_provider_list_api,
)


urlpatterns = [

    path(
        "register/",
        provider_register,
        name="provider_register"
    ),

    path(
        "profile/",
        provider_profile,
        name="provider_profile"
    ),

    path(
        "api/profile/",
        provider_profile_api,
        name="provider_profile_api"
    ),

    path(
        "dashboard/",
        provider_dashboard,
        name="provider_dashboard"
    ),

    path(
        "api/dashboard/",
        provider_dashboard_api,
        name="provider_dashboard_api"
    ),

    # Admin Provider Management API
    path(
        "api/admin/providers/",
        admin_provider_list_api,
        name="admin_provider_list_api"
    ),
]