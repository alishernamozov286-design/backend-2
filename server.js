const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Routes import
const servicesRoutes = require('./routes/services');
const mastersRoutes = require('./routes/masters');
const bookingsRoutes = require('./routes/bookings');
const telegramRoutes = require('./routes/telegram');

// Environment variables
dotenv.config();

const app = express();
// 5001-port band bo'lsa, 5002-portdan foydalanamiz
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', '*'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('uploads'));

// Routes
app.use('/api/services', servicesRoutes);
app.use('/api/masters', mastersRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/telegram', telegramRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Barbershop API'
  });
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Database connection (try MongoDB Atlas, fallback to local MongoDB, then to mock data)
if (process.env.MONGODB_URI) {
  console.log('🔄 MongoDB Atlas ga ulanishga harakat qilamiz...');
  console.log('URI:', process.env.MONGODB_URI);
  
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas ga ulanish muvaffaqiyatli');
    global.useMockData = false;
  })
  .catch(err => {
    console.error('❌ MongoDB Atlas ulanish xatosi:', err.message);
    console.log('🔄 Local MongoDB ga ulanishga harakat qilamiz...');
    
    // Fallback to local MongoDB
    mongoose.connect('mongodb://localhost:27017/barbershop')
    .then(() => {
      console.log('✅ Local MongoDB ga ulanish muvaffaqiyatli');
      global.useMockData = false;
    })
    .catch(localErr => {
      console.error('❌ Local MongoDB ulanish xatosi:', localErr.message);
      console.log('🔄 Mock data bilan ishlaymiz...');
      global.useMockData = true;
    });
  });
} else {
  console.log('⚠️  MongoDB URI sozlanmagan, local MongoDB ga ulanishga harakat qilamiz...');
  
  // Try to connect to local MongoDB
  mongoose.connect('mongodb://localhost:27017/barbershop')
  .then(() => {
    console.log('✅ Local MongoDB ga ulanish muvaffaqiyatli');
    global.useMockData = false;
  })
  .catch(err => {
    console.error('❌ Local MongoDB ulanish xatosi:', err.message);
    console.log('🔄 Mock data bilan ishlaymiz...');
    global.useMockData = true;
  });
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Barbershop API ishlamoqda!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(` barber shop server ${PORT} portida ishga tushdi`);
});