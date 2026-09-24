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

    # =====================================================
    # HOME
    # =====================================================

    path(
        "",
        home,
        name="home"
    ),

    # =====================================================
    # DJANGO ADMIN
    # =====================================================

    path(
        "admin/",
        admin.site.urls
    ),

    # =====================================================
    # PROVIDER
    # =====================================================

    path(
        "provider/",
        include("providers.urls")
    ),

    # =====================================================
    # SCHOLARSHIPS
    # =====================================================

    path(
        "api/scholarships/",
        include("scholarships.urls")
    ),

    # =====================================================
    # APPLICATIONS
    # =====================================================

    path(
        "application/",
        include("applications.urls")
    ),

    # =====================================================
    # STUDENT
    # =====================================================

    path(
        "student/",
        include("students.urls")
    ),

    # =====================================================
    # RECOMMENDATIONS
    # =====================================================

    path(
        "recommendations/",
        include("recommendations.urls")
    ),

    # =====================================================
    # ACCOUNTS / AUTHENTICATION
    # =====================================================

    path(
        "api/accounts/",
        include("accounts.urls")
    ),

    # =====================================================
    # DOCUMENTS
    # =====================================================

    path(
        "documents/",
        include("documents.urls")
    ),

    # =====================================================
    # NOTIFICATIONS
    # =====================================================

    path(
        "api/notifications/",
        include("notifications.urls")
    ),

    # =====================================================
    # CHATBOT
    # =====================================================

    path(
        "api/chatbot/",
        include("chatbot.urls")
    ),

    # =====================================================
    # ANALYTICS
    # =====================================================

    path(
        "api/analytics/",
        include("analytics.urls")
    ),

    # =====================================================
    # ADMIN DASHBOARD API
    # =====================================================

    path(
        "api/admin/",
        include("admin_dashboard.urls")
    ),
]


# =========================================================
# MEDIA FILES
# =========================================================

if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )