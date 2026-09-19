from django.conf import settings
from django.db import models
from scholarships.models import Scholarship


class Application(models.Model):

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("UNDER_REVIEW", "Under Review"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    scholarship = models.ForeignKey(
        Scholarship,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "scholarship"],
                name="unique_student_scholarship_application"
            )
        ]

    def __str__(self):
        return f"{self.student.email} - {self.scholarship.title}"