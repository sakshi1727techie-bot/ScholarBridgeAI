from django.contrib import admin

from .models import StudentActivity


@admin.register(StudentActivity)
class StudentActivityAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "activity_type",
        "description",
        "created_at",
    )

    list_filter = (
        "activity_type",
        "created_at",
    )

    search_fields = (
        "student__email",
        "activity_type",
        "description",
    )

    ordering = (
        "-created_at",
    )
