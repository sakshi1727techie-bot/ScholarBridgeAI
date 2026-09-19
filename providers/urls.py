from django.urls import path

from .views import (
    provider_register,
    provider_profile,
    provider_dashboard,
)

urlpatterns = [
    path(
        "register/",
        provider_register,
        name="provider_register"
    ),

    path(
        "profile/",
        provider_profile,
        name="provider_profile"
    ),

    path(
        "dashboard/",
        provider_dashboard,
        name="provider_dashboard"
    ),
]