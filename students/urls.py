from django.urls import path

from .views import (
    student_dashboard,
    student_profile,
    student_profile_api,
)


urlpatterns = [

    path(
        "dashboard/",
        student_dashboard,
        name="student_dashboard"
    ),

    path(
        "profile/",
        student_profile,
        name="student_profile"
    ),

    path(
        "api/profile/",
        student_profile_api,
        name="student_profile_api"
    ),

]