from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from scholarships.models import Scholarship
from .models import Application
from .serializers import ApplicationSerializer

from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# =========================================================
# STUDENT APPLY FOR SCHOLARSHIP
# =========================================================

@login_required
def apply_scholarship(request, scholarship_id):

    scholarship = get_object_or_404(
        Scholarship,
        id=scholarship_id,
        status="APPROVED"
    )

    existing_application = Application.objects.filter(
        student=request.user,
        scholarship=scholarship
    ).first()

    if existing_application:
        return render(
            request,
            "applications/already_applied.html",
            {
                "scholarship": scholarship,
                "application": existing_application,
            }
        )

    if request.method == "POST":

        Application.objects.create(
            student=request.user,
            scholarship=scholarship
        )

        return redirect(
            "application_success",
            scholarship_id=scholarship.id
        )

    return render(
        request,
        "applications/apply_scholarship.html",
        {
            "scholarship": scholarship
        }
    )


# =========================================================
# APPLICATION SUCCESS
# =========================================================

@login_required
def application_success(request, scholarship_id):

    scholarship = get_object_or_404(
        Scholarship,
        id=scholarship_id
    )

    application = Application.objects.filter(
        student=request.user,
        scholarship=scholarship
    ).first()

    return render(
        request,
        "applications/application_success.html",
        {
            "scholarship": scholarship,
            "application": application,
        }
    )


# =========================================================
# STUDENT MY APPLICATIONS PAGE
# =========================================================

@login_required
def my_applications(request):

    applications = (
        Application.objects
        .filter(
            student=request.user
        )
        .select_related(
            "scholarship"
        )
        .order_by(
            "-applied_at"
        )
    )

    return render(
        request,
        "applications/my_applications.html",
        {
            "applications": applications
        }
    )


# =========================================================
# STUDENT MY APPLICATIONS API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_applications_api(request):

    applications = (
        Application.objects
        .filter(
            student=request.user
        )
        .select_related(
            "scholarship",
            "scholarship__provider"
        )
        .order_by(
            "-applied_at"
        )
    )

    serializer = ApplicationSerializer(
        applications,
        many=True
    )

    return Response(
        serializer.data
    )


# =========================================================
# PROVIDER APPLICATIONS
# =========================================================

@login_required
def provider_applications(request):

    provider = request.user.provider_profile

    applications = (
        Application.objects
        .filter(
            scholarship__provider=provider
        )
        .select_related(
            "student",
            "scholarship"
        )
        .order_by(
            "-applied_at"
        )
    )

    return render(
        request,
        "applications/provider_applications.html",
        {
            "applications": applications
        }
    )


# =========================================================
# PROVIDER UPDATE APPLICATION STATUS
# =========================================================

@login_required
def update_application_status(
    request,
    application_id
):

    application = get_object_or_404(
        Application,
        id=application_id,
        scholarship__provider=request.user.provider_profile
    )

    if request.method == "POST":

        new_status = request.POST.get(
            "status"
        )

        if new_status in [
            "PENDING",
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED"
        ]:

            application.status = new_status
            application.save()

    return redirect(
        "provider_applications"
    )