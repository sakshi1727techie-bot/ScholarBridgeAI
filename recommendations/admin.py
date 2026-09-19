from django.contrib import admin

from .models import ScholarshipRecommendation


@admin.register(ScholarshipRecommendation)
class ScholarshipRecommendationAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "scholarship",
        "match_score",
        "created_at",
    )

    search_fields = (
        "student__email",
        "scholarship__title",
    )

    list_filter = (
        "scholarship",
        "created_at",
    )