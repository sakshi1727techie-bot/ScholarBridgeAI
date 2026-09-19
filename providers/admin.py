from django.contrib import admin
from .models import ProviderProfile


@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):

    list_display = (
        "organization_name",
        "organization_type",
        "contact_person",
        "phone",
        "verification_status",
        "created_at",
    )

    list_filter = (
        "organization_type",
        "verification_status",
    )

    search_fields = (
        "organization_name",
        "contact_person",
        "user__email",
    )