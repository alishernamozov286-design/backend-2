const mongoose = require('mongoose');
const Service = require('./models/Service');
const Master = require('./models/Master');
const Booking = require('./models/Booking');

// Load environment variables
require('dotenv').config();

// Use the same connection as the main server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop';

console.log('🔄 MongoDB ga ulanishga harakat qilamiz...');
console.log('URI:', MONGODB_URI.replace(/(mongodb\+srv:\/\/[^:]+:)[^@]+(@.*)/, '$1****$2'));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('✅ MongoDB ga ulanish muvaffaqiyatli');

  try {
    // Clear existing data
    await Service.deleteMany({});
    await Master.deleteMany({});
    await Booking.deleteMany({});
    
    console.log('🧹 Ma\'lumotlar tozalandi');

    // Insert sample services
    const services = [
      {
        name: 'Klassik Soch Kesish',
        description: 'Professional sartarosh tomonidan klassik uslubda soch kesish. Shampoo va styling kiradi.',
        price: 50000,
        duration: 45,
        isActive: true
      },
      {
        name: 'Soqol Tarash',
        description: 'Professional soqol tarash, yuz massaji va aftershave bilan. Mukammal toza ko\'rinish.',
        price: 35000,
        duration: 30,
        isActive: true
      },
      {
        name: 'VIP Paket',
        description: 'Soch kesish + soqol tarash + yuz parvarish + bosh massaji. To\'liq grooming tajriba.',
        price: 120000,
        duration: 90,
        isActive: true
      },
      {
        name: 'Mustache Styling',
        description: 'Professional mo\'ylov shakllash va styling. Turli uslublar mavjud.',
        price: 25000,
        duration: 20,
        isActive: true
      },
      {
        name: 'Yuz Parvarish',
        description: 'Erkaklar uchun maxsus yuz parvarishi, tozalash va namlovchi maskalar.',
        price: 45000,
        duration: 40,
        isActive: true
      },
      {
        name: 'Bosh Massaji',
        description: 'Relaks uchun professional bosh va bo\'yin massaji.',
        price: 30000,
        duration: 25,
        isActive: true
      }
    ];

    const insertedServices = await Service.insertMany(services);
    console.log(`✅ ${insertedServices.length} ta xizmat qo'shildi`);

    // Insert sample masters
    const masters = [
      {
        name: 'Aziz Karimov',
        experience: 8,
        specialization: ['Klassik soch kesish', 'Soqol tarash', 'Styling'],
        rating: 4.9,
        phone: '+998 90 123 45 67',
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
        isActive: true
      },
      {
        name: 'Bobur Ahmedov',
        experience: 12,
        specialization: ['VIP paket', 'Yuz parvarish', 'Massaj'],
        rating: 4.8,
        phone: '+998 91 234 56 78',
        workingHours: { start: '10:00', end: '19:00' },
        workingDays: ['Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
        isActive: true
      },
      {
        name: 'Sardor Usmonov',
        experience: 6,
        specialization: ['Zamonaviy uslublar', 'Mo\'ylov styling', 'Konsultatsiya'],
        rating: 4.7,
        phone: '+998 93 345 67 89',
        workingHours: { start: '08:30', end: '17:30' },
        workingDays: ['Dushanba', 'Chorshanba', 'Juma', 'Shanba', 'Yakshanba'],
        isActive: true
      }
    ];

    const insertedMasters = await Master.insertMany(masters);
    console.log(`✅ ${insertedMasters.length} ta usta qo'shildi`);

    console.log('🎉 Baza muvaffaqiyatli sozlandi!');
    console.log('📌 Endi backend serverni ishga tushiring: npm start');
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    mongoose.connection.close();
  }
});