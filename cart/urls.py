from django.urls import path

from . import views

app_name = "cart"

urlpatterns = [
    path("", views.cart_detail, name="detail"),
    path("add/<int:product_id>/", views.add_to_cart, name="add"),
    path("update/<int:product_id>/", views.update_cart, name="update"),
    path("update/<int:product_id>/<int:color_id>/", views.update_cart, name="update_color"),
    path("remove/<int:product_id>/", views.remove_from_cart, name="remove"),
    path("remove/<int:product_id>/<int:color_id>/", views.remove_from_cart, name="remove_color"),
]
