from django.urls import path

from .views import (
    scholarship_recommendations,
    recommendation_api,
)


urlpatterns = [

    # Student recommendation page
    path(
        "",
        scholarship_recommendations,
        name="scholarship_recommendations"
    ),

    # React API
    path(
        "api/",
        recommendation_api,
        name="recommendation_api"
    ),
]