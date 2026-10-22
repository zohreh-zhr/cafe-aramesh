# کافه آرامش — نسخه نهایی Vue + Quasar + Pinia

این پروژه بر اساس پروژه اولیه «کافه آرامش» و دو تسک استاد ساخته شده است.

## امکانات
- Vue 3 + Composition API
- Quasar
- Pinia و bookingStore.js
- فیلتر میزها بر اساس ظرفیت با computed
- q-card برای نمایش میزها
- وضعیت «آماده رزرو»، «رزرو موقت» و «رزرو شده»
- q-dialog برای رزرو
- قفل موقت ۵ دقیقه‌ای
- composable مستقل useBookingTimer.js
- انتخاب ساعت حضور
- کامپوننت مستقل CafeAddons.vue با props و emits
- محاسبه مبلغ نهایی
- تولید کد پیگیری مثل CAFE-1234
- Notify
- صفحه بلیت دیجیتال با route پویا /receipt/:bookingId
- طراحی فارسی و RTL
- صفحات خانه، منو، میزها، رزرو و رزروهای من

## اجرا

داخل پوشه پروژه:

```bash
npm.cmd install
npm.cmd run dev
```

اگر پورت 5173 اشغال باشد، Vite خودش یک پورت دیگر مثل 5174 انتخاب می‌کند.

## نکته
اطلاعات رزرو در Pinia نگه‌داری می‌شود. برای اجرای پروژه جدید بعد از بستن/باز کردن مرورگر، در صورت نیاز می‌توانیم در مرحله بعد persistence با localStorage را هم اضافه کنیم.

## مسیرهای پروژه
/
 /menu
 /tables
 /reservation
 /my-reservations
 /receipt/:bookingId
