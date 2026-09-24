from django.urls import path

from .views import (
    scholarship_api,
    scholarship_detail_api,
    save_scholarship_api,
    unsave_scholarship_api,
    my_saved_scholarships_api,
    admin_scholarship_list_api,
    admin_update_scholarship_status_api,
    provider_create_scholarship_api,
    provider_scholarship_list_api,
)


urlpatterns = [

    # =====================================================
    # SCHOLARSHIP LIST API
    # =====================================================

    path(
        "",
        scholarship_api,
        name="scholarship_api"
    ),


    # =====================================================
    # SCHOLARSHIP DETAIL API
    # =====================================================

    path(
        "<int:scholarship_id>/details/",
        scholarship_detail_api,
        name="scholarship_detail_api"
    ),


    # =====================================================
    # SAVE SCHOLARSHIP API
    # =====================================================

    path(
        "<int:scholarship_id>/save/",
        save_scholarship_api,
        name="save_scholarship_api"
    ),


    # =====================================================
    # UNSAVE SCHOLARSHIP API
    # =====================================================

    path(
        "<int:scholarship_id>/unsave/",
        unsave_scholarship_api,
        name="unsave_scholarship_api"
    ),


    # =====================================================
    # MY SAVED SCHOLARSHIPS API
    # =====================================================

    path(
        "saved/",
        my_saved_scholarships_api,
        name="my_saved_scholarships_api"
    ),


    # =====================================================
    # ADMIN SCHOLARSHIP MANAGEMENT API
    # =====================================================

    path(
        "admin/",
        admin_scholarship_list_api,
        name="admin_scholarship_list_api"
    ),


    # =====================================================
    # ADMIN UPDATE SCHOLARSHIP STATUS API
    # =====================================================

    path(
        "admin/<int:scholarship_id>/status/",
        admin_update_scholarship_status_api,
        name="admin_update_scholarship_status_api"
    ),


    # =====================================================
    # PROVIDER SCHOLARSHIP LIST API
    # =====================================================

    path(
        "provider/",
        provider_scholarship_list_api,
        name="provider_scholarship_list_api"
    ),


    # =====================================================
    # PROVIDER CREATE SCHOLARSHIP API
    # =====================================================

    path(
        "provider/create/",
        provider_create_scholarship_api,
        name="provider_create_scholarship_api"
    ),

]