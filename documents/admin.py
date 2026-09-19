from django.contrib import admin
from .models import StudentDocument


@admin.register(StudentDocument)
class StudentDocumentAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "document_type",
        "verification_status",
        "uploaded_at",
    )

    list_filter = (
        "document_type",
        "verification_status",
    )

    search_fields = (
        "student__email",
    )

    ordering = (
        "-uploaded_at",
    )
