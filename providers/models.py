from django.conf import settings
from django.db import models


class ProviderProfile(models.Model):

    ORGANIZATION_TYPES = (
        ("GOVERNMENT", "Government"),
        ("PRIVATE", "Private Organization"),
        ("NGO", "NGO"),
        ("TRUST", "Trust"),
        ("COLLEGE", "College / University"),
        ("CORPORATE", "Corporate"),
        ("OTHER", "Other"),
    )

    VERIFICATION_STATUS = (
        ("PENDING", "Pending"),
        ("VERIFIED", "Verified"),
        ("REJECTED", "Rejected"),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="provider_profile"
    )

    organization_name = models.CharField(
        max_length=200
    )

    organization_type = models.CharField(
        max_length=30,
        choices=ORGANIZATION_TYPES
    )

    contact_person = models.CharField(
        max_length=150
    )

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    address = models.TextField(
        blank=True
    )

    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS,
        default="PENDING"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.organization_name