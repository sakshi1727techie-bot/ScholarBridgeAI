from rest_framework import serializers

from .models import AdminSettings


class AdminSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = AdminSettings

        fields = [
            "id",

            # General Settings
            "language",
            "timezone",
            "items_per_page",

            # Notification Settings
            "email_notifications",
            "application_notifications",
            "provider_notifications",
            "scholarship_notifications",

            # Security Settings
            "two_factor_auth",

            # Platform Settings
            "maintenance_mode",

            # Timestamps
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]