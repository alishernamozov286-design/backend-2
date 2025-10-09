// In-memory mock data for development
const { ObjectId } = require('mongoose').Types;

// Generate ObjectIds
const generateObjectId = () => new ObjectId();

// Demo services data
const mockServices = [
  {
    _id: generateObjectId(),
    name: 'Klassik Soch Kesish',
    description: 'Professional sartarosh tomonidan klassik uslubda soch kesish. Shampoo va styling kiradi.',
    price: 50000,
    duration: 45,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateObjectId(),
    name: 'Soqol Tarash',
    description: 'Professional soqol tarash, yuz massaji va aftershave bilan. Mukammal toza ko\'rinish.',
    price: 35000,
    duration: 30,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateObjectId(),
    name: 'VIP Paket',
    description: 'Soch kesish + soqol tarash + yuz parvarish + bosh massaji. To\'liq grooming tajriba.',
    price: 120000,
    duration: 90,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateObjectId(),
    name: 'Mustache Styling',
    description: 'Professional mo\'ylov shakllash va styling. Turli uslublar mavjud.',
    price: 25000,
    duration: 20,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateObjectId(),
    name: 'Yuz Parvarish',
    description: 'Erkaklar uchun maxsus yuz parvarishi, tozalash va namlovchi maskalar.',
    price: 45000,
    duration: 40,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateObjectId(),
    name: 'Bosh Massaji',
    description: 'Relaks uchun professional bosh va bo\'yin massaji.',
    price: 30000,
    duration: 25,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Demo masters data
const mockMasters = [
  {
    _id: generateObjectId(),
    name: 'Aziz Karimov',
    photo: '',
    experience: 8,
    specialization: ['Klassik soch kesish', 'Soqol tarash', 'Styling'],
    rating: 4.9,
    phone: '+998 90 123 45 67',
    workingHours: { start: '09:00', end: '18:00' },
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateObjectId(),
    name: 'Bobur Ahmedov',
    photo: '',
    experience: 12,
    specialization: ['VIP paket', 'Yuz parvarish', 'Massaj'],
    rating: 4.8,
    phone: '+998 91 234 56 78',
    workingHours: { start: '10:00', end: '19:00' },
    workingDays: ['Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateObjectId(),
    name: 'Sardor Usmonov',
    photo: '',
    experience: 6,
    specialization: ['Zamonaviy uslublar', 'Mo\'ylov styling', 'Konsultatsiya'],
    rating: 4.7,
    phone: '+998 93 345 67 89',
    workingHours: { start: '08:30', end: '17:30' },
    workingDays: ['Dushanba', 'Chorshanba', 'Juma', 'Shanba', 'Yakshanba'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock bookings storage
let mockBookings = [];

module.exports = {
  mockServices,
  mockMasters,
  mockBookings
};