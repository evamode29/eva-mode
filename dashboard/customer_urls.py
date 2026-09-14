from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import (
    CustomerLoginView, add_to_cart, cart, customer_dashboard, logout_post, order_detail,
    place_order, register, remove_from_cart, update_cart,
)

app_name = "customer"

urlpatterns = [
    path("login/", CustomerLoginView.as_view(), name="login"),
    path("register/", register, name="register"),
    path("logout/", logout_post, name="logout"),
    path("cart/", cart, name="cart"),
    path("cart/add/", add_to_cart, name="add_to_cart"),
    path("cart/update/", update_cart, name="update_cart"),
    path("cart/remove/<int:item_id>/", remove_from_cart, name="remove_from_cart"),
    path("orders/create/", place_order, name="place_order"),
    path("orders/<int:order_id>/", order_detail, name="order_detail"),
    path("", customer_dashboard, name="dashboard"),
]
