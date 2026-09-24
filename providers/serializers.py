from rest_framework import serializers

from .models import ProviderProfile


class ProviderProfileSerializer(serializers.ModelSerializer):

    verification_status_display = serializers.CharField(
        source="get_verification_status_display",
        read_only=True
    )

    organization_type_display = serializers.CharField(
        source="get_organization_type_display",
        read_only=True
    )

    class Meta:
        model = ProviderProfile

        fields = [
            "id",
            "user",
            "organization_name",
            "organization_type",
            "organization_type_display",
            "contact_person",
            "phone",
            "address",
            "verification_status",
            "verification_status_display",
            "created_at",
            "updated_at",
        ]