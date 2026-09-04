from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import redirect, render

from products.models import Product

from .models import Order, OrderItem


def _cart_items(request):
    cart = request.session.get("cart", {})
    ids = [int(pk) for pk in cart.keys() if str(pk).isdigit()]
    products = Product.objects.filter(id__in=ids, is_active=True)
    items = []
    total = 0
    for product in products:
        quantity = max(1, min(20, int(cart.get(str(product.id), 1))))
        subtotal = product.price * quantity
        total += subtotal
        items.append({"product": product, "quantity": quantity, "subtotal": subtotal})
    return items, total


@login_required(login_url="/account/")
def checkout(request):
    items, total = _cart_items(request)
    if not items:
        return redirect("cart:detail")

    profile = getattr(request.user, "customer_profile", None)
    if request.method == "POST":
        full_name = (request.POST.get("full_name") or "").strip()
        mobile = (request.POST.get("mobile") or "").strip()
        city = (request.POST.get("city") or "").strip()
        address = (request.POST.get("address") or "").strip()
        postal_code = (request.POST.get("postal_code") or "").strip()
        if not full_name or not mobile or not city or not address:
            return render(request, "orders/checkout.html", {"items": items, "total": total, "profile": profile, "error": "لطفاً اطلاعات گیرنده و آدرس را کامل کنید."})

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                full_name=full_name,
                mobile=mobile,
                city=city,
                address=address,
                postal_code=postal_code,
                total=total,
            )
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product=item["product"],
                    product_name=item["product"].name,
                    unit_price=item["product"].price,
                    quantity=item["quantity"],
                )
            request.session["cart"] = {}
            request.session.modified = True
        return redirect("orders:success", order_id=order.id)

    return render(request, "orders/checkout.html", {"items": items, "total": total, "profile": profile})


@login_required(login_url="/account/")
def success(request, order_id):
    order = Order.objects.filter(id=order_id, user=request.user).prefetch_related("items").first()
    if not order:
        return redirect("orders:list")
    return render(request, "orders/success.html", {"order": order})


@login_required(login_url="/account/")
def order_list(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, "orders/list.html", {"orders": orders})


@login_required(login_url="/account/")
def order_detail(request, order_id):
    order = Order.objects.filter(id=order_id, user=request.user).prefetch_related("items").first()
    if not order:
        return redirect("orders:list")
    return render(request, "orders/detail.html", {"order": order})
