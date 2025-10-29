# 💈 Barbershop Backend API

Modern barbershop booking system backend with advanced features.

## 🚀 Features

### ✅ Core Functionality
- **Booking Management** - Create, read, update, delete bookings
- **Time Conflict Resolution** - Prevents double bookings
- **SMS Notifications** - Automated SMS alerts for booking status changes
- **Telegram Integration** - Real-time notifications to admin
- **Master Management** - Manage barbers and their schedules
- **Service Management** - Manage services and pricing

### 📱 SMS Notifications
- **Booking Confirmed** - SMS sent when admin confirms booking
- **Booking Cancelled** - SMS sent when booking is cancelled
- **Service Completed** - SMS sent when service is finished
- **Eskiz.uz Integration** - Professional SMS service

### ⏰ Time Conflict Prevention
- Real-time availability checking
- Prevents overlapping appointments
- Smart time slot management
- Works with both MongoDB and mock data

### 🔔 Telegram Integration
- Instant booking notifications
- Admin dashboard alerts
- Worker notifications (optional)
- Rich message formatting

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Atlas support)
- **Mongoose** - ODM for MongoDB
- **Axios** - HTTP client for external APIs
- **Eskiz.uz** - SMS service provider

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/alishernamozov286-design/backend-2.git
cd backend-2
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
```

## 🔧 Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# SMS Configuration (Eskiz.uz)
ESKIZ_EMAIL=your_eskiz_email
ESKIZ_PASSWORD=your_eskiz_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## 📚 API Endpoints

### 🏪 Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### 👨‍💼 Masters
- `GET /api/masters` - Get all masters
- `POST /api/masters` - Create new master
- `PUT /api/masters/:id` - Update master
- `DELETE /api/masters/:id` - Delete master

### 📅 Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get specific booking
- `POST /api/bookings` - Create new booking (with conflict check)
- `PATCH /api/bookings/:id/status` - Update booking status (triggers SMS)
- `DELETE /api/bookings/:id` - Soft delete booking

### 📱 Telegram
- `POST /api/telegram/webhook` - Telegram webhook endpoint

## 🔄 Booking Status Flow

1. **kutilmoqda** (Pending) - Initial status when booking is created
2. **tasdiqlangan** (Confirmed) - Admin confirms booking → SMS sent
3. **bajarilgan** (Completed) - Service completed → SMS sent
4. **bekor_qilingan** (Cancelled) - Booking cancelled → SMS sent

## 📱 SMS Templates

### Confirmation SMS
```
Hurmatli [Customer Name]! 
Sizning [Date] sanasiga [Time] vaqtga bronlashtirgan [Service] xizmatingiz TASDIQLANDI. 
Usta: [Master Name]
Manzil: [Salon Address]
Barbershop
```

### Cancellation SMS
```
Hurmatli [Customer Name]! 
Afsuski, [Date] sanasiga [Time] vaqtga bronlashtirgan [Service] xizmatingiz BEKOR QILINDI. 
Boshqa vaqt uchun: +998 XX XXX XX XX
Barbershop
```

### Completion SMS
```
Hurmatli [Customer Name]! 
[Service] xizmati muvaffaqiyatli bajarildi. 
Xizmatimizdan foydalanganingiz uchun rahmat! 
Yana kutamiz: +998 XX XXX XX XX
Barbershop
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Test specific features:
```bash
# Test SMS notifications
node testNotification.js

# Test Telegram integration
node testTelegram.js

# Test booking conflicts
node testRealBooking.js
```

## 🚀 Deployment

### Render.com Deployment
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Database Schema

### Booking Model
```javascript
{
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  serviceId: ObjectId,
  masterId: ObjectId,
  appointmentDate: Date,
  appointmentTime: String,
  totalPrice: Number,
  status: String, // kutilmoqda, tasdiqlangan, bajarilgan, bekor_qilingan
  notes: String,
  isDeleted: Boolean,
  deletedAt: Date
}
```

### Master Model
```javascript
{
  name: String,
  photo: String,
  experience: Number,
  specialization: [String],
  rating: Number,
  phone: String,
  workingDays: [String],
  workingHours: {
    start: String,
    end: String
  },
  telegramChatId: String,
  isActive: Boolean
}
```

### Service Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  duration: Number,
  image: String,
  isActive: Boolean
}
```

## 🔒 Security Features

- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Secure SMS API integration
- JWT token authentication ready

## 📈 Performance Features

- Database indexing
- Efficient queries with Mongoose
- Caching for frequently accessed data
- Optimized API responses

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Alisher Namozov**
- GitHub: [@alishernamozov286-design](https://github.com/alishernamozov286-design)

## 🙏 Acknowledgments

- Eskiz.uz for SMS services
- MongoDB Atlas for database hosting
- Render.com for deployment platform
- Telegram Bot API for notifications

---

⭐ Star this repository if you found it helpful!