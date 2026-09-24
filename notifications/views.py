from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Notification
from .serializers import NotificationSerializer


# =========================================================
# PROVIDER / USER NOTIFICATIONS API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def provider_notifications_api(request):

    notifications = Notification.objects.filter(
        user=request.user
    ).order_by("-created_at")

    serializer = NotificationSerializer(
        notifications,
        many=True
    )

    unread_count = notifications.filter(
        is_read=False
    ).count()

    return Response({
        "success": True,
        "unread_count": unread_count,
        "notifications": serializer.data,
    })


# =========================================================
# MARK SINGLE NOTIFICATION AS READ
# =========================================================

@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):

    try:
        notification = Notification.objects.get(
            id=notification_id,
            user=request.user
        )

    except Notification.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Notification not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    notification.is_read = True

    notification.save(
        update_fields=["is_read"]
    )

    return Response({
        "success": True,
        "message": "Notification marked as read."
    })


# =========================================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================================

@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):

    updated_count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).update(
        is_read=True
    )

    return Response({
        "success": True,
        "message": "All notifications marked as read.",
        "updated_count": updated_count,
    })


# =========================================================
# DELETE SINGLE NOTIFICATION
# =========================================================

@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):

    try:
        notification = Notification.objects.get(
            id=notification_id,
            user=request.user
        )

    except Notification.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Notification not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    notification.delete()

    return Response({
        "success": True,
        "message": "Notification deleted successfully."
    })


# =========================================================
# ADMIN NOTIFICATIONS API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_notifications_api(request):

    # =====================================================
    # ADMIN ROLE CHECK
    # =====================================================

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": "Admin access required."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # =====================================================
    # GET ALL NOTIFICATIONS
    # =====================================================

    notifications = (
        Notification.objects
        .select_related("user")
        .order_by("-created_at")
    )

    # =====================================================
    # SERIALIZE
    # =====================================================

    serializer = NotificationSerializer(
        notifications,
        many=True
    )

    # =====================================================
    # STATISTICS
    # =====================================================

    total_notifications = notifications.count()

    unread_notifications = notifications.filter(
        is_read=False
    ).count()

    read_notifications = notifications.filter(
        is_read=True
    ).count()

    # =====================================================
    # NOTIFICATION TYPE COUNTS
    # =====================================================

    system_notifications = notifications.filter(
        type="SYSTEM"
    ).count()

    scholarship_notifications = notifications.filter(
        type="SCHOLARSHIP"
    ).count()

    application_notifications = notifications.filter(
        type="APPLICATION"
    ).count()

    deadline_notifications = notifications.filter(
        type="DEADLINE"
    ).count()

    other_notifications = notifications.filter(
        type="OTHER"
    ).count()

    # =====================================================
    # RESPONSE
    # =====================================================

    return Response(
        {
            "success": True,

            "count": total_notifications,

            "statistics": {

                "total_notifications":
                    total_notifications,

                "unread":
                    unread_notifications,

                "read":
                    read_notifications,

                "system":
                    system_notifications,

                "scholarship":
                    scholarship_notifications,

                "application":
                    application_notifications,

                "deadline":
                    deadline_notifications,

                "other":
                    other_notifications,
            },

            "notifications":
                serializer.data,
        },

        status=status.HTTP_200_OK
    )