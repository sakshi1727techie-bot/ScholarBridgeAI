from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path


def home(request):
    return JsonResponse({
        "message": "ScholarBridge AI Backend is running!"
    })


urlpatterns = [
    path("", home, name="home"),

    path("admin/", admin.site.urls),

    path("provider/", include("providers.urls")),
    path("api/scholarships/", include("scholarships.urls")),
    path("application/", include("applications.urls")),
    path("student/", include("students.urls")),
    path("recommendations/", include("recommendations.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("documents/", include("documents.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/chatbot/", include("chatbot.urls")),
    path("api/analytics/", include("analytics.urls")),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )