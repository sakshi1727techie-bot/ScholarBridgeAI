from django.contrib import admin

from .models import ChatMessage


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "sender",
        "message",
        "created_at",
    )

    list_filter = (
        "sender",
        "created_at",
    )

    search_fields = (
        "user__email",
        "message",
    )

    ordering = (
        "-created_at",
    )