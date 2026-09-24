from django.conf import settings
from django.db import models


class AdminSettings(models.Model):

    admin = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="admin_settings"
    )

    # =====================================================
    # GENERAL SETTINGS
    # =====================================================

    language = models.CharField(
        max_length=20,
        default="English"
    )

    timezone = models.CharField(
        max_length=50,
        default="Asia/Kolkata"
    )

    items_per_page = models.PositiveIntegerField(
        default=10
    )

    # =====================================================
    # NOTIFICATION SETTINGS
    # =====================================================

    email_notifications = models.BooleanField(
        default=True
    )

    application_notifications = models.BooleanField(
        default=True
    )

    provider_notifications = models.BooleanField(
        default=True
    )

    scholarship_notifications = models.BooleanField(
        default=True
    )

    # =====================================================
    # SECURITY SETTINGS
    # =====================================================

    two_factor_auth = models.BooleanField(
        default=False
    )

    # =====================================================
    # PLATFORM SETTINGS
    # =====================================================

    maintenance_mode = models.BooleanField(
        default=False
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Settings - {self.admin.email}"