from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ChatMessage


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chatbot_api(request):

    user_message = request.data.get("message", "").strip()

    if not user_message:
        return Response(
            {"error": "Message is required."},
            status=400
        )

    # Save user's message
    ChatMessage.objects.create(
        user=request.user,
        sender="USER",
        message=user_message
    )

    message = user_message.lower()

    if "scholarship" in message:
        bot_response = (
            "I can help you find scholarships based on your "
            "qualification, course, income, category and state."
        )

    elif "eligible" in message or "eligibility" in message:
        bot_response = (
            "You can check your scholarship eligibility from "
            "the scholarship details page."
        )

    elif "document" in message:
        bot_response = (
            "You can upload your required scholarship documents "
            "from the My Documents section."
        )

    elif "deadline" in message:
        bot_response = (
            "Please check the scholarship deadline on the "
            "scholarship details page."
        )

    elif "hello" in message or "hi" in message:
        bot_response = (
            "Hello! 👋 I am ScholarBridge AI Assistant. "
            "How can I help you?"
        )

    else:
        bot_response = (
            "I can help you with scholarships, eligibility, "
            "documents and application-related questions."
        )

    # Save bot response
    ChatMessage.objects.create(
        user=request.user,
        sender="BOT",
        message=bot_response
    )

    return Response({
        "user_message": user_message,
        "bot_response": bot_response
    })