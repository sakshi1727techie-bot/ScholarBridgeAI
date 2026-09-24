from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from scholarships.models import Scholarship
from .models import ScholarshipRecommendation

from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import ScholarshipRecommendationSerializer


# =========================================================
# RECOMMENDATION GENERATOR
# =========================================================

def generate_recommendations(student):

    student_profile = getattr(
        student,
        "student_profile",
        None
    )

    if not student_profile:
        return []

    scholarships = (
        Scholarship.objects
        .filter(status="APPROVED")
        .select_related("eligibility")
    )

    recommendations = []

    for scholarship in scholarships:

        eligibility = getattr(
            scholarship,
            "eligibility",
            None
        )

        if not eligibility:
            continue

        score = 0
        reasons = []

        # =================================================
        # Academic Score
        # =================================================

        if (
            eligibility.minimum_percentage is not None
            and student_profile.academic_score is not None
        ):
            if (
                student_profile.academic_score
                >= eligibility.minimum_percentage
            ):
                score += 20
                reasons.append(
                    "Academic score matches"
                )

        # =================================================
        # Family Income
        # =================================================

        if (
            eligibility.maximum_income is not None
            and student_profile.family_income is not None
        ):
            if (
                student_profile.family_income
                <= eligibility.maximum_income
            ):
                score += 20
                reasons.append(
                    "Family income matches"
                )

        # =================================================
        # State
        # =================================================

        if (
            eligibility.state
            and student_profile.state
        ):
            if (
                eligibility.state.strip().lower()
                == student_profile.state.strip().lower()
            ):
                score += 15
                reasons.append(
                    "State matches"
                )

        # =================================================
        # Course
        # =================================================

        if (
            eligibility.eligible_courses
            and student_profile.course
        ):
            courses = [
                course.strip().lower()
                for course in
                eligibility.eligible_courses.split(",")
                if course.strip()
            ]

            if (
                student_profile.course.strip().lower()
                in courses
            ):
                score += 15
                reasons.append(
                    "Course matches"
                )

        # =================================================
        # Specialization
        # =================================================

        if (
            eligibility.specialization
            and student_profile.specialization
        ):
            specializations = [
                specialization.strip().lower()
                for specialization in
                eligibility.specialization.split(",")
                if specialization.strip()
            ]

            if (
                student_profile.specialization.strip().lower()
                in specializations
            ):
                score += 10
                reasons.append(
                    "Specialization matches"
                )

        # =================================================
        # Category
        # =================================================

        if (
            eligibility.category
            and student_profile.category
        ):
            categories = [
                category.strip().lower()
                for category in
                eligibility.category.split(",")
                if category.strip()
            ]

            if (
                student_profile.category.strip().lower()
                in categories
            ):
                score += 10
                reasons.append(
                    "Category matches"
                )

        # =================================================
        # Gender
        # =================================================

        if (
            eligibility.gender
            and student_profile.gender
            and eligibility.gender.strip().lower() != "all"
        ):
            genders = [
                gender.strip().lower()
                for gender in
                eligibility.gender.split(",")
                if gender.strip()
            ]

            if (
                student_profile.gender.strip().lower()
                in genders
            ):
                score += 10
                reasons.append(
                    "Gender matches"
                )

        # =================================================
        # SAVE / UPDATE RECOMMENDATION
        # =================================================

        if score > 0:

            recommendation, created = (
                ScholarshipRecommendation.objects
                .update_or_create(
                    student=student,
                    scholarship=scholarship,
                    defaults={
                        "match_score": score,
                        "reason": ", ".join(reasons),
                    }
                )
            )

            recommendations.append(
                recommendation
            )

    # =================================================
    # SORT HIGH MATCH FIRST
    # =================================================

    recommendations.sort(
        key=lambda recommendation: float(
            recommendation.match_score
        ),
        reverse=True
    )

    return recommendations


# =========================================================
# STUDENT RECOMMENDATIONS PAGE
# =========================================================

@login_required
def scholarship_recommendations(request):

    recommendations = generate_recommendations(
        request.user
    )

    return render(
        request,
        "recommendations/recommendations.html",
        {
            "recommendations": recommendations
        }
    )


# =========================================================
# REACT AI RECOMMENDATIONS API
# STUDENT
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recommendation_api(request):

    # =====================================================
    # GENERATE RECOMMENDATIONS FOR LOGGED-IN STUDENT
    # =====================================================

    recommendations = generate_recommendations(
        request.user
    )

    # =====================================================
    # SERIALIZE
    # =====================================================

    serializer = ScholarshipRecommendationSerializer(
        recommendations,
        many=True
    )

    # =====================================================
    # RESPONSE
    # =====================================================

    return Response(
        {
            "success": True,
            "count": len(recommendations),
            "recommendations": serializer.data,
        },
        status=200
    )


# =========================================================
# ADMIN AI RECOMMENDATIONS API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_recommendation_api(request):

    # =====================================================
    # ADMIN ROLE CHECK
    # =====================================================

    if getattr(request.user, "role", None) != "ADMIN":
        return Response(
            {
                "success": False,
                "message": "Admin access required."
            },
            status=403
        )

    # =====================================================
    # GET ALL EXISTING RECOMMENDATIONS
    # =====================================================

    recommendations = (
        ScholarshipRecommendation.objects
        .select_related(
            "student",
            "scholarship"
        )
        .order_by("-created_at")
    )

    # =====================================================
    # PREPARE ADMIN RESPONSE
    # =====================================================

    recommendation_data = []

    for recommendation in recommendations:

        student = recommendation.student
        scholarship = recommendation.scholarship

        # -----------------------------------------------
        # STUDENT NAME
        # -----------------------------------------------

        student_profile = getattr(
            student,
            "student_profile",
            None
        )

        if student_profile and student_profile.full_name:
            student_name = student_profile.full_name
        else:
            student_name = (
                getattr(student, "username", None)
                or student.email
            )

        # -----------------------------------------------
        # STATUS
        # -----------------------------------------------

        # Current recommendation model does not contain
        # Viewed / Applied status.
        #
        # Therefore backend reports the actual current
        # recommendation state as "Recommended".
        #
        # Application status can be connected separately
        # later if required.

        status = "Recommended"

        # -----------------------------------------------
        # ADD RECORD
        # -----------------------------------------------

        recommendation_data.append(
            {
                "id": recommendation.id,

                "student": {
                    "id": student.id,
                    "name": student_name,
                    "email": student.email,
                },

                "scholarship": {
                    "id": scholarship.id,
                    "title": scholarship.title,
                },

                "match_score": float(
                    recommendation.match_score
                ),

                "reason": recommendation.reason,

                "recommendation_date":
                    recommendation.created_at.strftime(
                        "%Y-%m-%d"
                    ),

                "status": status,
            }
        )

    # =====================================================
    # STATISTICS
    # =====================================================

    total_recommendations = len(
        recommendation_data
    )

    recommended_count = sum(
        1
        for recommendation in recommendation_data
        if recommendation["status"] == "Recommended"
    )

    viewed_count = sum(
        1
        for recommendation in recommendation_data
        if recommendation["status"] == "Viewed"
    )

    applied_count = sum(
        1
        for recommendation in recommendation_data
        if recommendation["status"] == "Applied"
    )

    # =====================================================
    # AVERAGE MATCH SCORE
    # =====================================================

    if total_recommendations > 0:

        average_match_score = round(
            sum(
                recommendation["match_score"]
                for recommendation
                in recommendation_data
            )
            / total_recommendations,
            2
        )

    else:

        average_match_score = 0

    # =====================================================
    # RESPONSE
    # =====================================================

    return Response(
        {
            "success": True,

            "count": total_recommendations,

            "statistics": {
                "total_recommendations":
                    total_recommendations,

                "recommended":
                    recommended_count,

                "viewed":
                    viewed_count,

                "applied":
                    applied_count,

                "average_match_score":
                    average_match_score,
            },

            "recommendations":
                recommendation_data,
        },
        status=200
    )