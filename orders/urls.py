from django.urls import path

from . import views

app_name = "orders"

urlpatterns = [
    path("", views.order_list, name="list"),
    path("checkout/", views.checkout, name="checkout"),
    path("success/<int:order_id>/", views.success, name="success"),
    path("<int:order_id>/", views.order_detail, name="detail"),
]
