from django.contrib import admin

from .models import (
    Scholarship,
    ScholarshipEligibility,
    ScholarshipRequiredDocument,
    SavedScholarship,
)


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "provider",
        "amount",
        "application_start",
        "deadline",
        "status",
    )

    list_filter = (
        "status",
        "application_start",
        "deadline",
    )

    search_fields = (
        "title",
        "description",
        "provider__organization_name",
    )


@admin.register(ScholarshipEligibility)
class ScholarshipEligibilityAdmin(admin.ModelAdmin):

    list_display = (
        "scholarship",
        "minimum_percentage",
        "maximum_income",
        "category",
        "gender",
        "state",
    )

    list_filter = (
        "category",
        "gender",
        "state",
    )

    search_fields = (
        "scholarship__title",
        "eligible_courses",
        "specialization",
    )


@admin.register(ScholarshipRequiredDocument)
class ScholarshipRequiredDocumentAdmin(admin.ModelAdmin):

    list_display = (
        "scholarship",
        "document_type",
        "is_mandatory",
    )

    list_filter = (
        "document_type",
        "is_mandatory",
    )

    search_fields = (
        "scholarship__title",
    )


@admin.register(SavedScholarship)
class SavedScholarshipAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "scholarship",
        "saved_at",
    )

    list_filter = (
        "saved_at",
    )

    search_fields = (
        "student__email",
        "scholarship__title",
    )