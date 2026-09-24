from django.conf import settings
from django.db import models

from applications.models import Application


class StudentDocument(models.Model):

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

    VERIFICATION_STATUS = (
        ("PENDING", "Pending"),
        ("VERIFIED", "Verified"),
        ("REJECTED", "Rejected"),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="documents",
        null=True,
        blank=True
    )

    document_type = models.CharField(
        max_length=50,
        choices=DOCUMENT_TYPES
    )

    document = models.FileField(
        upload_to="student_documents/"
    )

    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS,
        default="PENDING"
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.student.email} - "
            f"{self.get_document_type_display()}"
        )