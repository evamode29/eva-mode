from django.urls import path

from .views import management_dashboard, management_order_status

app_name = "management"

urlpatterns = [
    path("", management_dashboard, name="dashboard"),
    path("orders/<int:order_id>/status/", management_order_status, name="order_status"),
]
