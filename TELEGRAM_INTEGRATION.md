# 📱 Telegram Integration Documentation


This document explains how the Telegram bot integration works in the Barbershop booking system.

## 🎯 Purpose

When customers make a booking through the website, all the booking information is automatically sent to a Telegram bot for notification purposes.

## 🔄 How It Works

1. **Booking Creation**: When a customer submits a booking form on the website
2. **Notification Trigger**: The system automatically calls the `notifyBooking` function
3. **Message Formatting**: Booking details are formatted into a structured message
4. **Telegram Delivery**: The message is sent to the configured Telegram chat

## 📦 Data Included in Notifications

Every Telegram notification includes the following information:

- **Customer Details**:
  - Full name
  - Phone number
  - Email address (if provided)
  
- **Service Information**:
  - Service name
  - Master name
  - Appointment date and time
  - Total price
  
- **Additional Information**:
  - Booking creation timestamp
  - Special notes (if any)
  - Current status

## ⚙️ Configuration

The Telegram integration requires two environment variables in the [.env](file:///C:/Users/Acer/Desktop/barbersayt/backend/.env) file:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## 🧪 Testing

To test the Telegram integration:

```bash
# Run the basic test
node testBookingNotification.js

# Run the comprehensive test
node demoBookingNotification.js
```

## 🛠 API Endpoints

The following endpoints are available for Telegram-related operations:

- `GET /api/telegram/bot-info` - Get bot information
- `POST /api/telegram/get-chat-id` - Get chat ID by username
- `POST /api/telegram/send-test` - Send a test message
- `POST /api/telegram/send-message` - Send a custom message
- `GET /api/telegram/updates` - Get bot updates (debug)

## 📝 Setup

To set up the Telegram integration:

1. Create a bot with [@BotFather](https://t.me/BotFather) on Telegram
2. Obtain the bot token
3. Start a conversation with your bot
4. Run the setup script: `npm run setup-bot`
5. Add the token and chat ID to your [.env](file:///C:/Users/Acer/Desktop/barbersayt/backend/.env) file

## ✅ Verification

When working correctly, you should receive a message in Telegram like this:

```
🎉 Yangi bron qilindi!

👤 Mijoz: Alisher Namozov
📞 Telefon: +998901234567
✉️ Email: alisher@example.com

💈 Xizmat: Premium Soch Olish + Soqol
🧑‍🔧 Usta: Otabek Karimov
📅 Sana: 15.10.2025
⏰ Vaqt: 14:30
💵 Narx: 85 000 so'm
🕒 Yaratilgan vaqt: 01.10.2025, 14:30:45

📝 Izoh: Iltimos, 14:15 da kelishni so'rayman. Oldin telegramda habar beraman.

✅ Status: Kutilmoqda
```

## 📞 Support

If you're not receiving notifications:

1. Check that `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are correctly set in [.env](file:///C:/Users/Acer/Desktop/barbersayt/backend/.env)
2. Verify that the bot is not blocked on Telegram
3. Ensure the bot has been started by sending `/start` to it
4. Test with `node testBookingNotification.js`