from django.urls import path
from .views import register_api, login_api,current_user_api


urlpatterns = [
    path(
        "register/",
        register_api,
        name="register_api"
    ),

    path(
        "login/",
        login_api,
        name="login_api"
    ),

    path(
    "me/",
    current_user_api,
    name="current_user_api"
),
]