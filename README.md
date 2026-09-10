# EVA MODE

فروشگاه اینترنتی لباس زیر زنانه با Django.

## فناوری‌ها

- Django
- SQLite برای توسعه محلی
- MySQL برای محیط cPanel
- Pillow برای مدیریت تصاویر محصولات
- WhiteNoise برای فایل‌های استاتیک

## اجرای محلی

```bash
python manage.py migrate
python manage.py runserver
```

پنل مدیریت:

`/admin/`

فروشگاه:

`/`

## ساختار اصلی

- `config/` تنظیمات و URLهای Django
- `products/` مدل‌ها، مدیریت و صفحات محصولات
- `templates/` قالب‌های سایت
- `static/` فایل‌های CSS و استاتیک
- `media/` تصاویر آپلودشده محصولات (محلی و خارج از Git)

## آماده‌سازی cPanel

1. ساخت دیتابیس و کاربر MySQL در cPanel
2. تنظیم متغیرهای محیطی Production
3. نصب وابستگی‌های `requirements.txt`
4. اجرای migrationها
5. اجرای `collectstatic`
6. تنظیم Passenger برای اجرای `config.wsgi:application`
7. تنظیم مسیر `media/` برای فایل‌های آپلودی

## نکته امنیتی

کلید مخفی، اطلاعات دیتابیس و تنظیمات Production نباید داخل Git commit شوند.
