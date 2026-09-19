from rest_framework import serializers

from .models import StudentDocument


class StudentDocumentSerializer(serializers.ModelSerializer):

    document_url = serializers.SerializerMethodField()

    document_type_display = serializers.CharField(
        source="get_document_type_display",
        read_only=True
    )

    verification_status_display = serializers.CharField(
        source="get_verification_status_display",
        read_only=True
    )

    class Meta:
        model = StudentDocument
        fields = [
            "id",
            "document_type",
            "document_type_display",
            "document",
            "document_url",
            "verification_status",
            "verification_status_display",
            "uploaded_at",
        ]

    def get_document_url(self, obj):
        request = self.context.get("request")

        if obj.document and request:
            return request.build_absolute_uri(obj.document.url)

        return None