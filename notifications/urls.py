from django.urls import path

from .views import (
    provider_notifications_api,
    mark_notification_read,
    mark_all_notifications_read,
    delete_notification,
    admin_notifications_api,
)


urlpatterns = [

    # =====================================================
    # USER / PROVIDER NOTIFICATIONS
    # =====================================================

    path(
        "",
        provider_notifications_api,
        name="provider_notifications_api"
    ),

    # =====================================================
    # MARK SINGLE NOTIFICATION AS READ
    # =====================================================

    path(
        "<int:notification_id>/read/",
        mark_notification_read,
        name="mark_notification_read"
    ),

    # =====================================================
    # MARK ALL NOTIFICATIONS AS READ
    # =====================================================

    path(
        "mark-all-read/",
        mark_all_notifications_read,
        name="mark_all_notifications_read"
    ),

    # =====================================================
    # DELETE SINGLE NOTIFICATION
    # =====================================================

    path(
        "<int:notification_id>/delete/",
        delete_notification,
        name="delete_notification"
    ),

    # =====================================================
    # ADMIN NOTIFICATIONS
    # =====================================================

    path(
        "admin/",
        admin_notifications_api,
        name="admin_notifications_api"
    ),
]