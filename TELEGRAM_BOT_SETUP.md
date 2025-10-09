# 🤖 Telegram Bot Sozlash Yo'riqnomasi

Bu yo'riqnoma sizga barbershop loyihasi uchun Telegram botni to'liq sozlashga yordam beradi.

## 📋 Mavzular

1. [Bot Yaratish](#1-bot-yaratish)
2. [Environment Variables Sozlash](#2-environment-variables-sozlash)
3. [Chat ID Olish](#3-chat-id-olish)
4. [Botni Test Qilish](#4-botni-test-qilish)
5. [API Endpointlari](#5-api-endpointlari)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Bot Yaratish

### Qadamlar:

1. **Telegram'da @BotFather ni toping**
   - Telegram ochib @BotFather ga yozing

2. **Bot yarating**
   ```
   /newbot
   ```

3. **Bot nomini kiriting**
   ```
   Barbershop Booking Bot
   ```

4. **Bot username ni kiriting**
   ```
   barbershop_booking_bot
   ```
   *(username noyob bo'lishi kerak, agar band bo'lsa boshqa nom tanlang)*

5. **Tokenni saqlang**
   - BotFather sizga token beradi (masalan: `123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)
   - Bu tokenni yaxshi saqlang!

---

## 2. Environment Variables Sozlash

### `.env` faylida quyidagi o'zgaruvchilarni sozlang:

```env
# Telegram Bot Settings
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=@alishernamozovvv
```

**Muhim:** `TELEGRAM_CHAT_ID`ni keyingi qadamda olasiz.

---

## 3. Chat ID Olish

### Avtomatik usul (Tavsiya etiladi):

1. **Yaratilgan botga yozing**
   - Telegram'da @yourbotusername ga yozing
   - `/start` buyrug'ini yuboring

2. **Setup skriptni ishga tushiring**
   ```bash
   npm run setup-bot
   ```

3. **Username ni kiriting**
   - Skript so'raganda `alishernamozovvv` ni kiriting (@ belgisisiz)

4. **Chat ID ni `.env` ga qo'shing**
   - Skript sizga Chat ID ni ko'rsatadi
   - Uni `.env` fayliga qo'shing

### Manual usul:

1. **Bot API orqali updates olish**
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

2. **Chat ID ni JSON dan topish**
   - `"from"` -> `"id"` qiymatini toping

---

## 4. Botni Test Qilish

### Comando orqali:

```bash
npm run setup-bot
```

### API orqali:

```bash
curl -X POST http://localhost:5001/api/telegram/send-test \
  -H "Content-Type: application/json" \
  -d '{"chatId": "YOUR_CHAT_ID"}'
```

### Test muvaffaqiyatli bo'lsa:
- Telegramga test xabari kelishi kerak
- Console da "✅ Test xabar yuborildi!" ko'rinishi kerak

---

## 5. API Endpointlari

| Endpoint | Method | Tavsif |
|----------|--------|--------|
| `/api/telegram/bot-info` | GET | Bot ma'lumotlarini olish |
| `/api/telegram/get-chat-id` | POST | Username orqali Chat ID olish |
| `/api/telegram/send-test` | POST | Test xabar yuborish |
| `/api/telegram/send-message` | POST | Umumiy xabar yuborish |
| `/api/telegram/updates` | GET | Bot updates olish (debug) |

### Misollar:

**Bot ma'lumotlari:**
```bash
curl http://localhost:5001/api/telegram/bot-info
```

**Chat ID olish:**
```bash
curl -X POST http://localhost:5001/api/telegram/get-chat-id \
  -H "Content-Type: application/json" \
  -d '{"username": "alishernamozovvv"}'
```

**Test xabar:**
```bash
curl -X POST http://localhost:5001/api/telegram/send-test \
  -H "Content-Type: application/json" \
  -d '{"chatId": "@alishernamozovvv"}'
```

---

## 6. Troubleshooting

### ❌ "Bot token sozlanmagan"
- `.env` faylida `TELEGRAM_BOT_TOKEN` ni tekshiring
- Server restart qiling

### ❌ "Chat ID topilmadi"
- Avval botga `/start` buyrug'ini yuborganingizni tekshiring
- Username to'g'ri yozilganini tekshiring (@ belgisisiz)

### ❌ "Telegram xato: 400 Bad Request"
- Chat ID to'g'ri formatda ekanligini tekshiring
- Botga biror xabar yuborgan bo'lishingizni tekshiring

### ❌ "Forbidden: bot was blocked by the user"
- Telegramda botni block qilmagan bo'lishingizni tekshiring
- Bot bilan suhbatni yangilang

---

## 🎉 Tayyor!

Bot to'g'ri sozlangandan so'ng, barbershop saytida har gal bron qilinganida avtomatik ravishda Telegram orqali xabar olasiz!

### Xabar formati:
```
🎉 Yangi bron qilindi!

👤 Mijoz: Ali Valiyev
📞 Telefon: +998901234567
✉️ Email: ali@example.com

💈 Xizmat: Soch olish
🧑‍🔧 Usta: Aziz Karimov
📅 Sana: 15.12.2024
⏰ Vaqt: 14:30
💵 Narx: 50,000 so'm

✅ Status: Kutilmoqda
```

---

## 🔧 Qo'shimcha

### Komandalar:
- `npm run setup-bot` - Bot sozlash
- `npm run bot-help` - Yordam
- `npm start` - Server ishga tushirish
- `npm run dev` - Development rejimida ishga tushirish

Savollaringiz bo'lsa, admin bilan bog'laning! 🚀