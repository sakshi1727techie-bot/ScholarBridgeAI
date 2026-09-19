from django.conf import settings
from django.db import models
from providers.models import ProviderProfile


class Scholarship(models.Model):

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("CLOSED", "Closed"),
    )

    provider = models.ForeignKey(
        ProviderProfile,
        on_delete=models.CASCADE,
        related_name="scholarships"
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    application_start = models.DateField()

    deadline = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ScholarshipEligibility(models.Model):

    scholarship = models.OneToOneField(
        Scholarship,
        on_delete=models.CASCADE,
        related_name="eligibility"
    )

    eligible_courses = models.TextField(
        blank=True
    )

    specialization = models.CharField(
        max_length=200,
        blank=True
    )

    minimum_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    maximum_income = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    category = models.CharField(
        max_length=100,
        blank=True
    )

    gender = models.CharField(
        max_length=50,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        blank=True
    )

    other_criteria = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"Eligibility - {self.scholarship.title}"


class ScholarshipRequiredDocument(models.Model):

    DOCUMENT_TYPES = (
        ("AADHAAR", "Aadhaar Card"),
        ("PAN", "PAN Card"),
        ("MARKSHEET", "Marksheet"),
        ("INCOME_CERTIFICATE", "Income Certificate"),
        ("CASTE_CERTIFICATE", "Caste Certificate"),
        ("ADMISSION_PROOF", "Admission Proof"),
        ("FEE_RECEIPT", "Fee Receipt"),
        ("BANK_PROOF", "Bank Account Proof"),
        ("OTHER", "Other"),
    )

    scholarship = models.ForeignKey(
        Scholarship,
        on_delete=models.CASCADE,
        related_name="required_documents"
    )

    document_type = models.CharField(
        max_length=50,
        choices=DOCUMENT_TYPES
    )

    is_mandatory = models.BooleanField(
        default=True
    )

    description = models.CharField(
        max_length=300,
        blank=True
    )

    def __str__(self):
        return f"{self.scholarship.title} - {self.get_document_type_display()}"


class SavedScholarship(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_scholarships"
    )

    scholarship = models.ForeignKey(
        Scholarship,
        on_delete=models.CASCADE,
        related_name="saved_by_students"
    )

    saved_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "scholarship"],
                name="unique_student_saved_scholarship"
            )
        ]

    def __str__(self):
        return f"{self.student.email} - {self.scholarship.title}"