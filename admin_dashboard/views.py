from django.contrib.auth import get_user_model
from django.db.models import Count

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from students.models import StudentProfile
from providers.models import ProviderProfile
from scholarships.models import Scholarship
from applications.models import Application
from documents.models import StudentDocument

from admin_dashboard.models import AdminSettings
from admin_dashboard.serializers import AdminSettingsSerializer


User = get_user_model()


# =========================================================
# ADMIN DASHBOARD API
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_dashboard_api(request):

    # --------------------------------------------------
    # ADMIN ACCESS CHECK
    # --------------------------------------------------

    if request.user.role != "ADMIN":
        return Response(
            {
                "message": "Admin access required"
            },
            status=403
        )

    # --------------------------------------------------
    # ADMIN INFORMATION
    # --------------------------------------------------

    admin_first_name = request.user.first_name or ""
    admin_last_name = request.user.last_name or ""

    admin_name = (
        f"{admin_first_name} {admin_last_name}"
    ).strip()

    if not admin_name:
        admin_name = "Administrator"

    # --------------------------------------------------
    # BASIC COUNTS
    # --------------------------------------------------

    total_students = StudentProfile.objects.count()

    total_providers = ProviderProfile.objects.count()

    total_scholarships = Scholarship.objects.count()

    total_applications = Application.objects.count()

    # --------------------------------------------------
    # PROVIDER COUNTS
    # --------------------------------------------------

    pending_providers = ProviderProfile.objects.filter(
        verification_status="PENDING"
    ).count()

    verified_providers = ProviderProfile.objects.filter(
        verification_status="VERIFIED"
    ).count()

    rejected_providers = ProviderProfile.objects.filter(
        verification_status="REJECTED"
    ).count()

    # --------------------------------------------------
    # SCHOLARSHIP COUNTS
    # --------------------------------------------------

    pending_scholarships = Scholarship.objects.filter(
        status="PENDING"
    ).count()

    approved_scholarships = Scholarship.objects.filter(
        status="APPROVED"
    ).count()

    rejected_scholarships = Scholarship.objects.filter(
        status="REJECTED"
    ).count()

    closed_scholarships = Scholarship.objects.filter(
        status="CLOSED"
    ).count()

    # --------------------------------------------------
    # APPLICATION COUNTS
    # --------------------------------------------------

    pending_applications = Application.objects.filter(
        status="PENDING"
    ).count()

    under_review_applications = Application.objects.filter(
        status="UNDER_REVIEW"
    ).count()

    approved_applications = Application.objects.filter(
        status="APPROVED"
    ).count()

    rejected_applications = Application.objects.filter(
        status="REJECTED"
    ).count()

    # --------------------------------------------------
    # DOCUMENT COUNTS
    # --------------------------------------------------

    total_documents = StudentDocument.objects.count()

    pending_documents = StudentDocument.objects.filter(
        verification_status="PENDING"
    ).count()

    verified_documents = StudentDocument.objects.filter(
        verification_status="VERIFIED"
    ).count()

    rejected_documents = StudentDocument.objects.filter(
        verification_status="REJECTED"
    ).count()

    # --------------------------------------------------
    # RECENT STUDENTS
    # --------------------------------------------------

    recent_students = StudentProfile.objects.order_by(
        "-created_at"
    )[:5]

    # --------------------------------------------------
    # RECENT PROVIDERS
    # --------------------------------------------------

    recent_providers = ProviderProfile.objects.order_by(
        "-created_at"
    )[:5]

    # --------------------------------------------------
    # RECENT SCHOLARSHIPS
    # --------------------------------------------------

    recent_scholarships = Scholarship.objects.order_by(
        "-created_at"
    )[:5]

    # --------------------------------------------------
    # RECENT APPLICATIONS
    # --------------------------------------------------

    recent_applications = Application.objects.select_related(
        "student",
        "scholarship"
    ).order_by(
        "-applied_at"
    )[:5]

    # --------------------------------------------------
    # RECENT ACTIVITY
    # --------------------------------------------------

    recent_activity = []

    # --------------------------------------------------
    # STUDENT ACTIVITY
    # --------------------------------------------------

    for student in recent_students:

        recent_activity.append(
            {
                "type": "STUDENT",
                "title": "New student registration",
                "description": (
                    f"{student.full_name} registered on ScholarBridge AI."
                ),
                "time": student.created_at,
            }
        )

    # --------------------------------------------------
    # PROVIDER ACTIVITY
    # --------------------------------------------------

    for provider in recent_providers:

        recent_activity.append(
            {
                "type": "PROVIDER",
                "title": "New provider registered",
                "description": (
                    f"{provider.organization_name} "
                    f"registered as a provider."
                ),
                "time": provider.created_at,
            }
        )

    # --------------------------------------------------
    # SCHOLARSHIP ACTIVITY
    # --------------------------------------------------

    for scholarship in recent_scholarships:

        recent_activity.append(
            {
                "type": "SCHOLARSHIP",
                "title": "Scholarship submitted",
                "description": (
                    f"{scholarship.title} "
                    f"was submitted for review."
                ),
                "time": scholarship.created_at,
            }
        )

    # --------------------------------------------------
    # APPLICATION ACTIVITY
    # --------------------------------------------------

    for application in recent_applications:

        recent_activity.append(
            {
                "type": "APPLICATION",
                "title": "Application received",
                "description": (
                    f"New application received for "
                    f"{application.scholarship.title}."
                ),
                "time": application.applied_at,
            }
        )

    # --------------------------------------------------
    # SORT RECENT ACTIVITY
    # --------------------------------------------------

    recent_activity.sort(
        key=lambda item: item["time"],
        reverse=True
    )

    # --------------------------------------------------
    # LATEST 10 ACTIVITIES
    # --------------------------------------------------

    recent_activity = recent_activity[:10]

    # --------------------------------------------------
    # CONVERT DATETIME TO JSON FORMAT
    # --------------------------------------------------

    for activity in recent_activity:

        activity["time"] = activity["time"].isoformat()

    # --------------------------------------------------
    # RESPONSE
    # --------------------------------------------------

    return Response(
        {
            "message": "Admin dashboard data fetched successfully",

            # --------------------------------------------------
            # ADMIN INFORMATION
            # --------------------------------------------------

            "admin": {
                "name": admin_name,
                "first_name": admin_first_name,
                "last_name": admin_last_name,
                "email": request.user.email,
                "role": request.user.role,
            },

            # --------------------------------------------------
            # MAIN STATS
            # --------------------------------------------------

            "stats": {
                "total_students": total_students,
                "total_providers": total_providers,
                "total_scholarships": total_scholarships,
                "total_applications": total_applications,
            },

            # --------------------------------------------------
            # PROVIDERS
            # --------------------------------------------------

            "providers": {
                "total": total_providers,
                "pending": pending_providers,
                "verified": verified_providers,
                "rejected": rejected_providers,
            },

            # --------------------------------------------------
            # SCHOLARSHIPS
            # --------------------------------------------------

            "scholarships": {
                "total": total_scholarships,
                "pending": pending_scholarships,
                "approved": approved_scholarships,
                "rejected": rejected_scholarships,
                "closed": closed_scholarships,
            },

            # --------------------------------------------------
            # APPLICATIONS
            # --------------------------------------------------

            "applications": {
                "total": total_applications,
                "pending": pending_applications,
                "under_review": under_review_applications,
                "approved": approved_applications,
                "rejected": rejected_applications,
            },

            # --------------------------------------------------
            # DOCUMENTS
            # --------------------------------------------------

            "documents": {
                "total": total_documents,
                "pending": pending_documents,
                "verified": verified_documents,
                "rejected": rejected_documents,
            },

            # --------------------------------------------------
            # PENDING APPROVALS
            # --------------------------------------------------

            "pending_approvals": {
                "scholarships": pending_scholarships,
                "providers": pending_providers,
                "documents": pending_documents,
            },

            # --------------------------------------------------
            # RECENT ACTIVITY
            # --------------------------------------------------

            "recent_activity": recent_activity,
        }
    )


# =========================================================
# ADMIN SETTINGS API
# =========================================================

@api_view(["GET", "PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_settings_api(request):

    # --------------------------------------------------
    # ADMIN ACCESS CHECK
    # --------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": "Admin access required."
            },
            status=403
        )

    # --------------------------------------------------
    # GET OR CREATE ADMIN SETTINGS
    # --------------------------------------------------

    settings, created = AdminSettings.objects.get_or_create(
        admin=request.user
    )

    # --------------------------------------------------
    # GET SETTINGS
    # --------------------------------------------------

    if request.method == "GET":

        serializer = AdminSettingsSerializer(
            settings
        )

        return Response(
            {
                "success": True,
                "settings": serializer.data
            },
            status=200
        )

    # --------------------------------------------------
    # UPDATE SETTINGS
    # --------------------------------------------------

    if request.method == "PUT":

        serializer = AdminSettingsSerializer(
            settings,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Admin settings saved successfully.",
                    "settings": serializer.data
                },
                status=200
            )

        return Response(
            {
                "success": False,
                "message": "Invalid settings data.",
                "errors": serializer.errors
            },
            status=400
        )


# =========================================================
# RESET ADMIN SETTINGS API
# =========================================================

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def reset_admin_settings(request):

    # --------------------------------------------------
    # ADMIN ACCESS CHECK
    # --------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": "Admin access required."
            },
            status=403
        )

    # --------------------------------------------------
    # GET OR CREATE SETTINGS
    # --------------------------------------------------

    settings, created = AdminSettings.objects.get_or_create(
        admin=request.user
    )

    # --------------------------------------------------
    # RESET TO DEFAULT VALUES
    # --------------------------------------------------

    settings.language = "English"

    settings.timezone = "Asia/Kolkata"

    settings.items_per_page = 10

    settings.email_notifications = True

    settings.application_notifications = True

    settings.provider_notifications = True

    settings.scholarship_notifications = True

    settings.two_factor_auth = False

    settings.maintenance_mode = False

    settings.save()

    # --------------------------------------------------
    # SERIALIZE UPDATED SETTINGS
    # --------------------------------------------------

    serializer = AdminSettingsSerializer(
        settings
    )

    # --------------------------------------------------
    # RESPONSE
    # --------------------------------------------------

    return Response(
        {
            "success": True,
            "message": "Admin settings have been reset.",
            "settings": serializer.data
        },
        status=200
    )
# =========================================================
# ADMIN VERIFY PROVIDER API
# =========================================================

@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def verify_provider_api(request, provider_id):

    # --------------------------------------------------
    # ADMIN ACCESS CHECK
    # --------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": "Admin access required."
            },
            status=403
        )

    # --------------------------------------------------
    # GET PROVIDER
    # --------------------------------------------------

    try:

        provider = ProviderProfile.objects.get(
            id=provider_id
        )

    except ProviderProfile.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Provider not found."
            },
            status=404
        )

    # --------------------------------------------------
    # VERIFY PROVIDER
    # --------------------------------------------------

    provider.verification_status = "VERIFIED"

    provider.save(
        update_fields=[
            "verification_status",
            "updated_at"
        ]
    )

    # --------------------------------------------------
    # RESPONSE
    # --------------------------------------------------

    return Response(
        {
            "success": True,
            "message": "Provider verified successfully.",
            "provider": {
                "id": provider.id,
                "organization_name": provider.organization_name,
                "verification_status": provider.verification_status,
            }
        },
        status=200
    )