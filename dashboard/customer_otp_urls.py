from django.urls import path

from .views import (
    add_to_cart, cart, customer_dashboard, customer_login, logout_post, order_detail,
    place_order, remove_from_cart, resend_otp, update_cart, verify_otp,
)

app_name = "customer"

urlpatterns = [
    path("login/", customer_login, name="login"),
    path("verify/", verify_otp, name="verify_otp"),
    path("resend/", resend_otp, name="resend_otp"),
    path("logout/", logout_post, name="logout"),
    path("cart/", cart, name="cart"),
    path("cart/add/", add_to_cart, name="add_to_cart"),
    path("cart/update/", update_cart, name="update_cart"),
    path("cart/remove/<int:item_id>/", remove_from_cart, name="remove_from_cart"),
    path("orders/create/", place_order, name="place_order"),
    path("orders/<int:order_id>/", order_detail, name="order_detail"),
    path("", customer_dashboard, name="dashboard"),
]
