from rest_framework import serializers

from .models import (
    Scholarship,
    ScholarshipEligibility,
    ScholarshipRequiredDocument,
    SavedScholarship,
)


class ScholarshipRequiredDocumentSerializer(serializers.ModelSerializer):

    document_type_display = serializers.CharField(
        source="get_document_type_display",
        read_only=True
    )

    class Meta:
        model = ScholarshipRequiredDocument

        fields = [
            "id",
            "document_type",
            "document_type_display",
            "is_mandatory",
            "description",
        ]


class ScholarshipEligibilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = ScholarshipEligibility

        fields = [
            "eligible_courses",
            "specialization",
            "minimum_percentage",
            "maximum_income",
            "category",
            "gender",
            "state",
            "other_criteria",
        ]


class ScholarshipSerializer(serializers.ModelSerializer):

    provider_name = serializers.CharField(
        source="provider.organization_name",
        read_only=True
    )

    eligibility = ScholarshipEligibilitySerializer(
        read_only=True
    )

    required_documents = ScholarshipRequiredDocumentSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Scholarship

        fields = [
            "id",
            "title",
            "description",
            "amount",
            "application_start",
            "deadline",
            "status",
            "provider_name",
            "eligibility",
            "required_documents",
        ]


class SavedScholarshipSerializer(serializers.ModelSerializer):

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

    class Meta:
        model = SavedScholarship

        fields = [
            "id",
            "scholarship",
            "scholarship_title",
            "scholarship_amount",
            "provider_name",
            "deadline",
            "saved_at",
        ]