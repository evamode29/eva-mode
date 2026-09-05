from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("", views.login_view, name="login"),
    path("verify/", views.verify_view, name="verify"),
    path("profile/", views.profile_view, name="profile"),
    path("favorites/", views.favorites_view, name="favorites"),
    path("favorites/toggle/<slug:slug>/", views.favorites_toggle, name="favorites_toggle"),
    path("logout/", views.logout_view, name="logout"),
]
