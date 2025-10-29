// Mock data for development and testing purposes

// Mock services
const mockServices = [
  {
    _id: '1',
    name: 'Soch qirqish',
    description: 'Professional soch qirqish xizmati',
    price: 50000,
    duration: 30,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Soqol olish',
    description: 'Professional soqol olish xizmati',
    price: 40000,
    duration: 20,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Klassik turk soch olish',
    description: 'Klassik turk usulida soch olish',
    price: 80000,
    duration: 45,
    image: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock masters
const mockMasters = [
  {
    _id: '1',
    name: 'Alisher Namozov',
    phone: '+998901234567',
    experience: 5,
    rating: 4.9,
    image: '',
    telegramChatId: null,
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Ibrohim Ergashev',
    phone: '+998901234568',
    experience: 3,
    rating: 4.7,
    image: '',
    telegramChatId: null,
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    workingHours: {
      start: '10:00',
      end: '19:00'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock bookings
const mockBookings = [];

module.exports = {
  mockServices,
  mockMasters,
  mockBookings
};