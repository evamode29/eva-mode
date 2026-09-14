from django.urls import path

from .views import management_dashboard

app_name = "management"

urlpatterns = [
    path("", management_dashboard, name="dashboard"),
]
