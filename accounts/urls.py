from django.urls import path

from .views import (
    register_api,
    login_api,
    current_user_api,
    admin_forgot_password_api,
    admin_change_password_api,
)


urlpatterns = [

    # =====================================================
    # REGISTER
    # =====================================================

    path(
        "register/",
        register_api,
        name="register_api"
    ),

    # =====================================================
    # LOGIN
    # =====================================================

    path(
        "login/",
        login_api,
        name="login_api"
    ),

    # =====================================================
    # CURRENT USER
    # =====================================================

    path(
        "me/",
        current_user_api,
        name="current_user_api"
    ),

    # =====================================================
    # ADMIN FORGOT PASSWORD
    # =====================================================

    path(
        "admin-forgot-password/",
        admin_forgot_password_api,
        name="admin_forgot_password_api"
    ),

    # =====================================================
    # ADMIN CHANGE PASSWORD
    # =====================================================

    path(
        "admin-change-password/",
        admin_change_password_api,
        name="admin_change_password_api"
    ),

]