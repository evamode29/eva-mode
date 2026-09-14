import random
import uuid
from datetime import timedelta
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import F, Sum
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.utils.http import url_has_allowed_host_and_scheme
from products.models import Category, Product, ProductColor, ProductSize
from .forms import ManagerCreateForm, OTPVerifyForm, PhoneLoginForm
from .models import CartItem, Order, OrderItem
OTP_TTL_SECONDS=120; OTP_MAX_ATTEMPTS=5

def normalize_phone(phone):
    phone=str(phone).strip()
    if phone.startswith('+98'): return '0'+phone[3:]
    if phone.startswith('98'): return '0'+phone[2:]
    return phone

def find_or_create_customer(phone):
    phone=normalize_phone(phone); user=User.objects.filter(username=phone).first()
    if not user:
        user=User.objects.create(username=phone); user.set_unusable_password(); user.save(update_fields=['password'])
    return user

def customer_login(request):
    if request.user.is_authenticated: return redirect('customer:dashboard')
    if request.session.get('otp_phone'): return redirect('customer:verify_otp')
    form=PhoneLoginForm(request.POST or None)
    if request.method=='POST' and form.is_valid():
        phone=form.cleaned_data['phone']; next_url=request.POST.get('next') or request.GET.get('next') or ''; request.session.pop('otp_next',None)
        if url_has_allowed_host_and_scheme(next_url,allowed_hosts={request.get_host()},require_https=request.is_secure()): request.session['otp_next']=next_url
        code=f'{random.randint(0,999999):06d}'; request.session.update({'otp_phone':phone,'otp_code':code,'otp_expires':(timezone.now()+timedelta(seconds=OTP_TTL_SECONDS)).isoformat(),'otp_attempts':0}); print(f'[EVA MODE OTP] {phone}: {code}'); messages.success(request,'کد تأیید ارسال شد. (حالت آزمایشی)'); return redirect('customer:verify_otp')
    return render(request,'dashboard/login.html',{'form':form,'next':request.GET.get('next','')})

def verify_otp(request):
    phone=request.session.get('otp_phone')
    if not phone: return redirect('customer:login')
    expires=timezone.datetime.fromisoformat(request.session.get('otp_expires')) if request.session.get('otp_expires') else timezone.now()
    if timezone.is_naive(expires): expires=timezone.make_aware(expires)
    remaining=max(0,int((expires-timezone.now()).total_seconds())); form=OTPVerifyForm(request.POST or None)
    if request.method=='POST':
        attempts=int(request.session.get('otp_attempts',0))
        if remaining<=0 or attempts>=OTP_MAX_ATTEMPTS:
            messages.error(request,'کد منقضی شده یا تعداد تلاش‌ها تمام شده است.')
            for k in ('otp_phone','otp_code','otp_expires','otp_attempts','otp_next'): request.session.pop(k,None)
            return redirect('customer:login')
        if form.is_valid():
            request.session['otp_attempts']=attempts+1
            if form.cleaned_data['code']==request.session.get('otp_code'):
                login(request,find_or_create_customer(phone),backend='django.contrib.auth.backends.ModelBackend'); next_url=request.session.pop('otp_next','')
                for k in ('otp_phone','otp_code','otp_expires','otp_attempts'): request.session.pop(k,None)
                messages.success(request,'شماره موبایل شما با موفقیت احراز شد.'); return redirect(next_url or 'customer:dashboard')
            form.add_error('code','کد واردشده صحیح نیست.')
    return render(request,'dashboard/verify_otp.html',{'form':form,'phone':phone,'remaining':remaining,'demo_code':request.session.get('otp_code','')})

def resend_otp(request):
    if request.method!='POST': return redirect('customer:login')
    phone=request.session.get('otp_phone')
    if not phone: return redirect('customer:login')
    code=f'{random.randint(0,999999):06d}'; request.session.update({'otp_code':code,'otp_expires':(timezone.now()+timedelta(seconds=OTP_TTL_SECONDS)).isoformat(),'otp_attempts':0}); print(f'[EVA MODE OTP] {phone}: {code}'); messages.success(request,'کد جدید ایجاد شد.'); return redirect('customer:verify_otp')

@login_required
def customer_dashboard(request):
    orders=request.user.orders.prefetch_related('items').all()[:5]; items=request.user.cart_items.select_related('product').all()
    return render(request,'dashboard/customer.html',{'orders':orders,'order_count':request.user.orders.count(),'cart_count':sum(i.quantity for i in items),'cart_total':sum(i.line_total for i in items),'pending_count':request.user.orders.filter(status='pending').count(),'shipping_count':request.user.orders.filter(status__in=['confirmed','processing','shipped']).count(),'delivered_count':request.user.orders.filter(status='delivered').count()})
@login_required
def customer_orders(request): return render(request,'dashboard/orders.html',{'orders':request.user.orders.prefetch_related('items').all()})
def logout_post(request):
    if request.method=='POST': logout(request); return redirect('home')
    return redirect('customer:dashboard')
@login_required
def add_to_cart(request):
    if request.method!='POST': return redirect('products:shop')
    product=get_object_or_404(Product,pk=request.POST.get('product_id'),is_active=True); color=None; size=None
    if request.POST.get('color_id'): color=get_object_or_404(ProductColor,product=product,color_id=request.POST['color_id'],is_active=True).color
    if request.POST.get('size_id'): size=get_object_or_404(ProductSize,product=product,size_id=request.POST['size_id'],is_active=True).size
    try: quantity=max(1,min(99,int(request.POST.get('quantity',1) or 1)))
    except ValueError: quantity=1
    item,created=CartItem.objects.get_or_create(user=request.user,product=product,color=color,size=size,defaults={'quantity':quantity})
    if not created: item.quantity=min(99,item.quantity+quantity); item.save(update_fields=['quantity','updated_at'])
    messages.success(request,'محصول به سبد خرید اضافه شد.'); return redirect(request.POST.get('next') or 'customer:cart')
@login_required
def cart(request):
    items=request.user.cart_items.select_related('product','color','size').all(); subtotal=sum(i.line_total for i in items); return render(request,'dashboard/cart.html',{'items':items,'subtotal':subtotal,'shipping':0,'total':subtotal})
@login_required
def update_cart(request):
    if request.method=='POST':
        for key,value in request.POST.items():
            if key.startswith('qty_'):
                try:
                    item=request.user.cart_items.get(pk=key[4:]); qty=max(0,min(99,int(value)))
                    if qty==0: item.delete()
                    else: item.quantity=qty; item.save(update_fields=['quantity','updated_at'])
                except (ValueError,CartItem.DoesNotExist): pass
    return redirect('customer:cart')
@login_required
def remove_from_cart(request,item_id):
    if request.method=='POST': request.user.cart_items.filter(pk=item_id).delete()
    return redirect('customer:cart')
@login_required
def place_order(request):
    if request.method!='POST': return redirect('customer:cart')
    required=['full_name','phone','province','city','address']
    if any(not request.POST.get(f,'').strip() for f in required): messages.error(request,'لطفاً اطلاعات ارسال را کامل کنید.'); return redirect('customer:cart')
    with transaction.atomic():
        items=list(request.user.cart_items.select_related('product','color','size').select_for_update())
        if not items: messages.error(request,'سبد خرید شما خالی است.'); return redirect('customer:cart')
        for item in items:
            if not item.product.is_active: messages.error(request,f'محصول «{item.product.name}» دیگر فعال نیست.'); return redirect('customer:cart')
            if item.size_id:
                stock=ProductSize.objects.select_for_update().get(product=item.product,size_id=item.size_id,is_active=True)
                if item.quantity>stock.stock: messages.error(request,f'موجودی سایز {item.size} برای «{item.product.name}» کافی نیست.'); return redirect('customer:cart')
        subtotal=sum(i.line_total for i in items); order=Order.objects.create(user=request.user,number=f'EVA-{uuid.uuid4().hex[:10].upper()}',status='pending',full_name=request.POST['full_name'].strip(),phone=request.POST['phone'].strip(),province=request.POST['province'].strip(),city=request.POST['city'].strip(),address=request.POST['address'].strip(),postal_code=request.POST.get('postal_code','').strip(),note=request.POST.get('note','').strip(),subtotal=subtotal,shipping=0,total=subtotal)
        for item in items:
            OrderItem.objects.create(order=order,product=item.product,color=item.color,size=item.size,product_name=item.product.name,color_name=item.color.name if item.color else '',size_name=item.size.name if item.size else '',unit_price=item.product.price,quantity=item.quantity)
            if item.size_id: ProductSize.objects.filter(product=item.product,size_id=item.size_id).update(stock=F('stock')-item.quantity)
        request.user.cart_items.all().delete()
    messages.success(request,f'سفارش {order.number} با موفقیت ثبت شد.'); return redirect('customer:order_detail',order_id=order.id)
@login_required
def order_detail(request,order_id): return render(request,'dashboard/order_detail.html',{'order':get_object_or_404(request.user.orders.prefetch_related('items'),pk=order_id)})
def staff_required(view): return user_passes_test(lambda u:u.is_active and u.is_staff,login_url='/account/login/')(view)
@staff_required
def management_order_status(request,order_id):
    if request.method=='POST':
        order=get_object_or_404(Order,pk=order_id); status=request.POST.get('status','')
        if status in {x[0] for x in Order.STATUS_CHOICES}: order.status=status; order.save(update_fields=['status','updated_at']); messages.success(request,'وضعیت سفارش به‌روزرسانی شد.')
    return redirect('management:dashboard')
@staff_required
def management_dashboard(request):
    return render(request,'dashboard/management.html',{'product_count':Product.objects.count(),'active_product_count':Product.objects.filter(is_active=True).count(),'category_count':Category.objects.count(),'low_stock_count':ProductSize.objects.filter(is_active=True,stock__lte=3).count(),'total_stock':ProductSize.objects.filter(is_active=True).aggregate(total=Sum('stock'))['total'] or 0,'low_stock':ProductSize.objects.filter(is_active=True,stock__lte=3).select_related('product','size').order_by('stock')[:8],'order_count':Order.objects.count(),'pending_order_count':Order.objects.filter(status='pending').count(),'orders':Order.objects.select_related('user').all()[:10]})
@user_passes_test(lambda u:u.is_active and u.is_superuser,login_url='/account/login/')
def manager_users(request):
    form=ManagerCreateForm(request.POST or None)
    if request.method=='POST' and form.is_valid():
        phone=normalize_phone(form.cleaned_data['phone']); user,_=User.objects.get_or_create(username=phone); user.first_name=form.cleaned_data['first_name']; user.last_name=form.cleaned_data['last_name']; user.is_staff=True; user.is_active=True; user.set_unusable_password(); user.save(); messages.success(request,'حساب مدیر با موفقیت ساخته/به‌روزرسانی شد.'); return redirect('management:users')
    return render(request,'dashboard/managers.html',{'form':form,'managers':User.objects.filter(is_staff=True,is_superuser=False).order_by('first_name','last_name','username')})
@user_passes_test(lambda u:u.is_active and u.is_superuser,login_url='/account/login/')
def manager_toggle(request,user_id):
    if request.method=='POST':
        user=get_object_or_404(User,pk=user_id,is_superuser=False); user.is_staff=not user.is_staff; user.save(update_fields=['is_staff'])
    return redirect('management:users')
