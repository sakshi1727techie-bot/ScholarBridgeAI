from django.conf import settings
from django.db import models

from scholarships.models import Scholarship


class ScholarshipRecommendation(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="scholarship_recommendations"
    )

    scholarship = models.ForeignKey(
        Scholarship,
        on_delete=models.CASCADE,
        related_name="recommendations"
    )

    match_score = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    reason = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.student.email} - "
            f"{self.scholarship.title} - "
            f"{self.match_score}%"
        )