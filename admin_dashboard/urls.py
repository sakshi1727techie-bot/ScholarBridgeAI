from django.urls import path

from .views import (
    admin_dashboard_api,
    admin_settings_api,
    reset_admin_settings,
    verify_provider_api,
)


urlpatterns = [

    # =====================================================
    # ADMIN DASHBOARD
    # =====================================================

    path(
        "dashboard/",
        admin_dashboard_api,
        name="admin_dashboard_api"
    ),

    # =====================================================
    # ADMIN SETTINGS
    # =====================================================

    path(
        "settings/",
        admin_settings_api,
        name="admin_settings_api"
    ),

    # =====================================================
    # RESET ADMIN SETTINGS
    # =====================================================

    path(
        "settings/reset/",
        reset_admin_settings,
        name="reset_admin_settings"
    ),

    # =====================================================
    # VERIFY PROVIDER
    # =====================================================

    path(
        "providers/<int:provider_id>/verify/",
        verify_provider_api,
        name="verify_provider_api"
    ),

]