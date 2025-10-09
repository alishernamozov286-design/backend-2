const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const Master = require('./models/Master');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config();

// Demo services data
const servicesData = [
  {
    name: 'Klassik Soch Kesish',
    description: 'Professional sartarosh tomonidan klassik uslubda soch kesish. Shampoo va styling kiradi.',
    price: 50000,
    duration: 45
  },
  {
    name: 'Soqol Tarash',
    description: 'Professional soqol tarash, yuz massaji va aftershave bilan. Mukammal toza ko\'rinish.',
    price: 35000,
    duration: 30
  },
  {
    name: 'VIP Paket',
    description: 'Soch kesish + soqol tarash + yuz parvarish + bosh massaji. To\'liq grooming tajriba.',
    price: 120000,
    duration: 90
  },
  {
    name: 'Mustache Styling',
    description: 'Professional mo\'ylov shakllash va styling. Turli uslublar mavjud.',
    price: 25000,
    duration: 20
  },
  {
    name: 'Yuz Parvarish',
    description: 'Erkaklar uchun maxsus yuz parvarishi, tozalash va namlovchi maskalar.',
    price: 45000,
    duration: 40
  },
  {
    name: 'Bosh Massaji',
    description: 'Relaks uchun professional bosh va bo\'yin massaji.',
    price: 30000,
    duration: 25
  }
];

// Demo masters data
const mastersData = [
  {
    name: 'Aziz Karimov',
    experience: 8,
    specialization: ['Klassik soch kesish', 'Soqol tarash', 'Styling'],
    rating: 4.9,
    phone: '+998 90 123 45 67',
    workingHours: { start: '09:00', end: '18:00' },
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
  },
  {
    name: 'Bobur Ahmedov',
    experience: 12,
    specialization: ['VIP paket', 'Yuz parvarish', 'Massaj'],
    rating: 4.8,
    phone: '+998 91 234 56 78',
    workingHours: { start: '10:00', end: '19:00' },
    workingDays: ['Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
  },
  {
    name: 'Sardor Usmonov',
    experience: 6,
    specialization: ['Zamonaviy uslublar', 'Mo\'ylov styling', 'Konsultatsiya'],
    rating: 4.7,
    phone: '+998 93 345 67 89',
    workingHours: { start: '08:30', end: '17:30' },
    workingDays: ['Dushanba', 'Chorshanba', 'Juma', 'Shanba', 'Yakshanba']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB ga ulanish muvaffaqiyatli');

    // Clear existing data
    await Service.deleteMany({});
    await Master.deleteMany({});
    await Booking.deleteMany({});

    console.log('Eski ma\'lumotlar o\'chirildi');

    // Insert services
    const services = await Service.insertMany(servicesData);
    console.log(`${services.length} ta xizmat qo'shildi`);

    // Insert masters
    const masters = await Master.insertMany(mastersData);
    console.log(`${masters.length} ta usta qo'shildi`);

    // Create some demo bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingsData = [
      {
        customerName: 'John Doe',
        customerPhone: '+998 90 111 22 33',
        customerEmail: 'john@example.com',
        serviceId: services[0]._id,
        masterId: masters[0]._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        totalPrice: services[0].price,
        status: 'kutilmoqda',
        notes: 'Klassik uslub'
      },
      {
        customerName: 'Ali Valiyev',
        customerPhone: '+998 91 222 33 44',
        serviceId: services[2]._id,
        masterId: masters[1]._id,
        appointmentDate: tomorrow,
        appointmentTime: '14:00',
        totalPrice: services[2].price,
        status: 'tasdiqlangan',
        notes: 'VIP paket'
      }
    ];

    const bookings = await Booking.insertMany(bookingsData);
    console.log(`${bookings.length} ta demo bron qo'shildi`);

    console.log('\n✅ Demo ma\'lumotlar muvaffaqiyatli yuklandi!');
    console.log('\nQuyidagi ma\'lumotlar qo\'shildi:');
    console.log(`- ${services.length} ta xizmat`);
    console.log(`- ${masters.length} ta usta`);
    console.log(`- ${bookings.length} ta demo bron`);

  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMa\'lumotlar bazasi bilan ulanish yopildi');
    process.exit(0);
  }
};

// Run seeder
seedDatabase();