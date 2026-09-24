from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.db import transaction
from datetime import date

from .models import (
    Scholarship,
    ScholarshipEligibility,
    ScholarshipRequiredDocument,
    SavedScholarship,
)

from .forms import (
    ScholarshipForm,
    ScholarshipEligibilityForm,
    ScholarshipRequiredDocumentForm,
)

from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    ScholarshipSerializer,
    SavedScholarshipSerializer,
)


# =========================================================
# CREATE SCHOLARSHIP
# =========================================================

@login_required
def create_scholarship(request):

    if request.method == "POST":

        form = ScholarshipForm(request.POST)

        if form.is_valid():

            scholarship = form.save(commit=False)

            scholarship.provider = request.user.provider_profile

            scholarship.save()

            return redirect(
                "add_eligibility",
                scholarship_id=scholarship.id
            )

    else:

        form = ScholarshipForm()

    return render(
        request,
        "scholarships/create_scholarship.html",
        {
            "form": form
        }
    )


# =========================================================
# ADD ELIGIBILITY
# =========================================================

@login_required
def add_eligibility(request, scholarship_id):

    scholarship = Scholarship.objects.get(
        id=scholarship_id
    )

    if request.method == "POST":

        form = ScholarshipEligibilityForm(
            request.POST
        )

        if form.is_valid():

            eligibility = form.save(
                commit=False
            )

            eligibility.scholarship = scholarship

            eligibility.save()

            return redirect(
                "add_eligibility",
                scholarship_id=scholarship.id
            )

    else:

        form = ScholarshipEligibilityForm()

    return render(
        request,
        "scholarships/add_eligibility.html",
        {
            "form": form,
            "scholarship": scholarship,
        }
    )


# =========================================================
# ADD REQUIRED DOCUMENT
# =========================================================

@login_required
def add_required_document(request, scholarship_id):

    scholarship = Scholarship.objects.get(
        id=scholarship_id
    )

    if request.method == "POST":

        form = ScholarshipRequiredDocumentForm(
            request.POST
        )

        if form.is_valid():

            document = form.save(
                commit=False
            )

            document.scholarship = scholarship

            document.save()

            return redirect(
                "add_required_document",
                scholarship_id=scholarship.id
            )

    else:

        form = ScholarshipRequiredDocumentForm()

    return render(
        request,
        "scholarships/add_required_document.html",
        {
            "form": form,
            "scholarship": scholarship,
        }
    )


# =========================================================
# SCHOLARSHIP LIST
# =========================================================

@login_required
def scholarship_list(request):

    search = request.GET.get(
        "search",
        ""
    )

    scholarships = Scholarship.objects.filter(
        status="APPROVED"
    ).order_by(
        "deadline"
    )

    if search:

        scholarships = scholarships.filter(
            title__icontains=search
        )

    return render(
        request,
        "scholarships/scholarship_list.html",
        {
            "scholarships": scholarships,
            "search": search,
        }
    )


# =========================================================
# SCHOLARSHIP DETAIL
# =========================================================

@login_required
def scholarship_detail(
    request,
    scholarship_id
):

    scholarship = Scholarship.objects.get(
        id=scholarship_id,
        status="APPROVED"
    )

    eligibility = getattr(
        scholarship,
        "eligibility",
        None
    )

    required_documents = (
        scholarship.required_documents.all()
    )

    return render(
        request,
        "scholarships/scholarship_detail.html",
        {
            "scholarship": scholarship,
            "eligibility": eligibility,
            "required_documents": required_documents,
        }
    )


# =========================================================
# CHECK ELIGIBILITY
# =========================================================

@login_required
def check_eligibility(
    request,
    scholarship_id
):

    scholarship = Scholarship.objects.get(
        id=scholarship_id,
        status="APPROVED"
    )

    student_profile = getattr(
        request.user,
        "student_profile",
        None
    )

    eligibility = getattr(
        scholarship,
        "eligibility",
        None
    )

    eligible = True

    reasons = []

    if not student_profile:

        eligible = False

        reasons.append(
            "Please complete your student profile first."
        )

    elif not eligibility:

        eligible = False

        reasons.append(
            "Eligibility criteria are not available yet."
        )

    else:

        # Academic Score

        if (
            eligibility.minimum_percentage is not None
            and (
                student_profile.academic_score is None
                or
                student_profile.academic_score
                < eligibility.minimum_percentage
            )
        ):

            eligible = False

            reasons.append(
                "Your academic score is below the minimum requirement."
            )

        # Family Income

        if (
            eligibility.maximum_income is not None
            and (
                student_profile.family_income is None
                or
                student_profile.family_income
                > eligibility.maximum_income
            )
        ):

            eligible = False

            reasons.append(
                "Your family income is above the maximum limit."
            )

        # State

        if (
            eligibility.state
            and student_profile.state
            and
            eligibility.state.lower()
            !=
            student_profile.state.lower()
        ):

            eligible = False

            reasons.append(
                "Your state does not match the scholarship requirement."
            )

        # Course

        if (
            eligibility.eligible_courses
            and student_profile.course
        ):

            courses = [
                course.strip().lower()
                for course
                in
                eligibility.eligible_courses.split(",")
            ]

            if (
                student_profile.course.lower()
                not in courses
            ):

                eligible = False

                reasons.append(
                    "Your course does not match the scholarship requirement."
                )

        # Specialization

        if (
            eligibility.specialization
            and student_profile.specialization
        ):

            specializations = [
                specialization.strip().lower()
                for specialization
                in
                eligibility.specialization.split(",")
            ]

            if (
                student_profile.specialization.lower()
                not in specializations
            ):

                eligible = False

                reasons.append(
                    "Your specialization does not match the scholarship requirement."
                )

        # Category

        if (
            eligibility.category
            and student_profile.category
        ):

            categories = [
                category.strip().lower()
                for category
                in
                eligibility.category.split(",")
            ]

            if (
                student_profile.category.lower()
                not in categories
            ):

                eligible = False

                reasons.append(
                    "Your category does not match the scholarship requirement."
                )

        # Gender

        if (
            eligibility.gender
            and
            eligibility.gender.lower()
            !=
            "all"
            and
            student_profile.gender
        ):

            genders = [
                gender.strip().lower()
                for gender
                in
                eligibility.gender.split(",")
            ]

            if (
                student_profile.gender.lower()
                not in genders
            ):

                eligible = False

                reasons.append(
                    "Your gender does not match the scholarship requirement."
                )

    return render(
        request,
        "scholarships/check_eligibility.html",
        {
            "scholarship": scholarship,
            "eligible": eligible,
            "reasons": reasons,
        }
    )


# =========================================================
# SCHOLARSHIP API
# =========================================================

@api_view(["GET"])
def scholarship_api(request):

    scholarships = Scholarship.objects.filter(
        status="APPROVED"
    )

    serializer = ScholarshipSerializer(
        scholarships,
        many=True
    )

    return Response(
        serializer.data
    )


# =========================================================
# SCHOLARSHIP DETAIL API
# =========================================================

@api_view(["GET"])
def scholarship_detail_api(
    request,
    scholarship_id
):

    try:

        scholarship = Scholarship.objects.get(
            id=scholarship_id,
            status="APPROVED"
        )

    except Scholarship.DoesNotExist:

        return Response(
            {
                "message": "Scholarship not found"
            },
            status=404
        )

    serializer = ScholarshipSerializer(
        scholarship
    )

    return Response(
        serializer.data,
        status=200
    )


# =========================================================
# PROVIDER CREATE SCHOLARSHIP API
# =========================================================

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_create_scholarship_api(request):

    # -----------------------------------------------------
    # ONLY PROVIDER CAN CREATE SCHOLARSHIP
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
    # PROVIDER VERIFICATION CHECK
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
                "verification_status": (
                    provider.verification_status
                ),
            },
            status=403
        )

    # -----------------------------------------------------
    # BASIC SCHOLARSHIP DATA
    # -----------------------------------------------------

    title = request.data.get("title")
    description = request.data.get("description")
    amount = request.data.get("amount")
    application_start = request.data.get(
        "application_start"
    )
    deadline = request.data.get(
        "deadline"
    )

    # -----------------------------------------------------
    # REQUIRED FIELD VALIDATION
    # -----------------------------------------------------

    missing_fields = []

    if not title:
        missing_fields.append("title")

    if not description:
        missing_fields.append("description")

    if amount in [None, ""]:
        missing_fields.append("amount")

    if not application_start:
        missing_fields.append(
            "application_start"
        )

    if not deadline:
        missing_fields.append(
            "deadline"
        )

    if missing_fields:

        return Response(
            {
                "success": False,
                "message": "Please provide all required fields.",
                "missing_fields": missing_fields,
            },
            status=400
        )

    # -----------------------------------------------------
    # DATE VALIDATION
    # -----------------------------------------------------

    try:

        application_start_date = date.fromisoformat(
            application_start
        )

        deadline_date = date.fromisoformat(
            deadline
        )

    except (ValueError, TypeError):

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid date format. "
                    "Use YYYY-MM-DD."
                ),
            },
            status=400
        )

    # -----------------------------------------------------
    # DEADLINE VALIDATION
    # -----------------------------------------------------

    if deadline_date < application_start_date:

        return Response(
            {
                "success": False,
                "message": (
                    "Deadline cannot be earlier "
                    "than application start date."
                ),
            },
            status=400
        )

    # -----------------------------------------------------
    # AMOUNT VALIDATION
    # -----------------------------------------------------

    try:

        amount_value = float(amount)

        if amount_value < 0:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Scholarship amount cannot be negative."
                    ),
                },
                status=400
            )

    except (ValueError, TypeError):

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid scholarship amount."
                ),
            },
            status=400
        )

    # -----------------------------------------------------
    # ELIGIBILITY DATA
    # -----------------------------------------------------

    eligibility_data = request.data.get(
        "eligibility",
        {}
    )

    if not isinstance(
        eligibility_data,
        dict
    ):

        return Response(
            {
                "success": False,
                "message": (
                    "Eligibility must be an object."
                ),
            },
            status=400
        )

    # -----------------------------------------------------
    # REQUIRED DOCUMENTS
    # -----------------------------------------------------

    required_documents = request.data.get(
        "required_documents",
        []
    )

    if not isinstance(
        required_documents,
        list
    ):

        return Response(
            {
                "success": False,
                "message": (
                    "required_documents must be an array."
                ),
            },
            status=400
        )

    # -----------------------------------------------------
    # CREATE SCHOLARSHIP
    # -----------------------------------------------------

    try:

        with transaction.atomic():

            scholarship = Scholarship.objects.create(
                provider=provider,
                title=title,
                description=description,
                amount=amount,
                application_start=application_start_date,
                deadline=deadline_date,
                status="PENDING",
            )

            # -------------------------------------------------
            # CREATE ELIGIBILITY
            # -------------------------------------------------

            minimum_percentage = (
                eligibility_data.get(
                    "minimum_percentage"
                )
            )

            maximum_income = (
                eligibility_data.get(
                    "maximum_income"
                )
            )

            if minimum_percentage in ["", None]:
                minimum_percentage = None

            if maximum_income in ["", None]:
                maximum_income = None

            ScholarshipEligibility.objects.create(
                scholarship=scholarship,

                eligible_courses=(
                    eligibility_data.get(
                        "eligible_courses",
                        ""
                    )
                ),

                specialization=(
                    eligibility_data.get(
                        "specialization",
                        ""
                    )
                ),

                minimum_percentage=(
                    minimum_percentage
                ),

                maximum_income=(
                    maximum_income
                ),

                category=(
                    eligibility_data.get(
                        "category",
                        ""
                    )
                ),

                gender=(
                    eligibility_data.get(
                        "gender",
                        ""
                    )
                ),

                state=(
                    eligibility_data.get(
                        "state",
                        ""
                    )
                ),

                other_criteria=(
                    eligibility_data.get(
                        "other_criteria",
                        ""
                    )
                ),
            )

            # -------------------------------------------------
            # CREATE REQUIRED DOCUMENTS
            # -------------------------------------------------

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

    except Exception as error:

        return Response(
            {
                "success": False,
                "message": (
                    "Scholarship could not be created."
                ),
                "error": str(error),
            },
            status=400
        )

    # -----------------------------------------------------
    # SUCCESS RESPONSE
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

                "description": scholarship.description,

                "amount": str(
                    scholarship.amount
                ),

                "application_start": (
                    scholarship.application_start
                ),

                "deadline": (
                    scholarship.deadline
                ),

                "status": scholarship.status,

                "status_display": (
                    scholarship.get_status_display()
                ),

                "provider": {

                    "id": provider.id,

                    "organization_name": (
                        provider.organization_name
                    ),
                },
            },
        },
        status=201
    )


# =========================================================
# SAVE SCHOLARSHIP API
# =========================================================

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_scholarship_api(
    request,
    scholarship_id
):

    try:

        scholarship = Scholarship.objects.get(
            id=scholarship_id,
            status="APPROVED"
        )

    except Scholarship.DoesNotExist:

        return Response(
            {
                "message": "Scholarship not found"
            },
            status=404
        )

    saved_scholarship, created = (
        SavedScholarship.objects.get_or_create(
            student=request.user,
            scholarship=scholarship
        )
    )

    if not created:

        return Response(
            {
                "message": "Scholarship already saved"
            },
            status=200
        )

    return Response(
        {
            "message": "Scholarship saved successfully",
            "saved_id": saved_scholarship.id,
            "scholarship_id": scholarship.id,
            "scholarship_title": scholarship.title,
        },
        status=201
    )


# =========================================================
# UNSAVE SCHOLARSHIP API
# =========================================================

@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def unsave_scholarship_api(
    request,
    scholarship_id
):

    saved_scholarship = (
        SavedScholarship.objects.filter(
            student=request.user,
            scholarship_id=scholarship_id
        ).first()
    )

    if not saved_scholarship:

        return Response(
            {
                "message": "Scholarship is not saved"
            },
            status=404
        )

    saved_scholarship.delete()

    return Response(
        {
            "message": (
                "Scholarship removed from saved scholarships"
            )
        },
        status=200
    )


# =========================================================
# MY SAVED SCHOLARSHIPS API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_saved_scholarships_api(request):

    saved_scholarships = (
        SavedScholarship.objects
        .filter(
            student=request.user
        )
        .select_related(
            "scholarship",
            "scholarship__provider"
        )
        .order_by(
            "-saved_at"
        )
    )

    serializer = SavedScholarshipSerializer(
        saved_scholarships,
        many=True
    )

    return Response(
        serializer.data,
        status=200
    )


# =========================================================
# ADMIN SCHOLARSHIP MANAGEMENT API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_scholarship_list_api(request):

    # -----------------------------------------------------
    # ONLY ADMIN CAN ACCESS
    # -----------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": (
                    "Only admin users can access "
                    "scholarship records."
                )
            },
            status=403
        )

    # -----------------------------------------------------
    # GET ALL SCHOLARSHIPS
    # -----------------------------------------------------

    scholarships = (
        Scholarship.objects
        .select_related(
            "provider",
            "provider__user"
        )
        .all()
        .order_by(
            "-created_at"
        )
    )

    scholarship_list = []

    # -----------------------------------------------------
    # PREPARE RESPONSE
    # -----------------------------------------------------

    for scholarship in scholarships:

        # Provider information
        provider = scholarship.provider

        organization_name = (
            provider.organization_name
            if provider
            else "Not Provided"
        )

        provider_email = ""

        if provider and provider.user:

            provider_email = (
                provider.user.email or ""
            )

        # Status
        status_code = scholarship.status

        status_display = (
            scholarship.get_status_display()
        )

        # Amount
        amount = str(
            scholarship.amount
        )

        # Dates
        application_start = ""

        if scholarship.application_start:

            application_start = (
                scholarship.application_start.strftime(
                    "%d %b %Y"
                )
            )

        deadline = ""

        if scholarship.deadline:

            deadline = (
                scholarship.deadline.strftime(
                    "%d %b %Y"
                )
            )

        registration_date = ""

        if scholarship.created_at:

            registration_date = (
                scholarship.created_at.strftime(
                    "%d %b %Y"
                )
            )

        # -------------------------------------------------
        # ELIGIBILITY
        # -------------------------------------------------

        eligibility = getattr(
            scholarship,
            "eligibility",
            None
        )

        eligibility_data = None

        if eligibility:

            eligibility_data = {

                "eligible_courses": (
                    eligibility.eligible_courses
                ),

                "specialization": (
                    eligibility.specialization
                ),

                "minimum_percentage": (
                    str(
                        eligibility.minimum_percentage
                    )
                    if (
                        eligibility.minimum_percentage
                        is not None
                    )
                    else None
                ),

                "maximum_income": (
                    str(
                        eligibility.maximum_income
                    )
                    if (
                        eligibility.maximum_income
                        is not None
                    )
                    else None
                ),

                "category": (
                    eligibility.category
                ),

                "gender": (
                    eligibility.gender
                ),

                "state": (
                    eligibility.state
                ),

                "other_criteria": (
                    eligibility.other_criteria
                ),
            }

        # -------------------------------------------------
        # REQUIRED DOCUMENTS
        # -------------------------------------------------

        required_documents = []

        for document in (
            scholarship.required_documents.all()
        ):

            required_documents.append(
                {
                    "id": document.id,

                    "document_type": (
                        document.document_type
                    ),

                    "document_type_display": (
                        document.get_document_type_display()
                    ),

                    "is_mandatory": (
                        document.is_mandatory
                    ),

                    "description": (
                        document.description
                    ),
                }
            )

        # -------------------------------------------------
        # FINAL SCHOLARSHIP OBJECT
        # -------------------------------------------------

        scholarship_list.append(
            {
                "id": scholarship.id,

                "title": scholarship.title,

                "description": scholarship.description,

                "amount": amount,

                "application_start": (
                    application_start
                ),

                "deadline": deadline,

                "status": status_code,

                "status_display": status_display,

                "created_at": registration_date,

                "provider": {

                    "id": (
                        provider.id
                        if provider
                        else None
                    ),

                    "organization_name": (
                        organization_name
                    ),

                    "email": provider_email,
                },

                "eligibility": eligibility_data,

                "required_documents": (
                    required_documents
                ),
            }
        )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return Response(
        {
            "success": True,

            "count": len(
                scholarship_list
            ),

            "scholarships": (
                scholarship_list
            ),
        },
        status=200
    )

# =========================================================
# PROVIDER SCHOLARSHIP LIST API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_scholarship_list_api(request):

    # -----------------------------------------------------
    # ONLY PROVIDER CAN ACCESS
    # -----------------------------------------------------

    if getattr(request.user, "role", None) != "PROVIDER":

        return Response(
            {
                "success": False,
                "message": "Only provider users can access scholarships."
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
    # GET ONLY THIS PROVIDER'S SCHOLARSHIPS
    # -----------------------------------------------------

    scholarships = (
        Scholarship.objects
        .filter(
            provider=provider
        )
        .select_related(
            "provider"
        )
        .prefetch_related(
            "required_documents"
        )
        .order_by(
            "-created_at"
        )
    )

    scholarship_list = []

    # -----------------------------------------------------
    # PREPARE SCHOLARSHIP DATA
    # -----------------------------------------------------

    for scholarship in scholarships:

        eligibility = getattr(
            scholarship,
            "eligibility",
            None
        )

        eligibility_data = None

        if eligibility:

            eligibility_data = {

                "eligible_courses": (
                    eligibility.eligible_courses
                ),

                "specialization": (
                    eligibility.specialization
                ),

                "minimum_percentage": (
                    str(
                        eligibility.minimum_percentage
                    )
                    if (
                        eligibility.minimum_percentage
                        is not None
                    )
                    else None
                ),

                "maximum_income": (
                    str(
                        eligibility.maximum_income
                    )
                    if (
                        eligibility.maximum_income
                        is not None
                    )
                    else None
                ),

                "category": (
                    eligibility.category
                ),

                "gender": (
                    eligibility.gender
                ),

                "state": (
                    eligibility.state
                ),

                "other_criteria": (
                    eligibility.other_criteria
                ),
            }

        # -------------------------------------------------
        # REQUIRED DOCUMENTS
        # -------------------------------------------------

        required_documents = []

        for document in (
            scholarship.required_documents.all()
        ):

            required_documents.append(
                {
                    "id": document.id,

                    "document_type": (
                        document.document_type
                    ),

                    "document_type_display": (
                        document.get_document_type_display()
                    ),

                    "is_mandatory": (
                        document.is_mandatory
                    ),

                    "description": (
                        document.description
                    ),
                }
            )

        # -------------------------------------------------
        # SCHOLARSHIP OBJECT
        # -------------------------------------------------

        scholarship_list.append(
            {
                "id": scholarship.id,

                "title": scholarship.title,

                "description": scholarship.description,

                "amount": str(
                    scholarship.amount
                ),

                "application_start": (
                    scholarship.application_start.strftime(
                        "%Y-%m-%d"
                    )
                    if scholarship.application_start
                    else ""
                ),

                "deadline": (
                    scholarship.deadline.strftime(
                        "%Y-%m-%d"
                    )
                    if scholarship.deadline
                    else ""
                ),

                "status": scholarship.status,

                "status_display": (
                    scholarship.get_status_display()
                ),

                "created_at": (
                    scholarship.created_at.strftime(
                        "%Y-%m-%d"
                    )
                    if scholarship.created_at
                    else ""
                ),

                "provider": {
                    "id": provider.id,

                    "organization_name": (
                        provider.organization_name
                    ),
                },

                "eligibility": eligibility_data,

                "required_documents": (
                    required_documents
                ),
            }
        )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return Response(
        {
            "success": True,

            "count": len(
                scholarship_list
            ),

            "scholarships": scholarship_list,
        },
        status=200
    )

# ============================================================
# ADMIN UPDATE SCHOLARSHIP STATUS API
# ============================================================

@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_update_scholarship_status_api(
    request,
    scholarship_id
):

    # --------------------------------------------------------
    # ADMIN ROLE CHECK
    # --------------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": "Admin access required."
            },
            status=403
        )

    # --------------------------------------------------------
    # GET SCHOLARSHIP
    # --------------------------------------------------------

    try:

        scholarship = Scholarship.objects.get(
            id=scholarship_id
        )

    except Scholarship.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Scholarship not found."
            },
            status=404
        )

    # --------------------------------------------------------
    # GET STATUS FROM REQUEST
    # --------------------------------------------------------

    new_status = request.data.get("status")

    allowed_statuses = [
        "APPROVED",
        "REJECTED",
        "CLOSED",
    ]

    if new_status not in allowed_statuses:

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid status. "
                    "Allowed values are APPROVED, "
                    "REJECTED and CLOSED."
                )
            },
            status=400
        )

    # --------------------------------------------------------
    # UPDATE STATUS
    # --------------------------------------------------------

    scholarship.status = new_status

    scholarship.save(
        update_fields=[
            "status",
            "updated_at"
        ]
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return Response(
        {
            "success": True,
            "message": (
                f"Scholarship status updated to "
                f"{new_status} successfully."
            ),
            "scholarship": {
                "id": scholarship.id,
                "title": scholarship.title,
                "status": scholarship.status,
                "status_display": (
                    scholarship.get_status_display()
                ),
            }
        },
        status=200
    )