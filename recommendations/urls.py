from django.urls import path

from .views import (
    scholarship_recommendations,
    recommendation_api,
    admin_recommendation_api,
)


urlpatterns = [

    # =====================================================
    # Student recommendation page
    # =====================================================

    path(
        "",
        scholarship_recommendations,
        name="scholarship_recommendations"
    ),

    # =====================================================
    # Student React API
    # =====================================================

    path(
        "api/",
        recommendation_api,
        name="recommendation_api"
    ),

    # =====================================================
    # Admin React API
    # =====================================================

    path(
        "api/admin/",
        admin_recommendation_api,
        name="admin_recommendation_api"
    ),
]