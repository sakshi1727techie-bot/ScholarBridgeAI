from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from applications.models import Application
from scholarships.models import Scholarship
from .models import StudentProfile

# DRF Imports
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# ==========================================
# STUDENT DASHBOARD
# ==========================================

@login_required
def student_dashboard(request):

    applications = Application.objects.filter(
        student=request.user
    )

    return render(
        request,
        "students/dashboard.html",
        {
            "applications": applications
        }
    )


# ==========================================
# STUDENT PROFILE (Django HTML Form)
# ==========================================

@login_required
def student_profile(request):

    from .forms import StudentProfileForm

    profile = getattr(
        request.user,
        "student_profile",
        None
    )

    if request.method == "POST":

        form = StudentProfileForm(
            request.POST,
            instance=profile
        )

        if form.is_valid():

            student_profile = form.save(
                commit=False
            )

            student_profile.user = request.user
            student_profile.save()

            return redirect("student_dashboard")

    else:

        form = StudentProfileForm(
            instance=profile
        )

    return render(
        request,
        "students/profile.html",
        {
            "form": form
        }
    )


# ==========================================
# SCHOLARSHIP LIST
# ==========================================

def scholarship_list(request):

    scholarships = Scholarship.objects.filter(
        status="APPROVED"
    ).order_by("deadline")

    return render(
        request,
        "scholarships/scholarship_list.html",
        {
            "scholarships": scholarships
        }
    )


# ==========================================
# STUDENT PROFILE API
# ==========================================

@api_view(["GET", "PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def student_profile_api(request):

    profile = getattr(
        request.user,
        "student_profile",
        None
    )

    # ==========================
    # GET PROFILE
    # ==========================

    if request.method == "GET":

        if not profile:
            return Response(
                {
                    "message": "Student profile not found."
                },
                status=404
            )

        return Response(
            {
                "id": profile.id,
                "full_name": profile.full_name,
                "date_of_birth": profile.date_of_birth,
                "gender": profile.gender,
                "phone": profile.phone,
                "state": profile.state,
                "city": profile.city,
                "course": profile.course,
                "specialization": profile.specialization,
                "college": profile.college,
                "academic_score": profile.academic_score,
                "family_income": profile.family_income,
                "category": profile.category,
                "profile_completion": profile.profile_completion,
            },
            status=200
        )

    # ==========================
    # CREATE PROFILE IF NOT EXISTS
    # ==========================

    if not profile:

        profile = StudentProfile(
            user=request.user
        )

    # ==========================
    # UPDATE PROFILE
    # ==========================

    profile.full_name = request.data.get(
        "full_name",
        profile.full_name
    )

    profile.date_of_birth = request.data.get(
        "date_of_birth"
    ) or profile.date_of_birth

    profile.gender = request.data.get(
        "gender",
        profile.gender
    )

    profile.phone = request.data.get(
        "phone",
        profile.phone
    )

    profile.state = request.data.get(
        "state",
        profile.state
    )

    profile.city = request.data.get(
        "city",
        profile.city
    )

    profile.course = request.data.get(
        "course",
        profile.course
    )

    profile.specialization = request.data.get(
        "specialization",
        profile.specialization
    )

    profile.college = request.data.get(
        "college",
        profile.college
    )

    profile.academic_score = request.data.get(
        "academic_score"
    ) or profile.academic_score

    profile.family_income = request.data.get(
        "family_income"
    ) or profile.family_income

    profile.category = request.data.get(
        "category",
        profile.category
    )

    # ==========================
    # PROFILE COMPLETION
    # ==========================

    fields = [
        profile.full_name,
        profile.date_of_birth,
        profile.gender,
        profile.phone,
        profile.state,
        profile.city,
        profile.course,
        profile.specialization,
        profile.college,
        profile.academic_score,
        profile.family_income,
        profile.category,
    ]

    completed_fields = sum(
        1
        for field in fields
        if field not in [None, ""]
    )

    profile.profile_completion = round(
        (completed_fields / len(fields)) * 100
    )

    profile.save()

    return Response(
        {
            "message": "Profile updated successfully.",
            "profile_completion": profile.profile_completion,

            "profile": {
                "id": profile.id,
                "full_name": profile.full_name,
                "date_of_birth": profile.date_of_birth,
                "gender": profile.gender,
                "phone": profile.phone,
                "state": profile.state,
                "city": profile.city,
                "course": profile.course,
                "specialization": profile.specialization,
                "college": profile.college,
                "academic_score": profile.academic_score,
                "family_income": profile.family_income,
                "category": profile.category,
            }
        },
        status=200
    )


# ==========================================
# ADMIN - STUDENT LIST API
# ==========================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_student_list_api(request):

    # ==========================================
    # CHECK ADMIN ROLE
    # ==========================================

    if getattr(request.user, "role", None) != "ADMIN":
        return Response(
            {
                "message": "Only admin users can access student records."
            },
            status=403
        )

    # ==========================================
    # GET ALL STUDENT PROFILES
    # ==========================================

    profiles = StudentProfile.objects.select_related(
        "user"
    ).all().order_by("-id")

    students = []

    for profile in profiles:

        # ==========================================
        # ACCOUNT STATUS
        # ==========================================

        if not profile.user.is_active:
            account_status = "Inactive"

        elif profile.profile_completion < 100:
            account_status = "Pending"

        else:
            account_status = "Active"

        # ==========================================
        # REGISTRATION DATE
        # ==========================================

        registration_date = ""

        if profile.user.date_joined:
            registration_date = profile.user.date_joined.strftime(
                "%d %b %Y"
            )

        # ==========================================
        # STUDENT DATA
        # ==========================================

        students.append(
            {
                "id": profile.id,
                "full_name": profile.full_name or "Not Provided",
                "email": profile.user.email or "",
                "course": profile.course or "Not Provided",
                "college": profile.college or "Not Provided",
                "category": profile.category or "Not Provided",
                "registration_date": registration_date,
                "account_status": account_status,
                "profile_completion": profile.profile_completion,
                "user_id": profile.user.id,
            }
        )

    # ==========================================
    # RESPONSE
    # ==========================================

    return Response(
        {
            "count": len(students),
            "students": students
        },
        status=200
    )