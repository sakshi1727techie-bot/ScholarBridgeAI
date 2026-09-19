from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import RegisterSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):

    serializer = RegisterSerializer(data=request.data)

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

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

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

    token, created = Token.objects.get_or_create(user=user)

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

from rest_framework.permissions import IsAuthenticated


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