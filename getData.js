require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

// Import models
const Booking = require('./models/Booking');
const Master = require('./models/Master');
const Service = require('./models/Service');

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB ga ulanish muvaffaqiyatli amalga oshirildi');
  } catch (error) {
    console.error('MongoDB ga ulanishda xatolik:', error.message);
    process.exit(1);
  }
};

// Retrieve all data
const getAllData = async () => {
  try {
    // Get all services
    const services = await Service.find({});
    console.log('\n=== XIZMATLAR ===');
    console.log(JSON.stringify(services, null, 2));

    // Get all masters
    const masters = await Master.find({});
    console.log('\n=== USTALAR ===');
    console.log(JSON.stringify(masters, null, 2));

    // Get all bookings
    const bookings = await Booking.find({})
      .populate('serviceId')
      .populate('masterId');
    console.log('\n=== BUYURTMA QILINganlar ===');
    console.log(JSON.stringify(bookings, null, 2));

    console.log('\nMa\'lumotlar muvaffaqiyatli olindi!');
  } catch (error) {
    console.error('Ma\'lumotlarni olishda xatolik:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await getAllData();
};

run();