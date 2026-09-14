from django.urls import path
from .views import management_dashboard, management_order_status, manager_toggle, manager_users
app_name='management'
urlpatterns=[path('',management_dashboard,name='dashboard'),path('orders/<int:order_id>/status/',management_order_status,name='order_status'),path('managers/',manager_users,name='users'),path('managers/<int:user_id>/toggle/',manager_toggle,name='toggle_manager')]
