from django.urls import path

from .views import (
    scholarship_api,
    scholarship_detail_api,
    save_scholarship_api,
    unsave_scholarship_api,
    my_saved_scholarships_api,
)


urlpatterns = [

    # Scholarship List API
    path(
        "",
        scholarship_api,
        name="scholarship_api"
    ),

    # Scholarship Detail API
    path(
        "<int:scholarship_id>/details/",
        scholarship_detail_api,
        name="scholarship_detail_api"
    ),

    # Save Scholarship API
    path(
        "<int:scholarship_id>/save/",
        save_scholarship_api,
        name="save_scholarship_api"
    ),

    # Unsave Scholarship API
    path(
        "<int:scholarship_id>/unsave/",
        unsave_scholarship_api,
        name="unsave_scholarship_api"
    ),

    # My Saved Scholarships API
    path(
        "saved/",
        my_saved_scholarships_api,
        name="my_saved_scholarships_api"
    ),
]