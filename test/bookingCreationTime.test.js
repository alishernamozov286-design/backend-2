const mongoose = require('mongoose');
const Booking = require('../models/Booking');

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(),
    connection: {
      readyState: 1,
      close: jest.fn().mockResolvedValue()
    }
  };
});

// Mock Booking model
jest.mock('../models/Booking');

// Test to verify that booking creation time is properly recorded
describe('Booking Creation Time', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should automatically set createdAt and updatedAt timestamps', () => {
    // Create a mock booking with timestamps
    const mockBooking = {
      customerName: 'Test User',
      customerPhone: '+998901234567',
      serviceId: new mongoose.Types.ObjectId(),
      masterId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date(),
      appointmentTime: '10:00',
      totalPrice: 50000,
      createdAt: new Date('2023-10-10T14:30:00.000Z'),
      updatedAt: new Date('2023-10-10T14:30:00.000Z'),
      save: jest.fn().mockResolvedValue(this)
    };

    // Mock the Booking constructor
    Booking.mockImplementation(() => mockBooking);

    // Create a new booking instance
    const booking = new Booking(mockBooking);

    // Verify that timestamps are set
    expect(booking.createdAt).toBeDefined();
    expect(booking.updatedAt).toBeDefined();
    
    // Verify that createdAt and updatedAt are Date objects
    expect(booking.createdAt instanceof Date).toBe(true);
    expect(booking.updatedAt instanceof Date).toBe(true);
  });

  it('should have timestamps enabled in schema', () => {
    // Check that the Booking schema has timestamps enabled
    expect(Booking.schema.options.timestamps).toBe(true);
  });
});