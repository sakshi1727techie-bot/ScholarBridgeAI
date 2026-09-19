from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from applications.models import Application
from scholarships.models import Scholarship


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analytics_api(request):

    if request.user.role != "PROVIDER":
        return Response(
            {"error": "Only providers can access analytics."},
            status=403
        )

    total_scholarships = Scholarship.objects.filter(
        provider__user=request.user
    ).count()

    total_applications = Application.objects.filter(
        scholarship__provider__user=request.user
    ).count()

    pending_applications = Application.objects.filter(
        scholarship__provider__user=request.user,
        status="PENDING"
    ).count()

    under_review_applications = Application.objects.filter(
        scholarship__provider__user=request.user,
        status="UNDER_REVIEW"
    ).count()

    approved_applications = Application.objects.filter(
        scholarship__provider__user=request.user,
        status="APPROVED"
    ).count()

    rejected_applications = Application.objects.filter(
        scholarship__provider__user=request.user,
        status="REJECTED"
    ).count()

    return Response({
        "total_scholarships": total_scholarships,
        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "under_review_applications": under_review_applications,
        "approved_applications": approved_applications,
        "rejected_applications": rejected_applications,
    })