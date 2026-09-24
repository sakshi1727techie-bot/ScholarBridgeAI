from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from scholarships.models import Scholarship
from notifications.models import Notification

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

            # ====================================================
            # STUDENT NOTIFICATION
            # ====================================================

            notification_data = {

                "PENDING": {
                    "title": "Application Status Updated",
                    "message": (
                        f"Your application for "
                        f"'{application.scholarship.title}' "
                        f"is currently pending."
                    ),
                },

                "UNDER_REVIEW": {
                    "title": "Application Under Review",
                    "message": (
                        f"Your application for "
                        f"'{application.scholarship.title}' "
                        f"is now under review by the scholarship provider."
                    ),
                },

                "APPROVED": {
                    "title": "Application Approved",
                    "message": (
                        f"Congratulations! Your application for "
                        f"'{application.scholarship.title}' "
                        f"has been approved by the scholarship provider."
                    ),
                },

                "REJECTED": {
                    "title": "Application Rejected",
                    "message": (
                        f"Your application for "
                        f"'{application.scholarship.title}' "
                        f"has been rejected by the scholarship provider."
                    ),
                },

            }

            notification = notification_data.get(
                new_status
            )

            if notification:

                Notification.objects.create(
                    user=application.student,
                    title=notification["title"],
                    message=notification["message"],
                    type="APPLICATION",
                )

    return redirect(
        "provider_applications"
    )


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def apply_scholarship_api(request, scholarship_id):

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

        return Response(
            {
                "success": False,
                "message": "You have already applied for this scholarship.",
                "application": ApplicationSerializer(
                    existing_application
                ).data,
            },
            status=400
        )

    application = Application.objects.create(
        student=request.user,
        scholarship=scholarship
    )

    # ============================================================
    # STUDENT NOTIFICATION - APPLICATION SUBMITTED
    # ============================================================

    Notification.objects.create(
        user=request.user,
        title="Application Submitted",
        message=(
            f"Your application for "
            f"'{scholarship.title}' "
            f"has been submitted successfully."
        ),
        type="APPLICATION",
    )

    return Response(
        {
            "success": True,
            "message": "Application submitted successfully.",
            "application": ApplicationSerializer(
                application
            ).data,
        },
        status=201
    )


# ============================================================
# PROVIDER APPLICATION MANAGEMENT API
# ============================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_applications_api(request):

    # Only provider users can access this API
    if getattr(request.user, "role", None) != "PROVIDER":
        return Response(
            {
                "success": False,
                "message": "Only provider users can access application records."
            },
            status=403
        )

    # Get logged-in provider profile
    provider = getattr(request.user, "provider_profile", None)

    if not provider:
        return Response(
            {
                "success": False,
                "message": "Provider profile not found."
            },
            status=404
        )

    # Get applications submitted for scholarships
    # belonging to this provider
    applications = (
        Application.objects
        .filter(
            scholarship__provider=provider
        )
        .select_related(
            "student",
            "scholarship",
            "scholarship__provider"
        )
        .order_by(
            "-applied_at"
        )
    )

    application_list = []

    for application in applications:

        student_name = ""

        # Try full_name if your User model has it
        if hasattr(application.student, "full_name"):
            student_name = (
                application.student.full_name or ""
            )

        # Fallback to first_name + last_name
        if not student_name:
            student_name = (
                f"{application.student.first_name} "
                f"{application.student.last_name}"
            ).strip()

        # Final fallback to email
        if not student_name:
            student_name = application.student.email

        application_list.append(
            {
                "id": application.id,

                "student": {
                    "id": application.student.id,
                    "name": student_name,
                    "email": application.student.email,
                },

                "scholarship": {
                    "id": application.scholarship.id,
                    "title": application.scholarship.title,
                },

                "provider": {
                    "id": provider.id,
                    "organization_name": provider.organization_name,
                },

                "applied_at": application.applied_at.isoformat(),

                "status": application.status,

                "status_display": application.get_status_display(),
            }
        )

    return Response(
        {
            "success": True,
            "count": len(application_list),
            "applications": application_list,
        },
        status=200
    )


# ============================================================
# PROVIDER APPLICATION STATUS UPDATE API
# ============================================================

@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_update_application_status_api(
    request,
    application_id
):

    # Only provider users can update application status
    if getattr(request.user, "role", None) != "PROVIDER":
        return Response(
            {
                "success": False,
                "message": "Only provider users can update application status."
            },
            status=403
        )

    provider = getattr(request.user, "provider_profile", None)

    if not provider:
        return Response(
            {
                "success": False,
                "message": "Provider profile not found."
            },
            status=404
        )

    # Important:
    # Provider can update ONLY applications belonging
    # to scholarships created by that provider.
    try:

        application = (
            Application.objects
            .select_related(
                "student",
                "scholarship",
                "scholarship__provider"
            )
            .get(
                id=application_id,
                scholarship__provider=provider
            )
        )

    except Application.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Application not found."
            },
            status=404
        )

    new_status = request.data.get("status")

    allowed_statuses = [
        "PENDING",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
    ]

    if new_status not in allowed_statuses:

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid status. Allowed values are: "
                    "PENDING, UNDER_REVIEW, APPROVED, REJECTED."
                )
            },
            status=400
        )

    # ============================================================
    # UPDATE APPLICATION STATUS
    # ============================================================

    application.status = new_status
    application.save()

    # ============================================================
    # CREATE STUDENT NOTIFICATION
    # ============================================================

    notification_data = {

        "PENDING": {
            "title": "Application Status Updated",
            "message": (
                f"Your application for "
                f"'{application.scholarship.title}' "
                f"is currently pending."
            ),
        },

        "UNDER_REVIEW": {
            "title": "Application Under Review",
            "message": (
                f"Your application for "
                f"'{application.scholarship.title}' "
                f"is now under review by the scholarship provider."
            ),
        },

        "APPROVED": {
            "title": "Application Approved",
            "message": (
                f"Congratulations! Your application for "
                f"'{application.scholarship.title}' "
                f"has been approved by the scholarship provider."
            ),
        },

        "REJECTED": {
            "title": "Application Rejected",
            "message": (
                f"Your application for "
                f"'{application.scholarship.title}' "
                f"has been rejected by the scholarship provider."
            ),
        },

    }

    notification = notification_data.get(
        new_status
    )

    if notification:

        Notification.objects.create(
            user=application.student,
            title=notification["title"],
            message=notification["message"],
            type="APPLICATION",
        )

    # ============================================================
    # RESPONSE
    # ============================================================

    return Response(
        {
            "success": True,
            "message": "Application status updated successfully.",
            "application": {
                "id": application.id,
                "status": application.status,
                "status_display": application.get_status_display(),
                "updated_at": application.updated_at.isoformat(),
            },
        },
        status=200
    )


# ============================================================
# ADMIN APPLICATION MANAGEMENT API
# ============================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_applications_api(request):

    # --------------------------------------------------------
    # ADMIN ROLE CHECK
    # --------------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":
        return Response(
            {
                "success": False,
                "message": "Only administrator users can access application records."
            },
            status=403
        )

    # --------------------------------------------------------
    # GET ALL APPLICATIONS
    # --------------------------------------------------------

    applications = (
        Application.objects
        .all()
        .select_related(
            "student",
            "scholarship",
            "scholarship__provider"
        )
        .order_by(
            "-applied_at"
        )
    )

    application_list = []

    # --------------------------------------------------------
    # FORMAT APPLICATION DATA
    # --------------------------------------------------------

    for application in applications:

        student_name = ""

        # Try full_name if available
        if hasattr(application.student, "full_name"):
            student_name = (
                application.student.full_name or ""
            )

        # Try first name + last name
        if not student_name:

            student_name = (
                f"{application.student.first_name} "
                f"{application.student.last_name}"
            ).strip()

        # Final fallback
        if not student_name:
            student_name = application.student.email

        application_list.append(
            {
                "id": application.id,

                "student": {
                    "id": application.student.id,
                    "name": student_name,
                    "email": application.student.email,
                },

                "scholarship": {
                    "id": application.scholarship.id,
                    "title": application.scholarship.title,
                },

                "provider": {
                    "id": application.scholarship.provider.id,
                    "organization_name": (
                        application.scholarship.provider.organization_name
                    ),
                },

                "applied_at": application.applied_at.isoformat(),

                "status": application.status,

                "status_display": application.get_status_display(),
            }
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return Response(
        {
            "success": True,
            "count": len(application_list),
            "applications": application_list,
        },
        status=200
    )

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_application_student_details_api(
    request,
    application_id
):

    if getattr(request.user, "role", None) != "PROVIDER":
        return Response(
            {
                "success": False,
                "message": "Only provider users can view student details."
            },
            status=403
        )

    provider = getattr(
        request.user,
        "provider_profile",
        None
    )

    if not provider:
        return Response(
            {
                "success": False,
                "message": "Provider profile not found."
            },
            status=404
        )

    try:
        application = (
            Application.objects
            .select_related(
                "student",
                "scholarship",
                "scholarship__provider"
            )
            .get(
                id=application_id,
                scholarship__provider=provider
            )
        )

    except Application.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Application not found."
            },
            status=404
        )

    student = application.student

    # Student profile
    student_profile = getattr(
        student,
        "student_profile",
        None
    )

    student_data = {
        "id": student.id,
        "email": student.email,

        "full_name": (
            getattr(
                student_profile,
                "full_name",
                None
            )
            or f"{student.first_name} {student.last_name}".strip()
            or student.email
        ),

        "mobile": getattr(
            student,
            "mobile",
            ""
        ),

        "course": getattr(
            student_profile,
            "course",
            ""
        ),

        "specialization": getattr(
            student_profile,
            "specialization",
            ""
        ),

        "college": getattr(
            student_profile,
            "college",
            ""
        ),

        "category": getattr(
            student_profile,
            "category",
            ""
        ),

        "profile_completion": getattr(
            student_profile,
            "profile_completion",
            0
        ),
    }

    return Response(
        {
            "success": True,

            "application": {
                "id": application.id,
                "status": application.status,
                "status_display": application.get_status_display(),
                "applied_at": application.applied_at.isoformat(),
            },

            "scholarship": {
                "id": application.scholarship.id,
                "title": application.scholarship.title,
            },

            "student": student_data,
        },

        status=200
    )