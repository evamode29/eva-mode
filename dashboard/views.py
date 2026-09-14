import uuid

from django.contrib.auth import login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.views import LoginView
from django.db import transaction
from django.db.models import Sum
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages

from products.models import Category, Product, ProductColor, ProductSize
from .forms import CustomerCreationForm
from .models import CartItem, Order, OrderItem


@login_required
def customer_dashboard(request):
    orders = request.user.orders.prefetch_related("items").all()[:5]
    cart_items = request.user.cart_items.select_related("product").all()
    return render(request, "dashboard/customer.html", {
        "active_products": Product.objects.filter(is_active=True).count(),
        "orders": orders,
        "order_count": request.user.orders.count(),
        "cart_count": sum(item.quantity for item in cart_items),
        "cart_total": sum(item.line_total for item in cart_items),
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


def logout_post(request):
    from django.contrib.auth import logout
    if request.method == "POST":
        logout(request)
        return redirect("home")
    return redirect("customer:dashboard")


@login_required
def add_to_cart(request):
    if request.method != "POST":
        return redirect("products:shop")
    product = get_object_or_404(Product, pk=request.POST.get("product_id"), is_active=True)
    color = None
    size = None
    color_id = request.POST.get("color_id")
    size_id = request.POST.get("size_id")
    if color_id:
        color = get_object_or_404(ProductColor, product=product, color_id=color_id, is_active=True).color
    if size_id:
        size = get_object_or_404(ProductSize, product=product, size_id=size_id, is_active=True).size
    quantity = max(1, int(request.POST.get("quantity", 1) or 1))
    item, created = CartItem.objects.get_or_create(user=request.user, product=product, color=color, size=size, defaults={"quantity": quantity})
    if not created:
        item.quantity += quantity
        item.save(update_fields=["quantity", "updated_at"])
    messages.success(request, "محصول به سبد خرید اضافه شد.")
    return redirect(request.POST.get("next") or "customer:cart")


@login_required
def cart(request):
    items = request.user.cart_items.select_related("product", "color", "size").all()
    return render(request, "dashboard/cart.html", {"items": items, "subtotal": sum(i.line_total for i in items), "shipping": 0})


@login_required
def update_cart(request):
    if request.method == "POST":
        for key, value in request.POST.items():
            if key.startswith("qty_"):
                try:
                    item = request.user.cart_items.get(pk=key[4:])
                    qty = max(0, int(value))
                    if qty == 0:
                        item.delete()
                    else:
                        item.quantity = min(qty, 99)
                        item.save(update_fields=["quantity", "updated_at"])
                except (ValueError, CartItem.DoesNotExist):
                    pass
        messages.success(request, "سبد خرید به‌روزرسانی شد.")
    return redirect("customer:cart")


@login_required
def remove_from_cart(request, item_id):
    if request.method == "POST":
        request.user.cart_items.filter(pk=item_id).delete()
    return redirect("customer:cart")


@login_required
def place_order(request):
    if request.method != "POST":
        return redirect("customer:cart")
    required = ["full_name", "phone", "province", "city", "address"]
    if any(not request.POST.get(field, "").strip() for field in required):
        messages.error(request, "لطفاً اطلاعات ارسال را کامل کنید.")
        return redirect("customer:cart")
    with transaction.atomic():
        items = list(request.user.cart_items.select_related("product", "color", "size").select_for_update())
        if not items:
            messages.error(request, "سبد خرید شما خالی است.")
            return redirect("customer:cart")
        for item in items:
            if not item.product.is_active:
                messages.error(request, f"محصول «{item.product.name}» دیگر فعال نیست.")
                return redirect("customer:cart")
            if item.size_id:
                stock = ProductSize.objects.select_for_update().get(product=item.product, size_id=item.size_id, is_active=True).stock
                if item.quantity > stock:
                    messages.error(request, f"موجودی سایز {item.size} برای «{item.product.name}» کافی نیست.")
                    return redirect("customer:cart")
        subtotal = sum(item.line_total for item in items)
        shipping = 0
        order = Order.objects.create(
            user=request.user, number=f"EVA-{uuid.uuid4().hex[:10].upper()}", status="pending",
            full_name=request.POST["full_name"].strip(), phone=request.POST["phone"].strip(),
            province=request.POST["province"].strip(), city=request.POST["city"].strip(),
            address=request.POST["address"].strip(), postal_code=request.POST.get("postal_code", "").strip(),
            note=request.POST.get("note", "").strip(), subtotal=subtotal, shipping=shipping, total=subtotal,
        )
        for item in items:
            OrderItem.objects.create(order=order, product=item.product, color=item.color, size=item.size,
                product_name=item.product.name, color_name=item.color.name if item.color else "",
                size_name=item.size.name if item.size else "", unit_price=item.product.price, quantity=item.quantity)
            if item.size_id:
                ProductSize.objects.filter(product=item.product, size_id=item.size_id).update(stock=models.F("stock") - item.quantity)
        request.user.cart_items.all().delete()
    messages.success(request, f"سفارش {order.number} با موفقیت ثبت شد.")
    return redirect("customer:order_detail", order_id=order.id)


@login_required
def order_detail(request, order_id):
    order = get_object_or_404(request.user.orders.prefetch_related("items"), pk=order_id)
    return render(request, "dashboard/order_detail.html", {"order": order})


def staff_required(view):
    return user_passes_test(lambda user: user.is_active and user.is_staff, login_url="/account/login/")(view)


@staff_required
def management_dashboard(request):
    products = Product.objects.all()
    low_stock = ProductSize.objects.filter(is_active=True, stock__lte=3).select_related("product", "size").order_by("stock")[:8]
    context = {
        "product_count": products.count(), "active_product_count": products.filter(is_active=True).count(),
        "category_count": Category.objects.count(), "low_stock_count": ProductSize.objects.filter(is_active=True, stock__lte=3).count(),
        "total_stock": ProductSize.objects.filter(is_active=True).aggregate(total=Sum("stock"))["total"] or 0, "low_stock": low_stock,
    }
    return render(request, "dashboard/management.html", context)
