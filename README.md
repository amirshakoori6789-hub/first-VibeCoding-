# 🚀 First Vibe — آسا پمپ

> اولین پروژه وایب کدینگ من — فروشگاه تخصصی پمپ و تجهیزات صنعتی

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![PHP](https://img.shields.io/badge/PHP-Backend-777BB4?logo=php)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

---

## 📌 درباره پروژه

یک فروشگاه آنلاین تخصصی برای فروش پمپ و تجهیزات صنعتی، کشاورزی، فاضلابی و خانگی.
این پروژه اولین تجربه من در وایب کدینگ بود — ساخت یک اپلیکیشن واقعی با کمک هوش مصنوعی.

---

## ✨ امکانات

- 🛍️ نمایش محصولات با فیلتر دسته‌بندی
- 🔍 جستجوی محصولات
- 🛒 سبد خرید
- 👤 پنل مدیریت (ادمین)
- 📦 مدیریت محصولات، دسته‌بندی‌ها و تیکت‌ها
- 📱 طراحی واکنش‌گرا (Responsive)
- 🌙 پشتیبانی از زبان فارسی (RTL)

---

## 🛠️ تکنولوژی‌ها

| بخش | تکنولوژی |
|-----|-----------|
| فرانت‌اند | React + Vite |
| استایل | Tailwind CSS + Radix UI |
| بک‌اند | PHP 8+ |
| دیتابیس | MySQL |
| احراز هویت | JWT (ساده) |

---

## 📁 ساختار پروژه

```
first-vibe/
├── assets/              # فایل‌های کامپایل شده React
├── backend/
│   ├── api/             # REST API
│   │   ├── auth.php
│   │   ├── products.php
│   │   ├── categories.php
│   │   ├── branches.php
│   │   ├── news.php
│   │   ├── reviews.php
│   │   ├── settings.php
│   │   ├── tickets.php
│   │   └── upload.php
│   ├── config/
│   │   └── db.example.php   # نمونه تنظیمات دیتابیس
│   └── uploads/         # (در گیت نیست)
├── index.html
├── manifest.json
└── override.css
```

---

## ⚙️ نصب و راه‌اندازی

### ۱. کلون کردن پروژه
```bash
git clone https://github.com/your-username/first-vibe.git
cd first-vibe
```

### ۲. تنظیم دیتابیس
```bash
cp backend/config/db.example.php backend/config/db.php
```
فایل `db.php` رو باز کن و اطلاعات دیتابیست رو وارد کن:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('FRONTEND_URL', 'https://your-domain.com');
```

### ۳. ایمپورت دیتابیس
```bash
mysql -u username -p database_name < backend/database.sql
```

---

## 🔐 متغیرهای محیطی

فایل `backend/config/db.php` رو هرگز آپلود نکن!
از فایل `db.example.php` به عنوان template استفاده کن.

---

## 📝 یادداشت

این پروژه با کمک **Claude AI** (وایب کدینگ) ساخته شده.
تجربه جالبی بود — ساخت یک پروژه واقعی بدون دانش عمیق برنامه‌نویسی! 🎉

---

## 📄 لایسنس

MIT License — آزاد برای استفاده شخصی و آموزشی
