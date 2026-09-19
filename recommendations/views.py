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
# STUDENT RECOMMENDATIONS PAGE
# =========================================================

@login_required
def scholarship_recommendations(request):

    student_profile = getattr(
        request.user,
        "student_profile",
        None
    )

    recommendations = []

    if student_profile:

        scholarships = Scholarship.objects.filter(
            status="APPROVED"
        ).select_related(
            "eligibility"
        )

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
                    reasons.append("Academic score matches")

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
                    reasons.append("Family income matches")

            # =================================================
            # State
            # =================================================

            if (
                eligibility.state
                and student_profile.state
            ):
                if (
                    eligibility.state.lower()
                    == student_profile.state.lower()
                ):
                    score += 15
                    reasons.append("State matches")

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
                ]

                if student_profile.course.lower() in courses:
                    score += 15
                    reasons.append("Course matches")

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
                ]

                if (
                    student_profile.specialization.lower()
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
                ]

                if (
                    student_profile.category.lower()
                    in categories
                ):
                    score += 10
                    reasons.append("Category matches")

            # =================================================
            # Gender
            # =================================================

            if (
                eligibility.gender
                and student_profile.gender
                and eligibility.gender.lower() != "all"
            ):
                genders = [
                    gender.strip().lower()
                    for gender in
                    eligibility.gender.split(",")
                ]

                if (
                    student_profile.gender.lower()
                    in genders
                ):
                    score += 10
                    reasons.append("Gender matches")

            # =================================================
            # SAVE RECOMMENDATION
            # =================================================

            if score > 0:

                recommendation, created = (
                    ScholarshipRecommendation.objects
                    .update_or_create(
                        student=request.user,
                        scholarship=scholarship,
                        defaults={
                            "match_score": score,
                            "reason": ", ".join(reasons)
                        }
                    )
                )

                recommendations.append(
                    recommendation
                )

    # =========================================================
    # SORT BY MATCH SCORE
    # =========================================================

    recommendations.sort(
        key=lambda x: x.match_score,
        reverse=True
    )

    # =========================================================
    # RENDER DJANGO TEMPLATE
    # =========================================================

    return render(
        request,
        "recommendations/recommendations.html",
        {
            "recommendations": recommendations
        }
    )


# =========================================================
# REACT AI RECOMMENDATIONS API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recommendation_api(request):

    recommendations = (
        ScholarshipRecommendation.objects
        .filter(
            student=request.user
        )
        .select_related(
            "scholarship"
        )
    )

    serializer = ScholarshipRecommendationSerializer(
        recommendations,
        many=True
    )

    return Response(
        serializer.data
    )