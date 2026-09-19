from django.contrib import admin
from .models import StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "user",
        "course",
        "specialization",
        "college",
        "category",
        "profile_completion",
    )

    list_filter = (
        "course",
        "category",
        "gender",
        "state",
    )

    search_fields = (
        "full_name",
        "user__email",
        "college",
        "course",
        "specialization",
    )