from django.contrib.auth import login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.views import LoginView
from django.db.models import Sum
from django.shortcuts import redirect, render

from products.models import Category, Product, ProductSize
from .forms import CustomerCreationForm


@login_required
def customer_dashboard(request):
    return render(request, "dashboard/customer.html", {
        "active_products": Product.objects.filter(is_active=True).count(),
    })


class CustomerLoginView(LoginView):
    template_name = "dashboard/login.html"
    redirect_authenticated_user = True


def register(request):
    if request.user.is_authenticated:
        return redirect("customer:dashboard")
    form = CustomerCreationForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)
        return redirect("customer:dashboard")
    return render(request, "dashboard/register.html", {"form": form})


def staff_required(view):
    return user_passes_test(lambda user: user.is_active and user.is_staff, login_url="/account/login/")(view)


@staff_required
def management_dashboard(request):
    products = Product.objects.all()
    low_stock = ProductSize.objects.filter(is_active=True, stock__lte=3).select_related("product", "size").order_by("stock")[:8]
    context = {
        "product_count": products.count(),
        "active_product_count": products.filter(is_active=True).count(),
        "category_count": Category.objects.count(),
        "low_stock_count": ProductSize.objects.filter(is_active=True, stock__lte=3).count(),
        "total_stock": ProductSize.objects.filter(is_active=True).aggregate(total=Sum("stock"))["total"] or 0,
        "low_stock": low_stock,
    }
    return render(request, "dashboard/management.html", context)
