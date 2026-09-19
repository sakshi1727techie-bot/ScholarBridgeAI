from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):

    scholarship_title = serializers.CharField(
        source="scholarship.title",
        read_only=True
    )

    scholarship_amount = serializers.DecimalField(
        source="scholarship.amount",
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    deadline = serializers.DateField(
        source="scholarship.deadline",
        read_only=True
    )

    provider_name = serializers.CharField(
        source="scholarship.provider.organization_name",
        read_only=True
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "scholarship",
            "scholarship_title",
            "scholarship_amount",
            "provider_name",
            "deadline",
            "status",
            "status_display",
            "applied_at",
            "updated_at",
        ]