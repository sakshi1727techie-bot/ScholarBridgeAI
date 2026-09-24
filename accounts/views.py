from django.contrib.auth import authenticate

from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import (
    RegisterSerializer,
    AdminForgotPasswordSerializer,
)


# =========================================================
# REGISTER API
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):

    serializer = RegisterSerializer(
        data=request.data
    )

    if serializer.is_valid():

        user = serializer.save()

        return Response(
            {
                "message": "Registration successful",
                "user_id": user.id,
                "email": user.email,
                "role": user.role,
            },
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )


# =========================================================
# LOGIN API
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):

    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(
        request,
        email=email,
        password=password
    )

    if user is None:

        return Response(
            {
                "message": "Invalid email or password"
            },
            status=401
        )

    token, created = Token.objects.get_or_create(
        user=user
    )

    return Response(
        {
            "message": "Login successful",
            "token": token.key,
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
        },
        status=200
    )


# =========================================================
# CURRENT USER API
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_api(request):

    user = request.user

    return Response(
        {
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
        }
    )


# =========================================================
# ADMIN FORGOT PASSWORD API
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def admin_forgot_password_api(request):

    serializer = AdminForgotPasswordSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=400
        )

    user = serializer.validated_data["user"]

    new_password = (
        serializer.validated_data["new_password"]
    )

    user.set_password(new_password)

    user.save(
        update_fields=["password"]
    )

    return Response(
        {
            "message":
            "Admin password has been reset successfully."
        },
        status=200
    )


# =========================================================
# ADMIN CHANGE PASSWORD API
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_change_password_api(request):

    # -----------------------------------------------------
    # ADMIN ACCESS CHECK
    # -----------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": "Admin access required."
            },
            status=403
        )

    # -----------------------------------------------------
    # GET PASSWORD DATA
    # -----------------------------------------------------

    current_password = request.data.get(
        "current_password"
    )

    new_password = request.data.get(
        "new_password"
    )

    confirm_password = request.data.get(
        "confirm_password"
    )

    # -----------------------------------------------------
    # REQUIRED FIELD VALIDATION
    # -----------------------------------------------------

    if not current_password:

        return Response(
            {
                "success": False,
                "message": "Current password is required."
            },
            status=400
        )

    if not new_password:

        return Response(
            {
                "success": False,
                "message": "New password is required."
            },
            status=400
        )

    if not confirm_password:

        return Response(
            {
                "success": False,
                "message": "Confirm password is required."
            },
            status=400
        )

    # -----------------------------------------------------
    # CURRENT PASSWORD CHECK
    # -----------------------------------------------------

    if not request.user.check_password(
        current_password
    ):

        return Response(
            {
                "success": False,
                "message": "Current password is incorrect."
            },
            status=400
        )

    # -----------------------------------------------------
    # NEW PASSWORD CONFIRMATION
    # -----------------------------------------------------

    if new_password != confirm_password:

        return Response(
            {
                "success": False,
                "message":
                "New password and confirm password do not match."
            },
            status=400
        )

    # -----------------------------------------------------
    # PASSWORD LENGTH
    # -----------------------------------------------------

    if len(new_password) < 6:

        return Response(
            {
                "success": False,
                "message":
                "New password must be at least 6 characters long."
            },
            status=400
        )

    # -----------------------------------------------------
    # PREVENT SAME PASSWORD
    # -----------------------------------------------------

    if request.user.check_password(
        new_password
    ):

        return Response(
            {
                "success": False,
                "message":
                "New password must be different from the current password."
            },
            status=400
        )

    # -----------------------------------------------------
    # SET NEW PASSWORD
    # -----------------------------------------------------

    request.user.set_password(
        new_password
    )

    request.user.save(
        update_fields=["password"]
    )

    # -----------------------------------------------------
    # KEEP CURRENT TOKEN VALID
    # -----------------------------------------------------

    return Response(
        {
            "success": True,
            "message":
            "Administrator password changed successfully."
        },
        status=200
    )