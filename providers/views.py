from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from .forms import ProviderProfileForm
from applications.models import Application

from django.contrib.auth import login
from .forms import ProviderRegistrationForm

from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# ============================================================
# PROVIDER PROFILE
# ============================================================

@login_required
def provider_profile(request):

    profile = getattr(
        request.user,
        "provider_profile",
        None
    )

    if request.method == "POST":

        form = ProviderProfileForm(
            request.POST,
            instance=profile
        )

        if form.is_valid():

            provider_profile = form.save(
                commit=False
            )

            provider_profile.user = request.user
            provider_profile.save()

            return redirect(
                "provider_profile"
            )

    else:

        form = ProviderProfileForm(
            instance=profile
        )

    return render(
        request,
        "providers/provider_profile.html",
        {
            "form": form
        }
    )


# ============================================================
# PROVIDER REGISTRATION
# ============================================================

def provider_register(request):

    if request.method == "POST":

        form = ProviderRegistrationForm(
            request.POST
        )

        if form.is_valid():

            user = form.save()

            user.role = "PROVIDER"
            user.save()

            login(
                request,
                user
            )

            return redirect(
                "provider_profile"
            )

    else:

        form = ProviderRegistrationForm()

    return render(
        request,
        "providers/provider_register.html",
        {
            "form": form
        }
    )


# ============================================================
# PROVIDER DASHBOARD
# ============================================================

@login_required
def provider_dashboard(request):

    provider = request.user.provider_profile

    scholarships = (
        provider.scholarships
        .all()
        .order_by("-created_at")
    )

    total_scholarships = scholarships.count()

    approved_scholarships = scholarships.filter(
        status="APPROVED"
    ).count()

    pending_scholarships = scholarships.filter(
        status="PENDING"
    ).count()

    rejected_scholarships = scholarships.filter(
        status="REJECTED"
    ).count()

    total_applications = Application.objects.filter(
        scholarship__provider=provider
    ).count()

    pending_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="PENDING"
    ).count()

    under_review_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="UNDER_REVIEW"
    ).count()

    approved_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="APPROVED"
    ).count()

    context = {

        "provider": provider,

        "scholarships": scholarships,

        "total_scholarships": total_scholarships,

        "approved_scholarships":
            approved_scholarships,

        "pending_scholarships":
            pending_scholarships,

        "rejected_scholarships":
            rejected_scholarships,

        "total_applications":
            total_applications,

        "pending_applications":
            pending_applications,

        "under_review_applications":
            under_review_applications,

        "approved_applications":
            approved_applications,
    }

    return render(
        request,
        "providers/dashboard.html",
        context
    )


# ============================================================
# PROVIDER DASHBOARD API
# ============================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_dashboard_api(request):

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

    scholarships = (
        provider.scholarships
        .all()
        .order_by("-created_at")
    )

    # --------------------------------------------------------
    # SCHOLARSHIP STATISTICS
    # --------------------------------------------------------

    total_scholarships = scholarships.count()

    approved_scholarships = scholarships.filter(
        status="APPROVED"
    ).count()

    pending_scholarships = scholarships.filter(
        status="PENDING"
    ).count()

    rejected_scholarships = scholarships.filter(
        status="REJECTED"
    ).count()

    # --------------------------------------------------------
    # APPLICATION STATISTICS
    # --------------------------------------------------------

    total_applications = Application.objects.filter(
        scholarship__provider=provider
    ).count()

    pending_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="PENDING"
    ).count()

    under_review_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="UNDER_REVIEW"
    ).count()

    approved_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="APPROVED"
    ).count()

    # --------------------------------------------------------
    # RECENT SCHOLARSHIPS
    # --------------------------------------------------------

    recent_scholarships = scholarships[:5]

    # --------------------------------------------------------
    # UPCOMING DEADLINES
    # --------------------------------------------------------

    upcoming_deadlines = (
        scholarships
        .filter(status="APPROVED")
        .order_by("deadline")[:5]
    )

    # --------------------------------------------------------
    # RECENT APPLICATIONS
    # --------------------------------------------------------

    recent_applications = (
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
        )[:5]
    )

    # --------------------------------------------------------
    # API RESPONSE
    # --------------------------------------------------------

    return Response(

        {
            "success": True,

            # ----------------------------------------------
            # PROVIDER INFORMATION
            # ----------------------------------------------

            "provider": {

                "user_id": request.user.id,

                "email": request.user.email,

                "organization_name":
                    provider.organization_name,

                "organization_type":
                    provider.organization_type,

                "contact_person":
                    provider.contact_person,

                "phone":
                    provider.phone,

                "address":
                    provider.address,

                "verification_status":
                    provider.verification_status,
            },

            # ----------------------------------------------
            # SCHOLARSHIP STATISTICS
            # ----------------------------------------------

            "scholarship_stats": {

                "total":
                    total_scholarships,

                "approved":
                    approved_scholarships,

                "pending":
                    pending_scholarships,

                "rejected":
                    rejected_scholarships,
            },

            # ----------------------------------------------
            # APPLICATION STATISTICS
            # ----------------------------------------------

            "application_stats": {

                "total":
                    total_applications,

                "pending":
                    pending_applications,

                "under_review":
                    under_review_applications,

                "approved":
                    approved_applications,
            },

            # ----------------------------------------------
            # RECENT SCHOLARSHIPS
            # ----------------------------------------------

            "recent_scholarships": [

                {
                    "id":
                        scholarship.id,

                    "title":
                        scholarship.title,

                    "amount":
                        str(scholarship.amount),

                    "deadline":
                        scholarship.deadline,

                    "status":
                        scholarship.status,
                }

                for scholarship
                in recent_scholarships
            ],

            # ----------------------------------------------
            # UPCOMING DEADLINES
            # ----------------------------------------------

            "upcoming_deadlines": [

                {
                    "id":
                        scholarship.id,

                    "title":
                        scholarship.title,

                    "deadline":
                        scholarship.deadline,

                    "status":
                        scholarship.status,
                }

                for scholarship
                in upcoming_deadlines
            ],

            # ----------------------------------------------
            # RECENT APPLICATIONS
            # ----------------------------------------------

            "recent_applications": [

                {
                    "id":
                        application.id,

                    "student_id":
                        application.student.id,

                    "student_email":
                        application.student.email,

                    "scholarship_id":
                        application.scholarship.id,

                    "scholarship_title":
                        application.scholarship.title,

                    "status":
                        application.status,

                    "status_display":
                        application.get_status_display(),

                    "applied_at":
                        application.applied_at,
                }

                for application
                in recent_applications
            ],
        },

        status=200
    )


# ============================================================
# PROVIDER PROFILE API
# ============================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_profile_api(request):

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

    return Response(
        {
            "success": True,

            "provider": {
                "user_id": request.user.id,

                "email": request.user.email,

                "organization_name":
                    provider.organization_name,

                "organization_type":
                    provider.organization_type,

                "contact_person":
                    provider.contact_person,

                "phone":
                    provider.phone,

                "address":
                    provider.address,

                "verification_status":
                    provider.verification_status,
            }
        },

        status=200
    )


# ============================================================
# ADMIN - PROVIDER LIST API
# ============================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_provider_list_api(request):

    # ========================================================
    # CHECK ADMIN ROLE
    # ========================================================

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": "Only admin users can access provider records."
            },
            status=403
        )

    # ========================================================
    # IMPORT PROVIDER PROFILE
    # ========================================================

    from .models import ProviderProfile

    # ========================================================
    # GET ALL PROVIDERS
    # ========================================================

    providers = (
        ProviderProfile.objects
        .select_related("user")
        .all()
        .order_by("-created_at")
    )

    provider_list = []

    # ========================================================
    # BUILD PROVIDER RESPONSE
    # ========================================================

    for provider in providers:

        # ----------------------------------------------------
        # ACCOUNT STATUS
        # ----------------------------------------------------

        if not provider.user.is_active:

            account_status = "Inactive"

        else:

            account_status = "Active"

        # ----------------------------------------------------
        # VERIFICATION STATUS
        # ----------------------------------------------------

        verification_status = (
            provider.verification_status
        )

        # ----------------------------------------------------
        # REGISTRATION DATE
        # ----------------------------------------------------

        registration_date = ""

        if provider.created_at:

            registration_date = (
                provider.created_at.strftime(
                    "%d %b %Y"
                )
            )

        # ----------------------------------------------------
        # ORGANIZATION TYPE DISPLAY
        # ----------------------------------------------------

        organization_type = (
            provider.get_organization_type_display()
        )

        # ----------------------------------------------------
        # VERIFICATION STATUS DISPLAY
        # ----------------------------------------------------

        verification_status_display = (
            provider.get_verification_status_display()
        )

        # ----------------------------------------------------
        # PROVIDER DATA
        # ----------------------------------------------------

        provider_list.append(
            {
                "id": provider.id,

                "user_id":
                    provider.user.id,

                "organization_name":
                    provider.organization_name,

                "organization_type":
                    organization_type,

                "organization_type_code":
                    provider.organization_type,

                "contact_person":
                    provider.contact_person,

                "email":
                    provider.user.email or "",

                "phone":
                    provider.phone or "",

                "address":
                    provider.address or "",

                "verification_status":
                    verification_status,

                "verification_status_display":
                    verification_status_display,

                "registration_date":
                    registration_date,

                "account_status":
                    account_status,
            }
        )

    # ========================================================
    # API RESPONSE
    # ========================================================

    return Response(
        {
            "success": True,
            "count": len(provider_list),
            "providers": provider_list
        },
        status=200
    )

# =========================================================
# PROVIDER - CREATE SCHOLARSHIP API
# =========================================================

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_create_scholarship_api(request):

    # -----------------------------------------------------
    # CHECK PROVIDER ROLE
    # -----------------------------------------------------

    if getattr(request.user, "role", None) != "PROVIDER":

        return Response(
            {
                "success": False,
                "message": "Only provider users can create scholarships."
            },
            status=403
        )

    # -----------------------------------------------------
    # GET PROVIDER PROFILE
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # CHECK PROVIDER VERIFICATION
    # -----------------------------------------------------

    if provider.verification_status != "VERIFIED":

        return Response(
            {
                "success": False,
                "message": (
                    "Your provider account is not verified yet. "
                    "You cannot create a scholarship until your "
                    "provider profile is verified."
                ),
                "verification_status":
                    provider.verification_status,
            },
            status=403
        )

    # -----------------------------------------------------
    # GET BASIC SCHOLARSHIP DATA
    # -----------------------------------------------------

    title = request.data.get("title")
    description = request.data.get("description")
    amount = request.data.get("amount")
    application_start = request.data.get("application_start")
    deadline = request.data.get("deadline")

    # -----------------------------------------------------
    # VALIDATE BASIC DATA
    # -----------------------------------------------------

    if not title:
        return Response(
            {
                "success": False,
                "message": "Scholarship title is required."
            },
            status=400
        )

    if not description:
        return Response(
            {
                "success": False,
                "message": "Scholarship description is required."
            },
            status=400
        )

    if amount in [None, ""]:
        return Response(
            {
                "success": False,
                "message": "Scholarship amount is required."
            },
            status=400
        )

    if not application_start:
        return Response(
            {
                "success": False,
                "message": "Application start date is required."
            },
            status=400
        )

    if not deadline:
        return Response(
            {
                "success": False,
                "message": "Scholarship deadline is required."
            },
            status=400
        )

    # -----------------------------------------------------
    # CREATE SCHOLARSHIP
    # -----------------------------------------------------

    try:

        scholarship = Scholarship.objects.create(
            provider=provider,
            title=title,
            description=description,
            amount=amount,
            application_start=application_start,
            deadline=deadline,
            status="PENDING",
        )

    except Exception as error:

        return Response(
            {
                "success": False,
                "message": "Unable to create scholarship.",
                "error": str(error),
            },
            status=400
        )

    # -----------------------------------------------------
    # GET ELIGIBILITY DATA
    # -----------------------------------------------------

    eligibility_data = request.data.get(
        "eligibility",
        {}
    )

    if not isinstance(
        eligibility_data,
        dict
    ):

        eligibility_data = {}

    # -----------------------------------------------------
    # CREATE ELIGIBILITY
    # -----------------------------------------------------

    ScholarshipEligibility.objects.create(

        scholarship=scholarship,

        eligible_courses=
            eligibility_data.get(
                "eligible_courses",
                ""
            ),

        specialization=
            eligibility_data.get(
                "specialization",
                ""
            ),

        minimum_percentage=
            eligibility_data.get(
                "minimum_percentage"
            )
            if eligibility_data.get(
                "minimum_percentage"
            ) not in ["", None]
            else None,

        maximum_income=
            eligibility_data.get(
                "maximum_income"
            )
            if eligibility_data.get(
                "maximum_income"
            ) not in ["", None]
            else None,

        category=
            eligibility_data.get(
                "category",
                ""
            ),

        gender=
            eligibility_data.get(
                "gender",
                ""
            ),

        state=
            eligibility_data.get(
                "state",
                ""
            ),

        other_criteria=
            eligibility_data.get(
                "other_criteria",
                ""
            ),
    )

    # -----------------------------------------------------
    # GET REQUIRED DOCUMENTS
    # -----------------------------------------------------

    required_documents = request.data.get(
        "required_documents",
        []
    )

    if not isinstance(
        required_documents,
        list
    ):

        required_documents = []

    # -----------------------------------------------------
    # CREATE REQUIRED DOCUMENTS
    # -----------------------------------------------------

    for document in required_documents:

        if not isinstance(
            document,
            dict
        ):
            continue

        document_type = document.get(
            "document_type"
        )

        if not document_type:
            continue

        ScholarshipRequiredDocument.objects.create(

            scholarship=scholarship,

            document_type=document_type,

            is_mandatory=document.get(
                "is_mandatory",
                True
            ),

            description=document.get(
                "description",
                ""
            ),
        )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return Response(
        {
            "success": True,

            "message": (
                "Scholarship created successfully "
                "and submitted for admin approval."
            ),

            "scholarship": {
                "id": scholarship.id,

                "title": scholarship.title,

                "description":
                    scholarship.description,

                "amount":
                    str(scholarship.amount),

                "application_start":
                    scholarship.application_start,

                "deadline":
                    scholarship.deadline,

                "status":
                    scholarship.status,

                "status_display":
                    scholarship.get_status_display(),

                "provider": {
                    "id": provider.id,

                    "organization_name":
                        provider.organization_name,
                },
            },
        },
        status=201
    )