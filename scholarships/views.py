from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from .models import (
    Scholarship,
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
            "message": "Scholarship removed from saved scholarships"
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