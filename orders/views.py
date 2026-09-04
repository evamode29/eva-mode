from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import redirect, render

from products.models import Product, ProductColor

from .models import Order, OrderItem


def _parse_key(key):
    parts = str(key).split(":", 1)
    if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
        return int(parts[0]), int(parts[1])
    if str(key).isdigit():
        return int(key), None
    return None, None


def _cart_items(request):
    cart = request.session.get("cart", {})
    items = []
    total = 0
    for key, raw_quantity in cart.items():
        product_id, color_id = _parse_key(key)
        if not product_id:
            continue
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            continue
        color = None
        if color_id:
            color = ProductColor.objects.filter(id=color_id, product=product, is_active=True).first()
            if not color:
                continue
        try:
            quantity = max(1, min(20, int(raw_quantity)))
        except (TypeError, ValueError):
            quantity = 1
        subtotal = product.price * quantity
        total += subtotal
        items.append({"product": product, "color": color, "quantity": quantity, "subtotal": subtotal, "key": key})
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
                    color=item["color"],
                    color_name=item["color"].name if item["color"] else "",
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
