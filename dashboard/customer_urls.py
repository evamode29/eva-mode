from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import CustomerLoginView, customer_dashboard, register

app_name = "customer"

urlpatterns = [
    path("login/", CustomerLoginView.as_view(), name="login"),
    path("register/", register, name="register"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("", customer_dashboard, name="dashboard"),
]
