from rest_framework import serializers

from .models import User
from providers.models import ProviderProfile


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    organization_name = serializers.CharField(
        write_only=True,
        required=False
    )

    organization_type = serializers.CharField(
        write_only=True,
        required=False
    )

    contact_person = serializers.CharField(
        write_only=True,
        required=False
    )

    phone = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    address = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "role",
            "organization_name",
            "organization_type",
            "contact_person",
            "phone",
            "address",
        ]

    def create(self, validated_data):

        organization_name = validated_data.pop(
            "organization_name",
            ""
        )

        organization_type = validated_data.pop(
            "organization_type",
            ""
        )

        contact_person = validated_data.pop(
            "contact_person",
            ""
        )

        phone = validated_data.pop(
            "phone",
            ""
        )

        address = validated_data.pop(
            "address",
            ""
        )

        role = validated_data.get("role", "STUDENT")

        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            role=role
        )

        if role == "PROVIDER":

            ProviderProfile.objects.create(
                user=user,
                organization_name=organization_name,
                organization_type=organization_type,
                contact_person=contact_person,
                phone=phone,
                address=address
            )

        return user

class AdminForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()
    new_password = serializers.CharField(
        write_only=True,
        min_length=6
    )
    confirm_password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    def validate(self, attrs):

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "New password and confirm password do not match."
                }
            )

        try:
            user = User.objects.get(
                email=attrs["email"]
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "email":
                    "No account found with this email address."
                }
            )

        if user.role != "ADMIN":
            raise serializers.ValidationError(
                {
                    "email":
                    "This email is not registered as an administrator."
                }
            )

        attrs["user"] = user

        return attrs